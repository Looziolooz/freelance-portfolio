# Homepage premium: ricerca vault e piano

Fonti: vault `lorenzovault/Design Systems` (Luxury, Editorial, Minimalism, Japandi, Art Deco, Bold Typography, indice) e una scorsa alla Prompt Library. Vincolo fisso: DESIGN.md resta la legge. Palette Parchment & Forest, Fraunces + General Sans + JetBrains Mono, bordi ink 3px, ombre dure, niente blur, niente vetro, niente gradienti. La decisione del 2026-06-18 sta in piedi: si eleva il brand esistente, il vault serve per principi e meccaniche, mai per pivot estetici.

---

## Cosa dicono le fonti

### 💎 Luxury
- Il lusso quiet si comunica con silenzio, proporzione e dettaglio, il prezzo non si dice mai.
- Motion lenta e intenzionale: easing `cubic-bezier(0.76, 0, 0.24, 1)`, durate 600-900ms, "ogni transizione si vede e si sente".
- Dettagli che si scoprono: micro-animazioni, linee che si disegnano su hover (`stroke-dashoffset`), reveal del testo riga per riga (clip-path wipe).
- Spacing a progressione crescente (16/32/56/88/144/232), sezioni alte, pochi elementi per riga.
- L'accento (lì l'oro) usato pochissimo: "una linea, non un flood". Mai claim numerici gonfiati, mai testo marketing.
- Italic del serif come voce narrativa, Small Caps per label.

### 📰 Editorial
- La griglia è legge, la tipografia FA il design, immagini e colori sono supporto.
- Dispositivi editoriali concreti: label mono uppercase con filetto che corre fino al margine, `hr` 1px come separatori, numeri grandi come elemento grafico, didascalie mono 11px sotto le immagini, pullquote serif italic con filetto laterale.
- Un solo peso accento per sezione, l'accento copre al massimo il 5% della superficie.
- Motion quasi assente: transizioni link 150ms, nessun fade-in decorativo automatico.
- Riga di testo 60-75 caratteri, scala modulare rigorosa.

### ⬜ Minimalism
- Ogni elemento deve giustificare la propria presenza: "se puoi toglierlo, toglilo".
- Lo spazio bianco è layout attivo. Margini di sezione 96-160px verticali.
- Un solo colore d'accento per composizione, una sola variazione di grigio per il testo secondario.
- Gerarchia data dalla scala tipografica, la decorazione arriva dopo.
- Entrance sobrie: opacity pura o traslazioni minime, mai scroll-animation decorativa.

### 🍵 Japandi
- Il vuoto è parte del design. Composizioni 2/3 contenuto + 1/3 respiro.
- Palette calda e terrosa, un solo elemento d'accento vivo per composizione: coerente con la nostra parchment.
- Motion delicata 400-600ms, hover come sfumatura senza scale.
- Corpo testo con misura stretta (max ~520px) per leggibilità.
- Texture carta sottile come fondo: conferma la scelta del grain già in `--grain`.

### 🏛️ Art Deco
- Quasi tutto fuori brand (vedi sotto). Due idee trasferibili come principio, senza l'estetica: le bande decorative come momenti di transizione fra sezioni (da noi già svolte dai bordi ink 3px delle bande piene) e le linee che si disegnano con `stroke-dashoffset`, la stessa meccanica citata da Luxury.

### 🔠 Bold Typography
- Già la base della scala display attuale (decisione 2026-06-30). Conferme utili: la gerarchia nasce dal salto di scala fra il titolo e il resto, il body resta piccolo e disciplinato.
- Signature di motion: righe del titolo che salgono da sotto (clip + translateY) in cascata staggered, easing `cubic-bezier(0.16, 1, 0.3, 1)`, che è esattamente il nostro `--ease`.
- Hover sulla parola accento: passa da fill a contorno, underline che scatta da sinistra.

### 🎨 Indice + 📚 Prompt Library (scorsa)
- L'indice mappa "brand premium / lusso" su Luxury e Art Deco, e "landing pulita" su Minimalism, Swiss, Japandi. La nostra strada è l'incrocio: struttura da Editorial/Minimalism, tempi e dettagli da Luxury.
- La Prompt Library (253 prompt hero/landing, quasi tutti dark + Tailwind + Framer) è un catalogo di meccaniche, l'estetica è quasi sempre fuori brand. Regola già in uso nel repo (hero scrub del 2026-08-07): si porta la meccanica, mai il look. Niente in libreria batte quello che l'hero ha già.

---

## Cosa si applica qui

Mappatura principio → punto preciso della homepage attuale (Hero → WorkGrid → TechStack → BentoShift → Trust → Plans → Faq → LeadMagnet → CinematicFooter).

1. **Tempi di motion a due velocità** (Luxury). Oggi tutto viaggia a 150-300ms. I micro-hover devono restare scattanti, ma le entrance dei blocchi grandi (sec-head, celle bento, plan-card) meritano il registro lento: 500-650ms sullo stesso `--ease`. È la differenza fra "reattivo" e "deliberato", ed è il segnale premium a costo più basso di tutta la lista. File: durate in `Reveal.tsx` e transizioni entrance in `globals.css`.

2. **Filetto editoriale sugli eyebrow** (Editorial). `.sec-head__eyebrow` (e `.wgr__eyebrow`, `.tech__eyebrow`) guadagna un filetto 1px `--line` che corre dal testo al margine destro (il device `label::after` della scheda). Le sezioni si aprono come capitoli di una rivista. Un solo pattern, ripetuto ovunque, e la pagina si lega.

3. **Folio di sezione coerente** (Editorial, numeri come elemento grafico). Le sezioni del funnel portano un numero mono piccolo accanto all'eyebrow (01 Servizi, 02 Perché, 03 Piani, 04 FAQ, 05 Audit). Il numero c'è già a tratti nella storia del sito, qui torna come sistema, in mono 11px, senza watermark giganti.

4. **Un accento per carta** (Minimalism, Editorial 5%). Le card di `WorkGrid` oggi portano due pillole ochre a testa (badge demo + tag categoria): l'accento si diluisce. Il badge demo resta ochre (è l'azione), il tag categoria scende a mono ink con bordo sottile. Sul totale della pagina l'ochre torna a indicare solo azioni e highlight.

5. **Didascalie mono** (Editorial). Sotto il titolo di ogni card di WorkGrid, la categoria o il "Valore" in mono 10.5-11px come una vera didascalia da rivista. Materiale già in `projects.ts`, nessun contenuto nuovo.

6. **Underline che si disegna** (Luxury micro-dettaglio, Bold Typography hover). I link forest (nota di WorkGrid, `trust-proof`, link footer) passano da underline statica a underline che si disegna da sinistra su hover (background-size, 250-300ms, niente SVG). Dettaglio che si scopre, invisibile finché non lo cerchi.

7. **Entrance dell'hero a righe** (Bold Typography signature + Luxury reveal riga per riga). Kicker, H1, lede e CTA della statement entrano in cascata con clip + translateY sul primo paint, poi la scrub del footage prosegue come oggi. `EncryptedText` resta (il layout è già congelato dalla fix CLS), la cascata avvolge i blocchi, non i caratteri. Reduced-motion: tutto fermo e visibile, come ora.

8. **FAQ come indice editoriale** (Editorial). Le sette domande si numerano in mono (01-07), i separatori scendono a filetti 1px, la summary sale leggermente di corpo in Fraunces. La FAQ oggi è il blocco più anonimo della pagina, con tre tocchi diventa un sommario.

9. **Respiro verticale a progressione** (Luxury, Minimalism, Japandi). `--section-y` ha tetto 128px, le fonti convergono su 140-160 per il registro premium. Tetto a ~152px e un controllo che le bande piene (WorkGrid, Trust, LeadMagnet) respirino sopra e sotto con lo stesso ritmo. Il vuoto in più è il segnale.

10. **Voce narrativa in italic** (Luxury). Un solo punto della pagina in Fraunces italic: una riga di posizionamento nella banda scura di Trust, sopra le quattro card, come pullquote. Fraunces ha l'asse italic, il peso resta ≤600. Un punto solo, se compare due volte smette di essere un dispositivo.

11. **Cosa TOGLIERE** (Minimalism, la voce più premium della lista):
    - la seconda regola `.wgr__card:hover` duplicata nel CSS di `WorkGrid.tsx` (riga 87, copia della 78);
    - una delle due pillole ochre per card (punto 4);
    - il badge "0X · tag" sulle plan-card può scendere a solo folio mono, il chip attuale ripete l'eyebrow della sezione;
    - nessuna aggiunta di nuove sezioni: la pagina è già un funnel completo.

---

## Cosa non importare

- **Oro su nero, Didot/Bodoni, tracking positivo sui display** (Luxury, Art Deco). La nostra ochre vive su parchment con testo scuro, il display è Fraunces con tracking -0.02em fissato da DESIGN.md. Ogni suggerimento del vault che spinge verso il lusso notturno è fuori scope: cambierebbe palette e font, e quella decisione è chiusa.
- **Linee 0.5px e ombre ultra-soft** (Luxury). Il brand parla con bordi 3px e ombre dure a offset. I filetti editoriali si fanno con 1px `--line`, che nel sistema già esiste, non con hairline dorate.
- **Simmetria centrata, raggiere, gradienti oro su testo, glow** (Art Deco). Violano tre guardrail insieme: niente centered-everything, niente gradienti, niente blur.
- **Inter e il bianco puro** (Minimalism). La scheda propone Inter come display: è il font vietato numero uno del progetto. E il canvas resta parchment, mai `#FFFFFF`.
- **Togliere grain e texture** (Minimalism dice "nessuna texture"). Il grain è un asset del brand (Premium Elevation in DESIGN.md), si tiene.
- **Rosso editoriale e "nessuna ombra"** (Editorial). L'accento resta ochre/forest, le ombre dure restano: sono la struttura, non decorazione da ripulire.
- **Pesi 800/900 e display a 14vw** (Bold Typography). Fraunces resta ≤600 e l'hero ha già rifiutato il tier xl ("esagerato", decisione 2026-06-30).
- **Bottoni lowercase e hover soft-blur** (Japandi), **dark hero glassmorphism** (grosso della Prompt Library). Meccaniche sì, estetica no.

---

## Piano

Ordinato dal più piccolo. Nessun cambio a palette, font, struttura delle sezioni.

1. **Pulizia WorkGrid** · `src/components/WorkGrid.tsx`
   Rimuovere la regola hover duplicata, demotare il tag categoria da pillola ochre a label mono ink con bordo 1px. Perché è premium: un solo accento per carta, l'ochre torna a significare azione. **S**

2. **Underline disegnata sui link forest** · `src/app/globals.css`
   Link testuali (nota WorkGrid, trust-proof, footer svc): underline via `background-size` che cresce da sinistra su hover, 250ms su `--ease`. Perché: micro-dettaglio che si scopre, firma Luxury a costo zero. **S**

3. **Filetto editoriale + folio sugli header** · `src/app/globals.css`, `src/components/SectionHeader.tsx`
   `::after` 1px `--line` dopo l'eyebrow fino al margine, numero mono di sezione accanto (01-05 sul funnel). Stesso device su `.wgr__lead` e `.tech__lead`. Perché: la pagina si sfoglia come una pubblicazione, le sezioni diventano capitoli. **S**

4. **Registro lento per le entrance** · `src/components/Reveal.tsx`, `src/app/globals.css`
   Durata reveal dei blocchi grandi a 550-650ms (stesso `--ease`), hover e press invariati a 150-200ms. Perché: la calma è il tell del prezzo alto, la reattività resta dove serve. **S**

5. **Didascalie mono sotto i titoli card** · `src/components/WorkGrid.tsx`
   Riga mono 10.5px con categoria o Valore sotto `.wgr__name`. Perché: le card smettono di essere thumbnail e diventano schede catalogo. **S**

6. **Respiro verticale** · `src/app/globals.css`
   `--section-y` tetto da 128 a ~152px, verifica del ritmo sopra/sotto le tre bande piene. Perché: lo spazio in più fra i capitoli è il segnale premium più antico che esista. Da verificare su 1440 e 390 che nessuna sezione `min-height:100vh` vada in overflow. **M**

7. **FAQ editoriale** · `src/components/Faq.tsx`, `src/app/globals.css`
   Numerazione mono 01-07, separatori a filetto, summary in Fraunces un gradino sopra. Perché: il blocco più piatto della pagina guadagna la stessa voce del resto. **M**

8. **Cascata d'ingresso dell'hero + italic in Trust** · `src/components/HeroMotion.tsx`, `src/components/Trust.tsx`
   Statement dell'hero (kicker → H1 → lede → CTA) in cascata clip + translateY al primo paint, con guardia reduced-motion e senza toccare pin e scrub (il vincolo del DESIGN.md sui container trasformati resta). In Trust, una riga di posizionamento in Fraunces italic come pullquote sopra le card. Perché: l'apertura acquista regia e la banda scura una voce d'autore. **M**

Fuori lista ma da tenere d'occhio: il badge "0X · tag" delle plan-card (ridondante col folio del punto 3, si può semplificare quando si tocca Plans) e il controllo `npx impeccable detect src` prima di chiudere, come da CLAUDE.md.
