// Registro central de documentos citados. Cada cita apunta a un PDF público abierto
// en la página correspondiente (#page=N) cuando existe uno.

interface Documento {
  titulo: string
  /** PDF público. `null` si no hay una copia abierta online. */
  url: string | null
  nota?: string
}

export const DOCUMENTOS = {
  aea770: {
    titulo: 'AEA 90364-7-770:2017',
    url: 'https://www.junin.gob.ar/sites/default/files/programas/archivos/reglamento_aea.pdf',
    nota: 'Copia publicada por la Municipalidad de Junín',
  },
  programaUTN: {
    titulo: 'Programa del curso Electricista Habilitado Cat. III, UTN FRC 2025',
    url: 'https://portalseu.frc.utn.edu.ar/wp-content/uploads/2024/02/Programa-Curso-Electricista-Habilitado-Cat-III-UTN-2025.pdf',
  },
  carpetaERSeP: {
    titulo: 'ERSeP, Carpeta Técnica Modelo del Certificado de Instalación Eléctrica Apta',
    url: 'https://ersep.cba.gov.ar/wp-content/uploads/2022/05/Carpeta_Tecnica_Modelo.pdf',
  },
  manualCat3: {
    titulo: 'Manual del Instalador Electricista Cat. III (ERSeP, 2.ª ed.)',
    url: null,
    nota: 'Sin copia pública online',
  },
  iec60898: {
    titulo: 'IEC 60898-1',
    url: null,
    nota: 'Norma paga, sin copia pública',
  },
  teoria: {
    titulo: 'Teoría de circuitos',
    url: null,
  },
} satisfies Record<string, Documento>

export type IdDocumento = keyof typeof DOCUMENTOS

export interface Referencia {
  doc: IdDocumento
  /** Cláusula, tabla o sección citada */
  seccion?: string
  /** Página del PDF (para abrirlo en esa página) */
  pagina?: number
}

/**
 * Página del PDF de la AEA 770 (copia de Junín) donde está cada cláusula o tabla.
 * Relevado del PDF; si se cambia la URL de la copia hay que revisarlas.
 */
const PAGINAS_AEA770: Record<string, number> = {
  '770.3.2': 14,
  'Tabla 770.3.I': 15,
  '770.6.1': 18,
  'Tabla 770.6.I': 19,
  '770.7.1 m)': 20,
  '770.7.2': 21,
  '770.7.3': 21,
  'Tabla 770.7.I': 22,
  '770.7.5': 23,
  'Tabla 770.7.III': 24,
  'Tabla 770.8.I': 25,
  'Tabla 770.8.II': 25,
  '770.8.3.1': 26,
  '770.10.2': 28,
  '770.10.3.1': 28,
  '770.10.3.8.4': 38,
  'Tabla 770.10.VII': 39,
  'Tabla 770.10.VIII': 40,
  'Tabla 770.10.IX': 41,
  'Tabla 770.10.X': 42,
  '770.10.3.8.5': 42,
  'Tabla 770.10.XIII': 42,
  '770.10.4.2.1': 43,
  'Tabla 770.11.I': 44,
  'Tabla 770.12.I': 46,
  'Tabla 770.12.II': 47,
  '770.13.3': 49,
  '770.14.2.3': 51,
  '770.14.3.2': 52,
  '770.14.4.1': 53,
  'Tabla 770.14.I': 53,
  '770.14.4.2': 53,
  '770.14.4.3': 53,
  '770.14.4.5': 54,
  '770.14.4.6': 54,
  '770.15.2.1': 55,
  '770.15.2.2.2': 55,
  '770.15.2.2.5': 56,
  '770.15.6': 58,
  'Tabla 770.15.III': 58,
  '770.15.5': 58,
  'Tabla 770.15.IV': 59,
  '770.16.1': 59,
  '770.16.2': 60,
  '770.16.3.1': 60,
  '770.16.4': 61,
  '770.16.5.1': 63,
  '770.16.5.2': 63,
  '770.16.5.3': 64,
  '770.16.5.4': 64,
  '770.17': 65,
  '770.19.5.2': 67,
  'Tabla 770.19.I': 68,
  '770.19.5.3': 68,
}

/** Página del programa UTN donde está cada unidad. */
const PAGINAS_PROGRAMA_UTN: Record<number, number> = {
  1: 1,
  2: 2,
  3: 2,
  4: 3,
  5: 3,
  6: 3,
  7: 4,
  8: 4,
  9: 4,
  10: 5,
  11: 5,
  12: 6,
  13: 7,
  14: 7,
}

/** Cita de la AEA 770; la página se resuelve sola. */
export function aea(seccion: string): Referencia {
  return { doc: 'aea770', seccion, pagina: PAGINAS_AEA770[seccion] }
}

/** Cita de una unidad del programa UTN. */
export function programaUTN(unidad: number): Referencia {
  return { doc: 'programaUTN', seccion: `unidad ${unidad}`, pagina: PAGINAS_PROGRAMA_UTN[unidad] }
}

/** Cita del manual del ERSeP (sin copia pública). */
export function manual(seccion: string): Referencia {
  return { doc: 'manualCat3', seccion }
}

export function carpetaERSeP(seccion?: string): Referencia {
  return { doc: 'carpetaERSeP', seccion }
}

export function teoria(seccion?: string): Referencia {
  return { doc: 'teoria', seccion }
}

export function iec60898(seccion?: string): Referencia {
  return { doc: 'iec60898', seccion }
}

export function urlReferencia(referencia: Referencia): string | null {
  const { url } = DOCUMENTOS[referencia.doc]
  if (!url) return null
  return referencia.pagina ? `${url}#page=${referencia.pagina}` : url
}

export function textoReferencia(referencia: Referencia): string {
  const { titulo } = DOCUMENTOS[referencia.doc]
  const partes = [titulo, referencia.seccion, referencia.pagina && `pág. ${referencia.pagina}`]
  return partes.filter(Boolean).join(', ')
}

export function notaDocumento(referencia: Referencia): string | undefined {
  return (DOCUMENTOS[referencia.doc] as Documento).nota
}
