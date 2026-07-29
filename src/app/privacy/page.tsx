"use client";

import LegalPage from "@/components/LegalPage";

// Informativa privacy — MODELLO da personalizzare e far verificare da un legale.
// I campi tra [parentesi] vanno compilati (titolare, P.IVA, periodi di conservazione).
export default function PrivacyPage() {
  return (
    <LegalPage title="Informativa sulla privacy" updated="Ultimo aggiornamento: [DATA]">
      <div className="legal-note">
        <strong>Nota:</strong> questo è un modello di base fornito a scopo informativo, <strong>non è un
        parere legale</strong>. Personalizza i campi tra [parentesi] e fallo verificare da un professionista
        prima di pubblicarlo. Disponibile anche in EN/SV su richiesta.
      </div>

      <h2>1. Titolare del trattamento</h2>
      <p>
        Il titolare del trattamento dei dati è [NOME / RAGIONE SOCIALE], [INDIRIZZO], P.IVA [PARTITA IVA].
        Per qualsiasi richiesta puoi scrivere a <a href="mailto:hello@lorenzo.studio">hello@lorenzo.studio</a>.
      </p>

      <h2>2. Quali dati raccolgo</h2>
      <ul>
        <li><strong>Dati che invii tu</strong> tramite i moduli (audit gratuito, contatti, prenotazione call): nome, email, indirizzo del sito, messaggio.</li>
        <li><strong>Messaggi all'assistente AI</strong>: il testo che scrivi nella chat, per generare una risposta.</li>
        <li><strong>Statistiche anonime</strong> (solo con il tuo consenso): pagine viste in forma aggregata, senza cookie e senza dati che ti identificano.</li>
      </ul>
      <p>Non raccolgo categorie particolari di dati (art. 9 GDPR) e non svolgo profilazione o pubblicità comportamentale.</p>

      <h2>3. Finalità e basi giuridiche</h2>
      <ul>
        <li><strong>Rispondere alle tue richieste e preventivi</strong> → misure precontrattuali / esecuzione di un contratto (art. 6.1.b GDPR).</li>
        <li><strong>Assistente AI</strong> → dare seguito alla tua domanda su tua richiesta (art. 6.1.b) e legittimo interesse a fornire assistenza (art. 6.1.f).</li>
        <li><strong>Statistiche anonime</strong> → tuo consenso (art. 6.1.a), che puoi revocare in ogni momento.</li>
      </ul>

      <h2>4. Destinatari e responsabili del trattamento</h2>
      <p>I dati possono essere trattati, per mio conto e come responsabili, dai fornitori dei servizi che utilizzo:</p>
      <ul>
        <li><strong>Web3Forms</strong> — recapito dei moduli via email (con sede negli USA).</li>
        <li><strong>Vercel</strong> — hosting del sito e statistiche anonime (USA / UE).</li>
        <li><strong>Groq</strong> — elaborazione delle domande poste all'assistente AI (USA).</li>
        <li><strong>Stripe</strong> — gestione dei pagamenti, se attivati (USA / UE).</li>
      </ul>
      <p>Non vendo né cedo i tuoi dati a terzi per finalità di marketing.</p>

      <h2>5. Trasferimenti fuori dall'Unione Europea</h2>
      <p>
        Alcuni fornitori hanno sede fuori dallo Spazio Economico Europeo. In tal caso il trasferimento
        avviene sulla base di garanzie adeguate previste dal GDPR (ad es. Clausole Contrattuali Standard
        o decisioni di adeguatezza). [Verifica le condizioni di ciascun fornitore.]
      </p>

      <h2>6. Conservazione dei dati</h2>
      <p>
        Conservo i dati per il tempo necessario a gestire la tua richiesta e ad adempiere agli obblighi di
        legge, poi li cancello o li rendo anonimi. [Definisci i periodi di conservazione.]
      </p>

      <h2>7. I tuoi diritti</h2>
      <p>
        Hai diritto di accesso, rettifica, cancellazione, limitazione, opposizione e portabilità dei dati,
        e di revocare in ogni momento il consenso prestato. Per esercitarli scrivi a
        {" "}<a href="mailto:hello@lorenzo.studio">hello@lorenzo.studio</a>. Puoi inoltre proporre reclamo
        all'autorità di controllo competente (in Italia, il Garante per la protezione dei dati personali).
      </p>

      <h2>8. Assistente AI — trasparenza (Regolamento UE sull'IA)</h2>
      <p>
        L'assistente presente sul sito è un sistema di intelligenza artificiale. <strong>Quando lo usi stai
        interagendo con un'AI, non con una persona.</strong> Le risposte sono generate automaticamente,
        possono contenere imprecisioni e <strong>non costituiscono consulenza legale, medica, fiscale o
        finanziaria</strong>. Ti invito a non inserire in chat dati personali sensibili.
      </p>

      <h2>9. Cookie</h2>
      <p>
        Il sito utilizza solo storage tecnico necessario e, previo consenso, statistiche anonime senza
        cookie di profilazione. Trovi i dettagli nella <a href="/cookie">Cookie Policy</a>.
      </p>

      <h2>10. Modifiche a questa informativa</h2>
      <p>Posso aggiornare questa informativa nel tempo; la data in alto indica l'ultima revisione.</p>

      <h2>11. Contatti</h2>
      <p>[NOME] — <a href="mailto:hello@lorenzo.studio">hello@lorenzo.studio</a></p>
    </LegalPage>
  );
}
