# Globe3D, mappamondo 3D interattivo (React Three Fiber + shadcn/ui)

Costruisci un componente **Globe3D**: una Terra 3D testurizzata che ruota da sola, si trascina con il mouse, ha un alone d'atmosfera tenue e dei segnaposto (una linea sottile dalla superficie a un piccolo cerchio dorato) nelle città dei tuoi clienti. Stack: **React 18 + TypeScript + Tailwind CSS v4 + shadcn/ui**, con **@react-three/fiber**, **@react-three/drei** e **three** per la scena 3D. L'estetica segue la palette dello studio: tela parchment, testo ink, oro ocra per i pin, atmosfera tinta teal/forest. Nessun em dash nei testi.

---

## 1. Setup

### shadcn/ui + Tailwind v4 + TypeScript

Se non hai già il progetto, parti da una base Vite o Next.js con TypeScript, poi inizializza shadcn/ui (che imposta Tailwind v4 e i token):

```bash
npx shadcn@latest init
```

Durante l'init scegli lo stile "New York" o "Default" e conferma il path `@/components`. shadcn crea `components.json`, `app/globals.css` (o `src/index.css`) con i layer Tailwind v4 e l'helper `cn`.

Tailwind v4 si configura via CSS (niente `tailwind.config.js` obbligatorio). Nel tuo file CSS globale assicurati di avere:

```css
@import "tailwindcss";
```

### Dipendenze 3D

```bash
npm install three @react-three/fiber @react-three/drei
npm install -D @types/three
```

### Helper `cn`

shadcn genera `@/lib/utils`. Se ti serve crearlo a mano:

```ts
// src/lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

```bash
npm install clsx tailwind-merge
```

I componenti vivono in `@/components/ui` (convenzione shadcn). Crea lì `globe-3d.tsx`.

---

## 2. Token di palette

Usa questi colori (sono i nostri brand hex). Tienili in cima al componente o nel tema:

```ts
const PALETTE = {
  parchment: "#efe9dc",
  ink: "#26221d",
  gold: "#c8972e",     // pin / marker
  forest: "#1f4d3a",
  teal: "#2f6f68",     // atmosfera
} as const;
```

---

## 3. Configurazione e dati

```ts
export interface GlobeConfig {
  autoRotateSpeed: number;   // velocità di rotazione automatica (rad/frame)
  bumpScale: number;         // rilievo del bump map
  atmosphereColor: string;   // colore dell'alone (teal)
  markerColor: string;       // colore dei pin (oro)
  globeRadius: number;
}

export const DEFAULT_GLOBE_CONFIG: GlobeConfig = {
  autoRotateSpeed: 0.0016,
  bumpScale: 0.012,
  atmosphereColor: PALETTE.teal,
  markerColor: PALETTE.gold,
  globeRadius: 1,
};

export interface Marker {
  lat: number;
  lng: number;
  label: string;
}

// Demo personalizzata: città europee e italiane dei nostri clienti.
export const CLIENT_MARKERS: Marker[] = [
  { lat: 45.46, lng: 9.19,  label: "Milano" },
  { lat: 41.90, lng: 12.50, label: "Roma" },
  { lat: 45.07, lng: 7.69,  label: "Torino" },
  { lat: 51.51, lng: -0.13, label: "London" },
  { lat: 48.86, lng: 2.35,  label: "Paris" },
  { lat: 59.33, lng: 18.07, label: "Stockholm" },
  { lat: 40.42, lng: -3.70, label: "Madrid" },
];
```

### Texture (usa esattamente questi URL)

- Color map (blue marble): `https://unpkg.com/three-globe@2.31.0/example/img/earth-blue-marble.jpg`
- Bump map (topologia): `https://unpkg.com/three-globe@2.31.0/example/img/earth-topology.png`

Entrambe servono `Access-Control-Allow-Origin: *`, quindi WebGL può usarle. In drei le carichi con `useTexture`, che imposta già il cross-origin corretto.

### Conversione lat/lng → Vector3

La funzione chiave: latitudine/longitudine su una sfera di raggio `r`.

```ts
import { Vector3 } from "three";

export function latLngToVector3(lat: number, lng: number, r: number): Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
     r * Math.cos(phi),
     r * Math.sin(phi) * Math.sin(theta),
  );
}
```

---

## 4. Il componente

```tsx
// src/components/ui/globe-3d.tsx
"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import {
  Vector3,
  Group,
  BackSide,
  AdditiveBlending,
  Color,
  TextureLoader,
  SRGBColorSpace,
} from "three";
import { cn } from "@/lib/utils";

const PALETTE = {
  parchment: "#efe9dc",
  ink: "#26221d",
  gold: "#c8972e",
  forest: "#1f4d3a",
  teal: "#2f6f68",
} as const;

export interface GlobeConfig {
  autoRotateSpeed: number;
  bumpScale: number;
  atmosphereColor: string;
  markerColor: string;
  globeRadius: number;
}

export const DEFAULT_GLOBE_CONFIG: GlobeConfig = {
  autoRotateSpeed: 0.0016,
  bumpScale: 0.012,
  atmosphereColor: PALETTE.teal,
  markerColor: PALETTE.gold,
  globeRadius: 1,
};

export interface Marker {
  lat: number;
  lng: number;
  label: string;
}

export const CLIENT_MARKERS: Marker[] = [
  { lat: 45.46, lng: 9.19,  label: "Milano" },
  { lat: 41.90, lng: 12.50, label: "Roma" },
  { lat: 45.07, lng: 7.69,  label: "Torino" },
  { lat: 51.51, lng: -0.13, label: "London" },
  { lat: 48.86, lng: 2.35,  label: "Paris" },
  { lat: 59.33, lng: 18.07, label: "Stockholm" },
  { lat: 40.42, lng: -3.70, label: "Madrid" },
];

const TEX = {
  map: "https://unpkg.com/three-globe@2.31.0/example/img/earth-blue-marble.jpg",
  bump: "https://unpkg.com/three-globe@2.31.0/example/img/earth-topology.png",
};

function latLngToVector3(lat: number, lng: number, r: number): Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
     r * Math.cos(phi),
     r * Math.sin(phi) * Math.sin(theta),
  );
}

/* --- Atmosfera: shell sul retro, additivo, tinta teal/forest --- */
const ATMO_VERT = /* glsl */ `
  varying vec3 vN;
  void main() {
    vN = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const ATMO_FRAG = /* glsl */ `
  uniform vec3 uColor;
  varying vec3 vN;
  void main() {
    float i = pow(0.62 - dot(vN, vec3(0.0, 0.0, 1.0)), 2.4);
    gl_FragColor = vec4(uColor, 1.0) * clamp(i, 0.0, 1.0);
  }
`;

function Atmosphere({ radius, color }: { radius: number; color: string }) {
  const uniforms = useMemo(() => ({ uColor: { value: new Color(color) } }), [color]);
  return (
    <mesh>
      <sphereGeometry args={[radius * 1.18, 48, 48]} />
      <shaderMaterial
        vertexShader={ATMO_VERT}
        fragmentShader={ATMO_FRAG}
        uniforms={uniforms}
        blending={AdditiveBlending}
        side={BackSide}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

/* --- Un segnaposto: linea sottile dalla superficie + dot dorato + alone --- */
function Pin({ marker, config }: { marker: Marker; config: GlobeConfig }) {
  const PIN_LEN = 0.16;
  const base = useMemo(
    () => latLngToVector3(marker.lat, marker.lng, config.globeRadius * 1.001),
    [marker, config.globeRadius],
  );
  const tip = useMemo(
    () => latLngToVector3(marker.lat, marker.lng, config.globeRadius + PIN_LEN),
    [marker, config.globeRadius],
  );

  const linePositions = useMemo(
    () => new Float32Array([base.x, base.y, base.z, tip.x, tip.y, tip.z]),
    [base, tip],
  );

  return (
    <group>
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={linePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color={config.markerColor} transparent opacity={0.7} />
      </line>

      <mesh position={tip}>
        <sphereGeometry args={[0.018, 16, 16]} />
        <meshBasicMaterial color={config.markerColor} />
      </mesh>

      <mesh position={tip}>
        <sphereGeometry args={[0.034, 16, 16]} />
        <meshBasicMaterial color={config.markerColor} transparent opacity={0.18} depthWrite={false} />
      </mesh>
    </group>
  );
}

/* --- La Terra + atmosfera + pin, dentro un group che ruota da solo --- */
function Earth({ config, markers }: { config: GlobeConfig; markers: Marker[] }) {
  const group = useRef<Group>(null);
  const [map, bump] = useLoader(TextureLoader, [TEX.map, TEX.bump]);

  useMemo(() => {
    map.colorSpace = SRGBColorSpace;
  }, [map]);

  useFrame(() => {
    if (group.current) group.current.rotation.y += config.autoRotateSpeed;
  });

  return (
    // Inclinazione iniziale: l'Europa guarda verso lo spettatore.
    <group ref={group} rotation={[0.32, -1.7, 0]}>
      <mesh>
        <sphereGeometry args={[config.globeRadius, 64, 64]} />
        <meshPhongMaterial
          map={map}
          bumpMap={bump}
          bumpScale={config.bumpScale}
          shininess={8}
          specular={PALETTE.forest}
        />
      </mesh>

      <Atmosphere radius={config.globeRadius} color={config.atmosphereColor} />

      {markers.map((m) => (
        <Pin key={m.label} marker={m} config={config} />
      ))}
    </group>
  );
}

export interface Globe3DProps {
  config?: GlobeConfig;
  markers?: Marker[];
  className?: string;
}

export function Globe3D({
  config = DEFAULT_GLOBE_CONFIG,
  markers = CLIENT_MARKERS,
  className,
}: Globe3DProps) {
  return (
    <div className={cn("relative aspect-square w-full max-w-[560px]", className)}>
      <Canvas
        camera={{ position: [0, 0, 3.4], fov: 34 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
        // sfondo trasparente: la tela parchment traspare
      >
        <ambientLight intensity={0.55} />
        <directionalLight position={[-2.2, 1.4, 2.6]} intensity={1.15} color="#fff4e0" />
        <directionalLight position={[2.4, -0.6, -2.0]} intensity={0.5} color={PALETTE.teal} />

        <Earth config={config} markers={markers} />

        <OrbitControls
          enablePan={false}
          enableZoom={false}
          autoRotate={false}
          rotateSpeed={0.5}
          minPolarAngle={Math.PI / 2 - 0.9}
          maxPolarAngle={Math.PI / 2 + 0.9}
        />
      </Canvas>
    </div>
  );
}
```

### Note sull'implementazione

- **Auto-rotazione**: la fa `useFrame` ruotando il `group` di `autoRotateSpeed` ogni frame. Lasciamo `autoRotate={false}` su `OrbitControls` per evitare doppia rotazione e per mantenere lo spin anche quando l'utente non interagisce.
- **Drag**: `OrbitControls` gestisce il trascinamento; `enablePan` e `enableZoom` sono off per tenere il globo centrato. I limiti `minPolarAngle`/`maxPolarAngle` impediscono di ribaltare i poli.
- **Atmosfera**: shell sul retro (`BackSide`) con blending additivo, così il bordo si illumina di teal senza coprire la Terra. La funzione `pow(0.62 - dot(...), 2.4)` concentra il glow sul bordo (effetto fresnel).
- **Bump**: `bumpMap` + `bumpScale` danno il rilievo dei rilievi montuosi. Tienilo basso (0.012) per non esagerare.
- **Cross-origin**: `useTexture`/`useLoader(TextureLoader)` di drei imposta `crossOrigin = "anonymous"`; gli URL servono CORS aperto, quindi le texture si caricano in WebGL senza taint.
- **Fallback**: se vuoi blindarlo, avvolgi `Earth` in un `<Suspense fallback={<FallbackSphere />}>` dove `FallbackSphere` è una sfera con `meshStandardMaterial color={PALETTE.forest}`, così se le texture non arrivano vedi comunque un globo tinto.

---

## 5. Demo personalizzata

```tsx
// src/app/clienti/page.tsx  (o dove preferisci)
import { Globe3D } from "@/components/ui/globe-3d";

export default function ClientiPage() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center gap-5 bg-[#efe9dc] px-5 py-11">
      <div className="relative w-full max-w-[560px]">
        {/* alone caldo dietro al globo */}
        <div className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-[radial-gradient(circle,rgba(47,111,104,0.16),transparent_64%)]" />
        <Globe3D />
      </div>

      <figure className="max-w-[440px] text-center">
        <figcaption className="font-serif text-3xl italic text-[#c8972e]">
          I tuoi clienti, ovunque.
        </figcaption>
        <p className="mt-2.5 text-sm leading-relaxed text-[#26221d]/70">
          Trascina per ruotare. Da Milano a Stoccolma, ogni punto è una storia che possiamo
          raccontare insieme.
        </p>
      </figure>
    </section>
  );
}
```

Per il serif del titolo collega un display (es. Playfair Display o, nel nostro brand, Fraunces) e mappalo su `font-serif` nel tema. Cambia `CLIENT_MARKERS` per puntare alle città dei tuoi clienti reali: bastano `lat`, `lng` e un'etichetta.

---

## 6. Estensioni utili

- **Avatar nei pin**: sostituisci il dot dorato con un `Html` di drei (`@react-three/drei`) ancorato a `tip`, dentro cui metti un `<img>` circolare. Ricorda `distanceFactor` per scalare con la prospettiva.
- **Tooltip al hover**: aggiungi `onPointerOver` sul mesh del dot per mostrare `marker.label`.
- **Archi tra città**: traccia delle curve di Bézier quadratiche (`QuadraticBezierCurve3`) tra coppie di `Vector3` per collegare i clienti, come nel Globe di Aceternity.
- **Performance**: tieni `dpr={[1, 2]}` per limitare il pixel ratio; condividi geometrie/materiali dei dot tra i pin se ne aggiungi molti.
