// Catalogo /soluzioni — italiano, lingua sorgente.
//
// Formati usati dalle liste (le stesse convenzioni di serv.*.includes):
//   signals   "voce|voce|voce"
//   build     "Titolo::Corpo|Titolo::Corpo"      ← cosa e' previsto, voce per voce
//   excludes  "voce|voce"
//   phases    "Titolo::Durata::Corpo|…"
//   integra   "voce|voce|…"
//   faq       "Domanda::Risposta|…"
//
// Regole di scrittura: niente trattini lunghi, niente triplette, niente numeri
// non verificabili, niente promesse di risultato. Dove non so una cifra, lo
// scrivo invece di inventarla.

export const solIt: Record<string, string> = {
  // ── Voci che vivono fuori dal catalogo ─────────────────────────────────
  "nav.solutions": "Soluzioni",
  "home.sectors.label": "Il tuo settore",
  "home.sectors.all": "Tutte le soluzioni",
  // I gestionali su misura non sono una delle quattro discipline del sito.
  // Finche' non hanno una pagina in /servizi, l'etichetta vive qui.
  "fam.software.label": "Software su misura",
  "sol.badge.demo": "Con demo",
  "sol.badge.commessa": "Su commessa",
  "sol.sec.proof.nearest": "La prova più vicina",
  "sol.sec.proof.nearest.sub":
    "Questa soluzione non ha ancora una demo pubblica sua, e preferisco dirtelo. Qui sotto ci sono i lavori che dimostrano le parti di cui è fatta: se un pannello gestisce agenda, magazzino e prodotti, lo stesso pannello sa gestire un’altra agenda e un altro magazzino. Guardali e giudica da quelli.",
  "serv.sol.link": "Vedi cosa costruisco, caso per caso",

  // ── Hub ────────────────────────────────────────────────────────────────
  "sol.hub.eyebrow": "Soluzioni",
  "sol.hub.title": "Cosa posso costruire per la tua attività.",
  "sol.hub.lede":
    "Ogni voce dice cosa è previsto, cosa non è compreso, quanto ci vuole e cosa c'è già di costruito dietro. Parti dal tuo settore, oppure da quello che ti serve.",
  "sol.hub.byDisc": "Per tipo di lavoro",
  "sol.hub.bySector": "Per settore",
  "sol.hub.listTitle": "Tutte le soluzioni",
  "sol.sec.details": "Dettagli pratici",
  "sol.sec.details.sub": "Cosa non è compreso, con cosa si collega e le domande frequenti: la parte da leggere prima di chiedere il preventivo, aperta con un tocco.",
  "sol.filter.all": "Tutte",
  "sol.hub.empty": "Con questi due filtri insieme non resta niente. Togline uno.",
  "sol.hub.reset": "Azzera i filtri",
  "sol.hub.sectors.title": "Il tuo settore",
  "sol.hub.sectors.sub":
    "Ogni settore ha la sua pagina: le soluzioni che lo riguardano e i lavori già fatti, in un posto solo.",
  "sol.count.one": "soluzione",
  "sol.count.many": "soluzioni",

  // ── Titoli delle sezioni ───────────────────────────────────────────────
  "sol.sec.problem": "Il problema",
  "sol.sec.signals": "Da valutare se oggi",
  "sol.sec.build": "Cosa è previsto",
  "sol.sec.excludes": "Cosa non è compreso",
  "sol.sec.excludes.sub":
    "Scritto qui perché è la parte che di solito si scopre a lavoro iniziato. Se ti serve, si aggiunge e si quota a parte.",
  "sol.sec.change": "Cosa cambia",
  "sol.sec.proof": "Guardalo funzionare",
  "sol.sec.proof.sub":
    "Demo aperte e navigabili, non schermate. Sono lavori dimostrativi: nessun cliente è stato inventato per riempire questa pagina.",
  "sol.sec.phases": "Fasi e tempi",
  "sol.sec.integra": "Con cosa si collega",
  "sol.sec.integra.sub":
    "Gli strumenti che usi già. Se il tuo non è in elenco, si verifica prima del preventivo.",
  "sol.sec.faq": "Domande frequenti",
  "sol.sec.time": "In tutto",
  "sol.related": "Altre soluzioni vicine",
  "sol.back": "Tutte le soluzioni",
  "sol.cta.title": "Partiamo dal tuo caso.",
  "sol.cta.body":
    "Mezz'ora, gratis. Guardo quello che hai adesso e ti dico cosa sposterebbe di più, anche se poi decidi di farlo da solo.",

  // ── Pagina settore ─────────────────────────────────────────────────────
  "sec.sol.title": "Cosa costruisco per questo settore",
  "sec.proof.title": "I lavori che lo dimostrano",
  "sec.other.title": "Gli altri settori",

  // ── Settori ────────────────────────────────────────────────────────────
  "sec.ristorazione.label": "Ristoranti e pizzerie",
  "sec.ristorazione.title": "Per chi lavora in sala.",
  "sec.ristorazione.intro":
    "Un ristorante ha un problema di tempi prima ancora che di marketing. Le richieste arrivano nell'ora in cui non puoi rispondere, e chi non ti trova al telefono prenota da un'altra parte senza dirtelo.|Quello che costruisco per la ristorazione serve a spostare fuori dal servizio tutto quello che si può spostare: il menù che si aggiorna da solo quando lo cambi, la prenotazione che arriva scritta, le domande di sempre a cui risponde il sito. Il tempo che resta lo passi in sala.",
  "sec.bar-forni.label": "Bar, gelaterie e forni",
  "sec.bar-forni.title": "Per chi apre presto.",
  "sec.bar-forni.intro":
    "Il tuo lavoro cambia ogni giorno: i gusti, le teglie, quello che finisce entro le undici. Ma online sei fermo a una scheda Google con gli orari sbagliati e a un profilo dove l'ultimo post ha tre mesi.|Qui il sito serve a una cosa sola: dire cosa c'è oggi e quando sei aperto, a chi ti sta cercando adesso da trecento metri di distanza. E prendere le ordinazioni per le feste in forma scritta, con la data del ritiro.",
  "sec.produttori-food.label": "Chi produce",
  "sec.produttori-food.title": "Per chi fa la materia prima.",
  "sec.produttori-food.intro":
    "Olio, vino, conserve, birra. Il prodotto è buono e lo sanno nel raggio di cinquanta chilometri. Fuori da lì sei un'etichetta senza storia, e chi potrebbe distribuirti ti giudica da una pagina Facebook ferma a due anni fa.|Per chi produce il sito ha due lettori diversi nella stessa pagina: la persona che compra una bottiglia e il buyer che valuta un carico. Il primo vuole il racconto del posto, il secondo i formati e i pezzi per cartone. Servono entrambi, e vanno separati bene.",
  "sec.benessere-sport.label": "Yoga, palestre e centri",
  "sec.benessere-sport.title": "Per chi riempie una sala.",
  "sec.benessere-sport.intro":
    "L'orario dei corsi vive in un'immagine su Instagram e in un gruppo WhatsApp da centoventi persone. Chi vuole provare deve chiedere, aspettare, poi chiedere ancora il prezzo. Metà si perde tra la prima domanda e la seconda.|Quello che costruisco qui serve a togliere di mezzo quel percorso: il calendario si vede, il posto si prenota, il prezzo è scritto. Chi scopre lo studio la sera si iscrive la sera, senza passare da te.",
  "sec.servizi-persona.label": "Barbieri, saloni ed estetica",
  "sec.servizi-persona.title": "Per chi lavora su appuntamento.",
  "sec.servizi-persona.intro":
    "Prendi gli appuntamenti mentre hai le mani occupate. Ti segni il nome sul quaderno, qualcuno non si presenta, e quell'ora è persa senza che nessuno ti avvisi.|Un calendario online non è un vezzo tecnologico: è il modo per far scegliere al cliente un orario che esiste davvero, mandargli il promemoria il giorno prima e liberare il posto se disdice. Il quaderno resta sul bancone per le eccezioni.",
  "sec.turismo.label": "Turismo e ospitalità",
  "sec.turismo.title": "Per chi vende un viaggio.",
  "sec.turismo.intro":
    "In alta stagione rispondi trenta volte al giorno alle stesse cinque domande, e le rispondi da un telefono, mentre sei in mezzo a qualcos'altro. Gli itinerari stanno in un PDF che riapri ogni volta che cambia una data.|Il sito di un tour operator lavora bene quando arriva alla richiesta con le informazioni già date: tappe, durata, cosa è incluso, quanti posti restano. Quello che ti arriva dopo è una richiesta vera, con le date e il numero di persone.",
  "sec.studi-creativi.label": "Fotografi e studi creativi",
  "sec.studi-creativi.title": "Per chi vive del proprio lavoro visivo.",
  "sec.studi-creativi.intro":
    "Il portfolio sta su una piattaforma che mette il suo logo sopra il tuo lavoro e cambia le regole ogni anno. Le richieste arrivano in chat, senza data, senza luogo, senza budget. Rispondi a venti persone per trovarne una seria.|Un sito tuo risolve due cose insieme: il lavoro si vede grande e veloce sul tuo dominio, e la richiesta arriva già compilata. Filtrare venti messaggi diventa questione di dieci secondi.",
  "sec.commercio-prodotto.label": "Marchi di prodotto",
  "sec.commercio-prodotto.title": "Per chi ha un oggetto da far capire.",
  "sec.commercio-prodotto.intro":
    "Il prodotto è bello dal vivo e piatto dentro una scheda e-commerce. Le varianti diventano un menù a tendina, i materiali una parola sola. Chi non l'ha mai avuto in mano non capisce perché costa quello che costa.|Per un marchio di prodotto la pagina è la vetrina, il commesso e la prova insieme. Deve far girare l'oggetto, mostrare le varianti mentre le scegli e restare leggera anche quando dentro c'è del 3D.",

  "sec.trasversale.label": "Vale per ogni impresa",
  "sec.trasversale.title": "Quello che serve a chiunque abbia un'attività.",
  "sec.trasversale.intro":
    "Ci sono lavori che non dipendono da cosa vendi. Un foglio riempito a mano ogni lunedì, un preventivo costruito copiando quello del mese scorso, una casella dove le richieste aspettano il tuo turno. Sono gli stessi identici in un'officina e in uno studio legale.|Qui stanno le soluzioni che partono dal modo in cui lavori invece che dal settore in cui lavori. Il settore cambia il nome delle cose, non il fatto che quel tempo lo stai spendendo.",
  "sec.sanita.label": "Sanità e studi medici",
  "sec.sanita.title": "Per chi lavora su agenda e su cartella.",
  "sec.sanita.intro":
    "Uno studio medico vive di due cose che non possono sbagliarsi: chi viene quando, e cosa è stato fatto la volta scorsa. La prima si gestisce ancora al telefono in mezza Italia, con una persona in segreteria che ripete gli stessi orari cinquanta volte al giorno.|Qui quello che si sposta online va spostato con prudenza, perché di mezzo ci sono dati sanitari e regole precise su come si trattano. La prenotazione sì, il promemoria sì, la cartella clinica solo con le tutele che merita. È il settore in cui dico più spesso di no a una scorciatoia.",
  "sec.servizi-professionali.label": "Studi e professionisti",
  "sec.servizi-professionali.title": "Per chi fattura ore e competenza.",
  "sec.servizi-professionali.intro":
    "Un professionista perde tempo in due punti. Prima, quando spiega per la ventesima volta come lavora e quanto costa. Dopo, quando deve chiedere di essere pagato. In mezzo c'è il lavoro vero, che è l'unica parte che gli piace.|Le soluzioni per gli studi lavorano sulle due estremità: fare arrivare richieste già chiare, e togliere dalle tue mani il promemoria della fattura scaduta. Il lavoro in mezzo resta tuo, ed è il motivo per cui ti chiamano.",
  "sec.agricoltura.label": "Agricoltura e cantine",
  "sec.agricoltura.title": "Per chi lavora la terra e la trasforma.",
  "sec.agricoltura.intro":
    "Un'azienda agricola che imbottiglia o confeziona ha due mestieri sovrapposti: il campo e il prodotto finito. Il primo si racconta bene, il secondo si vende male, perché tra il racconto e l'ordine di solito non c'è niente.|Quello che costruisco qui parte dalla trasformazione: le schede con formati e rese, l'area per chi compra a bancali, il racconto del posto per chi compra una bottiglia sola. Due lettori diversi, la stessa azienda.",

  // ══ G01 · Gestionale ristorante ════════════════════════════════════════
  "sol.gestRistorante.title": "Gestionale per ristorante: sala, cucina e delivery in un posto solo",
  "sol.gestRistorante.lede":
    "Le comande passano dal tablet al monitor della cucina, gli ordini del delivery entrano nello stesso flusso, e a fine serata sai quanto hai incassato e quanto ti è costato.",
  "sol.gestRistorante.problem":
    "In sala si scrive su un blocchetto, in cucina si legge una calligrafia. Il telefono prende prenotazioni su un quaderno e intanto tre tablet delle piattaforme di delivery suonano sul bancone, ognuno con il suo formato. Chi sta ai fuochi tiene insieme tutto a memoria. A fine serata sai quanto hai incassato perché lo dice la cassa, ma quale piatto ti abbia fatto guadagnare non lo sa nessuno.",
  "sol.gestRistorante.signals":
    "Le comande scritte a mano diventano errori in cucina|Gli ordini arrivano da sala, telefono e tre tablet del delivery, ognuno in un formato diverso|Non sai quale piatto ti fa margine e quale ti tiene occupato il forno per niente|Le prenotazioni stanno su un quaderno e il sabato qualcuno si presenta senza tavolo",
  "sol.gestRistorante.build":
    "Comanda dal tablet al monitor di cucina::Il cameriere batte al tavolo e la comanda compare sulla stazione giusta, con i tempi di preparazione. Le intolleranze escono in rosso, dove servono davvero.|Delivery dentro lo stesso flusso::Gli ordini delle piattaforme entrano nel monitor di cucina insieme agli altri. Nessuno deve più guardare tre tablet a turno.|Prenotazioni con la capienza vera::Il calendario conosce i coperti e le fasce. Quando il servizio è pieno smette di accettare, invece di accettare e lasciare qualcuno in piedi.|Menù che si spegne da solo::Il piatto finito si disabilita in sala e sul menù digitale nello stesso momento, così alle dieci e mezza nessuno lo ordina.|Food cost per piatto::Ogni comanda scarica gli ingredienti dalla ricetta. A fine mese vedi il margine per piatto e per fascia oraria, non soltanto il totale.",
  "sol.gestRistorante.excludes":
    "Il registratore telematico e la trasmissione dei corrispettivi, che restano al tuo registratore e al tuo commercialista|La contabilità e le paghe",
  "sol.gestRistorante.phases":
    "Menù, ricette e postazioni::1 settimana::Mettiamo per iscritto il menù con le ricette, e decidiamo quante stazioni ha la cucina e chi vede cosa.|Sala e cucina::4-6 settimane::Comande, monitor di cucina e prenotazioni. Si prova a locale chiuso con un servizio finto, prima di toccarne uno vero.|Delivery e numeri::2-3 settimane::Colleghiamo le piattaforme, il food cost e il report di fine serata.",
  "sol.gestRistorante.integra":
    "Glovo, Deliveroo e JustEat|Il tuo registratore telematico|TheFork e le prenotazioni da Google|Stampanti di comanda per zona|POS (Nexi, SumUp, Satispay)|La tua contabilità",
  "sol.gestRistorante.faq":
    "Devo cambiare il registratore di cassa?::No. Il gestionale lavora accanto a quello che hai: gli passa il conto, e i corrispettivi restano affare suo.|E se salta la linea durante il servizio?::Le comande continuano a girare in locale e si riallineano quando la connessione torna. Un servizio non può dipendere dal wi-fi del locale.|Quanto ci mette un cameriere a impararlo?::Un servizio, se la tastiera è costruita sul tuo menù e non su un menù generico. È la parte che decidiamo insieme all inizio, non dopo.|Serve anche con un locale piccolo?::Sotto i trenta coperti spesso no, e te lo dico prima. Con un turno solo e due persone in cucina il blocchetto regge ancora. Ha senso quando gli ordini arrivano da più di una fonte.",
  "sol.gestRistorante.change":
    "La cucina riceve una cosa sola e leggibile, da qualunque parte arrivi l ordine. E a fine mese sai quale piatto ti mantiene aperto e quale ti tiene soltanto occupato il forno.",
  "sol.gestRistorante.time":
    "Da 7 a 10 settimane, a seconda di quante postazioni ha la cucina e di quante piattaforme colleghiamo.",

  // ══ 01 · Sito ristorante ═══════════════════════════════════════════════
  "sol.ristorante.title": "Sito per ristorante con prenotazione del tavolo",
  "sol.ristorante.lede":
    "Il menù aggiornato, le foto della sala e un tasto per prenotare. Chi ti cerca su Google arriva qui e prenota, senza passare dal telefono.",
  "sol.ristorante.problem":
    "Il telefono squilla durante il servizio. Chi chiama a sala piena riattacca e prova il locale di fianco, e tu il buco lo scopri la sera guardando i tavoli vuoti. Intanto il menù che si vede online è quello di due stagioni fa, e le foto le ha caricate un cliente col telefono.",
  "sol.ristorante.signals":
    "Il telefono suona durante il servizio e resta senza risposta|Il menù che si vede online non è quello che c'è in cucina|Le prenotazioni le prendi a voce e le segni su un quaderno|Chi cerca il tuo nome trova prima un portale che te",
  "sol.ristorante.build":
    "Menù che aggiorni tu::Piatti, prezzi e fuori menù si cambiano dal telefono. Nessuna richiesta a me, nessun PDF da rifare.|Prenotazione del tavolo::Il cliente sceglie giorno, ora e numero di persone. Riceve conferma via email, tu ricevi la richiesta scritta.|Collegamento al tuo calendario::Le prenotazioni entrano dove guardi già, senza una seconda agenda da tenere allineata.|Pagine per le occasioni::Pranzo di lavoro, eventi privati, cene di festa. Ognuna con la sua pagina, perché sono ricerche diverse.|Scheda Google collegata::Orari, foto e menù coerenti fra sito e mappa, così chi arriva da lì arriva da te.",
  "sol.ristorante.excludes":
    "Le foto professionali dei piatti, se non le hai già|La gestione della sala e dei turni del personale, che è un gestionale e non un sito",
  "sol.ristorante.phases":
    "Materiali e struttura::2 giorni::Raccolgo menù, foto e orari, e decidiamo quali pagine servono davvero.|Costruzione::5-7 giorni::Il sito prende forma. A metà strada lo vedi online e mi dici cosa cambiare.|Prenotazioni e Google::1-2 giorni::Colleghiamo il calendario, proviamo il percorso di prenotazione, allineiamo la scheda Google.",
  "sol.ristorante.integra":
    "Google Calendar|Google Business Profile|La tua casella email|WhatsApp|Instagram|TheFork, se già lo usi",
  "sol.ristorante.faq":
    "Il sito sostituisce TheFork?::No, e non è il suo lavoro. TheFork ti porta gente che non ti conosceva, e per quella prende una commissione. Il sito serve a farsi prenotare da chi il tuo nome lo sa già, e lì la commissione non la paghi.|Posso cambiare il menù da solo?::Sì, ed è il punto. Ti lascio un accesso dove modifichi piatti e prezzi come scriveresti un messaggio.|Cosa succede se arrivano due prenotazioni per lo stesso tavolo?::Il calendario conosce la capienza che imposti: quando un orario è pieno smette di essere selezionabile.|Il sito resta mio?::Sì. Dominio, codice e contenuti sono tuoi, e se un giorno vuoi portarli altrove non devi chiedermi il permesso.",
  "sol.ristorante.change":
    "Le prenotazioni arrivano mentre stai lavorando, scritte, con nome e numero di coperti. Il menù che legge il cliente è quello vero. E quando qualcuno cerca il tuo nome trova te, non il portale che ti trattiene una percentuale su ogni tavolo.",
  "sol.ristorante.time":
    "Prima versione online in 7-10 giorni, se menù e foto ci sono già.",

  // ══ 02 · Menù digitale ═════════════════════════════════════════════════
  "sol.menu.title": "Menù digitale con QR al tavolo",
  "sol.menu.lede":
    "Un menù che cambi in due minuti dal telefono, si apre subito anche con la linea del locale e si legge in tre lingue.",
  "sol.menu.problem":
    "Il PDF attaccato al QR pesa quattro mega e si apre storto sul telefono. Cambi un prezzo e devi rifare il file, ristampare i codici, ricordarti di sostituirli su ogni tavolo. Chi non parla italiano ordina indicando col dito.",
  "sol.menu.signals":
    "Il QR apre un PDF che dal telefono si legge male|Per cambiare un prezzo devi rifare il file e ristampare i codici|I clienti stranieri ordinano indicando col dito|Il fuori menù del giorno lo dici a voce, tavolo per tavolo",
  "sol.menu.build":
    "Menù in pagina::Si apre come un sito, si scorre col pollice e non chiede di ingrandire niente.|Modifiche immediate::Cambi un prezzo e cambia su tutti i tavoli nello stesso momento.|Allergeni e ingredienti::Ogni piatto porta le informazioni che la norma chiede, senza un foglio a parte da tenere aggiornato.|Tre lingue::Il menù si legge in italiano, in inglese e in una terza lingua che scegli tu.|QR che non scadono::I codici stampati restano validi: cambia il contenuto, non l'indirizzo.",
  "sol.menu.excludes":
    "La stampa fisica dei supporti da tavolo|La cassa e i comandi in cucina, che sono un gestionale a parte",
  "sol.menu.phases":
    "Menù e struttura::1 giorno::Mi mandi il menù come ce l'hai e lo trasformo in categorie e piatti.|Costruzione e traduzioni::3 giorni::Pagina, allergeni e lingue. Poi lo apri dal tuo telefono e lo provi in sala.|QR e consegna::1 giorno::Ti do i codici pronti da stampare e l'accesso per modificare.",
  "sol.menu.integra":
    "Il tuo sito, se ce l'hai|Google Business Profile|Instagram|Stampa dei QR|Fogli Google, per chi tiene lì i prezzi",
  "sol.menu.faq":
    "Devo ristampare i QR quando cambio il menù?::No. Il codice punta a un indirizzo fisso, e quello che cambia è la pagina dietro.|Funziona anche con la linea lenta del locale?::Sì, ed è uno dei motivi per cui non uso un PDF. La pagina pesa poche decine di kilobyte invece di quattro mega.|Posso avere menù diversi per pranzo e cena?::Sì. Si gestiscono come due liste che si accendono da sole negli orari che imposti.",
  "sol.menu.change":
    "Il fuori menù del giorno lo pubblichi prima del servizio, dalla cucina. Nessuna ristampa, nessun file da rigenerare, e chi arriva da fuori capisce cosa sta ordinando.",
  "sol.menu.time": "Cinque giorni dal momento in cui mi mandi il menù.",

  // ══ 03 · Bar, gelateria, forno ═════════════════════════════════════════
  "sol.bar.title": "Sito per bar, gelateria e forno",
  "sol.bar.lede":
    "Gusti del giorno, orari veri, ordinazioni per le feste. La vetrina che hai in strada, aperta anche quando il locale è chiuso.",
  "sol.bar.problem":
    "Gli orari su Google sono sbagliati da mesi e a Ferragosto qualcuno arriva e trova la saracinesca. I gusti li racconti su Instagram, dove dopo un giorno sono in fondo al feed. Le torte su ordinazione te le segni a voce su un foglio vicino alla cassa.",
  "sol.bar.signals":
    "Gli orari che si vedono su Google non sono quelli veri|I gusti del giorno li sanno solo quelli che passano davanti|Le ordinazioni per le feste finiscono su un foglio vicino alla cassa|Chi cerca la gelateria più vicina non ti trova",
  "sol.bar.build":
    "Vetrina del giorno::Gusti, teglie e prodotti disponibili oggi, aggiornati dal telefono in mezzo minuto.|Orari che restano veri::Aperture, chiusure e festivi in un posto solo, allineati anche con la scheda Google.|Ordinazioni su misura::Torte, vassoi e catering con data e ora del ritiro, e la richiesta ti arriva scritta.|Racconto del laboratorio::Da dove viene la materia prima e chi la lavora, che è la parte che ti distingue dal bar di fianco.|Pagina per le forniture::Uffici, feste private e catering hanno domande diverse: qui trovano risposta e un modulo.",
  "sol.bar.excludes":
    "Il negozio online con pagamento e spedizione|La gestione del magazzino e degli ordini ai fornitori",
  "sol.bar.phases":
    "Prodotti e foto::1-2 giorni::Mettiamo insieme la lista dei prodotti e le foto che abbiamo già.|Costruzione::4-5 giorni::Il sito prende forma e a metà strada lo guardi.|Ordinazioni e Google::1 giorno::Proviamo il modulo delle ordinazioni e allineiamo la scheda Google.",
  "sol.bar.integra":
    "Google Business Profile|Google Calendar|Instagram|La tua casella email|WhatsApp",
  "sol.bar.faq":
    "Quanto tempo mi porta via aggiornare i gusti?::Meno di un minuto, dal telefono. È pensato per essere fatto mentre alzi la saracinesca.|Posso ricevere ordinazioni anche da chiuso?::Sì. Il modulo resta attivo e tu leggi le richieste quando riapri.|Serve se ho già Instagram?::Instagram ti fa vedere da chi ti segue di già. Il sito ti fa trovare da chi ti sta cercando adesso e non sa il tuo nome.",
  "sol.bar.change":
    "Chi cerca la gelateria più vicina ti trova aperta e sa già che gusti hai oggi. Le ordinazioni arrivano scritte, con il nome e il giorno del ritiro, e non dipendono più dal foglio vicino alla cassa.",
  "sol.bar.time": "Prima versione in 7 giorni.",

  // ══ 04 · Produttore food ═══════════════════════════════════════════════
  "sol.produttore.title": "Vetrina per chi produce",
  "sol.produttore.lede":
    "Il posto dove si racconta come nasce quello che fai, e dove un distributore capisce con chi sta parlando prima ancora di scriverti.",
  "sol.produttore.problem":
    "Il prodotto è buono e lo sanno in cinquanta chilometri. Più in là sei un'etichetta senza storia: chi ti cerca trova una pagina ferma al 2022 e un numero di telefono. I buyer chiedono il catalogo su WhatsApp e tu mandi foto scattate in magazzino con la luce al neon.",
  "sol.produttore.signals":
    "Chi ti cerca online trova una pagina ferma a due anni fa|Il catalogo lo mandi per WhatsApp con foto scattate in magazzino|Formati, pesi e pezzi per cartone non sono scritti da nessuna parte|I distributori esteri non hanno niente da leggere nella loro lingua",
  "sol.produttore.build":
    "Racconto della lavorazione::Come nasce il prodotto, passaggio per passaggio, con le foto del posto vero e non di un archivio.|Schede prodotto complete::Formati, pesi, pezzi per cartone, conservazione e dati tecnici, una pagina per referenza.|Area rivenditori::Listino riservato e richiesta campioni, dietro un accesso che dai tu a chi vuoi.|Versione inglese::La stessa profondità dell'italiano, scritta e non tradotta a macchina.|Materiali scaricabili::Schede tecniche e listino in PDF, generati dagli stessi dati del sito così non divergono.",
  "sol.produttore.excludes":
    "La vendita diretta con carrello e spedizioni|La fotografia di prodotto in studio",
  "sol.produttore.phases":
    "Catalogo e materiali::2-3 giorni::Raccogliamo referenze, dati tecnici e quello che già esiste.|Costruzione::6-8 giorni::Struttura, racconto e schede prodotto. Lo vedi online mentre cresce.|Area rivenditori e inglese::2-3 giorni::Accessi, listino riservato e la versione inglese.",
  "sol.produttore.integra":
    "La tua casella email|Fogli Google o il gestionale, per il listino|LinkedIn|Google Business Profile|Generazione dei PDF dalle schede",
  "sol.produttore.faq":
    "Serve anche se vendo solo a distributori?::Soprattutto in quel caso. Un buyer ti cerca prima di rispondere, e quello che trova decide se risponderti.|Posso tenere il listino nascosto?::Sì. Sta dietro un accesso che dai tu, e il resto del sito resta pubblico.|Chi aggiorna le schede quando cambia un formato?::Tu, da un pannello. I PDF si rigenerano con i dati aggiornati, così non resta in giro una scheda vecchia.",
  "sol.produttore.change":
    "Chi ti scrive ha già letto la storia e visto i formati. La trattativa parte dal prezzo invece che dalle presentazioni, e il catalogo smette di essere una cartella di foto su WhatsApp.",
  "sol.produttore.time":
    "Da 10 a 15 giorni. Il tempo dipende da quante schede prodotto ci sono.",

  // ══ 05 · Studio benessere ══════════════════════════════════════════════
  "sol.benessere.title": "Sito per studio yoga, palestra e centro benessere",
  "sol.benessere.lede":
    "Corsi, orari, insegnanti e un modo per iscriversi alla lezione che non passa da una chat.",
  "sol.benessere.problem":
    "L'orario dei corsi è un'immagine su Instagram e un messaggio fissato in un gruppo da centoventi persone. Chi vuole provare deve chiedere, aspettare la risposta, poi chiedere ancora quanto costa. Molti si fermano tra la prima domanda e la seconda.",
  "sol.benessere.signals":
    "L'orario dei corsi vive in un'immagine e in un gruppo WhatsApp|Chi vuole provare deve chiedere il prezzo prima di sapere se c'è posto|Le iscrizioni le tieni a mente o su un foglio|Non sai quante persone avrai in sala finché non arrivano",
  "sol.benessere.build":
    "Calendario dei corsi::Giorni, orari, insegnante e posti rimasti, sempre aggiornati.|Iscrizione online::Singola lezione o pacchetto, con conferma automatica e promemoria il giorno prima.|Schede insegnanti e discipline::Chi guida cosa, con che stile, e per chi è adatto.|Prezzi scritti::Abbonamenti, carnet e prova gratuita, senza doverli chiedere in chat.|Pagina della prima volta::Cosa portare, come vestirsi, dove parcheggiare. È la pagina che toglie l'imbarazzo a chi non è mai entrato.",
  "sol.benessere.excludes":
    "La gestione contabile degli abbonamenti e le ricevute fiscali|L'app nativa per iOS e Android",
  "sol.benessere.phases":
    "Corsi e orari::2 giorni::Mettiamo in ordine discipline, insegnanti e griglia settimanale.|Costruzione::6-7 giorni::Sito e calendario. Lo provi con una lezione finta prima di aprirlo.|Iscrizioni e prova::1-2 giorni::Colleghiamo pagamenti o conferme e proviamo il percorso di iscrizione.",
  "sol.benessere.integra":
    "Google Calendar|La tua casella email|Stripe o PayPal, se vuoi incassare online|WhatsApp|Instagram",
  "sol.benessere.faq":
    "Posso limitare i posti per ogni lezione?::Sì. Imposti la capienza della sala e quando è piena l'orario smette di essere prenotabile.|E se qualcuno disdice all'ultimo?::Le regole le scrivi tu una volta e valgono sempre. Il posto liberato torna disponibile da solo.|Devo per forza incassare online?::No. Puoi tenere il pagamento in studio e usare il sito solo per prenotare.",
  "sol.benessere.change":
    "Chi scopre lo studio alle dieci di sera prenota la prima lezione alle dieci di sera. Tu la mattina apri e sai già quante persone hai in sala.",
  "sol.benessere.time": "10 giorni per la prima versione, calendario compreso.",

  // ══ 06 · Prenotazione appuntamenti ═════════════════════════════════════
  "sol.prenotazioni.title": "Prenotazione appuntamenti online",
  "sol.prenotazioni.lede":
    "Un calendario che il cliente vede davvero, con i tuoi orari, le tue pause e le tue regole di disdetta.",
  "sol.prenotazioni.problem":
    "Prendi gli appuntamenti mentre hai le mani occupate. Ti segni il nome sul quaderno, poi qualcuno non si presenta e quell'ora resta vuota senza che nessuno ti avvisi in tempo per riempirla. I promemoria li mandi tu, quando ti ricordi.",
  "sol.prenotazioni.signals":
    "Prendi appuntamenti mentre hai le mani occupate|Qualcuno non si presenta e l'ora resta vuota|I promemoria li mandi tu, quando ti ricordi|Il quaderno è l'unico posto dove esiste la giornata di domani",
  "sol.prenotazioni.build":
    "Disponibilità vere::Orari, pause e giorni di chiusura come sono davvero, non una griglia teorica che poi correggi a mano.|Scelta del servizio::Il cliente sceglie cosa vuole e il sistema calcola quanto dura, così due tagli non finiscono nella stessa mezz'ora.|Promemoria automatico::Un messaggio il giorno prima, con la possibilità di disdire da lì invece che di non presentarsi.|Regole di disdetta::Le scrivi una volta e vengono applicate senza che tu debba discuterne.|Vista del giorno::Apri il telefono e vedi la giornata, senza aprire nient'altro.",
  "sol.prenotazioni.excludes":
    "La cassa e la fatturazione|La gestione del magazzino prodotti",
  "sol.prenotazioni.phases":
    "Servizi e orari::1 giorno::Mettiamo per iscritto durate, pause e regole di disdetta.|Costruzione::3-4 giorni::Calendario e pagina di prenotazione, provati con appuntamenti finti.|Promemoria e avvio::1 giorno::Colleghiamo email o messaggi e apriamo le prenotazioni.",
  "sol.prenotazioni.integra":
    "Google Calendar|La tua casella email|WhatsApp o SMS per i promemoria|Instagram|Il sito che hai già",
  "sol.prenotazioni.faq":
    "Funziona se lavoriamo in più persone?::Sì. Ognuno ha i suoi orari, e il cliente può scegliere da chi andare.|Posso bloccare un'ora al volo?::Sì, dal telefono. Serve per le emergenze e per le pause che non erano previste.|E chi non prenota online?::Continui a segnarlo tu. Gli appuntamenti presi a voce entrano nello stesso calendario e occupano il posto.",
  "sol.prenotazioni.change":
    "Le ore perse per dimenticanza si riducono, perché il promemoria parte da solo. Il quaderno resta sul bancone per le eccezioni e smette di essere il sistema.",
  "sol.prenotazioni.time": "Una settimana, se le disponibilità sono chiare.",

  // ══ 07 · Barbiere e salone ═════════════════════════════════════════════
  "sol.barbiere.title": "Sito per barbiere e salone",
  "sol.barbiere.lede":
    "Listino, foto dei tagli, orari e prenotazione. Tutto quello che un cliente nuovo vuole sapere prima di entrare.",
  "sol.barbiere.problem":
    "Il cliente nuovo arriva da Instagram e trova nove foto e nessun prezzo. Chiama per sapere quanto costa una barba, tu sei sotto un cliente e non rispondi. Prova quello di fianco, che il listino ce l'ha scritto.",
  "sol.barbiere.signals":
    "Il cliente nuovo chiede il prezzo al telefono mentre sei sotto un altro|Le foto dei tagli stanno solo su Instagram e dopo un giorno spariscono|Chi cerca un barbiere in zona non trova il tuo nome|Gli orari e il giorno di chiusura te li chiedono in chat",
  "sol.barbiere.build":
    "Listino per servizio::Taglio, barba, trattamenti. Prezzo scritto, così la telefonata non serve più.|Galleria dei tagli::Le foto che fai già, in un posto dove restano visibili invece di scendere nel feed.|Prenotazione con scelta del barbiere::Chi ha il suo barbiere di fiducia lo sceglie, e non prende l'appuntamento sbagliato.|Orari e posizione::Giorno di chiusura, orario continuato, come arrivare e dove si parcheggia.|Versione inglese::Se lavori in centro o in zona di passaggio, cambia chi entra dalla porta.",
  "sol.barbiere.excludes":
    "La vendita online dei prodotti da barba|La gestione delle scorte e degli ordini ai fornitori",
  "sol.barbiere.phases":
    "Servizi e foto::1 giorno::Listino, durate e le foto migliori fra quelle che hai già.|Costruzione::4-5 giorni::Sito, galleria e prenotazione.|Google e avvio::1 giorno::Scheda Google allineata e prenotazioni aperte.",
  "sol.barbiere.integra":
    "Google Business Profile|Google Calendar|Instagram|WhatsApp|La tua casella email",
  "sol.barbiere.faq":
    "Serve se ho già tanti clienti fissi?::I clienti fissi non li porta il sito. Il sito porta quello nuovo che si è appena trasferito in zona e sta cercando dove andare.|Quanto costa mantenerlo?::Dominio e hosting sono voci piccole e te le dico in chiaro prima di partire. Il sito in sé non ha un canone.|Posso aggiungere il taglio che ho fatto ieri?::Sì, dal telefono, in trenta secondi.",
  "sol.barbiere.change":
    "Chi entra ha già visto il prezzo e scelto il taglio. Le telefonate durante il lavoro si riducono a quelle che valeva la pena ricevere.",
  "sol.barbiere.time": "5-7 giorni.",

  // ══ 08 · Portfolio fotografo ═══════════════════════════════════════════
  "sol.fotografo.title": "Portfolio per fotografi e studi creativi",
  "sol.fotografo.lede":
    "Le foto grandi, veloci ad aprirsi, e una richiesta che ti arriva già compilata con data, luogo e tipo di servizio.",
  "sol.fotografo.problem":
    "Il portfolio vive su una piattaforma che mette il suo logo sopra il tuo lavoro e cambia le regole ogni anno. Le richieste arrivano in chat senza data, senza luogo e senza budget. Rispondi a venti persone per trovarne una che era seria.",
  "sol.fotografo.signals":
    "Il portfolio vive su una piattaforma che decide le regole al posto tuo|Le richieste arrivano senza data, senza luogo e senza budget|Le foto ai clienti le consegni con link che scadono|Il tuo lavoro migliore è sotto il marchio di qualcun altro",
  "sol.fotografo.build":
    "Gallerie per progetto::Immagini grandi che si aprono in fretta, nell'ordine deciso da te e non da un algoritmo.|Racconto del metodo::Come lavori, cosa succede il giorno dello scatto, cosa consegni. È la parte che fa scegliere te e non un altro.|Richiesta strutturata::Data, luogo, tipo di servizio e budget indicativo, chiesti prima che il messaggio parta.|Area consegna::Uno spazio riservato dove il cliente scarica le sue foto, senza link che scadono dopo una settimana.|Multilingua::Se lavori con clienti stranieri, il sito parla la loro lingua.",
  "sol.fotografo.excludes":
    "La stampa e i prodotti fisici come album e cornici|L'editing e il ritocco delle immagini",
  "sol.fotografo.phases":
    "Selezione::2 giorni::Scegliamo quali lavori entrano e in che ordine si leggono.|Costruzione::5-7 giorni::Gallerie, racconto e modulo di richiesta.|Consegna e lingue::2 giorni::Area riservata e versioni in lingua.",
  "sol.fotografo.integra":
    "La tua casella email|Google Drive o Dropbox per le consegne|Instagram|Google Calendar|Stripe, se prendi acconti online",
  "sol.fotografo.faq":
    "Le foto pesanti rallentano il sito?::Non se vengono servite come si deve. Il sito consegna la dimensione giusta per lo schermo di chi guarda, e l'originale resta intatto.|Posso togliere un lavoro dal portfolio?::Sì, quando vuoi, senza passare da me.|Il cliente deve registrarsi per scaricare?::No, basta un link riservato. La registrazione la mettiamo solo se vuoi tenere traccia di chi scarica.",
  "sol.fotografo.change":
    "Le richieste arrivano complete e le filtri in dieci secondi. Il lavoro si vede sul tuo dominio, grande, senza il marchio di qualcun altro sopra.",
  "sol.fotografo.time":
    "7-12 giorni. Il tempo dipende da quante gallerie porti.",

  // ══ 09 · Turismo ═══════════════════════════════════════════════════════
  "sol.turismo.title": "Sito per tour operator e ospitalità",
  "sol.turismo.lede":
    "Itinerari, partenze, posti disponibili e una richiesta che arriva scritta invece che a voce.",
  "sol.turismo.problem":
    "Gli itinerari stanno in un PDF che mandi per email, e lo riapri ogni volta che cambia una data. Chi ti scrive chiede sempre le stesse cinque cose, e in alta stagione rispondi alle stesse cinque cose trenta volte al giorno, dal telefono, in mezzo a qualcos'altro.",
  "sol.turismo.signals":
    "Gli itinerari stanno in un PDF che riapri a ogni cambio di data|In alta stagione rispondi alle stesse domande decine di volte|Le richieste arrivano senza date e senza numero di persone|I posti rimasti li sai solo tu, e li dici a voce",
  "sol.turismo.build":
    "Schede itinerario::Tappe, durata, difficoltà e cosa è incluso, una pagina per viaggio invece di un PDF per tutti.|Calendario delle partenze::Date, posti rimasti e stato della partenza, aggiornati da te in un posto solo.|Richiesta con i dati giusti::Date, numero di persone e tipo di sistemazione, chiesti prima dell'invio.|Domande frequenti per viaggio::Le cinque domande di sempre, scritte sotto l'itinerario che le fa nascere.|Più lingue::Inglese e le lingue dei mercati da cui arrivano già richieste.",
  "sol.turismo.excludes":
    "La prenotazione con pagamento immediato e i sistemi di booking di terzi|L'assicurazione viaggio e la contrattualistica",
  "sol.turismo.phases":
    "Itinerari::2-3 giorni::Mettiamo in ordine viaggi, tappe e materiali che hai.|Costruzione::7-9 giorni::Schede, calendario delle partenze e modulo di richiesta.|Lingue e avvio::2-3 giorni::Versioni in lingua e prova del percorso di richiesta.",
  "sol.turismo.integra":
    "La tua casella email|Google Calendar|Fogli Google per le partenze|WhatsApp|Instagram e Facebook",
  "sol.turismo.faq":
    "Posso vendere direttamente dal sito?::Si può fare, ma non è da dove parto. Prima si sistema la richiesta, che è il punto in cui oggi si perdono i contatti. L'incasso online si aggiunge dopo, quando i numeri lo giustificano.|Come aggiorno i posti rimasti?::Da un pannello, oppure da un foglio se preferisci lavorare lì. Il sito legge da dove decidi tu.|Serve una lingua per ogni mercato?::No. Meglio due lingue fatte bene che cinque tradotte male.",
  "sol.turismo.change":
    "Le domande ripetute le prende il sito. A te arriva la richiesta vera, già con le date e quante persone sono.",
  "sol.turismo.time":
    "Da 12 giorni, a seconda di quanti itinerari carichiamo insieme.",

  // ══ 10 · Landing di prodotto ═══════════════════════════════════════════
  "sol.prodotto.title": "Landing di prodotto con configuratore",
  "sol.prodotto.lede":
    "Una pagina sola, costruita perché il prodotto si guardi. Colori, varianti e dettagli che si girano col dito.",
  "sol.prodotto.problem":
    "Il prodotto è bello dal vivo e piatto dentro una scheda e-commerce. Le varianti diventano un menù a tendina, i materiali una parola. Chi non l'ha mai avuto in mano non capisce perché costa quello che costa, e chiude la pagina.",
  "sol.prodotto.signals":
    "Dal vivo il prodotto convince e nelle foto no|Le varianti sono un menù a tendina che nessuno apre|Chi arriva dalla pubblicità se ne va dopo tre secondi|Il prezzo sembra alto perché niente lo giustifica a schermo",
  "sol.prodotto.build":
    "Pagina che si racconta::Una sequenza che si legge scorrendo, senza un menù da studiare prima di capire cosa vendi.|Configuratore::Colori e varianti che cambiano davanti agli occhi mentre le scegli.|Dettagli ravvicinati::Materiali, finiture e misure viste da vicino, dove il prezzo si giustifica da solo.|Un invito solo::Una sola azione da compiere, ripetuta dove serve invece di cinque pulsanti che si contendono il clic.|Peso controllato::Anche con il 3D dentro, la pagina si apre in fretta sul telefono.",
  "sol.prodotto.excludes":
    "Il catalogo completo con carrello e magazzino|La modellazione 3D del prodotto, se non esiste già un file",
  "sol.prodotto.phases":
    "Materiali e sequenza::2-3 giorni::Guardiamo cosa esiste fra foto, render e file 3D, e decidiamo l'ordine del racconto.|Costruzione::7-12 giorni::Pagina, animazioni e configuratore.|Prestazioni e prova::2-3 giorni::Alleggerimento e prova su telefoni veri, non solo sul mio schermo.",
  "sol.prodotto.integra":
    "Il tuo e-commerce, se ce l'hai|Stripe o PayPal|Meta e Google Ads|La tua casella email|Analytics",
  "sol.prodotto.faq":
    "Serve per forza il 3D?::No. Con foto buone si arriva quasi allo stesso posto. Il 3D conviene quando le varianti sono tante e fotografarle tutte costerebbe di più.|Funziona su telefoni vecchi?::La pagina resta usabile e il 3D si spegne dove non regge, lasciando le immagini al suo posto.|Posso collegarla al mio negozio online?::Sì. La landing racconta, il negozio incassa.",
  "sol.prodotto.change":
    "Il prodotto si capisce prima di essere spiegato. Chi arriva da una campagna resta a guardarlo invece di tornare indietro dopo tre secondi.",
  "sol.prodotto.time": "10-20 giorni. Il 3D è la parte che allunga i tempi.",

  // ══ 11 · Multilingua ═══════════════════════════════════════════════════
  "sol.multilingua.title": "Sito multilingua che si trova anche fuori dall'Italia",
  "sol.multilingua.lede":
    "Due o tre lingue vere, ognuna col suo indirizzo, scritte per essere lette invece che passate da un traduttore.",
  "sol.multilingua.problem":
    "Tanto c'è il traduttore del browser, si dice. Poi leggi come suona il tuo servizio in inglese e capisci perché quel cliente non ha più risposto. E per Google quella pagina inglese non esiste: di indirizzo ce n'è uno solo, in italiano.",
  "sol.multilingua.signals":
    "Hai un indirizzo solo e speri che il traduttore del browser faccia il resto|I clienti stranieri scrivono una volta e poi spariscono|Nelle ricerche in inglese non compari|Il pulsante della lingua riporta sempre alla home",
  "sol.multilingua.build":
    "Un indirizzo per lingua::Ogni lingua ha il suo URL, e viene indicizzata per conto suo invece di sparire dentro l'italiano.|Testi scritti, non tradotti::Il copy nasce nella lingua, con le parole che userebbe chi legge.|Hreflang e metadati::I segnali tecnici che dicono ai motori quale versione mostrare a chi.|Cambio lingua che non perde il posto::Passi da una lingua all'altra restando sulla pagina dove eri.|Formati locali::Valute, date e numeri come si scrivono là, non come li scriviamo qui.",
  "sol.multilingua.excludes":
    "La traduzione continua di un blog che cresce ogni settimana|Il servizio clienti nelle lingue aggiunte",
  "sol.multilingua.phases":
    "Scelta delle lingue::1 giorno::Decidiamo quali mercati valgono davvero, guardando da dove arrivano già le richieste.|Struttura e testi::3-4 giorni::URL per lingua, hreflang e stesura dei testi.|Prova::1 giorno::Controllo che ogni versione sia raggiungibile, coerente e dichiarata bene.",
  "sol.multilingua.integra":
    "Google Search Console|Analytics|Il CMS che usi già|DeepL come base di lavoro, mai come consegna|Google Business Profile",
  "sol.multilingua.faq":
    "Non basta il traduttore automatico?::Per capire una pagina sì. Per venderci qualcosa no, e per Google quella pagina non esiste comunque, perché non ha un indirizzo suo.|Quante lingue conviene fare?::Quelle da cui arrivano già richieste, più al massimo una scommessa. Cinque lingue vuote costano più di due piene.|Chi scrive i testi in inglese o svedese?::Li scrivo io, e dove il testo pesa li faccio rileggere a una persona madrelingua prima della pubblicazione.",
  "sol.multilingua.change":
    "Chi cerca nella sua lingua ti trova. E quando arriva legge qualcosa che è stato scritto per lui, con le parole che userebbe.",
  "sol.multilingua.time":
    "Circa 5 giorni in più rispetto allo stesso sito in una lingua sola.",

  // ══ 12 · Assistente WhatsApp ═══════════════════════════════════════════
  "sol.whatsapp.title": "Assistente WhatsApp che risponde e prende le prenotazioni",
  "sol.whatsapp.lede":
    "Risponde alle domande di sempre usando le tue informazioni vere, e quando serve prenota. Anche alle undici di sera, anche mentre sei al lavoro.",
  "sol.whatsapp.problem":
    "Su WhatsApp arrivano orari, prezzi, dove si parcheggia, se c'è posto sabato. Sempre le stesse. Rispondi la sera tardi, quando chi ha scritto ha già risolto da un'altra parte.",
  "sol.whatsapp.signals":
    "Su WhatsApp arrivano sempre le stesse domande|Rispondi la sera tardi, quando chi ha scritto ha già risolto altrove|Le prenotazioni prese in chat le riscrivi a mano da qualche parte|Di notte e nei giorni di chiusura non risponde nessuno",
  "sol.whatsapp.build":
    "Risposte dai tuoi documenti::Listini, orari e condizioni diventano la fonte. Se una cosa non c'è scritta, l'assistente non se la inventa: lo dice e passa a te.|Prenotazione in chat::L'appuntamento si prende dentro la conversazione, senza mandare il cliente su un altro sito a ricominciare.|Passaggio a te::Quando la domanda esce dal seminato, l'assistente si ferma e ti chiama in causa.|Registro delle domande::Vedi cosa ti chiedono davvero, e capisci cosa manca sul sito.|Tono deciso da te::Come parla, quanto è formale, e le cose che non deve mai dire.",
  "sol.whatsapp.excludes":
    "Le trattative sui prezzi e le eccezioni commerciali, che restano tue|La gestione dei reclami",
  "sol.whatsapp.phases":
    "Raccolta::3-4 giorni::Mettiamo insieme listini, orari, condizioni e le domande vere che ricevi già.|Costruzione e prova::5-7 giorni::L'assistente prende forma e lo provi tu prima dei clienti.|Apertura sorvegliata::3-4 giorni::Va in servizio mentre tu leggi tutto, e correggiamo dove sbaglia.",
  "sol.whatsapp.integra":
    "WhatsApp Business|Google Calendar|La tua casella email|Fogli Google|Il sito che hai già",
  "sol.whatsapp.faq":
    "Risponde da solo anche di notte?::Sì. È la ragione principale per cui esiste.|E se inventa una cosa?::Risponde solo da quello che gli hai dato, e quando non trova la risposta lo dice e passa a te. Nelle prime settimane leggi tutto tu, così vediamo insieme dove va aggiustato.|Quanto costa tenerlo acceso?::Ci sono i costi di WhatsApp Business per i messaggi e poco altro. Li mettiamo neri su bianco prima di partire.|Il cliente capisce che non sono io?::Sì, e va detto. L'assistente si presenta per quello che è, e questo è anche il motivo per cui il passaggio a te deve funzionare bene.",
  "sol.whatsapp.change":
    "Chi scrive alle undici di sera ha la risposta alle undici di sera. Tu la mattina leggi solo i messaggi che avevano bisogno di te.",
  "sol.whatsapp.time":
    "Due settimane, incluso il tempo per mettere insieme le informazioni giuste.",

  // ══ 13 · Risposte email ════════════════════════════════════════════════
  "sol.email.title": "Risposte email già scritte, da rileggere",
  "sol.email.lede":
    "Ogni email in arrivo viene letta, capita e messa in coda con una bozza pronta. Tu rileggi e mandi.",
  "sol.email.problem":
    "La casella si riempie di richieste che meritano una risposta e ne ricevono una in ritardo. Le informazioni ci sono, stanno nei tuoi listini e nelle tue condizioni, ma ogni volta le riscrivi a mano dall'inizio.",
  "sol.email.signals":
    "Le richieste restano in casella per giorni|Riscrivi a mano risposte che hai già scritto cento volte|Le informazioni ci sono ma stanno sparse fra listini e allegati|Rispondi meglio al primo della giornata che all'ultimo",
  "sol.email.build":
    "Classificazione per intento::Ogni email viene capita per quello che è: preventivo, assistenza, fornitore, o niente di importante.|Bozza cercata nei tuoi documenti::La risposta si costruisce da quello che hai davvero scritto, con il riferimento visibile così puoi controllarlo.|Nessun invio automatico::La bozza aspetta te. Decidi tu cosa parte e con quali parole.|Regole di esclusione::Quello che non deve mai passare da una macchina resta intoccato.|Sulla casella che usi già::Niente migrazioni e niente indirizzi nuovi da comunicare ai clienti.",
  "sol.email.excludes":
    "L'invio automatico senza revisione|La posta certificata e gli adempimenti fiscali",
  "sol.email.phases":
    "Documenti::2-3 giorni::Raccogliamo listini, condizioni e le risposte tipo che già usi.|Costruzione::4-5 giorni::Classificazione e bozze, provate sulle email vere degli ultimi mesi.|Taratura::2 settimane::Gira sulla tua casella mentre correggiamo dove le bozze mancano il bersaglio.",
  "sol.email.integra":
    "Gmail o Outlook|Google Drive o la cartella dei documenti|Il CRM, se ne hai uno|Fogli Google|Google Calendar",
  "sol.email.faq":
    "Le mie email vengono lette da qualcuno?::Vengono elaborate da un servizio, non lette da una persona. Prima di partire ti dico dove passano i dati e cosa viene conservato.|Posso escludere certi clienti?::Sì, per indirizzo, per dominio o per parola chiave.|Quanto tempo mi fa risparmiare?::Dipende dal volume, e un numero inventato non te lo do. Nella prima settimana contiamo quante bozze usi senza modificarle: quello è il numero vero.",
  "sol.email.change":
    "Le richieste non restano in attesa che tu trovi il tempo. Chi scrive riceve in giornata invece che in settimana.",
  "sol.email.time":
    "10 giorni per metterlo in piedi, poi due settimane in cui si aggiusta il tiro sulle tue email vere.",

  // ══ 14 · Solleciti ═════════════════════════════════════════════════════
  "sol.solleciti.title": "Solleciti di pagamento che partono da soli",
  "sol.solleciti.lede":
    "Le fatture scadute vengono ricordate al momento giusto, col tono che decidi tu, senza che tu debba aprire lo scadenzario.",
  "sol.solleciti.problem":
    "Sollecitare è il lavoro che rimandi. Ti dà fastidio scrivere, quindi aspetti, e più aspetti più diventa imbarazzante scriverlo. Intanto quei soldi sono i tuoi e stanno sul conto di qualcun altro.",
  "sol.solleciti.signals":
    "Sollecitare è il lavoro che rimandi ogni settimana|Non sai a memoria quali fatture sono scadute e da quanto|Quando ti decidi a scrivere è passato troppo tempo per farlo con leggerezza|Ci sono clienti che pagano tardi da anni e nessuno glielo ha mai fatto notare",
  "sol.solleciti.build":
    "Lettura dello scadenzario::Il sistema sa cosa è scaduto e da quanti giorni, senza che tu apra niente.|Sequenza a più tempi::Promemoria gentile, poi fermo, poi formale. Le parole di ognuno le decidi tu.|Stop al pagamento::Appena l'incasso risulta, la sequenza si ferma da sola e non parte il messaggio sbagliato.|Lista di esclusione::I clienti che vuoi trattare a mano non ricevono niente in automatico.|Riepilogo settimanale::Una email il lunedì con quello che è ancora aperto e da quanto.",
  "sol.solleciti.excludes":
    "Il recupero crediti legale e i solleciti con valore giuridico|L'emissione delle fatture",
  "sol.solleciti.phases":
    "Scadenzario::1-2 giorni::Guardiamo dove stanno i dati e in che stato sono.|Sequenza e testi::2 giorni::Scriviamo insieme i tre messaggi e le regole che li fanno partire.|Avvio::1-2 giorni::Parte su un gruppo piccolo di clienti, poi su tutti.",
  "sol.solleciti.integra":
    "Il tuo gestionale o software di fatturazione|Fogli Google|Gmail o Outlook|Stripe, se incassi online|Google Calendar",
  "sol.solleciti.faq":
    "Rischio di scrivere a chi ha già pagato?::È il primo controllo che fa: se il pagamento risulta, il messaggio non parte.|Posso leggere prima cosa viene mandato?::Sì. Si può tenere in modalità bozza, con la tua approvazione su ogni invio, oppure lasciare andare i primi due passaggi e tenere il terzo a mano.|Funziona col mio gestionale?::Dipende da cosa espone. Lo verifico prima del preventivo, e se non è collegabile si lavora su un'esportazione periodica.",
  "sol.solleciti.change":
    "I ritardi si accorciano perché il promemoria parte il giorno giusto e non tre settimane dopo. E non sei tu a doverlo scrivere.",
  "sol.solleciti.time": "Una settimana, se lo scadenzario è già in ordine.",

  // ══ 15 · Contenuti social ══════════════════════════════════════════════
  "sol.social.title": "Contenuti social che escono con una cadenza",
  "sol.social.lede":
    "Da una cosa che hai fatto escono i testi per ogni canale, ognuno con la lunghezza e il tono che quel canale vuole.",
  "sol.social.problem":
    "Pubblicare dipende dall'ispirazione del lunedì. Un mese vai forte, poi arriva una settimana piena e sparisci per venti giorni. Chi ti segue se ne accorge, e l'algoritmo pure.",
  "sol.social.signals":
    "Pubblichi a ondate e poi sparisci per settimane|Riscrivi lo stesso contenuto in tre versioni a mano|Non ti ricordi cosa hai già pubblicato e rischi di ripeterti|Rimandi perché non sai cosa scrivere, non perché non hai niente da dire",
  "sol.social.build":
    "Un punto di partenza::Il lavoro consegnato, il piatto del giorno, la lezione di ieri. Basta quello per far partire tutto.|Testi per canale::Lunghezza e tono adattati a ciascuno, invece dello stesso post incollato tre volte.|Calendario::Cosa esce e quando, visibile prima che esca e non dopo.|Approvazione tua::Niente parte senza che tu l'abbia letto.|Archivio::Quello che è già uscito resta consultabile, così due post non finiscono per dire la stessa cosa.",
  "sol.social.excludes":
    "La produzione di foto e video|La gestione dei commenti e dei messaggi diretti",
  "sol.social.phases":
    "Tono e canali::1-2 giorni::Definiamo come parli e dove ha senso pubblicare.|Costruzione::3-4 giorni::Il flusso prende forma e produce i primi contenuti da correggere insieme.|Prima settimana::5 giorni::Gira davvero, e aggiustiamo il tono su quello che esce.",
  "sol.social.integra":
    "Instagram e Facebook|LinkedIn|Fogli Google|La tua casella email|Il sito, come fonte dei contenuti",
  "sol.social.faq":
    "Pubblica da solo?::Solo se glielo lasci fare. Di base prepara e aspetta il tuo via libera.|Si capisce che è scritto da una macchina?::Se il tono non viene tarato, sì. Per questo la prima settimana serve a correggere, e l'archivio serve a non far uscire tre post che si somigliano.|Va bene per tutti i canali?::Per quelli scritti sì. Per i video serve comunque girare qualcosa, e quello resta lavoro tuo.",
  "sol.social.change":
    "Restare presenti smette di dipendere dal tempo che avanza. Il tempo speso passa da mezza giornata a una rilettura.",
  "sol.social.time": "Una settimana per impostarlo, poi cammina da solo.",

  // ══ 16 · Audit visibilità ══════════════════════════════════════════════
  "sol.audit.title": "Audit di visibilità su Google e sulle risposte AI",
  "sol.audit.lede":
    "Cosa succede quando qualcuno cerca quello che fai, e cosa rispondono ChatGPT e le risposte generate di Google quando gli si chiede di te.",
  "sol.audit.problem":
    "Sai di non essere in prima pagina ma non sai perché, quindi ogni intervento è un tentativo. E c'è una domanda nuova a cui nessuno ti ha ancora dato una risposta: quando un cliente chiede consiglio a un assistente AI, il tuo nome esce oppure no?",
  "sol.audit.signals":
    "Sai di non essere in prima pagina ma non sai perché|Hai già provato interventi SEO senza vedere un cambiamento|Non sai cosa risponde un assistente AI quando gli chiedono del tuo settore|Paghi qualcuno per la visibilità e non sai cosa stia facendo",
  "sol.audit.build":
    "Controllo tecnico::Cosa vedono davvero i motori: velocità, struttura, pagine indicizzate e pagine perse per strada.|Posizionamento reale::Dove sei sulle ricerche che contano per te, non su quelle che fanno bella figura in un rapporto.|Visibilità sugli assistenti AI::Cosa rispondono ChatGPT, Perplexity e le risposte generate di Google alle domande vere dei tuoi clienti.|Confronto con chi ti precede::Cosa fanno di diverso i tre che stanno davanti a te, in concreto.|Lista in ordine di effetto::Non tutto quello che si potrebbe fare, ma cosa conviene fare per primo.",
  "sol.audit.excludes":
    "L'esecuzione degli interventi, che è un lavoro a parte|L'acquisto di backlink",
  "sol.audit.phases":
    "Raccolta::1 giorno::Accessi agli strumenti che hai già e scelta delle ricerche da controllare.|Analisi::3 giorni::Controllo tecnico, posizionamenti, assistenti AI e concorrenti.|Consegna::1 giorno::Rapporto scritto e mezz'ora insieme per leggerlo.",
  "sol.audit.integra":
    "Google Search Console|Google Analytics|Google Business Profile|ChatGPT, Perplexity e le risposte AI di Google|Il tuo CMS",
  "sol.audit.faq":
    "Cosa ricevo alla fine?::Un documento scritto, con schermate e una lista di interventi in ordine. Non un file di numeri da interpretare da solo.|Devi mettere mano al sito?::No, l'audit non tocca niente. Se poi vuoi che gli interventi li faccia io, se ne parla separatamente.|Serve anche se il sito è nuovo?::Sì, e anzi è il momento migliore: gli errori strutturali costano poco adesso e molto fra un anno.",
  "sol.audit.change":
    "Smetti di lavorare a intuito. Sai cosa sistemare per primo, cosa può aspettare e cosa non stava rallentando niente.",
  "sol.audit.time": "Il rapporto arriva in 5 giorni lavorativi.",

  // ══ 17 · Mappa del mercato ═════════════════════════════════════════════
  "sol.mercato.title": "Mappa del mercato locale",
  "sol.mercato.lede":
    "Chi fa la stessa cosa nel tuo raggio, cosa promette, quanto chiede e dove ha lasciato un buco.",
  "sol.mercato.problem":
    "Del mercato attorno a te sai quello che si dice al bar. Apri un servizio nuovo o alzi un prezzo basandoti su una sensazione, e come stavano davvero le cose lo scopri dopo, dai numeri di fine mese.",
  "sol.mercato.signals":
    "Del mercato attorno a te sai quello che si dice in giro|Decidi i prezzi a sensazione|Non sai cosa promettono davvero i tuoi concorrenti|Stai per aprire un servizio nuovo senza sapere chi lo fa già",
  "sol.mercato.build":
    "Elenco di chi c'è::Chi lavora nel tuo raggio, da fonti pubbliche, con quello che dichiara di fare.|Cosa offrono::Servizi, promesse e le parole che usano per venderli.|Fasce di prezzo::Dove sono dichiarate, raccolte e messe una accanto all'altra.|Recensioni in blocco::Cosa gli viene rimproverato più spesso, che di solito è dove resta spazio per te.|Foglio riapribile::Tutto in un file che resta tuo e che puoi rileggere fra sei mesi.",
  "sol.mercato.excludes":
    "Dati riservati o non pubblici sui concorrenti|La strategia commerciale, che si decide insieme e non si estrae da un foglio",
  "sol.mercato.phases":
    "Perimetro::1 giorno::Definiamo raggio, categoria e chi conta davvero come concorrente.|Raccolta::3 giorni::Estrazione dalle fonti pubbliche e pulizia dei dati.|Lettura::1 giorno::Il foglio consegnato, con le tre cose che saltano all'occhio.",
  "sol.mercato.integra":
    "Google Maps e Business Profile|Fogli Google|Registri e fonti pubbliche|La tua casella email|Recensioni pubbliche",
  "sol.mercato.faq":
    "È legale raccogliere questi dati?::Sono dati pubblici, letti come li leggerebbe una persona. Non entro in aree riservate e non raccolgo dati personali.|Quanto resta valido?::Sei mesi circa, in un mercato normale. Si può rifare periodicamente e guardare cosa si è mosso.|Vale anche se ho pochi concorrenti?::Sì, e diventa più preciso: con dieci nomi si guarda ognuno per davvero invece di fare medie.",
  "sol.mercato.change":
    "Le decisioni sui prezzi e sui servizi nuovi partono da quello che c'è intorno, non da quello che si dice in giro.",
  "sol.mercato.time": "5 giorni per la prima mappa.",
};
