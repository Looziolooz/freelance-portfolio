Build the **FileUpload** component (Aceternity style) in React + TypeScript styled with **shadcn/ui** + **Tailwind CSS v4**. It's a click-or-drag dropzone sitting over an animated checkerboard **GridPattern** (under a soft radial mask). An upload-icon tile lifts and animates on hover; dropping or selecting files adds each one as an animated card showing the file name, size in MB, type and modified date. Reproduce both files below faithfully. The demo is personalized for **lorenzo.studio** (Italian copy, parchment surface, ink text, ochre-gold drop highlight, forest/teal accents).

## Setup checklist

1. A React app with **TypeScript** (Next.js App Router or Vite).
2. **Tailwind CSS v4** installed and wired up.
3. **shadcn/ui** initialized:
   ```bash
   npx shadcn@latest init
   ```
   This creates `@/lib/utils` exporting `cn` and sets the default component path to `@/components/ui`.
4. Install the runtime dependencies:
   ```bash
   npm i motion react-dropzone @tabler/icons-react
   ```
   - **motion** (`motion/react`) — the animation primitives.
   - **react-dropzone** — drag/drop + click-to-select handling.
   - **@tabler/icons-react** — the upload icon.
5. If you don't have it yet, the `cn` helper (`@/lib/utils`):
   ```ts
   import { clsx, type ClassValue } from "clsx";
   import { twMerge } from "tailwind-merge";

   export function cn(...inputs: ClassValue[]) {
     return twMerge(clsx(inputs));
   }
   ```
6. Fonts: the demo uses **Fraunces** (display) and **General Sans** (body). Load them however your stack prefers (`next/font`, a `<link>`, or a Fontshare `@font-face`). They aren't required for the mechanic — swap in your own brand fonts freely.

Two files: `components/ui/file-upload.tsx` (the reusable primitive, verbatim) and `components/file-upload-demo.tsx` (our personalized usage).

---

## `components/ui/file-upload.tsx`

Copy this verbatim. `FileUpload` owns the dropzone (via `useDropzone`), holds the selected files in state, and renders the `GridPattern` plus an animated upload tile. Each selected file animates in as a card with its metadata. `GridPattern` is a masked checkerboard exported from the same file.

```tsx
"use client";

import { cn } from "@/lib/utils";
import React, { useRef, useState } from "react";
import { motion } from "motion/react";
import { IconUpload } from "@tabler/icons-react";
import { useDropzone } from "react-dropzone";

const mainVariant = {
  initial: { x: 0, y: 0 },
  animate: { x: 20, y: -20, opacity: 0.9 },
};

const secondaryVariant = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
};

export const FileUpload = ({
  onChange,
  title = "Carica il tuo file",
  subtitle = "Trascina qui o clicca per caricare",
}: {
  onChange?: (files: File[]) => void;
  title?: string;
  subtitle?: string;
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (newFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    onChange && onChange(newFiles);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const { getRootProps, isDragActive } = useDropzone({
    multiple: true,
    noClick: true,
    onDrop: handleFileChange,
    onDropRejected: (error) => {
      console.log(error);
    },
  });

  return (
    <div className="w-full" {...getRootProps()}>
      <motion.div
        onClick={handleClick}
        whileHover="animate"
        className={cn(
          "group/file relative block w-full cursor-pointer overflow-hidden rounded-2xl border p-10",
          "border-black/10 bg-[#f4efe4]",
          isDragActive &&
            "border-[#c8972e] bg-[#efe9dc] shadow-[0_0_0_3px_rgba(200,151,46,0.22)]"
        )}
      >
        <input
          ref={fileInputRef}
          id="file-upload-handle"
          type="file"
          multiple
          onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
          className="hidden"
        />

        {/* GridPattern under a radial mask */}
        <div className="absolute inset-0 [mask-image:radial-gradient(circle_at_center,#000_0%,rgba(0,0,0,0.35)_55%,transparent_78%)]">
          <GridPattern />
        </div>

        <div className="flex flex-col items-center justify-center">
          <p className="relative z-20 font-serif text-xl font-semibold text-[#26221d]">
            {title}
          </p>
          <p className="relative z-20 mt-2 text-base text-[#6b6256]">
            {subtitle}
          </p>

          <div className="relative mx-auto mt-10 w-full max-w-xl">
            {/* Selected files render as animated cards */}
            {files.length > 0 &&
              files.map((file, idx) => (
                <motion.div
                  key={"file" + idx}
                  layoutId={idx === 0 ? "file-upload" : "file-upload-" + idx}
                  className={cn(
                    "relative z-40 mx-auto mt-4 flex w-full flex-col items-start justify-start overflow-hidden rounded-xl p-4 md:h-24",
                    "border border-black/10 bg-[#efe9dc] shadow-[0_10px_26px_-20px_rgba(38,34,29,0.5)]"
                  )}
                >
                  <div className="flex w-full items-center justify-between gap-4">
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                      className="max-w-xs truncate text-base font-semibold text-[#26221d]"
                    >
                      {file.name}
                    </motion.p>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                      className="w-fit shrink-0 rounded-full border border-[#c8972e]/30 bg-[#c8972e]/15 px-2 py-1 text-sm tabular-nums text-[#26221d]"
                    >
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </motion.p>
                  </div>

                  <div className="mt-2 flex w-full flex-col items-start justify-between gap-1 text-sm text-[#6b6256] md:flex-row md:items-center">
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                      className="rounded-md px-1 py-0.5 font-medium text-[#2f6f68]"
                    >
                      {file.type || "file"}
                    </motion.p>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                    >
                      Modificato{" "}
                      {new Date(file.lastModified).toLocaleDateString("it-IT")}
                    </motion.p>
                  </div>
                </motion.div>
              ))}

            {/* The upload tile: lifts/animates on hover */}
            {!files.length && (
              <motion.div
                layoutId="file-upload"
                variants={mainVariant}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={cn(
                  "relative z-40 mx-auto mt-4 flex h-32 w-full max-w-[8rem] items-center justify-center rounded-md",
                  "border border-black/10 bg-[#efe9dc] text-[#1f4d3a]",
                  "shadow-[0_14px_30px_-16px_rgba(38,34,29,0.4)] group-hover/file:shadow-2xl"
                )}
              >
                {isDragActive ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center text-[#b3852b]"
                  >
                    Rilascia
                    <IconUpload className="h-5 w-5 text-[#b3852b]" />
                  </motion.p>
                ) : (
                  <IconUpload className="h-6 w-6 text-[#1f4d3a]" />
                )}
              </motion.div>
            )}

            {/* Dashed echo behind the tile that fades in on hover */}
            {!files.length && (
              <motion.div
                variants={secondaryVariant}
                className="absolute inset-0 z-30 mx-auto mt-4 flex h-32 w-full max-w-[8rem] items-center justify-center rounded-md border border-dashed border-[#c8972e] bg-transparent opacity-0"
              />
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export function GridPattern() {
  const columns = 41;
  const rows = 11;
  return (
    <div className="flex flex-shrink-0 scale-105 flex-wrap items-center justify-center gap-x-px gap-y-px bg-[#efe9dc]">
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: columns }).map((_, col) => {
          const index = row * columns + col;
          return (
            <div
              key={`${col}-${row}`}
              className={cn(
                "h-10 w-10 flex flex-shrink-0 rounded-[2px]",
                index % 2 === 0
                  ? "bg-[#f4efe4]"
                  : "bg-[#f4efe4] shadow-[0px_0px_1px_3px_rgba(244,239,228,1)_inset]"
              )}
            />
          );
        })
      )}
    </div>
  );
}
```

---

## `components/file-upload-demo.tsx`

Our personalized demo: the dropzone on a warm **parchment** surface, **ink** title in Fraunces, the gold drop highlight when dragging, forest/teal accents on the file metadata. The Italian copy is wired through the `title`/`subtitle` props.

```tsx
"use client";

import React, { useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";

export default function FileUploadDemo() {
  const [files, setFiles] = useState<File[]>([]);

  const handleFileUpload = (newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
    // Hook this up to your real upload (presigned URL, server action, etc.).
  };

  return (
    <div className="mx-auto min-h-96 w-full max-w-2xl rounded-2xl border border-black/10 bg-[#f4efe4] p-2 shadow-[0_28px_70px_-34px_rgba(38,34,29,0.45)]">
      <FileUpload
        title="Carica il tuo file"
        subtitle="Trascina qui o clicca per caricare"
        onChange={handleFileUpload}
      />
    </div>
  );
}
```

### How the effect works

- **Dropzone.** `useDropzone({ noClick: true, multiple: true, onDrop })` gives you `getRootProps()` (spread on the wrapper) and `isDragActive`. `noClick` is on because we trigger the hidden `<input>` ourselves via the tile, keeping the whole surface clickable without double-opening the picker.
- **GridPattern + mask.** A `41 × 11` grid of `2.5rem` cells alternates two parchment tints (the odd cells get an inset ring so the checkerboard reads). The wrapper applies a `radial-gradient` `mask-image` so the pattern is crisp in the centre and dissolves at the edges.
- **The lifting tile.** The `motion.div` with `layoutId="file-upload"` uses `mainVariant`: at rest `{ x:0, y:0 }`, and on the parent's `whileHover="animate"` it springs to `{ x:20, y:-20, opacity:0.9 }`. A dashed echo behind it (`secondaryVariant`) fades from `opacity 0 → 1` on hover. Together the tile lifts and a ghost outline appears.
- **File cards.** Each selected file is a `motion.div` sharing the `file-upload` `layoutId` so the tile morphs into the first card. Inside, name / size / type / date each fade in (`opacity 0 → 1`) with `layout` so they reflow smoothly. Size is `(file.size / 1024 / 1024).toFixed(2)` MB; the date is `new Date(file.lastModified).toLocaleDateString("it-IT")`.
- **Drag highlight.** When `isDragActive` is true the shell border switches to ochre-gold with a soft gold ring, and the tile copy flips to "Rilascia".

### Brand notes (lorenzo.studio)

- Surface is warm parchment `#f4efe4` / `#efe9dc`; title is ink `#26221d` in Fraunces, subtitle ink-muted `#6b6256`.
- The drag highlight is ochre-gold `#c8972e` (border + soft ring). The size pill uses a translucent gold fill with **dark ink text** — never white text on gold.
- File-type label is teal `#2f6f68`; the upload icon sits in forest `#1f4d3a`. Copy stays human and Italian-first; mirror EN/SV as needed (e.g. EN "Upload your file" / "Drag and drop or click to upload", SV "Ladda upp din fil" / "Dra hit eller klicka för att ladda upp").
