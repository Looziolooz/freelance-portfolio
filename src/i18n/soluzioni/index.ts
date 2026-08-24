// Il copy del catalogo /soluzioni, una lingua per file.
//
// Sta fuori da i18n/index.ts perche' da solo porta piu' di seicento chiavi, e
// una lingua per file perche' quando si riscrive una scheda si riscrive tutta
// la scheda: averla spezzata in tre file per blocco (titoli qui, FAQ la')
// costringerebbe a tenere allineate tre finestre per cambiare una frase.
export { solIt } from "./it";
export { solEn } from "./en";
export { solSv } from "./sv";
