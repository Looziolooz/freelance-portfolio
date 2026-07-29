"use client";

import LegalPage from "@/components/LegalPage";

// Cookie Policy — MODELLO da personalizzare e far verificare da un legale.
export default function CookiePage() {
  return (
    <LegalPage title="Cookie Policy" updated="Ultimo aggiornamento: [DATA]">
      <div className="legal-note">
        <strong>Nota:</strong> modello informativo, <strong>non parere legale</strong>. Personalizza [DATA] e i
        dettagli e fallo verificare da un professionista. Disponibile anche in EN/SV su richiesta.
      </div>

      <p>
        Questo sito è pensato per essere il più leggero possibile sul piano della privacy: <strong>non usa
        cookie di profilazione né pubblicità comportamentale</strong>. Ecco cosa viene utilizzato.
      </p>

      <h2>1. Storage tecnico necessario</h2>
      <p>
        Salvo alcune preferenze nel tuo browser (tramite <em>localStorage</em>, non cookie) per far funzionare
        il sito: la <strong>lingua</strong> scelta, il <strong>tema chiaro/scuro</strong> e — se usi l'area
        riservata — la <strong>sessione di accesso</strong>. Sono strettamente necessari e non richiedono
        consenso.
      </p>

      <h2>2. Statistiche anonime (solo con consenso)</h2>
      <p>
        Uso <strong>Vercel Analytics</strong> per contare le visite in forma aggregata: <strong>senza cookie
        e senza dati che ti identificano</strong>. Vengono caricate <strong>solo dopo il tuo consenso</strong>
        tramite il banner. Se scegli “Solo necessari”, le statistiche non vengono attivate.
      </p>

      <h2>3. Servizi di terze parti</h2>
      <p>
        Alcuni servizi possono impostare cookie tecnici solo quando li usi attivamente: <strong>Web3Forms</strong>
        (invio dei moduli di contatto) e <strong>Stripe</strong> (pagamenti, se attivati). Non vengono usati per
        profilarti.
      </p>

      <h2>4. Come gestire il consenso</h2>
      <p>
        Puoi rifiutare le statistiche dal banner scegliendo “Solo necessari”. Per modificare la tua scelta in
        seguito, cancella i dati del sito dal tuo browser e ricarica la pagina: il banner ricomparirà. Puoi
        anche bloccare o eliminare cookie e storage dalle impostazioni del browser.
      </p>

      <h2>5. Altre informazioni</h2>
      <p>
        Per come tratto i dati che invii tramite i moduli e la chat, vedi l'<a href="/privacy">Informativa
        sulla privacy</a>.
      </p>
    </LegalPage>
  );
}
