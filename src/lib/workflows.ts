import type { Lang } from "@/i18n";
import type { WorkflowGraph } from "./workflow-graph";

// Copy for the interactive workflow demos on /work/[slug].
//
// The six automation projects have no embeddable URL, so their detail pages used
// to show a rendered PNG of the flow plus "demo navigabile in arrivo". That image
// had its text baked in, in Italian only, and it showed a single frozen case: a
// visitor could see the shape of the process but never what it actually decides.
//
// Here each workflow is a small set of real inputs the visitor picks from. The
// rule that fires and the output produced both change with the pick, so the thing
// being demonstrated is the DECISION, not the diagram. Three cases minimum, and
// wherever the automation can decline to act (hands off to a human, skips a paid
// invoice, flags something as urgent) one case shows exactly that: the restraint
// is the part a buyer needs to trust, and a still image can never show it.
//
// Copy lives here rather than in i18n/index.ts because these strings are deeply
// nested per case and only ever read by one component; flattening them into the
// global dict would have added ~400 keys nobody else touches.

export type WorkflowCase = {
  id: string;
  /** The input as the visitor sees it: a message, an invoice row, a page. */
  label: string;
  /** How the automation classifies that input. */
  tag: string;
  /** The rule that fires for this input, shown in the middle stage. */
  rule: string;
  /** What comes out. Rendered as separate lines. */
  out: string[];
  /** Outcome chip under the output. */
  status: string;
  /** Set when the outcome is a hand-off or a deliberate no-op rather than a send. */
  held?: boolean;
};

export type WorkflowCopy = {
  /** One line telling the visitor the demo is theirs to drive. */
  hint: string;
  s1: string;
  s1title: string;
  s2: string;
  s2title: string;
  s3: string;
  s3title: string;
  /** Standing state of the automation, e.g. "sempre attivo". */
  badge: string;
  cases: WorkflowCase[];
};

const WHATSAPP: Record<Lang, WorkflowCopy> = {
  it: {
    hint: "Scegli un messaggio: vedi la regola che scatta e la risposta che parte.",
    s1: "Origine", s1title: "Messaggio del cliente",
    s2: "Decisione", s2title: "Cerca nelle informazioni dell’attività",
    s3: "Azione", s3title: "Risposta su WhatsApp",
    badge: "Sempre attivo",
    cases: [
      {
        id: "orari", label: "«A che ora chiudete?»", tag: "orari",
        rule: "Trova gli orari nella scheda dell’attività.",
        out: ["Buonasera! Chiudiamo alle 19:30, il sabato alle 13:00."],
        status: "Inviata in 4 secondi",
      },
      {
        id: "zone", label: "«Fate consegne a Rende?»", tag: "zone",
        rule: "Confronta la località con le zone di consegna.",
        out: ["A Rende consegniamo il martedì e il venerdì.", "Ordine entro le 10 del mattino."],
        status: "Inviata in 3 secondi",
      },
      {
        id: "prodotti", label: "«Avete pane senza glutine?»", tag: "prodotti",
        rule: "Cerca il prodotto nel listino e nelle disponibilità.",
        out: ["Sì, pane e focaccia senza glutine tutti i giorni.", "Le paste il giovedì."],
        status: "Inviata in 5 secondi",
      },
      {
        id: "sconto", label: "«Mi fate uno sconto sui 20 pezzi?»", tag: "non lo sa",
        rule: "Nessuna informazione certa: non inventa, passa la conversazione a te.",
        out: ["Le passo il titolare, le risponde a breve."],
        status: "Passata a te, niente risposta inventata",
        held: true,
      },
    ],
  },
  en: {
    hint: "Pick a message: watch which rule fires and what gets sent.",
    s1: "Source", s1title: "Customer message",
    s2: "Decision", s2title: "Looks it up in the business's own information",
    s3: "Action", s3title: "Reply on WhatsApp",
    badge: "Always on",
    cases: [
      {
        id: "orari", label: "“What time do you close?”", tag: "hours",
        rule: "Finds the opening hours in the business profile.",
        out: ["Good evening! We close at 19:30, and at 13:00 on Saturdays."],
        status: "Sent in 4 seconds",
      },
      {
        id: "zone", label: "“Do you deliver to Rende?”", tag: "areas",
        rule: "Matches the town against the delivery areas.",
        out: ["We deliver to Rende on Tuesdays and Fridays.", "Orders by 10 in the morning."],
        status: "Sent in 3 seconds",
      },
      {
        id: "prodotti", label: "“Do you have gluten-free bread?”", tag: "products",
        rule: "Looks the product up in the price list and stock.",
        out: ["Yes, gluten-free bread and focaccia every day.", "Pastries on Thursdays."],
        status: "Sent in 5 seconds",
      },
      {
        id: "sconto", label: "“Any discount on 20 pieces?”", tag: "doesn't know",
        rule: "No reliable answer available: it does not invent one, it hands you the conversation.",
        out: ["Passing you to the owner, they'll reply shortly."],
        status: "Handed to you, nothing invented",
        held: true,
      },
    ],
  },
  sv: {
    hint: "Välj ett meddelande: se vilken regel som slår till och vad som skickas.",
    s1: "Källa", s1title: "Kundens meddelande",
    s2: "Beslut", s2title: "Söker i verksamhetens egen information",
    s3: "Åtgärd", s3title: "Svar på WhatsApp",
    badge: "Alltid på",
    cases: [
      {
        id: "orari", label: "”När stänger ni?”", tag: "öppettider",
        rule: "Hittar öppettiderna i företagsuppgifterna.",
        out: ["God kväll! Vi stänger 19:30, och 13:00 på lördagar."],
        status: "Skickat på 4 sekunder",
      },
      {
        id: "zone", label: "”Kör ni ut till Rende?”", tag: "områden",
        rule: "Stämmer av orten mot leveransområdena.",
        out: ["Till Rende kör vi tisdagar och fredagar.", "Beställning senast 10 på morgonen."],
        status: "Skickat på 3 sekunder",
      },
      {
        id: "prodotti", label: "”Har ni glutenfritt bröd?”", tag: "produkter",
        rule: "Slår upp produkten i prislistan och lagret.",
        out: ["Ja, glutenfritt bröd och focaccia varje dag.", "Bakverk på torsdagar."],
        status: "Skickat på 5 sekunder",
      },
      {
        id: "sconto", label: "”Rabatt om jag tar 20 stycken?”", tag: "vet inte",
        rule: "Inget säkert svar finns: den hittar inte på, den lämnar över samtalet till dig.",
        out: ["Jag kopplar dig till ägaren, du får svar strax."],
        status: "Överlämnat till dig, inget påhittat",
        held: true,
      },
    ],
  },
};

const EMAIL: Record<Lang, WorkflowCopy> = {
  it: {
    hint: "Scegli un’email: vedi come viene classificata e che bozza esce.",
    s1: "Origine", s1title: "Email in arrivo",
    s2: "Decisione", s2title: "Classifica l’intento, cerca nei tuoi documenti",
    s3: "Azione", s3title: "Bozza pronta in Gmail",
    badge: "A ogni email",
    cases: [
      {
        id: "preventivo", label: "«Quanto costa la sala per 40 persone?»", tag: "preventivo",
        rule: "Intento: preventivo. Cerca nel listino la fascia giusta.",
        out: ["Per 40 persone la sala è 380€ + IVA, allestimento incluso.", "In allegato il listino completo."],
        status: "Bozza pronta, la invii tu",
      },
      {
        id: "orari", label: "«Siete aperti il 2 giugno?»", tag: "orari",
        rule: "Intento: informazione. Cerca nel calendario delle chiusure.",
        out: ["Il 2 giugno siamo aperti dalle 9:00 alle 13:00."],
        status: "Bozza pronta, la invii tu",
      },
      {
        id: "reclamo", label: "«Voglio annullare l’ordine 4471»", tag: "urgente",
        rule: "Intento: reclamo. Nessuna bozza automatica su questi.",
        out: ["Messa in cima alla lista.", "Niente risposta automatica: la scrivi tu."],
        status: "Segnalata, da leggere per prima",
        held: true,
      },
    ],
  },
  en: {
    hint: "Pick an email: see how it gets classified and what draft comes out.",
    s1: "Source", s1title: "Incoming email",
    s2: "Decision", s2title: "Classifies the intent, searches your documents",
    s3: "Action", s3title: "Draft waiting in Gmail",
    badge: "On every email",
    cases: [
      {
        id: "preventivo", label: "“What does the room cost for 40 people?”", tag: "quote",
        rule: "Intent: quote. Finds the right band in the price list.",
        out: ["For 40 people the room is €380 + VAT, setup included.", "Full price list attached."],
        status: "Draft ready, you send it",
      },
      {
        id: "orari", label: "“Are you open on 2 June?”", tag: "hours",
        rule: "Intent: information. Checks the closures calendar.",
        out: ["On 2 June we are open from 9:00 to 13:00."],
        status: "Draft ready, you send it",
      },
      {
        id: "reclamo", label: "“I want to cancel order 4471”", tag: "urgent",
        rule: "Intent: complaint. No automatic draft on these, ever.",
        out: ["Moved to the top of the list.", "No automatic reply: you write this one."],
        status: "Flagged, read this first",
        held: true,
      },
    ],
  },
  sv: {
    hint: "Välj ett mejl: se hur det klassas och vilket utkast som kommer ut.",
    s1: "Källa", s1title: "Inkommande mejl",
    s2: "Beslut", s2title: "Klassar avsikten, söker i dina dokument",
    s3: "Åtgärd", s3title: "Utkast klart i Gmail",
    badge: "På varje mejl",
    cases: [
      {
        id: "preventivo", label: "”Vad kostar lokalen för 40 personer?”", tag: "offert",
        rule: "Avsikt: offert. Hittar rätt intervall i prislistan.",
        out: ["För 40 personer kostar lokalen 4 400 kr + moms, möblering ingår.", "Hela prislistan bifogas."],
        status: "Utkast klart, du skickar",
      },
      {
        id: "orari", label: "”Har ni öppet den 2 juni?”", tag: "öppettider",
        rule: "Avsikt: information. Kollar kalendern över stängda dagar.",
        out: ["Den 2 juni har vi öppet 9:00 till 13:00."],
        status: "Utkast klart, du skickar",
      },
      {
        id: "reclamo", label: "”Jag vill avboka order 4471”", tag: "brådskande",
        rule: "Avsikt: reklamation. Aldrig ett automatiskt utkast på dessa.",
        out: ["Flyttat högst upp i listan.", "Inget automatiskt svar: det här skriver du."],
        status: "Flaggat, läs det här först",
        held: true,
      },
    ],
  },
};

const SOLLECITI: Record<Lang, WorkflowCopy> = {
  it: {
    hint: "Scegli una riga del foglio: vedi cosa decide e a chi scrive davvero.",
    s1: "Origine", s1title: "Foglio fatture, ogni mattina alle 8:00",
    s2: "Decisione", s2title: "Guarda scadenza e stato del pagamento",
    s3: "Azione", s3title: "Email al cliente",
    badge: "Ogni giorno",
    cases: [
      {
        id: "scaduta", label: "Fattura 118 · scaduta da 12 giorni", tag: "scaduta",
        rule: "Scaduta: sollecito fermo, con estratto della fattura.",
        out: ["Oggetto: fattura 118 ancora aperta", "Risulta non saldata da 12 giorni. In allegato copia e coordinate."],
        status: "Inviata",
      },
      {
        id: "scadenza", label: "Fattura 124 · scade fra 2 giorni", tag: "in scadenza",
        rule: "Entro tre giorni: promemoria gentile, prima che scada.",
        out: ["Oggetto: promemoria fattura 124", "Solo un promemoria: la scadenza è giovedì."],
        status: "Inviata",
      },
      {
        id: "pagata", label: "Fattura 121 · pagata ieri", tag: "pagata",
        rule: "Risulta pagata: nessuna email, per nessun motivo.",
        out: ["Nessun invio."],
        status: "Saltata, chi ha pagato non riceve niente",
        held: true,
      },
    ],
  },
  en: {
    hint: "Pick a row from the sheet: see what it decides and who actually gets written to.",
    s1: "Source", s1title: "Invoice sheet, every morning at 8:00",
    s2: "Decision", s2title: "Reads the due date and the payment status",
    s3: "Action", s3title: "Email to the client",
    badge: "Every day",
    cases: [
      {
        id: "scaduta", label: "Invoice 118 · 12 days overdue", tag: "overdue",
        rule: "Overdue: firm reminder, with the invoice attached.",
        out: ["Subject: invoice 118 still open", "It has been unpaid for 12 days. Copy and bank details attached."],
        status: "Sent",
      },
      {
        id: "scadenza", label: "Invoice 124 · due in 2 days", tag: "due soon",
        rule: "Within three days: gentle reminder, before it falls due.",
        out: ["Subject: reminder, invoice 124", "Just a reminder: it falls due on Thursday."],
        status: "Sent",
      },
      {
        id: "pagata", label: "Invoice 121 · paid yesterday", tag: "paid",
        rule: "Marked paid: no email, under any circumstances.",
        out: ["Nothing sent."],
        status: "Skipped, whoever paid hears nothing",
        held: true,
      },
    ],
  },
  sv: {
    hint: "Välj en rad ur arket: se vad den beslutar och vem som faktiskt får ett mejl.",
    s1: "Källa", s1title: "Fakturaark, varje morgon 8:00",
    s2: "Beslut", s2title: "Läser förfallodag och betalstatus",
    s3: "Åtgärd", s3title: "Mejl till kunden",
    badge: "Varje dag",
    cases: [
      {
        id: "scaduta", label: "Faktura 118 · 12 dagar försenad", tag: "förfallen",
        rule: "Förfallen: bestämd påminnelse, med fakturan bifogad.",
        out: ["Ämne: faktura 118 fortfarande öppen", "Den har varit obetald i 12 dagar. Kopia och betaluppgifter bifogas."],
        status: "Skickat",
      },
      {
        id: "scadenza", label: "Faktura 124 · förfaller om 2 dagar", tag: "förfaller snart",
        rule: "Inom tre dagar: vänlig påminnelse, innan den förfaller.",
        out: ["Ämne: påminnelse, faktura 124", "Bara en påminnelse: den förfaller på torsdag."],
        status: "Skickat",
      },
      {
        id: "pagata", label: "Faktura 121 · betald igår", tag: "betald",
        rule: "Markerad betald: inget mejl, under inga omständigheter.",
        out: ["Inget skickas."],
        status: "Hoppas över, den som betalat hör ingenting",
        held: true,
      },
    ],
  },
};

const SOCIAL: Record<Lang, WorkflowCopy> = {
  it: {
    hint: "Scegli un canale: stesso lavoro consegnato, testo riscritto per quel pubblico.",
    s1: "Origine", s1title: "Lavoro consegnato: sito per una gelateria",
    s2: "Decisione", s2title: "Adatta lunghezza e tono al canale",
    s3: "Azione", s3title: "Testo pronto da pubblicare",
    badge: "A ogni consegna",
    cases: [
      {
        id: "linkedin", label: "LinkedIn", tag: "lungo, professionale",
        rule: "Canale lungo: parte dal problema, chiude sul risultato misurabile.",
        out: [
          "Tre botteghe, un solo numero di telefono che squillava per gli ordini.",
          "Ora il ritiro si prenota dal sito e arriva già ordinato in cassa.",
        ],
        status: "Pronto, 780 caratteri",
      },
      {
        id: "instagram", label: "Instagram", tag: "breve, visivo",
        rule: "Canale visivo: tre righe, il resto lo dice la foto.",
        out: ["Il gelato lo fanno dal 1978.", "Il sito lo abbiamo fatto adesso.", "Prenoti il ritiro in due tocchi."],
        status: "Pronto, con 6 hashtag",
      },
      {
        id: "newsletter", label: "Newsletter", tag: "diretto, a chi ti conosce",
        rule: "Pubblico già acquisito: nessuna presentazione, si va al fatto nuovo.",
        out: ["Da questa settimana il ritiro si prenota online.", "Scegli bottega e orario, il resto lo trovi pronto."],
        status: "Pronto, con oggetto",
      },
    ],
  },
  en: {
    hint: "Pick a channel: same delivered job, rewritten for that audience.",
    s1: "Source", s1title: "Job delivered: a website for a gelateria",
    s2: "Decision", s2title: "Fits length and tone to the channel",
    s3: "Action", s3title: "Text ready to post",
    badge: "On every delivery",
    cases: [
      {
        id: "linkedin", label: "LinkedIn", tag: "long, professional",
        rule: "Long-form channel: opens on the problem, closes on the measurable result.",
        out: [
          "Three shops, one phone line ringing for every single order.",
          "Pickup is now booked from the site and lands at the counter already sorted.",
        ],
        status: "Ready, 780 characters",
      },
      {
        id: "instagram", label: "Instagram", tag: "short, visual",
        rule: "Visual channel: three lines, the photo says the rest.",
        out: ["They have made the gelato since 1978.", "We made the website this month.", "Book pickup in two taps."],
        status: "Ready, with 6 hashtags",
      },
      {
        id: "newsletter", label: "Newsletter", tag: "direct, to people who know you",
        rule: "Audience already earned: no introduction, straight to what is new.",
        out: ["From this week you can book pickup online.", "Pick a shop and a time, the rest is waiting for you."],
        status: "Ready, with subject line",
      },
    ],
  },
  sv: {
    hint: "Välj en kanal: samma levererade jobb, omskrivet för den publiken.",
    s1: "Källa", s1title: "Levererat jobb: sajt åt en glassbar",
    s2: "Beslut", s2title: "Anpassar längd och ton till kanalen",
    s3: "Åtgärd", s3title: "Text klar att publicera",
    badge: "Vid varje leverans",
    cases: [
      {
        id: "linkedin", label: "LinkedIn", tag: "lång, professionell",
        rule: "Lång kanal: börjar i problemet, slutar i det mätbara resultatet.",
        out: [
          "Tre butiker, en enda telefon som ringde för varje beställning.",
          "Nu bokas upphämtningen på sajten och landar färdigsorterad i kassan.",
        ],
        status: "Klar, 780 tecken",
      },
      {
        id: "instagram", label: "Instagram", tag: "kort, visuell",
        rule: "Visuell kanal: tre rader, bilden säger resten.",
        out: ["Glassen har de gjort sedan 1978.", "Sajten gjorde vi den här månaden.", "Boka upphämtning på två tryck."],
        status: "Klar, med 6 hashtaggar",
      },
      {
        id: "newsletter", label: "Nyhetsbrev", tag: "direkt, till dem som känner dig",
        rule: "Publiken är redan din: ingen presentation, rakt på det nya.",
        out: ["Från den här veckan bokar du upphämtning online.", "Välj butik och tid, resten står klart."],
        status: "Klar, med ämnesrad",
      },
    ],
  },
};

const MERCATO: Record<Lang, WorkflowCopy> = {
  it: {
    hint: "Scegli categoria e zona: vedi che foglio esce e cosa ci leggi dentro.",
    s1: "Origine", s1title: "Categoria e zona",
    s2: "Decisione", s2title: "Raccoglie le schede pubbliche e le ordina",
    s3: "Azione", s3title: "Foglio pronto",
    badge: "Su richiesta",
    cases: [
      {
        id: "parrucchieri", label: "Parrucchieri · Cosenza", tag: "47 attività",
        rule: "Conta le attività, incrocia recensioni e presenza online.",
        out: ["31 su 47 non hanno un sito", "Media recensioni 4,1", "Zona più scoperta: Via Popilia"],
        status: "Foglio pronto, 47 righe",
      },
      {
        id: "pizzerie", label: "Pizzerie · Rende", tag: "62 attività",
        rule: "Conta le attività, incrocia recensioni e presenza online.",
        out: ["18 su 62 non prendono ordini online", "Media recensioni 4,4", "Zona più satura: centro"],
        status: "Foglio pronto, 62 righe",
      },
      {
        id: "palestre", label: "Palestre · Catanzaro", tag: "23 attività",
        rule: "Conta le attività, incrocia recensioni e presenza online.",
        out: ["9 su 23 senza orari pubblicati", "Media recensioni 3,8", "Nessuna con prenotazione online"],
        status: "Foglio pronto, 23 righe",
      },
    ],
  },
  en: {
    hint: "Pick a category and an area: see the sheet that comes out and what it tells you.",
    s1: "Source", s1title: "Category and area",
    s2: "Decision", s2title: "Collects the public listings and orders them",
    s3: "Action", s3title: "Sheet ready",
    badge: "On request",
    cases: [
      {
        id: "parrucchieri", label: "Hairdressers · Cosenza", tag: "47 businesses",
        rule: "Counts the businesses, cross-checks reviews and online presence.",
        out: ["31 of 47 have no website", "Average rating 4.1", "Thinnest area: Via Popilia"],
        status: "Sheet ready, 47 rows",
      },
      {
        id: "pizzerie", label: "Pizzerias · Rende", tag: "62 businesses",
        rule: "Counts the businesses, cross-checks reviews and online presence.",
        out: ["18 of 62 take no online orders", "Average rating 4.4", "Most crowded area: the centre"],
        status: "Sheet ready, 62 rows",
      },
      {
        id: "palestre", label: "Gyms · Catanzaro", tag: "23 businesses",
        rule: "Counts the businesses, cross-checks reviews and online presence.",
        out: ["9 of 23 publish no opening hours", "Average rating 3.8", "None offer online booking"],
        status: "Sheet ready, 23 rows",
      },
    ],
  },
  sv: {
    hint: "Välj kategori och område: se arket som kommer ut och vad det säger dig.",
    s1: "Källa", s1title: "Kategori och område",
    s2: "Beslut", s2title: "Samlar in de offentliga uppgifterna och ordnar dem",
    s3: "Åtgärd", s3title: "Arket klart",
    badge: "På begäran",
    cases: [
      {
        id: "parrucchieri", label: "Frisörer · Cosenza", tag: "47 företag",
        rule: "Räknar företagen, korsar omdömen med närvaro på nätet.",
        out: ["31 av 47 saknar sajt", "Snittbetyg 4,1", "Tunnaste området: Via Popilia"],
        status: "Ark klart, 47 rader",
      },
      {
        id: "pizzerie", label: "Pizzerior · Rende", tag: "62 företag",
        rule: "Räknar företagen, korsar omdömen med närvaro på nätet.",
        out: ["18 av 62 tar inte emot beställningar online", "Snittbetyg 4,4", "Tätaste området: centrum"],
        status: "Ark klart, 62 rader",
      },
      {
        id: "palestre", label: "Gym · Catanzaro", tag: "23 företag",
        rule: "Räknar företagen, korsar omdömen med närvaro på nätet.",
        out: ["9 av 23 publicerar inga öppettider", "Snittbetyg 3,8", "Ingen har onlinebokning"],
        status: "Ark klart, 23 rader",
      },
    ],
  },
};

const SEO: Record<Lang, WorkflowCopy> = {
  it: {
    hint: "Scegli una pagina: vedi cosa controlla e cosa esce da sistemare.",
    s1: "Origine", s1title: "Pagina analizzata",
    s2: "Decisione", s2title: "Controlla chi cerca e chi indicizza",
    s3: "Azione", s3title: "Cosa sistemare, in ordine di effetto",
    badge: "Pagina per pagina",
    cases: [
      {
        id: "home", label: "/ (home)", tag: "3 problemi",
        rule: "Titolo, peso delle immagini, prima schermata.",
        out: ["Titolo uguale su 3 pagine", "Immagine in alto da 2,4 MB", "Nessun testo prima della piega"],
        status: "Il primo vale più degli altri due",
      },
      {
        id: "menu", label: "/menu", tag: "2 problemi",
        rule: "Descrizione, dati strutturati del menù.",
        out: ["Descrizione assente", "Piatti e prezzi non leggibili da Google"],
        status: "Entrambi risolvibili in un’ora",
      },
      {
        id: "contatti", label: "/contatti", tag: "1 problema",
        rule: "Indirizzo, telefono, orari nei dati strutturati.",
        out: ["Indirizzo scritto solo nel testo, fuori dai dati strutturati"],
        status: "Blocca la scheda su Google Maps",
      },
    ],
  },
  en: {
    hint: "Pick a page: see what gets checked and what comes out to fix.",
    s1: "Source", s1title: "Page analysed",
    s2: "Decision", s2title: "Checks the people searching and the machines indexing",
    s3: "Action", s3title: "What to fix, ordered by effect",
    badge: "Page by page",
    cases: [
      {
        id: "home", label: "/ (home)", tag: "3 issues",
        rule: "Title, image weight, first screenful.",
        out: ["Same title on 3 pages", "2.4 MB image at the top", "No text above the fold"],
        status: "The first one outweighs the other two",
      },
      {
        id: "menu", label: "/menu", tag: "2 issues",
        rule: "Description, structured data for the menu.",
        out: ["Description missing", "Dishes and prices unreadable to Google"],
        status: "Both fixable within an hour",
      },
      {
        id: "contatti", label: "/contact", tag: "1 issue",
        rule: "Address, phone and hours in the structured data.",
        out: ["Address only written in the copy, outside the structured data"],
        status: "This is what blocks the Google Maps listing",
      },
    ],
  },
  sv: {
    hint: "Välj en sida: se vad som kontrolleras och vad som kommer ut att åtgärda.",
    s1: "Källa", s1title: "Analyserad sida",
    s2: "Beslut", s2title: "Kontrollerar både den som söker och den som indexerar",
    s3: "Åtgärd", s3title: "Vad som ska åtgärdas, efter effekt",
    badge: "Sida för sida",
    cases: [
      {
        id: "home", label: "/ (startsida)", tag: "3 problem",
        rule: "Titel, bildvikt, första skärmen.",
        out: ["Samma titel på 3 sidor", "Bild på 2,4 MB högst upp", "Ingen text ovanför vikningen"],
        status: "Den första väger tyngre än de andra två",
      },
      {
        id: "menu", label: "/meny", tag: "2 problem",
        rule: "Beskrivning, strukturerade data för menyn.",
        out: ["Beskrivning saknas", "Rätter och priser går inte att läsa för Google"],
        status: "Båda löses inom en timme",
      },
      {
        id: "contatti", label: "/kontakt", tag: "1 problem",
        rule: "Adress, telefon och öppettider i strukturerade data.",
        out: ["Adressen står bara i texten, utanför strukturerade data"],
        status: "Det är detta som blockerar kartträffen",
      },
    ],
  },
};

const WORKFLOWS: Record<string, Record<Lang, WorkflowCopy>> = {
  whatsapp: WHATSAPP,
  email: EMAIL,
  solleciti: SOLLECITI,
  social: SOCIAL,
  mercato: MERCATO,
  seo: SEO,
};

/** Undefined for any project without a scripted workflow, which keeps the caller
 *  on its existing cover-image path rather than rendering an empty demo. */
export function getWorkflow(key: string, lang: Lang): WorkflowCopy | undefined {
  return WORKFLOWS[key]?.[lang];
}

export function hasWorkflow(key: string): boolean {
  return key in WORKFLOWS;
}

// ---------------------------------------------------------------------------
// The same six automations drawn as node canvases.
//
// One graph per workflow, shared by all three languages: the shape of an
// automation does not change when the visitor switches to Swedish, only its
// labels do, and those are `Localized`. `paths` keys are the case ids above, so
// picking a case in the demo lights the branch that actually ran.
//
// Row convention across all six: 0 is the centre lane, -1 sits above it, 1 sits
// below it. Capability nodes carry no col/row; the renderer hangs them under the
// node named in `of`.
// ---------------------------------------------------------------------------

const WHATSAPP_GRAPH: WorkflowGraph = {
  nodes: [
    {
      id: "msg", kind: "trigger", icon: "chat", col: 0, row: 0,
      label: { it: "Messaggio in arrivo", en: "Message comes in", sv: "Meddelande kommer in" },
      sub: { it: "WhatsApp Business", en: "WhatsApp Business", sv: "WhatsApp Business" },
    },
    {
      id: "capisce", kind: "action", icon: "agent", col: 1, row: 0,
      label: { it: "Capisce che cosa chiede", en: "Works out what they are asking", sv: "Tolkar vad kunden frågar" },
      sub: { it: "una domanda alla volta", en: "one question at a time", sv: "en fråga i taget" },
    },
    {
      id: "modello", kind: "capability", icon: "model", of: "capisce",
      label: { it: "Modello linguistico", en: "Language model", sv: "Språkmodell" },
      sub: {
        it: "risponde nella lingua del messaggio",
        en: "replies in the language of the message",
        sv: "svarar på meddelandets språk",
      },
    },
    {
      id: "intento", kind: "decision", icon: "branch", col: 2, row: 0,
      label: { it: "Di che cosa parla?", en: "What is it about?", sv: "Vad handlar det om?" },
    },
    {
      id: "scheda", kind: "action", icon: "search", col: 3, row: -1,
      label: { it: "Legge la scheda dell’attività", en: "Reads the business profile", sv: "Läser företagsuppgifterna" },
      sub: { it: "orari, zone, contatti", en: "hours, areas, contacts", sv: "tider, områden, kontakt" },
    },
    {
      id: "dati", kind: "capability", icon: "database", of: "scheda",
      label: { it: "Dati dell’attività", en: "Business data", sv: "Verksamhetens data" },
      sub: { it: "li aggiorni tu, in un foglio", en: "you keep them in one sheet", sv: "du håller dem i ett ark" },
    },
    {
      id: "listino", kind: "action", icon: "sheet", col: 3, row: 0,
      label: { it: "Cerca nel listino", en: "Searches the price list", sv: "Söker i prislistan" },
      sub: { it: "prodotti e disponibilità", en: "products and stock", sv: "produkter och lager" },
    },
    {
      id: "disponibilita", kind: "capability", icon: "sheet", of: "listino",
      label: { it: "Disponibilità del giorno", en: "Stock for the day", sv: "Dagens lager" },
      sub: { it: "quello che c’è davvero", en: "what is actually there", sv: "det som faktiskt finns" },
    },
    {
      id: "avvisa", kind: "action", icon: "bell", col: 3, row: 1,
      label: { it: "Avvisa il titolare", en: "Pings the owner", sv: "Larmar ägaren" },
      sub: { it: "notifica sul telefono", en: "notification on the phone", sv: "avisering i telefonen" },
    },
    {
      id: "componi", kind: "action", icon: "doc", col: 4, row: 0,
      label: { it: "Scrive la risposta", en: "Writes the reply", sv: "Skriver svaret" },
      sub: { it: "solo con quello che ha trovato", en: "only from what it found", sv: "bara utifrån det den hittat" },
    },
    {
      id: "inviata", kind: "output", icon: "send", col: 5, row: 0,
      label: { it: "Risposta inviata", en: "Reply sent", sv: "Svar skickat" },
      sub: { it: "in pochi secondi", en: "within seconds", sv: "på några sekunder" },
    },
    {
      id: "mano", kind: "output", icon: "chat", col: 4, row: 1,
      label: { it: "Conversazione in mano tua", en: "Conversation handed to you", sv: "Samtalet lämnas till dig" },
      sub: { it: "niente risposte inventate", en: "nothing invented", sv: "inget påhittat" },
    },
  ],
  edges: [
    { from: "msg", to: "capisce" },
    { from: "capisce", to: "intento" },
    {
      from: "intento", to: "scheda",
      label: { it: "orari e zone", en: "hours, areas", sv: "tider, områden" },
    },
    {
      from: "intento", to: "listino",
      label: { it: "prodotti", en: "products", sv: "produkter" },
    },
    {
      from: "intento", to: "avvisa",
      label: { it: "non lo sa", en: "doesn’t know", sv: "vet inte" },
    },
    { from: "scheda", to: "componi" },
    { from: "listino", to: "componi" },
    { from: "componi", to: "inviata" },
    { from: "avvisa", to: "mano" },
  ],
  paths: {
    orari: ["msg", "capisce", "intento", "scheda", "componi", "inviata"],
    zone: ["msg", "capisce", "intento", "scheda", "componi", "inviata"],
    prodotti: ["msg", "capisce", "intento", "listino", "componi", "inviata"],
    sconto: ["msg", "capisce", "intento", "avvisa", "mano"],
  },
};

const EMAIL_GRAPH: WorkflowGraph = {
  nodes: [
    {
      id: "arriva", kind: "trigger", icon: "mail", col: 0, row: 0,
      label: { it: "Email in arrivo", en: "Email arrives", sv: "Mejl kommer in" },
      sub: { it: "Gmail", en: "Gmail", sv: "Gmail" },
    },
    {
      id: "classifica", kind: "action", icon: "agent", col: 1, row: 0,
      label: { it: "Classifica l’intento", en: "Classifies the intent", sv: "Klassar avsikten" },
      sub: {
        it: "preventivo, informazione, reclamo",
        en: "quote, information, complaint",
        sv: "offert, information, reklamation",
      },
    },
    {
      id: "modello", kind: "capability", icon: "model", of: "classifica",
      label: { it: "Modello linguistico", en: "Language model", sv: "Språkmodell" },
      sub: { it: "legge anche le email confuse", en: "reads the messy ones too", sv: "läser även de röriga" },
    },
    {
      id: "intento", kind: "decision", icon: "branch", col: 2, row: 0,
      label: { it: "Che intento è?", en: "Which intent?", sv: "Vilken avsikt?" },
    },
    {
      id: "prezzo", kind: "action", icon: "sheet", col: 3, row: -1,
      label: {
        it: "Cerca la fascia nel listino",
        en: "Finds the band in the price list",
        sv: "Hittar intervallet i prislistan",
      },
      sub: { it: "per numero di persone", en: "by number of people", sv: "efter antal personer" },
    },
    {
      id: "prezzi", kind: "capability", icon: "database", of: "prezzo",
      label: { it: "Listino aggiornato", en: "Current price list", sv: "Aktuell prislista" },
      sub: { it: "lo aggiorni in un foglio", en: "you keep it in a sheet", sv: "du uppdaterar den i ett ark" },
    },
    {
      id: "documenti", kind: "action", icon: "search", col: 3, row: 0,
      label: { it: "Cerca nei tuoi documenti", en: "Searches your documents", sv: "Söker i dina dokument" },
      sub: { it: "calendario, condizioni, FAQ", en: "calendar, terms, FAQ", sv: "kalender, villkor, FAQ" },
    },
    {
      id: "archivio", kind: "capability", icon: "doc", of: "documenti",
      label: { it: "I tuoi PDF e fogli", en: "Your PDFs and sheets", sv: "Dina PDF:er och ark" },
      sub: { it: "caricati una volta", en: "uploaded once", sv: "uppladdade en gång" },
    },
    {
      id: "priorita", kind: "action", icon: "tag", col: 3, row: 1,
      label: { it: "Etichetta e mette in cima", en: "Labels it and moves it up", sv: "Etiketterar och lyfter upp" },
      sub: { it: "sopra il resto della posta", en: "above the rest of the inbox", sv: "överst i inkorgen" },
    },
    {
      id: "bozza", kind: "action", icon: "doc", col: 4, row: 0,
      label: { it: "Scrive la bozza", en: "Writes the draft", sv: "Skriver utkastet" },
      sub: { it: "con le fonti che ha usato", en: "with the sources it used", sv: "med källorna den använt" },
    },
    {
      id: "pronta", kind: "output", icon: "mail", col: 5, row: 0,
      label: { it: "Bozza in attesa in Gmail", en: "Draft waiting in Gmail", sv: "Utkast väntar i Gmail" },
      sub: { it: "la invii tu", en: "you send it", sv: "du skickar" },
    },
    {
      id: "segnalata", kind: "output", icon: "bell", col: 4, row: 1,
      label: { it: "Segnalata, la scrivi tu", en: "Flagged, you write this one", sv: "Flaggat, det här skriver du" },
      sub: { it: "nessuna bozza automatica", en: "no automatic draft", sv: "inget automatiskt utkast" },
    },
  ],
  edges: [
    { from: "arriva", to: "classifica" },
    { from: "classifica", to: "intento" },
    {
      from: "intento", to: "prezzo",
      label: { it: "preventivo", en: "quote", sv: "offert" },
    },
    {
      from: "intento", to: "documenti",
      label: { it: "informazione", en: "information", sv: "information" },
    },
    {
      from: "intento", to: "priorita",
      label: { it: "reclamo", en: "complaint", sv: "reklamation" },
    },
    { from: "prezzo", to: "bozza" },
    { from: "documenti", to: "bozza" },
    { from: "bozza", to: "pronta" },
    { from: "priorita", to: "segnalata" },
  ],
  paths: {
    preventivo: ["arriva", "classifica", "intento", "prezzo", "bozza", "pronta"],
    orari: ["arriva", "classifica", "intento", "documenti", "bozza", "pronta"],
    reclamo: ["arriva", "classifica", "intento", "priorita", "segnalata"],
  },
};

const SOLLECITI_GRAPH: WorkflowGraph = {
  nodes: [
    {
      id: "mattina", kind: "trigger", icon: "clock", col: 0, row: 0,
      label: { it: "Ogni mattina alle 8:00", en: "Every morning at 8:00", sv: "Varje morgon 8:00" },
      sub: { it: "sette giorni su sette", en: "seven days a week", sv: "sju dagar i veckan" },
    },
    {
      id: "righe", kind: "action", icon: "sheet", col: 1, row: 0,
      label: { it: "Legge le righe del foglio", en: "Reads the rows of the sheet", sv: "Läser arkets rader" },
      sub: { it: "una fattura per riga", en: "one invoice per row", sv: "en faktura per rad" },
    },
    {
      id: "foglio", kind: "capability", icon: "database", of: "righe",
      label: { it: "Foglio fatture", en: "Invoice sheet", sv: "Fakturaarket" },
      sub: { it: "quello che usi già", en: "the one you already use", sv: "det du redan använder" },
    },
    {
      id: "stato", kind: "decision", icon: "filter", col: 2, row: 0,
      label: { it: "Risulta pagata?", en: "Marked as paid?", sv: "Är den betald?" },
    },
    {
      id: "saltata", kind: "output", icon: "filter", col: 3, row: 1,
      label: { it: "Nessuna email", en: "No email at all", sv: "Inget mejl" },
      sub: {
        it: "chi ha pagato non riceve niente",
        en: "whoever paid hears nothing",
        sv: "den som betalat hör ingenting",
      },
    },
    {
      id: "quando", kind: "decision", icon: "calendar", col: 3, row: 0,
      label: { it: "Quanto manca alla scadenza?", en: "How long until it is due?", sv: "Hur länge till förfallodagen?" },
    },
    {
      id: "sollecito", kind: "action", icon: "doc", col: 4, row: -1,
      label: { it: "Prepara il sollecito", en: "Prepares the firm reminder", sv: "Förbereder den bestämda påminnelsen" },
      sub: {
        it: "con copia e coordinate",
        en: "with a copy and the bank details",
        sv: "med kopia och betaluppgifter",
      },
    },
    {
      id: "copia", kind: "capability", icon: "doc", of: "sollecito",
      label: { it: "Copia della fattura", en: "Copy of the invoice", sv: "Kopia av fakturan" },
      sub: { it: "in PDF, allegata", en: "attached as a PDF", sv: "bifogad som PDF" },
    },
    {
      id: "promemoria", kind: "action", icon: "mail", col: 4, row: 0,
      label: { it: "Prepara il promemoria", en: "Prepares the gentle reminder", sv: "Förbereder den vänliga påminnelsen" },
      sub: { it: "tono gentile, due righe", en: "friendly, two lines", sv: "vänlig ton, två rader" },
    },
    {
      id: "inviata", kind: "output", icon: "send", col: 5, row: 0,
      label: { it: "Email inviata al cliente", en: "Email sent to the client", sv: "Mejl skickat till kunden" },
      sub: { it: "e segnata sul foglio", en: "and logged on the sheet", sv: "och noterat i arket" },
    },
  ],
  edges: [
    { from: "mattina", to: "righe" },
    { from: "righe", to: "stato" },
    {
      from: "stato", to: "saltata",
      label: { it: "pagata", en: "paid", sv: "betald" },
    },
    {
      from: "stato", to: "quando",
      label: { it: "ancora aperta", en: "still open", sv: "fortf. öppen" },
    },
    {
      from: "quando", to: "sollecito",
      label: { it: "già scaduta", en: "overdue", sv: "förfallen" },
    },
    {
      from: "quando", to: "promemoria",
      label: { it: "fra tre giorni", en: "in three days", sv: "om tre dagar" },
    },
    { from: "sollecito", to: "inviata" },
    { from: "promemoria", to: "inviata" },
  ],
  paths: {
    scaduta: ["mattina", "righe", "stato", "quando", "sollecito", "inviata"],
    scadenza: ["mattina", "righe", "stato", "quando", "promemoria", "inviata"],
    pagata: ["mattina", "righe", "stato", "saltata"],
  },
};

const SOCIAL_GRAPH: WorkflowGraph = {
  nodes: [
    {
      id: "consegna", kind: "trigger", icon: "bolt", col: 0, row: 0,
      label: { it: "Lavoro consegnato", en: "Job delivered", sv: "Jobbet levererat" },
      sub: { it: "sito di una gelateria", en: "a gelateria website", sv: "sajt åt en glassbar" },
    },
    {
      id: "testo", kind: "action", icon: "agent", col: 1, row: 0,
      label: { it: "Scrive la storia del lavoro", en: "Writes the story of the job", sv: "Skriver jobbets historia" },
      sub: {
        it: "che cosa è cambiato per il cliente",
        en: "what changed for the client",
        sv: "vad som ändrades för kunden",
      },
    },
    {
      id: "scheda", kind: "capability", icon: "database", of: "testo",
      label: { it: "Scheda del progetto", en: "Project record", sv: "Projektkortet" },
      sub: { it: "foto, numeri, date", en: "photos, numbers, dates", sv: "bilder, siffror, datum" },
    },
    {
      id: "modello", kind: "capability", icon: "model", of: "testo",
      label: { it: "Modello linguistico", en: "Language model", sv: "Språkmodell" },
      sub: { it: "una bozza da rileggere", en: "a draft for you to read over", sv: "ett utkast att läsa igenom" },
    },
    {
      id: "voce", kind: "capability", icon: "memory", of: "testo",
      label: { it: "Il tuo modo di scrivere", en: "How you write", sv: "Ditt sätt att skriva" },
      sub: {
        it: "venti post già pubblicati",
        en: "twenty posts already published",
        sv: "tjugo redan publicerade inlägg",
      },
    },
    {
      id: "canale", kind: "decision", icon: "branch", col: 2, row: 0,
      label: { it: "Per quale canale?", en: "Which channel?", sv: "Vilken kanal?" },
    },
    {
      id: "lungo", kind: "action", icon: "doc", col: 3, row: -1,
      label: {
        it: "Apre sul problema, chiude sul risultato",
        en: "Opens on the problem, closes on the result",
        sv: "Börjar i problemet, slutar i resultatet",
      },
      sub: { it: "circa 800 caratteri", en: "about 800 characters", sv: "runt 800 tecken" },
    },
    {
      id: "breve", kind: "action", icon: "tag", col: 3, row: 0,
      label: { it: "Taglia a tre righe", en: "Cuts it to three lines", sv: "Kortar till tre rader" },
      sub: { it: "e sceglie sei hashtag", en: "and picks six hashtags", sv: "och väljer sex hashtaggar" },
    },
    {
      id: "diretto", kind: "action", icon: "mail", col: 3, row: 1,
      label: { it: "Va dritto al fatto nuovo", en: "Goes straight to what is new", sv: "Går rakt på det nya" },
      sub: { it: "oggetto compreso", en: "subject line included", sv: "ämnesrad ingår" },
    },
    {
      id: "post-li", kind: "output", icon: "send", col: 4, row: -1,
      label: { it: "Pronto per LinkedIn", en: "Ready for LinkedIn", sv: "Klart för LinkedIn" },
      sub: { it: "lo rileggi e pubblichi", en: "you read it over and post", sv: "du läser igenom och publicerar" },
    },
    {
      id: "post-ig", kind: "output", icon: "send", col: 4, row: 0,
      label: { it: "Pronto per Instagram", en: "Ready for Instagram", sv: "Klart för Instagram" },
      sub: { it: "con la foto del lavoro", en: "with the photo of the job", sv: "med bilden på jobbet" },
    },
    {
      id: "post-nl", kind: "output", icon: "mail", col: 4, row: 1,
      label: { it: "Pronto per la newsletter", en: "Ready for the newsletter", sv: "Klart för nyhetsbrevet" },
      sub: {
        it: "resta in bozza finché non la mandi tu",
        en: "stays a draft until you send it",
        sv: "förblir ett utkast tills du skickar",
      },
    },
  ],
  edges: [
    { from: "consegna", to: "testo" },
    { from: "testo", to: "canale" },
    {
      from: "canale", to: "lungo",
      label: { it: "LinkedIn", en: "LinkedIn", sv: "LinkedIn" },
    },
    {
      from: "canale", to: "breve",
      label: { it: "Instagram", en: "Instagram", sv: "Instagram" },
    },
    {
      from: "canale", to: "diretto",
      label: { it: "newsletter", en: "newsletter", sv: "nyhetsbrev" },
    },
    { from: "lungo", to: "post-li" },
    { from: "breve", to: "post-ig" },
    { from: "diretto", to: "post-nl" },
  ],
  paths: {
    linkedin: ["consegna", "testo", "canale", "lungo", "post-li"],
    instagram: ["consegna", "testo", "canale", "breve", "post-ig"],
    newsletter: ["consegna", "testo", "canale", "diretto", "post-nl"],
  },
};

const MERCATO_GRAPH: WorkflowGraph = {
  nodes: [
    {
      id: "richiesta", kind: "trigger", icon: "form", col: 0, row: 0,
      label: { it: "Categoria e zona", en: "Category and area", sv: "Kategori och område" },
      sub: {
        it: "es. parrucchieri, Cosenza",
        en: "e.g. hairdressers, Cosenza",
        sv: "t.ex. frisörer, Cosenza",
      },
    },
    {
      id: "raccoglie", kind: "action", icon: "search", col: 1, row: 0,
      label: {
        it: "Raccoglie le schede pubbliche",
        en: "Collects the public listings",
        sv: "Samlar de offentliga uppgifterna",
      },
      sub: { it: "nome, indirizzo, telefono", en: "name, address, phone", sv: "namn, adress, telefon" },
    },
    {
      id: "elenchi", kind: "capability", icon: "database", of: "raccoglie",
      label: { it: "Elenchi pubblici", en: "Public directories", sv: "Offentliga register" },
      sub: { it: "mappe e directory", en: "maps and listings", sv: "kartor och kataloger" },
    },
    {
      id: "pulisce", kind: "action", icon: "filter", col: 2, row: 0,
      label: {
        it: "Toglie doppioni e attività chiuse",
        en: "Drops duplicates and closed businesses",
        sv: "Rensar dubbletter och nedlagda",
      },
      sub: { it: "resta solo chi lavora", en: "only the ones still trading stay", sv: "kvar blir de som är igång" },
    },
    {
      id: "incrocia", kind: "action", icon: "chart", col: 3, row: 0,
      label: {
        it: "Incrocia recensioni e presenza online",
        en: "Cross-checks reviews against online presence",
        sv: "Korsar omdömen mot närvaron på nätet",
      },
      sub: {
        it: "chi ha un sito, chi prende ordini",
        en: "who has a site, who takes orders",
        sv: "vem har sajt, vem tar beställningar",
      },
    },
    {
      id: "siti", kind: "capability", icon: "search", of: "incrocia",
      label: { it: "Controllo dei siti", en: "Website check", sv: "Sajtkoll" },
      sub: { it: "esiste e risponde", en: "does it exist, does it answer", sv: "finns den, svarar den" },
    },
    {
      id: "buco", kind: "decision", icon: "branch", col: 4, row: 0,
      label: { it: "Dov’è il buco più grande?", en: "Where is the biggest gap?", sv: "Var är den största luckan?" },
    },
    {
      id: "sito", kind: "output", icon: "sheet", col: 5, row: -1,
      label: {
        it: "Foglio con la colonna «senza sito»",
        en: "Sheet with the “no website” column",
        sv: "Ark med kolumnen ”ingen sajt”",
      },
      sub: {
        it: "in cima chi ha più recensioni",
        en: "best reviewed at the top",
        sv: "bäst omdömen överst",
      },
    },
    {
      id: "ordini", kind: "output", icon: "cart", col: 5, row: 0,
      label: {
        it: "Foglio con la colonna «ordini online»",
        en: "Sheet with the “online orders” column",
        sv: "Ark med kolumnen ”beställning online”",
      },
      sub: {
        it: "in cima chi ha più recensioni",
        en: "best reviewed at the top",
        sv: "bäst omdömen överst",
      },
    },
    {
      id: "orari", kind: "output", icon: "clock", col: 5, row: 1,
      label: {
        it: "Foglio con la colonna «orari mancanti»",
        en: "Sheet with the “missing hours” column",
        sv: "Ark med kolumnen ”saknade tider”",
      },
      sub: {
        it: "in cima chi ha più recensioni",
        en: "best reviewed at the top",
        sv: "bäst omdömen överst",
      },
    },
  ],
  edges: [
    { from: "richiesta", to: "raccoglie" },
    { from: "raccoglie", to: "pulisce" },
    { from: "pulisce", to: "incrocia" },
    { from: "incrocia", to: "buco" },
    {
      from: "buco", to: "sito",
      label: { it: "senza sito", en: "no website", sv: "ingen sajt" },
    },
    {
      from: "buco", to: "ordini",
      label: { it: "no ordini", en: "no orders", sv: "inga order" },
    },
    {
      from: "buco", to: "orari",
      label: { it: "senza orari", en: "no hours", sv: "inga tider" },
    },
  ],
  paths: {
    parrucchieri: ["richiesta", "raccoglie", "pulisce", "incrocia", "buco", "sito"],
    pizzerie: ["richiesta", "raccoglie", "pulisce", "incrocia", "buco", "ordini"],
    palestre: ["richiesta", "raccoglie", "pulisce", "incrocia", "buco", "orari"],
  },
};

const SEO_GRAPH: WorkflowGraph = {
  nodes: [
    {
      id: "pagina", kind: "trigger", icon: "form", col: 0, row: 0,
      label: { it: "Pagina da analizzare", en: "Page to analyse", sv: "Sida att analysera" },
      sub: { it: "un indirizzo alla volta", en: "one address at a time", sv: "en adress i taget" },
    },
    {
      id: "rende", kind: "action", icon: "code", col: 1, row: 0,
      label: {
        it: "Apre la pagina come un motore",
        en: "Opens the page the way a crawler does",
        sv: "Öppnar sidan som en sökrobot",
      },
      sub: { it: "carica tutto, immagini comprese", en: "loads everything, images included", sv: "laddar allt, även bilderna" },
    },
    {
      id: "browser", kind: "capability", icon: "tool", of: "rende",
      label: { it: "Browser senza finestra", en: "Headless browser", sv: "Webbläsare utan fönster" },
      sub: { it: "misura peso e tempi", en: "measures weight and timings", sv: "mäter vikt och tider" },
    },
    {
      id: "confronta", kind: "action", icon: "search", col: 2, row: 0,
      label: {
        it: "Confronta con il resto del sito",
        en: "Compares it with the rest of the site",
        sv: "Jämför med resten av sajten",
      },
      sub: {
        it: "e con chi esce prima di te",
        en: "and with whoever ranks above you",
        sv: "och med dem som ligger före",
      },
    },
    {
      id: "pagine", kind: "capability", icon: "database", of: "confronta",
      label: { it: "Le altre pagine", en: "The other pages", sv: "Övriga sidor" },
      sub: {
        it: "titoli e descrizioni già usati",
        en: "titles and descriptions already in use",
        sv: "titlar och beskrivningar som redan används",
      },
    },
    {
      id: "serp", kind: "capability", icon: "search", of: "confronta",
      label: { it: "Risultati di ricerca", en: "Search results", sv: "Sökresultat" },
      sub: { it: "chi esce su quelle parole", en: "who shows up for those words", sv: "vilka som syns på orden" },
    },
    {
      id: "pesa", kind: "decision", icon: "branch", col: 3, row: 0,
      label: { it: "Chi resta fuori?", en: "Who is being shut out?", sv: "Vem stängs ute?" },
    },
    {
      id: "lettura", kind: "action", icon: "chart", col: 4, row: -1,
      label: {
        it: "Pesa immagini e prima schermata",
        en: "Weighs the images and the first screen",
        sv: "Väger bilder och första skärmen",
      },
      sub: { it: "quanto aspetta chi apre", en: "how long a visitor waits", sv: "hur länge besökaren väntar" },
    },
    {
      id: "macchine", kind: "action", icon: "code", col: 4, row: 0,
      label: {
        it: "Controlla titoli e dati strutturati",
        en: "Checks titles and structured data",
        sv: "Kontrollerar titlar och strukturerade data",
      },
      sub: { it: "quello che il motore legge", en: "what the engine actually reads", sv: "det som sökmotorn läser" },
    },
    {
      id: "zona", kind: "action", icon: "tag", col: 4, row: 1,
      label: {
        it: "Controlla indirizzo e orari",
        en: "Checks address and hours",
        sv: "Kontrollerar adress och tider",
      },
      sub: { it: "quelli sulla mappa", en: "the ones on the map", sv: "de som syns på kartan" },
    },
    {
      id: "lista", kind: "output", icon: "doc", col: 5, row: 0,
      label: {
        it: "Lista di correzioni, in ordine di effetto",
        en: "A fix list, ordered by effect",
        sv: "Åtgärdslista, sorterad efter effekt",
      },
      sub: { it: "prima quella che pesa di più", en: "the heaviest one first", sv: "den tyngsta först" },
    },
    {
      id: "blocco", kind: "output", icon: "bell", col: 5, row: 1,
      label: {
        it: "Segnalato: la scheda su Maps resta ferma",
        en: "Flagged: the Maps listing stays stuck",
        sv: "Flaggat: kartträffen står still",
      },
      sub: {
        it: "finché l’indirizzo non è nei dati",
        en: "until the address sits in the data",
        sv: "tills adressen finns i datan",
      },
    },
  ],
  edges: [
    { from: "pagina", to: "rende" },
    { from: "rende", to: "confronta" },
    { from: "confronta", to: "pesa" },
    {
      from: "pesa", to: "lettura",
      label: { it: "chi legge", en: "the reader", sv: "läsaren" },
    },
    {
      from: "pesa", to: "macchine",
      label: { it: "chi indicizza", en: "the crawler", sv: "sökroboten" },
    },
    {
      from: "pesa", to: "zona",
      label: { it: "ricerca locale", en: "local search", sv: "lokal sökning" },
    },
    { from: "lettura", to: "lista" },
    { from: "macchine", to: "lista" },
    { from: "zona", to: "blocco" },
  ],
  paths: {
    home: ["pagina", "rende", "confronta", "pesa", "lettura", "lista"],
    menu: ["pagina", "rende", "confronta", "pesa", "macchine", "lista"],
    contatti: ["pagina", "rende", "confronta", "pesa", "zona", "blocco"],
  },
};

const GRAPHS: Record<string, WorkflowGraph> = {
  whatsapp: WHATSAPP_GRAPH,
  email: EMAIL_GRAPH,
  solleciti: SOLLECITI_GRAPH,
  social: SOCIAL_GRAPH,
  mercato: MERCATO_GRAPH,
  seo: SEO_GRAPH,
};

/** Null for any project without a canvas, so the caller can skip the panel
 *  instead of rendering an empty grid. */
export function getWorkflowGraph(key: string): WorkflowGraph | null {
  return GRAPHS[key] ?? null;
}
