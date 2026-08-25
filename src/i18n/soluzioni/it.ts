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
  "sec.automotive.label": "Officine e concessionari",
  "sec.automotive.title": "Per chi ripara e vende veicoli.",
  "sec.automotive.intro":
    "Un'officina vive su accettazioni, ricambi e tempi di consegna. Il preventivo si fa ancora a mano, lo storico del cliente vive in un quaderno o in un foglio, e quando il ricambio giusto non è a magazzino il tecnico telefona tre fornitori per trovare chi lo ha.|Quello che costruisco per l'automotive parte dall'accettazione digitale: foto dei danni, preventivo da catalogo integrato, approvazione su WhatsApp. Il ricambio fuori stock si ordina da solo, e a fine mese sai quanto ha guadagnato ogni intervento, non solo il totale.",
  "sec.immobiliare.label": "Immobiliare e gestione patrimoniale",
  "sec.immobiliare.title": "Per chi gestisce edifici e persone.",
  "sec.immobiliare.intro":
    "Un agente inserisce un immobile su quattro portali e ci mette quarantacinque minuti. Il mandato scade senza avviso, le visite non lasciano traccia e le provvigioni si calcolano a mano.|Quello che costruisco per l'immobiliare parte dalla pubblicazione multiportale: un immobile inserito una volta e pubblicato ovunque. Il lead arriva nel CRM con la sua fonte, il mandato avvisa prima della scadenza e la provvigione si calcola da sola a chiusura.",
  "sec.edilizia.label": "Edilizia e cantieri",
  "sec.edilizia.title": "Per chi costruisce e ristruttura.",
  "sec.edilizia.intro":
    "Gli sforamenti di budget emergono quando arrivano le fatture di fine mese. Il piano di sicurezza aggiornato deve essere in cantiere per legge e gira su carta. I fogli presenze manuali costano ore di segreteria ogni settimana.|Quello che costruisco per l'edilizia parte dall'app cantiere: badge digitale, foto geolocalizzate di avanzamento, budget in tempo reale che segnala gli sforamenti prima che diventino problemi.",
  "sec.formazione.label": "Scuole e formazione",
  "sec.formazione.title": "Per chi insegna e certifica.",
  "sec.formazione.intro":
    "La segreteria gestisce iscrizioni, pagamenti e supplenti con Excel e WhatsApp. Le quote scadono senza avviso, le presenze vanno su un foglio e le circolari arrivano via email senza conferma di lettura.|Quello che costruisco per la formazione parte dal registro elettronico: voti, presenze e scheda alunno in un posto solo. Le quote scadute si sollecitano da sole, le circolari hanno conferma di lettura e i genitori vedono tutto dal portale.",
  "sec.manifattura.label": "Manifattura e produzione",
  "sec.manifattura.title": "Per chi produce e assembla.",
  "sec.manifattura.intro":
    "Gli ordini arrivano via email, e-commerce, portale e telefono, ognuno con un formato diverso. Il magazzino non sa cosa serve e le vendite non sanno quando parte la merce. I tempi di consegna restano senza misura.|Quello che costruisco per la manifattura parte dalla gestione ordini multicanale: un ordine da qualsiasi fonte diventa lo stesso formato, passa tra i reparti con uno stato e genera i documenti giusti al momento giusto.",
  "sec.logistica.label": "Logistica e trasporti",
  "sec.logistica.title": "Per chi muove e stocca merce.",
  "sec.logistica.intro":
    "Il magazzino vive nella testa di chi lo conosce: il prelievo va a memoria, i lotti si cercano a mano, e le scadenze si scoprono quando qualcosa è già andato male sullo scaffale. L'inventario è un lavoro da weekend che nessuno vuole.|Quello che costruisco per la logistica parte dal magazzino: ubicazioni con barcode, picking guidato, rotazione FIFO o FEFO imposta dal sistema. Il magazzino e il gestionale tornano a dire lo stesso numero, senza copia e incolla.",
  "sec.retail.label": "Negozi e retail",
  "sec.retail.title": "Per chi vende e riordina.",
  "sec.retail.intro":
    "Il negozio che vende online e in sede usa due sistemi che non si parlano. La cassa registra quello che entra ma non quello che esce dal magazzino. Le scorte si contano a occhio e i riordini si fanno a sentimento.|Quello che costruisco per il retail parte dall'unificazione: vendita al dettaglio, e-commerce e magazzino nello stesso flusso. Lo scontrino scala la giacenza, il riordino parte quando serve e il report di fine giornata è pronto quando chiudi la serranda.",

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

  // ══ G02 · Gestionale palestra ══════════════════════════════════════════
  "sol.gestPalestra.title": "Gestionale per palestra con accessi e abbonamenti",
  "sol.gestPalestra.lede":
    "Abbonamenti, tornello e prenotazione dei corsi in un posto solo. Chi è in regola entra, chi è in scadenza riceve il messaggio prima di scoprirlo al tornello.",
  "sol.gestPalestra.problem":
    "I rinnovi passano per WhatsApp e nessuno li segna, così la scadenza la scopre il tornello, davanti al socio, all'ora di punta. La lista d'attesa del corso delle 19 vive nella testa dell'istruttore, e a fine giornata la reception conta la cassa cercando di ricordare chi ha pagato cosa.",
  "sol.gestPalestra.signals":
    "Le scadenze degli abbonamenti le scopri quando il socio è già davanti al tornello|La lista d'attesa dei corsi la tiene a mente l'istruttore|I rinnovi si concordano su WhatsApp e non restano scritti da nessuna parte|A fine giornata la cassa non torna mai al primo colpo",
  "sol.gestPalestra.build":
    "Abbonamenti e rinnovi::Listini, scadenze e rinnovi in un archivio solo. Sette giorni prima della scadenza parte il promemoria, senza che nessuno debba ricordarselo.|Controllo accessi::Il badge o l'app aprono il tornello solo a chi è in regola. Chi è scaduto lo sa prima di arrivare, non davanti a tutti.|Corsi con capienza e lista d'attesa::Il socio prenota dall'app, la capienza è quella vera della sala, e una disdetta promuove il primo in lista da sola.|Cassa e pagamenti::Contanti, carta e pagamenti ricorrenti registrati nello stesso posto, così la chiusura di giornata è una lettura, non una ricostruzione.|I numeri del mese::Incassi, presenze e occupazione dei corsi. Vedi quale orario è pieno e quale sala lavora a metà.",
  "sol.gestPalestra.excludes":
    "L'hardware dei tornelli, che scegli col tuo installatore: io collego quello che monti|La contabilità: il gestionale esporta verso il tuo commercialista, non lo sostituisce",
  "sol.gestPalestra.phases":
    "Listini e regole::1 settimana::Mettiamo per iscritto abbonamenti, listini e regole di accesso, comprese le eccezioni che oggi vivono a voce.|Accessi e prenotazioni::3-5 settimane::Tornello, app dei soci e prenotazione dei corsi. Si prova con un gruppo ristretto prima di aprirla a tutti.|Pagamenti e report::2 settimane::Rinnovi automatici, promemoria di scadenza e i report di fine mese.",
  "sol.gestPalestra.integra":
    "Tornelli e lettori badge (ZKTeco, Hikvision)|Stripe, Nexi e Satispay|WhatsApp Business per i promemoria|Google Calendar|Mailchimp o Brevo|La tua contabilità",
  "sol.gestPalestra.faq":
    "Serve anche a una palestra piccola?::Sotto il centinaio di soci spesso basta un'agenda fatta bene, e te lo dico prima. Il gestionale rende quando gli ingressi e i corsi superano quello che una persona tiene a mente.|I soci devono usare per forza l'app?::No. L'app è la via comoda, ma badge e reception continuano a funzionare per chi non la vuole.|Cosa succede ai pagamenti che falliscono?::Il sistema riprova e avvisa il socio da solo. Tu vedi la lista di chi resta indietro, invece di scoprirlo a fine trimestre.|Il tornello che ho già va bene?::Quasi sempre sì: i lettori più diffusi si collegano. Lo verifichiamo nella prima settimana, prima di scrivere una riga di codice.",
  "sol.gestPalestra.change":
    "Chi entra è in regola senza che nessuno controlli a vista, i rinnovi partono da soli, e a fine mese sai quali corsi riempiono la sala e quali la tengono solo occupata.",
  "sol.gestPalestra.time":
    "Da 6 a 9 settimane, a seconda dell'hardware in ingresso e di quante sedi hai.",

  // ══ G03 · Gestionale clinica ═══════════════════════════════════════════
  "sol.clinica.title": "Gestionale per poliambulatorio e clinica privata",
  "sol.clinica.lede":
    "Agenda multi-medico, cartella clinica e fatturazione che si parlano. La segreteria smette di fare da ponte tra tre programmi e un quaderno.",
  "sol.clinica.problem":
    "La segreteria tiene l'agenda di cinque medici su un programma, le cartelle in un armadio e le fatture in un altro programma ancora. Una doppia prenotazione si scopre quando i due pazienti sono in sala d'attesa, e il medico ricostruisce la storia clinica a memoria, visita per visita.",
  "sol.clinica.signals":
    "Le doppie prenotazioni si scoprono in sala d'attesa|La storia del paziente è divisa tra archivio cartaceo e memoria del medico|Le fatture si emettono a mano, una alla volta, a fine giornata|I no-show non li conta nessuno, ma i buchi in agenda si vedono",
  "sol.clinica.build":
    "Agenda per medico e per sala::Ogni slot conosce medico, sala e tipo di visita. Una doppia prenotazione non è più fisicamente possibile.|Cartella clinica::Anamnesi, diario, referti e consensi firmati nella stessa scheda, visibili solo a chi ha il ruolo per vederli.|Promemoria ai pazienti::Conferma alla prenotazione e promemoria prima della visita, via SMS o email. I no-show calano perché la gente si dimentica meno.|Fatturazione collegata::La visita chiusa genera la ricevuta, con l'invio al Sistema Tessera Sanitaria per le detrazioni del paziente.|Portale del paziente::Prenotazione online, referti e pagamenti da casa, così il telefono della segreteria suona di meno.",
  "sol.clinica.excludes":
    "Il visualizzatore radiologico e i macchinari: mi collego a quello che c'è, non lo fornisco|La parte clinica dei referti, che resta dei medici: io costruisco il contenitore, non il contenuto",
  "sol.clinica.phases":
    "Ruoli e percorsi::1-2 settimane::Chi vede cosa, come entra un paziente, come esce una fattura. In sanità questa mappa si scrive prima, non dopo.|Agenda e cartella::4-6 settimane::Prenotazioni, cartella e consensi. Si prova con dati finti finché il percorso non fila.|Pagamenti e portale::2-3 settimane::Fatturazione, Tessera Sanitaria e il portale con cui il paziente si arrangia da solo.",
  "sol.clinica.integra":
    "Sistema Tessera Sanitaria|POS e pagamenti online|SMS, email e WhatsApp per i promemoria|Firma digitale per i consensi|La tua contabilità|Google Calendar",
  "sol.clinica.faq":
    "I dati dei pazienti dove stanno?::Su server in Europa, cifrati, con accessi per ruolo e un registro di chi ha visto cosa. Sono dati sanitari nel senso pieno del GDPR e si trattano da tali: è il settore dove alle scorciatoie si dice di no.|Possiamo migrare le cartelle vecchie?::Quelle digitali sì, con un'importazione che proviamo insieme prima di buttare via niente. Il cartaceo si digitalizza per gradi, partendo dai pazienti attivi.|Serve la connessione per lavorare?::L'agenda e la cartella vivono online, ma il calendario del giorno resta consultabile anche se la linea cade. Nessuna visita salta per il wi-fi.|Funziona per uno studio con due medici?::Sì, ed è anzi la taglia dove rende subito: senza una segreteria dedicata, ogni automatismo è tempo clinico recuperato.",
  "sol.clinica.change":
    "La segreteria prenota senza paura di doppioni, il medico apre la visita con la storia davanti, e la fattura esce quando esce il paziente, non a fine serata.",
  "sol.clinica.time":
    "Da 8 a 12 settimane, a seconda di quanti medici e di cosa va migrato.",

  // ══ G04 · Gestionale dentistico ════════════════════════════════════════
  "sol.dentistico.title": "Gestionale per studio dentistico",
  "sol.dentistico.lede":
    "Odontogramma, piani di cura e rate in un programma solo. Quello che segni alla poltrona è già in segreteria, senza doppio inserimento.",
  "sol.dentistico.problem":
    "Alla poltrona si segna a mano, poi qualcuno reinserisce tutto in segreteria: tre quarti d'ora al giorno di doppio lavoro. Il preventivo vive su un foglio, le rate su un altro, e il richiamo dei pazienti fermi da un anno non lo fa nessuno perché non esiste una lista da cui farlo.",
  "sol.dentistico.signals":
    "Quello che si segna alla poltrona si reinserisce in segreteria|I preventivi accettati e le rate incassate vivono su fogli diversi|I pazienti che mancano da più di un anno non li richiama nessuno|Le radiografie stanno in un programma, la cartella in un altro",
  "sol.dentistico.build":
    "Odontogramma e piano di cura::Lo stato dei denti si aggiorna in due tocchi, e il piano distingue il pianificato dall'eseguito. La segreteria lo vede nello stesso momento.|Preventivi e rate::Il preventivo si presenta in più opzioni, e ogni seduta scala la sua quota. Le rate hanno una scadenza e un promemoria, non una speranza.|Recall automatico::Igiene a sei mesi, controlli annuali, pazienti fermi: le liste si costruiscono da sole e il messaggio parte da solo.|Agenda multi-poltrona::Ogni poltrona ha la sua colonna e ogni buco si vede. Riempire l'agenda smette di essere un'arte della segretaria.|Ricevute e Tessera Sanitaria::A fine visita la ricevuta è pronta e la spesa è inviata per la detrazione del paziente.",
  "sol.dentistico.excludes":
    "Il software radiologico: mi collego a quello che usi (DICOM), non lo sostituisco|La firma grafometrica su hardware dedicato, se non c'è già: si parte con la firma via email",
  "sol.dentistico.phases":
    "Listino e piani tipo::1 settimana::Prestazioni, listino e i piani di cura più frequenti, scritti come li proponi davvero.|Poltrona e segreteria::4-6 settimane::Odontogramma, agenda e preventivi. Si prova su casi finti finché il giro poltrona-segreteria non fila liscio.|Rate e richiami::2-3 settimane::Rateizzazioni, promemoria e le liste di recall che partono da sole.",
  "sol.dentistico.integra":
    "Radiologici via DICOM (Romexis, Sidexis)|Sistema Tessera Sanitaria|SEPA per le rate|SMS, email e WhatsApp|POS e Satispay|Google Calendar",
  "sol.dentistico.faq":
    "Ho già anni di cartelle in un altro programma::Si migrano: anagrafiche e piani aperti per primi, lo storico per gradi. Niente si butta, e per un periodo i due sistemi convivono.|I consensi dei minori come funzionano?::Il consenso è dei genitori e il sistema lo sa: la scheda del minore chiede la firma giusta e la conserva.|Quanto tempo perde la poltrona per imparare?::Un paio di giornate operative, se odontogramma e listino sono i tuoi e non un modello generico. È il lavoro della prima settimana.|Serve anche a un dentista da solo?::Se lavori da solo con poche decine di pazienti attivi, forse no, e te lo dico prima. Rende quando il doppio inserimento e i richiami mancati costano più del gestionale.",
  "sol.dentistico.change":
    "Il doppio inserimento sparisce, le rate si incassano perché hanno una scadenza, e l'agenda si riempie coi richiami invece che con la fortuna.",
  "sol.dentistico.time":
    "Da 8 a 12 settimane, a seconda delle poltrone e di cosa va migrato.",

  // ══ G05 · Gestionale estetica ══════════════════════════════════════════
  "sol.estetica.title": "Gestionale per centro estetico e SPA",
  "sol.estetica.lede":
    "Agenda per operatrice e per cabina, pacchetti che si scalano da soli e promemoria che riducono i buchi. La giornata si vede in uno schermo.",
  "sol.estetica.problem":
    "L'agenda dice chi è prenotata ma non in quale cabina, e la cabina con la pressoterapia è una sola. I pacchetti prepagati vivono su schede di carta, e quando una cliente contesta le sedute residue vince chi ha la voce più ferma. Le disdette arrivano un'ora prima e il buco resta.",
  "sol.estetica.signals":
    "Le sedute residue dei pacchetti si contestano perché stanno su schede di carta|La cabina giusta è occupata anche quando l'operatrice è libera|Le disdette dell'ultima ora lasciano buchi che nessuno riempie|I prodotti finiscono senza che nessuno se ne accorga prima",
  "sol.estetica.build":
    "Agenda per operatrice e cabina::Ogni prenotazione impegna una persona e una stanza. La pressoterapia non si prenota due volte.|Pacchetti prepagati::Ogni seduta scala il saldo, e la cliente lo vede anche lei. Le contestazioni finiscono perché il conto è scritto.|Prenotazione online con caparra::Chi prenota dal link in bio lascia una caparra, e le disdette tardive smettono di essere gratis.|Promemoria scalati::A tre giorni, il giorno prima e due ore prima. Chi deve disdire lo fa in tempo per farti riempire il buco.|Magazzino dei prodotti::La vendita scala la scorta e l'avviso parte prima che il prodotto finisca.",
  "sol.estetica.excludes":
    "L'hardware di cassa, se non c'è già: mi collego ai POS più diffusi|Le campagne di marketing: il gestionale prepara le liste, la comunicazione resta tua o del tuo social manager",
  "sol.estetica.phases":
    "Servizi, cabine e regole::1 settimana::Listino, durata reale dei trattamenti, quali cabine servono a cosa, e le regole di caparra e disdetta.|Agenda e pacchetti::3-4 settimane::Prenotazioni, saldi dei pacchetti e schede clienti. Si prova a centro chiuso con la squadra.|Online e promemoria::2 settimane::La prenotazione dal sito e da Instagram, le caparre e i promemoria.",
  "sol.estetica.integra":
    "Stripe o PayPal per le caparre|WhatsApp Business|Instagram e Google Business Profile|Fatture in Cloud|Mailchimp o Brevo|Il tuo POS",
  "sol.estetica.faq":
    "Le clienti prenoteranno davvero online?::Una parte sì, subito, dal link in bio. Il telefono non sparisce: cala. E ogni prenotazione online è una telefonata in meno durante un trattamento.|La caparra non farà scappare le clienti?::Le nuove la accettano più di quanto si tema, e per le storiche si può togliere. La regola la decidi tu, il sistema la applica senza discussioni.|Le note riservate delle operatrici dove stanno?::Nella scheda, visibili solo al centro, con le allergie in evidenza. Sono dati sensibili e si trattano da tali.|Serve anche con due cabine?::Se lavori da sola con un'agenda che regge, no, e te lo dico prima. Rende quando cabine, operatrici e pacchetti insieme superano quello che la carta tiene.",
  "sol.estetica.change":
    "La giornata si apre con un colpo d'occhio invece che con tre telefonate, i pacchetti non si discutono più, e i buchi delle disdette si riempiono perché lo sai in tempo.",
  "sol.estetica.time":
    "Da 5 a 8 settimane, a seconda di quante operatrici e se c'è una vendita prodotti da collegare.",

  // ══ G06 · Gestionale hotel (PMS) ═══════════════════════════════════════
  "sol.pms.title": "Gestionale per hotel e B&B (PMS)",
  "sol.pms.lede":
    "Camere, prenotazioni dai portali e pulizie in un sistema solo, con la scheda alloggiati che parte nei tempi. Il front desk smette di ricopiare.",
  "sol.pms.problem":
    "Le prenotazioni arrivano da Booking, dal telefono e dal sito, e finiscono su un planning che va aggiornato a mano su ogni canale: l'overbooking è sempre a una dimenticanza di distanza. Le pulizie si coordinano a voce, e ogni sera qualcuno ricopia i documenti degli ospiti per la questura.",
  "sol.pms.signals":
    "Il planning delle camere si aggiorna a mano su ogni portale|La scheda alloggiati si compila ricopiando i documenti la sera|Le pulizie si coordinano a voce e non si sa mai quali camere sono pronte|Il prezzo è lo stesso a febbraio e a Ferragosto",
  "sol.pms.build":
    "Planning e channel manager::Booking, Expedia e il tuo sito leggono la stessa disponibilità. Una prenotazione chiude la camera ovunque, nello stesso istante.|Prenotazione diretta dal sito::Il motore di prenotazione sul tuo dominio, senza commissione: chi ti conosce già prenota da te.|Check-in e alloggiati::Il documento si acquisisce all'arrivo e la comunicazione alla questura parte nei tempi, senza ricopiature serali.|Pulizie organizzate::Ogni piano sa quali camere fare e in che ordine, dal telefono. Le camere pronte si vedono dal front desk.|Tariffe per stagione::Prezzi per periodo e per canale, e i numeri che contano a fine giornata: occupazione e ricavo medio a camera.",
  "sol.pms.excludes":
    "Le serrature elettroniche, se non ci sono già: mi collego alle più diffuse, non le fornisco|I contenuti e le foto del sito: il motore di prenotazione vive dentro il sito che hai, o che facciamo come progetto a parte",
  "sol.pms.phases":
    "Camere, canali e tariffe::1-2 settimane::Inventario delle camere, i portali attivi e le regole tariffarie con cui lavori davvero.|Planning e portali::4-6 settimane::Il planning, il collegamento ai portali e la prenotazione diretta. Si prova in parallelo al metodo attuale.|Check-in e pulizie::2-3 settimane::Alloggiati, pulizie e i report di fine giornata.",
  "sol.pms.integra":
    "Booking, Expedia e Airbnb|ALLOGGIATI WEB|Pagamenti online e POS|FatturaPA e la tua contabilità|Le serrature elettroniche più diffuse|TripAdvisor e Google per le recensioni",
  "sol.pms.faq":
    "L'imposta di soggiorno la gestisce?::Sì, con le esenzioni del tuo comune, e a fine periodo il conteggio per il versamento è già fatto.|Cosa succede se un portale cambia qualcosa?::Il collegamento passa per i canali ufficiali dei portali, fatti per durare. Se uno cambia le regole, si aggiorna il connettore, non il tuo modo di lavorare.|Ho un B&B con sei camere, è troppo?::Può darsi, e te lo dico prima: sotto le dieci camere spesso bastano un channel manager e un planning semplice. Il sistema completo rende quando entrano in gioco pulizie, ristorante o più persone al front desk.|Le prenotazioni telefoniche dove finiscono?::Nel planning come le altre: le inserisce il front desk in trenta secondi, e chiudono la disponibilità sui portali come tutte.",
  "sol.pms.change":
    "L'overbooking smette di essere una paura quotidiana, la sera nessuno ricopia documenti, e il sito torna a portare prenotazioni senza commissione.",
  "sol.pms.time":
    "Da 8 a 12 settimane, a seconda dei portali collegati e delle dimensioni della struttura.",

  // ══ G07 · Gestione turni ═══════════════════════════════════════════════
  "sol.turni.title": "Gestione turni del personale",
  "sol.turni.lede":
    "Il planning si costruisce da solo dentro le regole, i cambi passano dall'app e il costo del lavoro si vede prima, non a cedolino.",
  "sol.turni.problem":
    "Ogni settimana qualcuno passa ore a incastrare turni su un foglio, tenendo a mente ferie, preferenze e riposi obbligatori. I cambi si negoziano su WhatsApp e non li vede nessuno, e quando qualcuno dà forfait alle sette di mattina parte il giro di telefonate.",
  "sol.turni.signals":
    "Il planning della settimana costa ore e va rifatto a ogni imprevisto|I cambi turno passano su WhatsApp e non restano scritti|Le undici ore di riposo tra un turno e l'altro si controllano a occhio|Il costo degli straordinari si scopre col cedolino",
  "sol.turni.build":
    "Planning con le regole dentro::Riposi, ore massime e vincoli del contratto sono nel motore: un turno che li viola non si riesce a salvare.|App per chi lavora::Ognuno vede i suoi turni, chiede ferie e propone cambi dal telefono. Il cambio approvato aggiorna il planning da solo.|Sostituzioni senza telefonate::Un'assenza improvvisa interroga i qualificati disponibili: il primo che accetta copre il turno.|Costo prima, non dopo::Il planning mostra quanto costerà, straordinari e festivi compresi, mentre lo componi.|Export per le paghe::A fine mese le ore vanno al consulente del lavoro nel formato che usa, senza ricopiature.",
  "sol.turni.excludes":
    "La rilevazione presenze hardware, se non c'è: mi collego a badge e app esistenti|Il payroll vero e proprio, che resta al consulente del lavoro",
  "sol.turni.phases":
    "Regole e squadre::1-2 settimane::Contratto applicato, vincoli, competenze e le regole non scritte che oggi vivono nella testa di chi pianifica.|Planning e app::3-4 settimane::Il motore dei turni e l'app. Si pianifica in parallelo col metodo attuale per un paio di cicli.|Paghe e report::1-2 settimane::L'export per il consulente e i report su assenze e straordinari.",
  "sol.turni.integra":
    "Zucchetti, TeamSystem e i payroll più diffusi|Badge e rilevazione presenze|Google Calendar|Teams e Slack|WhatsApp per le notifiche|Il tuo gestionale, se c'è",
  "sol.turni.faq":
    "E i dipendenti più restii all'app?::Il turno stampato non sparisce: l'app è la via comoda, non un obbligo. Di solito la adottano quando capiscono che serve a chiedere i cambi senza passare dal capo.|Funziona col nostro contratto?::Le regole si configurano sul contratto che applichi, comprese le maggiorazioni. È il lavoro della prima fase, fatto insieme.|E se il planning proposto non mi piace?::Lo cambi a mano: il motore propone, tu disponi. Il punto è che ogni modifica viene verificata contro le regole mentre la fai.|Sotto quante persone non serve?::Sotto le dieci, quasi mai, e te lo dico prima. Rende da quando gli incastri superano quello che una persona tiene a mente senza errori.",
  "sol.turni.change":
    "Il planning della settimana si chiude in minuti, i cambi lasciano traccia, e il costo del lavoro lo conosci quando puoi ancora correggerlo.",
  "sol.turni.time":
    "Da 5 a 8 settimane, a seconda delle sedi e del contratto applicato.",

  // ══ G08 · Tracciabilità HACCP ══════════════════════════════════════════
  "sol.haccp.title": "Tracciabilità e HACCP digitale",
  "sol.haccp.lede":
    "Temperature, lotti e checklist firmate dal telefono, e il fascicolo per l'ispezione pronto in un minuto invece che in una notte.",
  "sol.haccp.problem":
    "I registri HACCP si compilano a mano a fine turno, quando va bene: le temperature del frigo, quando va male, si ricostruiscono. All'arrivo di un'ispezione il fascicolo si assembla da raccoglitori diversi, e se un fornitore richiama un lotto la ricostruzione richiede giorni.",
  "sol.haccp.signals":
    "I registri delle temperature si compilano a fine turno, a memoria|I certificati dei fornitori stanno in un raccoglitore che nessuno apre|Un richiamo di lotto significherebbe giorni di ricostruzione|Le checklist di sanificazione si firmano in blocco a fine settimana",
  "sol.haccp.build":
    "Temperature sotto controllo::Le sonde registrano da sole, giorno e notte, e l'anomalia arriva sul telefono quando puoi ancora salvare la merce.|Registro digitale firmato::Le checklist si compilano dal telefono al momento giusto, con firma e ora. Niente più compilazioni a memoria.|Lotti tracciati::Ogni merce entra con lotto e scadenza. Un richiamo si risolve con una ricerca, non con una ricostruzione.|Documenti dei fornitori::Certificati e schede tecniche in un archivio con le scadenze in vista, non in un raccoglitore.|Fascicolo per l'ispezione::Il report di conformità si genera in un minuto, dal tablet, davanti all'ispettore.",
  "sol.haccp.excludes":
    "Le sonde hardware: ti indico le compatibili e collego quelle che scegli|La consulenza HACCP: il piano di autocontrollo resta del tuo consulente, io lo rendo vivo",
  "sol.haccp.phases":
    "Piano e punti critici::1 settimana::Il tuo piano di autocontrollo, i punti critici e le checklist reali, tradotti in digitale insieme al tuo consulente.|Registri e lotti::3-4 settimane::Temperature, checklist e tracciabilità. Si va in parallelo col cartaceo finché la squadra non si fida.|Sonde e report::1-2 settimane::Il collegamento delle sonde e i report per le ispezioni.",
  "sol.haccp.integra":
    "Sonde di temperatura (Testo, Comet)|Barcode e QR per i lotti|Il tuo POS, per legare vendite e lotti|Firma digitale|Portali dei fornitori|Il tuo gestionale, se c'è",
  "sol.haccp.faq":
    "Il mio consulente HACCP resta?::Sì, ed è voluto: il piano di autocontrollo è suo, io costruisco lo strumento che lo fa rispettare davvero. Di solito il consulente è il primo contento.|La squadra compilerà davvero le checklist?::Più di prima, perché dal telefono costa trenta secondi al momento giusto invece di venti minuti a fine turno. E quello che manca si vede subito, non all'ispezione.|Le sonde sono obbligatorie?::No: si può partire con le rilevazioni manuali digitalizzate e aggiungere le sonde dopo. Cambia la fatica, non la conformità.|Serve anche a un laboratorio piccolo?::Se produci e vendi lotti, sì, prima di quanto si pensi: è proprio il laboratorio artigianale quello che un richiamo mette in ginocchio.",
  "sol.haccp.change":
    "I registri si compilano quando succedono le cose, l'ispezione trova un fascicolo invece di una caccia al raccoglitore, e un richiamo diventa una ricerca di dieci secondi.",
  "sol.haccp.time":
    "Da 4 a 7 settimane, a seconda dei punti di controllo e delle sonde.",

  // ══ S01 · CRM su misura ════════════════════════════════════════════════
  "sol.crm.title": "CRM su misura per PMI",
  "sol.crm.lede":
    "I clienti, le trattative e le cose da fare in un posto solo, coi campi che servono a te. Sei campi giusti, non sessanta vuoti.",
  "sol.crm.problem":
    "Lo storico dei clienti vive nelle caselle email di chi li segue, e quando una persona se ne va, se ne va anche la memoria. Le trattative si seguono a sensazione, i preventivi mandati non hanno una data di richiamo, e il CRM provato l'anno scorso è morto perché chiedeva sessanta campi per salvare un contatto.",
  "sol.crm.signals":
    "Lo storico dei clienti vive nelle email personali di chi li segue|I preventivi inviati non hanno una data di richiamo|Il CRM provato in passato è stato abbandonato in un mese|Le scadenze dei contratti si scoprono quando il cliente ha già firmato altrove",
  "sol.crm.build":
    "Anagrafica coi tuoi campi::I campi che usi davvero, il controllo dei duplicati, e le email che si agganciano alla scheda da sole.|Pipeline sulle tue fasi::Le trattative avanzano sulle fasi reali del tuo modo di vendere, non su quelle di un modello americano.|Richiami che non si perdono::Ogni preventivo esce con una data di richiamo, e la mattina sai chi chiamare.|Scadenze dei contratti::Novanta giorni prima del rinnovo il sistema avvisa, con lo storico davanti.|Report commerciali::Quanto c'è in pipeline, cosa si chiude, dove si perde. Senza che nessuno compili un foglio la domenica.",
  "sol.crm.excludes":
    "La lista dei contatti non la invento: si parte dai tuoi dati veri, ripuliti insieme|Le campagne di marketing: il CRM prepara le liste, l'invio resta al tuo strumento di email",
  "sol.crm.phases":
    "I tuoi campi e le tue fasi::1 settimana::Come vendi davvero, quali campi servono e quali no. È la settimana che decide se il CRM verrà usato.|Schede e pipeline::2-4 settimane::Anagrafiche, trattative e richiami, coi tuoi dati importati. Si prova sul lavoro vero, non su dati demo.|Collegamenti::1-2 settimane::Email, calendario, il form del sito e, se c'è, il gestionale.",
  "sol.crm.integra":
    "Outlook e Gmail|Google Calendar|Il form del tuo sito|Fatture in Cloud o il tuo gestionale|WhatsApp Business|Mailchimp o Brevo",
  "sol.crm.faq":
    "Perché non un CRM famoso in abbonamento?::Se le sue fasi e i suoi campi ti somigliano, prendilo, e te lo dico volentieri. Il su misura rende quando il tuo modo di vendere non entra nei modelli, o quando l'abbonamento a utente costa più del lavoro.|Gli agenti lo useranno?::Se salvare un contatto costa dieci secondi dal telefono, sì. È il motivo per cui i campi sono sei e non sessanta.|Lo storico resta all'azienda?::Sì, ed è uno dei motivi per farlo: quando un commerciale se ne va, i clienti e la memoria restano a te.|I dati dove stanno?::Su un database tuo, in Europa, esportabile quando vuoi. Il CRM è tuo come il resto: codice, accessi e dati.",
  "sol.crm.change":
    "Le trattative hanno una faccia e una data, i richiami partono al momento giusto, e la memoria commerciale resta in azienda anche quando le persone cambiano.",
  "sol.crm.time":
    "Da 4 a 8 settimane, a seconda dei collegamenti e della pulizia dei dati di partenza.",

  // ══ S02 · Dashboard KPI ════════════════════════════════════════════════
  "sol.kpi.title": "Dashboard aziendale con i numeri che contano",
  "sol.kpi.lede":
    "I numeri sparsi tra gestionale, banca e fogli si ritrovano in una schermata sola, aggiornata da sola. Il lunedì si apre leggendo, non assemblando.",
  "sol.kpi.problem":
    "I numeri esistono, ma ognuno sta in un sistema: il fatturato nel gestionale, i costi in contabilità, le vendite online nell'e-commerce, il resto in fogli che qualcuno aggiorna quando può. Il quadro d'insieme si costruisce a mano una volta al mese, e quando è pronto racconta un mese già finito.",
  "sol.kpi.signals":
    "Il report mensile costa ore di copia e incolla da sistemi diversi|Il margine reale si conosce solo a bilancio|Ogni sede o canale ha i suoi numeri e i confronti non tornano|Le decisioni si prendono a sensazione perché il dato arriva tardi",
  "sol.kpi.build":
    "Collegamento alle fonti::Gestionale, contabilità, e-commerce e banca si leggono da soli, ogni giorno. Il copia e incolla sparisce.|I KPI concordati::Non cento grafici: i cinque-dieci numeri su cui decidi davvero, definiti insieme prima di costruire.|Confronti che parlano::Rispetto al mese scorso, all'anno scorso, alla sede accanto. Il numero da solo non dice niente, il confronto sì.|Soglie e avvisi::Quando un numero esce dal binario arriva un messaggio, senza che tu debba aprire niente.|Accessi per ruolo::La direzione vede tutto, il commerciale il suo, il consulente quello che gli serve.",
  "sol.kpi.excludes":
    "La pulizia di tutto lo storico sporco: si sistema il flusso da oggi in avanti, non ogni cella del passato|La contabilità analitica, che resta del commercialista: io la leggo, non la produco",
  "sol.kpi.phases":
    "Le decisioni e i numeri::1 settimana::Quali decisioni prendi ogni settimana e quali numeri ti servono per prenderle. Si parte dalle domande, non dai grafici.|Connettori e dashboard::2-4 settimane::I collegamenti alle fonti e la prima versione, su cui si itera coi numeri veri.|Soglie e abitudine::1 settimana::Gli avvisi, gli accessi e la messa a punto dopo le prime settimane d'uso.",
  "sol.kpi.integra":
    "Il tuo gestionale o ERP|Fatture in Cloud e la contabilità|WooCommerce o Shopify|La banca, via estratti od open banking|Google Analytics e Meta Ads|Fogli Google, per quello che resta manuale",
  "sol.kpi.faq":
    "I dati sono nostri o vostri?::Tuoi: la dashboard legge dai tuoi sistemi e vive su infrastruttura tua. Io costruisco, non custodisco.|E se una fonte non ha un collegamento?::Si parte da un export periodico o da un foglio strutturato, e si automatizza dopo. Meglio un dato semi-automatico oggi che uno perfetto mai.|Non basta Excel?::Se una persona sola aggiorna un file e il file regge, sì. La dashboard rende quando le fonti sono più di due e il tempo di assemblarle costa più della sua costruzione.|Ogni quanto si aggiorna?::Dipende dalla fonte: la banca ogni giorno, il gestionale anche ogni ora. La frequenza si decide fonte per fonte, in base a cosa serve davvero.",
  "sol.kpi.change":
    "Il quadro d'insieme non si costruisce più: c'è. E i problemi si vedono quando sono ancora curve, non quando sono già bilanci.",
  "sol.kpi.time":
    "Da 3 a 6 settimane, a seconda di quante fonti e di come si collegano.",

  // ══ 18 · Automatizzare Excel ═══════════════════════════════════════════
  "sol.excel.title": "Dal foglio Excel a un'applicazione vera",
  "sol.excel.lede":
    "Il foglio che regge mezza azienda diventa un'applicazione con accessi, storico e calcoli in un posto solo. Senza versioni doppie e senza file che crollano.",
  "sol.excel.problem":
    "C'è un file che regge mezza azienda, e tutti lo sanno. Va in crash oltre una certa mole, esiste in tre versioni su Drive, e le formule le capisce solo la persona che l'ha costruito, che prima o poi andrà in ferie. Ogni report è un pomeriggio di copia e incolla.",
  "sol.excel.signals":
    "Il file esiste in più versioni e nessuno sa qual è quella buona|Le formule le capisce una persona sola|Sopra una certa mole il file rallenta o crolla|Il report periodico è un pomeriggio di copia e incolla",
  "sol.excel.build":
    "Un dato, un posto solo::Un database al posto del file: tutti lavorano sugli stessi numeri, nello stesso momento, senza versioni.|Le tue formule, centralizzate::I calcoli che oggi vivono nelle celle diventano regole scritte una volta e uguali per tutti.|Maschere al posto delle celle::Chi inserisce compila un modulo che controlla i dati, invece di scrivere in una cella libera. Gli errori calano all'origine.|Accessi e storico::Ognuno vede e tocca il suo, e ogni modifica lascia traccia: chi, cosa, quando.|Report in un clic::Quello che oggi è un pomeriggio di copia e incolla diventa un pulsante, o parte da solo a calendario.",
  "sol.excel.excludes":
    "Excel non sparisce: per le analisi personali resta, e l'export verso il foglio è sempre possibile|I processi che nel foglio non sono mai passati: si automatizza quello che il file fa davvero",
  "sol.excel.phases":
    "Anatomia del foglio::1 settimana::Smontiamo il file insieme a chi lo usa: cosa calcola, chi lo tocca, dove fa male. Le regole non scritte sono la parte preziosa.|Costruzione::2-4 settimane::L'applicazione prende forma coi tuoi dati veri, e il foglio resta in parallelo finché non ti fidi.|Collegamenti::1 settimana::Gestionale, contabilità o e-commerce, perché i dati entrino da soli invece che a mano.",
  "sol.excel.integra":
    "Il tuo gestionale o ERP|Fatture in Cloud|WooCommerce o Shopify|Google Workspace e Microsoft 365|Email, Slack o Teams per le notifiche|La banca, dove serve",
  "sol.excel.faq":
    "Perdiamo la flessibilità di Excel?::Un po', ed è il punto: la libertà di scrivere ovunque è anche la libertà di sbagliare ovunque. Dove serve manovra, l'export c'è sempre.|Quanto ci mette la squadra ad abituarsi?::Meno di quanto pensi, perché l'applicazione nasce dalla logica del loro foglio, non da un gestionale calato dall'alto.|E se il foglio cambia spesso?::Allora la prima settimana serve a capire cosa è stabile e cosa no. La parte stabile si irrigidisce, quella viva resta configurabile.|Vale anche per un foglio piccolo?::No, e te lo dico subito: un file che una persona aggiorna in dieci minuti al giorno sta benissimo com'è. Vale quando il file è diventato un collo di bottiglia condiviso.",
  "sol.excel.change":
    "Il file smette di essere un rischio con un nome proprio: i dati hanno una casa, gli errori calano all'origine e i report si fanno da soli.",
  "sol.excel.time":
    "Da 3 a 6 settimane, a seconda della complessità del foglio e dei collegamenti.",

  // ══ 19 · Back office officina ═════════════════════════════════════════
  "sol.officina.title": "Back office per officine e concessionari",
  "sol.officina.lede":
    "Accettazioni digitali, ordinazione ricambi e contabilità interventi in un posto solo. Il tecnico smette di scrivere a mano e il titolare smette di chiedersi quanto ha guadagnato ogni intervento.",
  "sol.officina.problem":
    "L'accettazione si scrive su un blocchetto carbone, mezza volta illeggibile. Lo storico del cliente vive in un quaderno o in una vecchia cartella fatture, e quando il tecnico ha bisogno di un ricambio non disponibile telefona tre fornitori per trovare chi lo ha. A fine mese sai il totale ma non quale intervento ha guadagnato e quale ha perso.",
  "sol.officina.signals":
    "Le accettazioni sono scritte a mano e a volte illeggibili|La ricerca ricambi significa telefonare a tre fornitori|Lo storico del cliente vive in un quaderno o nelle vecchie fatture|Sai il totale mensile ma non il margine per intervento",
  "sol.officina.build":
    "Accettazione digitale::Foto dei danni, lavoro richiesto e preventivo da catalogo ricambi, tutto in un modulo che il cliente firma dal telefono.|Ordinazione ricambi::Quando un ricambio non è disponibile il sistema verifica la disponibilità fornitore e genera l'ordine, senza telefonata.|Approvazione su WhatsApp::Il preventivo arriva al cliente come messaggio con pulsante si/no, e la risposta torna nella scheda lavoro.|Contabilità interventi::Mano d'opera, ricambi e tempo tracciati per intervento, così a fine mese sai esattamente cosa ha guadagnato ciascuno.|Storico cliente::Ogni visita, ogni ricambio, ogni preventivo legati al veicolo e al proprietario, visibili in due tap.",
  "sol.officina.excludes":
    "Gestione magazzino e giacenze ricambi oltre l'intervento in corso|Contabilità e paghe, che restano dal tuo commercialista",
  "sol.officina.phases":
    "Accettazione e catalogo::1-2 settimane::Mappiamo il flusso di accettazione, il catalogo ricambi e la struttura dei preventivi.|Costruzione::4-6 settimane::Schede lavoro, percorso di approvazione e contabilità interventi. Provati sugli interventi reali prima che sparisca il quaderno.|Ricambi e storico::2-3 settimane::Integrazione fornitori, ordinazione ricambi e vista storico cliente.",
  "sol.officina.integra":
    "Tecdoc per il catalogo ricambi|WhatsApp Business per l'approvazione cliente|Il tuo software contabile|Google Calendar per le date di consegna|Portali fornitori per la disponibilità",
  "sol.officina.faq":
    "Posso continuare a usare l'accettazione cartacea per i passaggi?::Sì. Il modulo digitale è la via più veloce, non l'unica. Le scritture cartacee vengono inserite dalla reception quando serve.|E se un fornitore non è connesso?::Il sistema genera un elenco da inviare via email o WhatsApp. L'ordine esce lo stesso, solo con un canale diverso.|Conviene per un'officina con un solo posto?::Sotto venti interventi al mese il quaderno funziona ancora e te lo dico. Conviene quando gli interventi si accumulano e inizi a perdere traccia di chi è stato chiamato per cosa.",
  "sol.officina.change":
    "L'accettazione è leggibile e il cliente la riceve per iscritto. Gli ordini ricambi escono senza giro di telefonate, e a fine mese sai quanto ha guadagnato ogni intervento invece di quello che dice solo il conto in banca.",
  "sol.officina.time":
    "Da 5 a 8 settimane, a seconda di quanti fornitori vanno collegati.",

  // ══ 20 · Gestione immobiliare ════════════════════════════════════════
  "sol.immobiliare.title": "Pubblicazione multiportale e tracciamento mandati per immobiliare",
  "sol.immobiliare.lede":
    "Un immobile inserito una volta e pubblicato ovunque, con lead che arrivano nel CRM e mandati che avvisano prima della scadenza.",
  "sol.immobiliare.problem":
    "Inserisci un immobile su quattro portali e ognuno richiede quindici minuti con il suo formato e l'ordine delle foto. Il mandato scade e lo scopri quando un cliente chiama per quello. Le visite succedono ma nessuno scrive chi è venuto o cosa ha detto, e la provvigione si calcola a mano a chiusura.",
  "sol.immobiliare.signals":
    "Inserire un immobile su quattro portali richiede quarantacinque minuti|I mandati scadono senza avviso|Le visite non lasciano traccia e nessuno ricorda cosa ha detto il cliente|Le provvigioni si calcolano a mano a chiusura",
  "sol.immobiliare.build":
    "Inserimento unico, tutti i portali::L'immobile viene inserito una volta con foto, planimetria e descrizione, e pubblicato su ogni portale collegato nel formato giusto per ognuno.|Tracciamento lead::Ogni richiesta arriva nel CRM con la sua fonte, così sai quale portale porta davvero clienti.|Avvisi mandato::Trenta giorni prima della scadenza il sistema ti avvisa, con i giorni rimasti e i dati dell'immobile davanti a te.|Calcolo provvigioni::La commissione viene impostata alla firma del mandato e la provvigione si calcola da sola a chiusura, senza foglio di calcolo.|Registro visite::Chi è venuto, quando, cosa ha detto e quale è il prossimo passo. Lo storico resta con l'immobile, non nella testa di qualcuno.",
  "sol.immobiliare.excludes":
    "Fotografia professionale e tour virtuali|Trasferimento di proprietà e lavoro legale a chiusura",
  "sol.immobiliare.phases":
    "Configurazione portali e struttura mandato::1-2 settimane::Collego i portali che usi davvero e definisco i campi del mandato e le regole di provvigione.|Costruzione::4-5 settimane::Pubblicazione multiportale, tracciamento lead e calendario mandati.|CRM e provvigioni::2-3 settimane::La pipeline dei lead e il calcolatore di provvigioni, provati sugli immobili reali.",
  "sol.immobiliare.integra":
    "Immobiliare.it, Idealista e Casa.it|Il tuo sito|Google Business Profile|Google Calendar per le visite|WhatsApp per la comunicazione con i clienti|Il tuo software contabile",
  "sol.immobiliare.faq":
    "Sostituisce i portali?::No, pubblica su di loro. Continui a pagare gli abbonamenti ai portali, ma smetti di reinserire lo stesso immobile quattro volte.|Posso impostare foto diverse per portale?::Sì. L'inserimento è uno, ma ogni portale può riordinare o nascondere foto specifiche.|E se un portali cambia formato?::Il connettore si aggiorna, non il tuo modo di lavorare. Quello è il pezzo che ti risparmia i quarantacinque minuti.",
  "sol.immobiliare.change":
    "Un immobile va online su ogni portale in cinque minuti invece di quarantacinque. I lead arrivano già etichettati per fonte, e non perdi mai un mandato a una scadenza dimenticata.",
  "sol.immobiliare.time":
    "Da 5 a 8 settimane, a seconda di quanti portali e se il CRM esiste già.",

  // ══ 21 · Gestione coworking ══════════════════════════════════════════
  "sol.coworking.title": "Prenotazione e gestione membership per spazi coworking",
  "sol.coworking.lede":
    "Postazioni, sale riunioni e membership in un sistema solo. Il calendario mostra cosa è libero, la fattura esce da sola e il portale membro fa il resto.",
  "sol.coworking.problem":
    "Le postazioni si prenotano via WhatsApp e nessuno sa chi arriva davvero. La sala riunioni ha un foglio sulla porta e le doppie prenotazioni succedono ogni settimana. Le fatture escono in ritardo perché qualcuno deve abbinare le presenze al listino a mano, e l'ingresso di un nuovo membro è fatto di tre email che arrivano forse.",
  "sol.coworking.signals":
    "Le prenotazioni postazione arrivano via WhatsApp senza vista centralizzata|La sala riunioni si prenota due volte perché fa fede un foglio sulla porta|Le fatture escono in ritardo perché qualcuno abbina le presenze a mano|L'ingresso di un nuovo membro è fatto di tre email sparse",
  "sol.coworking.build":
    "Calendario postazioni e sale::Disponibilità reale per giorno e ora, prenotabile dal portale membro. Niente più doppie prenotazioni.|Piani di membership::Diversi livelli con diversi accessi, ognuno con il suo prezzo e ciclo di fatturazione.|Fatturazione automatica::A fine ciclo la fattura si genera dall'uso reale e esce da sola.|Portale membro::Prenota una postazione, vedi il calendario, gestisci la membership. La reception smette di essere centralino.|Registro visitatori::Gli ospiti fanno check-in con nome e host, e l'host viene avvisato.",
  "sol.coworking.excludes":
    "Hardware di controllo accessi come i lettori badge|Il sito web e il sito marketing, che è un progetto a parte",
  "sol.coworking.phases":
    "Piani e regole::1 settimana::Livelli di membership, capacità postazioni e sale, regole cancellazione e fatturazione.|Costruzione::4-5 settimane::Calendario, portale membro e fatturazione. Provato con un piccolo gruppo prima di aprire a tutti.|Onboarding e lancio::1-2 settimane::Il percorso di onboarding membro e il passaggio al tuo team.",
  "sol.coworking.integra":
    "Stripe o PayPal per i pagamenti|Google Calendar per le prenotazioni sale|La tua casella di posta|WhatsApp per le notifiche|Il tuo sito, se esiste",
  "sol.coworking.faq":
    "Posso offrire biglietti giornalieri oltre alle membership?::Sì. Biglietti giornalieri e membership convivono, ognuno con il suo prezzo e le sue regole di accesso.|E i membri che non prenotano e arrivano così?::Il calendario è per la pianificazione, non per il blocco. Gli arrivi funzionano come sempre.|Gestisce postazioni calde e fisse in modo diverso?::Sì. Una postazione fissa è sempre riservata al membro, una calda è disponibile su prenotazione in ordine di arrivo.",
  "sol.coworking.change":
    "Postazioni e sale si prenotano in secondi invece di un thread WhatsApp. Le fatture escono in tempo senza che nessuno passi il pomeriggio ad abbinare fogli, e i nuovi membri sanno cosa fare prima che la reception glielo dica.",
  "sol.coworking.time":
    "Da 4 a 6 settimane, a seconda di quanti livelli di membership e se la fatturazione va collegata.",

  // ══ 22 · App cantiere ════════════════════════════════════════════════
  "sol.cantieri.title": "App cantiere per edilizia e imprese di costruzione",
  "sol.cantieri.lede":
    "Badge digitale, foto geolocalizzate e budget in tempo reale su ogni cantiere. L'ufficio vede cosa succede senza chiedere.",
  "sol.cantieri.problem":
    "Il foglio presenze è un modulo cartaceo che qualcuno fotografia e invia il venerdì, e entro lunedì metà dei nomi sono sbagliati. Le foto di avanzamento finiscono nella galleria del telefono di qualcuno senza data e senza riferimento al lavoro. Gli sforamenti di budget emergono quando arrivano le fatture di fine mese, momento in cui sono già un problema.",
  "sol.cantieri.signals":
    "I fogli presenze sono moduli cartacei fotografati e inviati il venerdì|Le foto di avanzamento stanno nel telefono di qualcuno senza data né riferimento al lavoro|Gli sforamenti di budget emergono con le fatture di fine mese|Il piano di sicurezza gira su carta e nessuno sa se è aggiornato",
  "sol.cantieri.build":
    "Badge digitale::Timbratura ingresso e uscita dal telefono, geolocalizzata, con il cantiere allegato. Niente carta, niente fotografie, niente email del venerdì.|Foto avanzamento::Geolocalizzate e con timestamp, allegate al lavoro e visibili dall'ufficio in tempo reale.|Budget live::Preventivato versus effettivo, aggiornato man mano che arrivano le fatture. Gli sforamenti segnalano prima che diventino problemi.|Report presenze::Ore per lavoratore, per cantiere, per settimana. Esportati per le paghe nel formato giusto.|Condivisione documenti::Piani di sicurezza, permessi e disegni sul telefono, con controllo versione così nessuno lavora con uno vecchio.",
  "sol.cantieri.excludes":
    "Project management e pianificazione Gantt, che è software separato|Elaborazione paghe, che resta dal tuo consulente",
  "sol.cantieri.phases":
    "Cantieri e regole::1 settimana::Quali cantieri sono attivi, chi lavora dove, le regole presenze e budget.|Costruzione::4-5 settimane::Badge, foto e budget. Provati su un cantiere prima di estendere.|Report e documenti::1-2 settimane::L'esportazione presenze e l'area condivisione documenti.",
  "sol.cantieri.integra":
    "Il tuo software contabile|Google Drive o il tuo archivio documenti|WhatsApp per avvisi cantiere|Google Calendar per le scadenze|Excel, se il budget vive lì adesso",
  "sol.cantieri.faq":
    "Funziona offline in cantiere?::Sì. Timbratura, foto e note funzionano offline e si sincronizzano quando torna la connessione. Un cantiere non può dipendere dal segnale.|I lavoratori possono timbrare per conto di altri?::I controlli di geolocalizzazione rendono improbabile, e il sistema lo segnala quando succede.|Conviene per un'impresa di due persone?::Sotto cinque lavoratori il foglio carta funziona ancora e te lo dico. Conviene quando i cantieri si moltiplicano e le presenze diventano un lavoro amministrativo settimanale.",
  "sol.cantieri.change":
    "Le presenze sono accurate e arrivano in ufficio lo stesso giorno. Le foto di avanzamento sono archiviate con luogo e data. E i problemi di budget appaiono come curve su uno schermo invece di sorprese in una fattura.",
  "sol.cantieri.time":
    "Da 4 a 6 settimane, a seconda del numero di cantieri attivi.",

  // ══ 23 · Gestione autoscuola ═════════════════════════════════════════
  "sol.autoscuola.title": "Gestionale per autoscuole",
  "sol.autoscuola.lede":
    "Lezioni teoriche, guide pratiche e prenotazioni esami in un posto solo. L'allievo si iscrive, paga e prenota senza che il telefono dell'ufficio squilli.",
  "sol.autoscuola.problem":
    "Le iscrizioni arrivano per telefono e vengono scritte in un quaderno. La tabella delle lezioni vive in una griglia settimanale sulla parete, e quando un istruttore si dà malato il pomeriggio salta. Gli allievi chiedono quante ore gli restano, le date d'esame arrivano via email e qualcuno deve telefonare a ogni allievo per offrire lo slot.",
  "sol.autoscuola.signals":
    "Le iscrizioni arrivano per telefono e vengono scritte in un quaderno|Gli allievi chiedono quante ore gli restano|Le date d'esame arrivano via email e qualcuno telefona a ogni allievo|Quando un istruttore si dà malato il pomeriggio salta",
  "sol.autoscuola.build":
    "Iscrizione online::L'allievo sceglie il corso, compila i dati e paga la prima rata, senza telefonare in ufficio.|Tracciamento lezioni::Ogni ora pratica è registrata per allievo, per istruttore. Le ore rimanenti sono sempre visibili.|Calendario lezioni teoriche::Sessioni con data, aula e istruttore, prenotabili dal portale allievi.|Gestione slot esame::Le date d'esame arrivano, vengono assegnate agli allievi idonei e la notifica esce automaticamente.|Calendario istruttori::Ogni istruttore vede la sua settimana, con sostituzioni e assenze gestite nel sistema invece che al telefono.",
  "sol.autoscuola.excludes":
    "L'integrazione Patente Camilleri per le prenotazioni esami teoria, che resta separata|Le effettive lezioni di guida, che sono il tuo lavoro",
  "sol.autoscuola.phases":
    "Corsi e regole::1-2 settimane::Il catalogo corsi, i prezzi, la struttura delle lezioni e i requisiti d'esame.|Costruzione::5-7 settimane::Iscrizione, tracciamento lezioni e calendario istruttori.|Portale e notifiche::2 settimane::La vista allievi, le notifiche esame e i promemoria pagamento.",
  "sol.autoscuola.integra":
    "Stripe o PayPal per i pagamenti|Google Calendar per i calendari istruttori|WhatsApp per le notifiche agli allievi|Il tuo software contabile|Email per gli annunci d'esame",
  "sol.autoscuola.faq":
    "Gli allievi possono prenotare le guide da soli?::Sì, dagli slot disponibili sul calendario dello istruttore. L'ufficio smette di essere centralino per la programmazione.|E le rate?::Il sistema traccia cosa è stato pagato e cosa è dovuto, e manda promemoria prima della data. Niente più inseguimenti al telefono.|Gestisce diverse categorie di patente?::Sì. Ogni categoria ha il suo percorso, il suo conteggio ore e il suo prezzo.",
  "sol.autoscuola.change":
    "Gli allievi si iscrivono e pagano dal telefono. Le ore di guida sono sempre note, gli slot esame arrivano agli allievi giusti automaticamente, e il telefono dell'ufficio smette di squillare per cose che il portale risponde già.",
  "sol.autoscuola.time":
    "Da 6 a 9 settimane, a seconda di quante categorie di corso e se il sistema di pagamento va configurato.",

  // ══ 24 · Amministrazione condomini ════════════════════════════════════
  "sol.condominio.title": "Amministrazione condominiale e tracciamento pagamenti",
  "sol.condominio.lede":
    "Quote, verbali e richieste di manutenzione in un posto solo. L'amministratore smette di chiamare per i pagamenti e il proprietario smette di chiedere quando arriva l'ascensore.",
  "sol.condominio.problem":
    "I promemoria delle quote vanno per lettera e arrivano in ritardo perché qualcuno li stampa il giovedì. I proprietari chiedono il saldo e l'amministratore lo ricostruisce da un registro, e i contributi speciali per riparazioni urgenti si perdono tra la riunione e la fattura. Nessuno sa cosa è stato pagato fino alla riconciliazione trimestrale.",
  "sol.condominio.signals":
    "I promemoria delle quote vengono stampati e spediti a mano|I proprietari chiedono il saldo e l'amministratore lo ricostruisce da un registro|I contributi speciali si perdono tra la riunione e la fattura|Nessuno sa cosa è stato pagato fino alla riconciliazione trimestrale",
  "sol.condominio.build":
    "Promemoria quote automatici::Il sistema invia il promemoria prima della scadenza, via email o messaggio, e traccia chi ha pagato.|Portale proprietari::Ogni proprietario vede il suo saldo, lo storico pagamenti e gli annunci dell'edificio senza telefonare in amministrazione.|Verbali e delibere::I verbali vengono redatti da un modello, approvati digitalmente e archiviati con le delibere e il conteggio voti.|Richieste di manutenzione::I proprietari segnalano problemi dal portale, l'amministratore li assegna e lo stato è visibile a tutti.|Registro spese::Ogni spesa è categorizzata e visibile per edificio, per anno, con il saldo in tempo reale.",
  "sol.condominio.excludes":
    "Lavoro legale e contenziosi, che restano dall'avvocato dell'amministratore|Posta cartacea ai proprietari non raggiungibili digitalmente, che resta una tua responsabilità",
  "sol.condominio.phases":
    "Edifici e regole::1-2 settimane::Gli edifici in gestione, la struttura delle quote e le regole di pagamento.|Costruzione::5-7 settimane::Tracciamento quote, portale proprietari e flusso richieste manutenzione.|Verbali e registro::2-3 settimane::Il modello verbali e il registro spese.",
  "sol.condominio.integra":
    "SEPA per i domiciliazioni|Il tuo software contabile|WhatsApp per le notifiche ai proprietari|Google Calendar per le date delle riunioni|Email per promemoria e annunci",
  "sol.condominio.faq":
    "Gestisce edifici con strutture di quote diverse?::Sì. Ogni edificio ha le sue regole, il suo registro e la sua lista proprietari.|E i proprietari che vogliono ancora la carta?::Il sistema invia digitalmente per impostazione predefinita. La carta resta possibile per singoli proprietari, stampata dagli stessi dati.|Gestisce contributi speciali per lavori straordinari?::Sì. La delibera viene registrata, il contributo viene calcolato per lotto e il tracciamento pagamento parte.",
  "sol.condominio.change":
    "I proprietari pagano in tempo perché il promemoria li raggiunge prima della scadenza. L'amministratore vede il saldo di ogni edificio senza aprire un registro. E i contributi speciali smettono di perdersi tra la sala riunioni e la posta.",
  "sol.condominio.time":
    "Da 6 a 9 settimane, a seconda del numero di edifici e se le domiciliazioni vanno configurate.",

  // ══ 25 · Gestione ordini manifattura ══════════════════════════════════
  "sol.ordini.title": "Gestione ordini multicanale per manifattura",
  "sol.ordini.lede":
    "Ordini da email, telefono, e-commerce e portale diventano lo stesso formato, passano tra i reparti con uno stato e generano i documenti giusti al momento giusto.",
  "sol.ordini.problem":
    "Gli ordini arrivano via email, telefono, e-commerce e portale, ognuno con un formato diverso. Le vendite non sanno quando spedisce il magazzino, il magazzino non sa cosa hanno promesso le vendite, e il piano produzione viene ricostruito ogni mattina a memoria. I tempi di consegna restano senza misura perché nessuno vede l'intero percorso.",
  "sol.ordini.signals":
    "Gli ordini arrivano in formati diversi da canali diversi|Le vendite non sanno quando spedisce il magazzino|Il piano produzione si ricostruisce ogni mattina a memoria|I tempi di consegna restano senza misura perché nessuno vede l'intero percorso",
  "sol.ordini.build":
    "Un unico ingresso::Un ordine da qualsiasi fonte diventa lo stesso formato, con gli stessi campi, nello stesso sistema.|Flusso di stato::L'ordine passa da ricevuto a confermato, in lavorazione, pronto e spedito, e tutti vedono dove è.|Documenti automatici::Conferma, DDT e fattura si generano al momento giusto dai dati dell'ordine.|Visibilità produzione::Chi produce vede cosa fare e quando, senza la riunione della mattina per ricostruire il programma.|Tracciamento dei tempi::Tempo medio da ordine a spedizione, per prodotto e per canale, misurato senza che nessuno compili un foglio.",
  "sol.ordini.excludes":
    "Pianificazione produzione e MRP, che è un sistema separato|Gestione magazzino, che è la soluzione magazzino",
  "sol.ordini.phases":
    "Canali e struttura ordini::1-2 settimane::Quali canali portano ordini, cosa contengono e quali sono le fasi.|Costruzione::5-7 settimane::Ingresso ordini, flusso di stato e generazione documenti.|Tracciamento e report::2 settimane::Misurazione tempi e report per canale e prodotto.",
  "sol.ordini.integra":
    "Il tuo e-commerce (WooCommerce, Shopify)|Email e telefono per ordini|Il tuo software contabile|WhatsApp per conferme ordine|Google Calendar per le date di consegna",
  "sol.ordini.faq":
    "E se gli ordini arrivano senza dati strutturati?::Chi risponde al telefono compila lo stesso modulo che usa l'e-commerce. Un ingresso, un formato, indipendentemente da dove parte.|Posso impostare target di tempo diversi per prodotto?::Sì. Ogni prodotto o categoria può avere il suo obiettivo, e il sistema segnala quando è a rischio.|Sostituisce l'ERP?::Se hai uno che gestisce gli ordini bene, questo potrebbe non servire. Conviene quando gli ordini arrivano da troppi canali e l'ERP non li vede tutti.",
  "sol.ordini.change":
    "Ogni ordine, indipendentemente da dove è partito, segue lo stesso percorso e produce i documenti giusti. Vendite e magazzino vedono lo stesso stato. E i tempi di consegna smettono di essere una stima perché i numeri sono misurati.",
  "sol.ordini.time":
    "Da 6 a 9 settimane, a seconda di quanti canali vanno collegati.",

  // ══ 26 · Gestione magazzino ══════════════════════════════════════════
  "sol.magazzino.title": "Gestione magazzino con picking a barcode",
  "sol.magazzino.lede":
    "Ubicazioni, barcode e regole di rotazione in un sistema solo. Il prelievo smette di andare a memoria, e il magazzino e il gestionale dicono lo stesso numero.",
  "sol.magazzino.problem":
    "Il picking si fa a memoria o da un elenco stampato, e gli errori si scoprono alla spedizione, a casa del cliente sbagliato. I lotti si cercano a mano, le scadenze restano invisibili fino a quando qualcosa va male sugli scaffali, e l'inventario diventa un lavoro da weekend che nessuno vuole. Quello che il magazzino ha e quello che dice il gestionale non coincidono quasi mai.",
  "sol.magazzino.signals":
    "Gli errori di prelievo si scoprono quando il pacco è già dal cliente|I lotti si cercano a mano e le scadenze restano invisibili|L'inventario diventa un lavoro da weekend|Quello che il magazzino ha e quello che dice il gestionale non coincidono",
  "sol.magazzino.build":
    "Ubicazioni a più livelli::Scaffali, corsie e posizioni con barcode. Il prelevatore scansiona e sa esattamente dove sta il lotto.|Picking guidato da barcode::Il sistema dice al prelevatore dove andare e cosa prendere, e lo scanner conferma il pezzo giusto prima che parta quello sbagliato.|Rotazione FIFO o FEFO::Il sistema impone la regola di rotazione che scegli, così il lotto più vecchio esce per primo senza che nessuno debba ricordarlo.|Giacenza in tempo reale::Ogni movimento aggiorna il conteggio immediatamente. Quello che il magazzino ha e quello che dice il sistema sono lo stesso numero.|Inventario programmato::Il conteggio gira per zona su un calendario rotativo, così il lavoro da weekend sparisce.",
  "sol.magazzino.excludes":
    "Muletti e arredi, che scegli con il tuo installatore|Il gestionale stesso, che questa soluzione collega",
  "sol.magazzino.phases":
    "Layout e ubicazioni::1-2 settimane::La mappa del magazzino, la struttura delle ubicazioni e lo schema barcode.|Costruzione e scansionamento::4-6 settimane::Ubicazioni, flusso picking e scansionamento barcode. Avviato in parallelo al metodo vecchio.|Rotazione e report::2-3 settimane::Regole FIFO o FEFO, programmazione inventario e report di scostamento giacenze.",
  "sol.magazzino.integra":
    "Il tuo gestionale o ERP|Scanner barcode (Zebra, Honeywell)|WooCommerce o Shopify, se vendi online|Il tuo software contabile|Stampanti etichette per ubicazioni e codici lotto",
  "sol.magazzino.faq":
    "Devo comprare scanner barcode?::Per la prima versione basta la fotocamera del telefono. Gli scanner dedicati rendono più veloce, e li aggiungi quando il flusso lo giustifica.|E se i prodotti non hanno ancora i barcode?::Li generi. Il sistema crea codici lotto e etichette ubicazioni, e il magazzino viene barcodato dal primo giorno.|Posso iniziare con una zona ed estendere?::Sì. Di solito è l'approccio giusto: una zona prova il flusso, le altre seguono sulla stessa logica.",
  "sol.magazzino.change":
    "Il prelevatore scansiona e va allo scaffali giusto. Le scadenze sono visibili prima che diventino una perdita. E il numero sullo schermo corrisponde al numero sugli scaffali.",
  "sol.magazzino.time":
    "Da 5 a 9 settimane, a seconda della dimensione del magazzino e con quante zone inizi.",

  // ══ 27 · Back office agricolo ═════════════════════════════════════════
  "sol.agricolo.title": "Back office per aziende agricole e operazioni agricole",
  "sol.agricolo.lede":
    "Registri di campo, tracciamento raccolto e vendite in un posto solo. I dati che l'agrumazione chiede sono già lì, e la vendita al ristorant^ vicino è inserita nello stesso sistema del banale venduto al distributore.",
  "sol.agricolo.problem":
    "Le operazioni di campo si registrano su un quaderno cartaceo che non soddisfa nessuno. Le rese del raccolto si conoscono dal peso alla consegna ma non per campo, così la coltura più redditizia è una supposizione. La documentazione per i contributi richiede una settimana per essere ricostruita da fogli sparsi, e le vendite dirette non vengono registrate fino a quando il commercialista chiede a fine anno.",
  "sol.agricolo.signals":
    "Le operazioni di campo si registrano su un quaderno cartaceo|Le rese del raccolto si conoscono dal peso alla consegna, non per campo|La documentazione contributi richiede una settimana per essere ricostruita|Le vendite dirette non vengono registrate fino a quando il commercialista chiede",
  "sol.agricolo.build":
    "Registro campo::Ogni operazione per campo, per data: semina, trattamenti, raccolte. I dati che l'agrumazione chiede sono già strutturati.|Tracciamento rese::Peso del raccolto legato a campo e lotto, così sai quale terra guadagna e quale costa.|Registro vendite dirette::Vendite al ristorante, al mercato e in fattoria inserite nello stesso sistema, con i documenti giusti generati.|Tracciamento spese::Input, manodopera e carburante allocati per campo, così il costo reale per ettaro è un report, non una stima.|Esportazione contributi::La documentazione formattata come la richiede l'agenzia, generata dai dati che hai già.",
  "sol.agricolo.excludes":
    "Pianificazione colturale e consulenza agronomica, che resta dal tuo consulente|L'effettivo lavoro di campo, che è il tuo lavoro",
  "sol.agricolo.phases":
    "Campi e operazioni::1-2 settimane::L'inventario campi, i tipi di operazione e la struttura dei dati.|Costruzione::4-5 settimane::Registro campo, tracciamento rese e vendite dirette.|Contributi e report::1-2 settimane::L'esportazione documenti e il report costo per ettaro.",
  "sol.agricolo.integra":
    "Il tuo software contabile|WhatsApp per conferme vendita diretta|Google Calendar per programmazione operazioni|Email per corrispondenza contributi|Excel, se i dati rese vivono lì adesso",
  "sol.agricolo.faq":
    "Posso inserire i dati dal campo col telefono?::Sì. I moduli funzionano offline e si sincronizzano quando torna la connessione. Un campo non ha bisogno del wifi.|Gestisce colture diverse sullo stesso campo?::Sì. Ogni operazione è legata al campo e alla coltura, così le rotazioni e le colture miste sono entrambe coperte.|Conviene per una piccola azienda?::Sotto cinque ettari il quaderno cartaceo funziona ancora e te lo dico. Conviene quando la documentazione contributi diventa una settimana di ricostruzione o quando le vendite dirette crescono oltre un pugno.",
  "sol.agricolo.change":
    "Il fascicolo contributi si assembla dai dati che hai già inserito. Il raccolto ti dice quale campo guadagna e quale costa. E le vendite dirette vengono registrate nel momento in cui succedono, non a fine anno.",
  "sol.agricolo.time":
    "Da 4 a 6 settimane, a seconda di quanti campi e tipi di operazione.",

  // ══ 28 · Gestione cantina ════════════════════════════════════════════
  "sol.cantina.title": "Gestionale per cantine e produttori di vino",
  "sol.cantina.lede":
    "Annate, operazioni di cantina e vendite in un sistema solo. La bottiglia che lascia lo scaffale conosce il suo lotto, il suo vigneto e la sua storia, e il distributore ha tutto quello che serve prima di chiedere.",
  "sol.cantina.problem":
    "La cantina funziona con registri cartacei e la memoria di chi ci lavora da più tempo. Il tracciamento lotti si fa quando un richiamo lo impone, non prima. La carta dei vini per l'enoteca è un documento diverso dal listino per il distributore, e i due si scostano. Le vendite dirette in fattoria non vengono registrate fino a fine trimestre.",
  "sol.cantina.signals":
    "Le operazioni di cantina funzionano con registri cartacei|Il tracciamento lotti avviene solo quando un richiamo lo impone|La carta dell'enoteca e il listino distributore si scostano|Le vendite dirette in fattoria non vengono registrate fino a fine trimestre",
  "sol.cantina.build":
    "Tracciamento annata e lotto::Ogni imbottigliamento legato al vigneto, all'annata e al lotto, così un richiamo è una ricerca, non una ricostruzione.|Operazioni di cantina::Fermentazione, travaso, assemblaggio e invecchiamento tracciati per lotto con date e note.|Listino unico::L'enoteca, il distributore e l'e-commerce leggono dagli stessi dati, ognuno con la sua vista.|Inserimento vendite dirette::Vendite in fattoria inserite dal telefono al momento della vendita, con i documenti giusti.|Area distributore::Catalogo e listino riservati dietro accesso, così il compratore ha tutto prima della prima email.",
  "sol.cantina.excludes":
    "E-commerce con pagamento e spedizione, che è un progetto a parte|Consulenza agronomica e gestione del vigneto, che resta dal tuo consulente",
  "sol.cantina.phases":
    "Annate e lotti::1-2 settimane::L'inventario annate, la struttura lotti e i tipi di operazione di cantina.|Costruzione::5-7 settimane::Tracciamento lotti, operazioni di cantina e listino unico.|Distributore e vendite::2-3 settimane::L'area distributore e l'inserimento vendite dirette.",
  "sol.cantina.integra":
    "Il tuo software contabile|WhatsApp per conferme ordine|Google Calendar per le operazioni di cantina|Email per corrispondenza distributori|Il tuo sito, se esiste",
  "sol.cantina.faq":
    "Gestisce formati ed etichette diverse?::Sì. Ogni lotto conosce le sue bottiglie, etichette e formati, così lo stesso vino in tre etichette è tre voci da un lotto.|Posso tracciare per vigneto?::Sì. Il lotto porta il vigneto, così sai quale terra produce quale vino.|Conviene per una cantina piccola?::Sotto mille bottiglie il registro cartaceo funziona. Conviene quando il tracciamento lotti diventa un requisito normativo o quando le vendite dirette crescono oltre un pugno di clienti.",
  "sol.cantina.change":
    "Una bottiglia che lascia lo scaffale conosce dove è stata coltivata e quando è stata imbottigliata. L'enoteca e il distributore vedono lo stesso listino. E le vendite dirette smettono di essere un mistero che il commercialista risolve a fine anno.",
  "sol.cantina.time":
    "Da 6 a 9 settimane, a seconda del numero di annate e formati.",

  // ══ 29 · Gestione scuola ═════════════════════════════════════════════
  "sol.scuola.title": "Gestionale per scuole e centri di formazione",
  "sol.scuola.lede":
    "Iscrizioni, presenze, voti e tracciamento quote in un posto solo. La segreteria smette di barcamenarsi con Excel e WhatsApp, e i genitori vedono quello che serve senza chiamare.",
  "sol.scuola.problem":
    "Le iscrizioni arrivano per telefono e email, ognuna gestita in modo diverso. Le presenze si segnano su un foglio e il supplente viene trovato da una catena di messaggi WhatsApp. Le quote scadono senza avviso e la segreteria passa il lunedì mattina a chiamare per i pagamenti. Le circolari escono via email senza conferma di lettura, così la scuola non sa chi le ha viste.",
  "sol.scuola.signals":
    "Le iscrizioni arrivano per telefono e email, ognuna gestita in modo diverso|Le presenze si segnano su un foglio e i supplenti si trovano da catena WhatsApp|Le quote scadono senza avviso e la segreteria chiama per i pagamenti|Le circolari escono via email senza conferma di lettura",
  "sol.scuola.build":
    "Iscrizione online::Il genitore compila il modulo, carica i documenti e paga la prima rata, senza telefonare in segreteria.|Registro presenze::Digitale, per classe e per giorno, con una lista di supplenti che riempie il vuoto in una tap.|Tracciamento quote::Date di scadenza, promemoria e stato pagamento visibili in un colpo d'occhio. Le quote scadute si sollecitano da sole.|Portale genitori::Voti, presenze, circolari e stato quote, tutto in un posto solo. Il telefono della segreteria si calma.|Distribuzione circolari::Le circolari escono con conferma di lettura, e la scuola vede chi le ha lette e chi no.",
  "sol.scuola.excludes":
    "La piattaforma di e-learning per corsi online, che è software separato|L'effettivo insegnamento, che è il tuo lavoro",
  "sol.scuola.phases":
    "Corsi e regole::1-2 settimane::Il catalogo corsi, la struttura delle quote, le regole di presenza e i campi del portale genitori.|Costruzione::5-7 settimane::Iscrizione, presenze, voti e tracciamento quote.|Portale e notifiche::2-3 settimane::Il portale genitori, la distribuzione circolari e i promemoria quote.",
  "sol.scuola.integra":
    "Stripe o PayPal per i pagamenti|WhatsApp per notifiche urgenti|Email per le circolari|Google Calendar per eventi scolastici|Il tuo software contabile",
  "sol.scuola.faq":
    "I genitori vedono solo i dati del proprio figlio?::Sì. Ogni genitore vede voti, presenze e quote del proprio figlio. Nessun genitore vede quelli degli altri.|E gli insegnanti che non vogliono usare un'app?::Le presenze possono essere inserite dalla segreteria dallo stesso sistema. L'insegnante non deve cambiare le sue abitudini.|Gestisce scadenze diverse per corso?::Sì. Ogni corso o percorso ha la sua struttura costi e la sua tempistica di pagamento.",
  "sol.scuola.change":
    "Le quote arrivano in tempo perché il promemoria raggiunge il genitore prima della scadenza. Le circolari hanno conferma di lettura. E la segreteria passa il lunedì mattina su lavoro che conta invece di inseguire pagamenti al telefono.",
  "sol.scuola.time":
    "Da 6 a 9 settimane, a seconda di quanti corsi e se il sistema di pagamento va configurato.",
};
