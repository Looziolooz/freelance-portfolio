import SolutionsHub from "@/components/SolutionsHub";

// Niente Suspense e niente useSearchParams qui sotto: servivano a un hub che
// leggeva i filtri dall'URL, e il prezzo era che la griglia non finiva
// nell'HTML statico. Ora la pagina si prerenderizza intera, link compresi.
export default function Page() {
  return <SolutionsHub />;
}
