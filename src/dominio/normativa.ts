import { aea, iec60898, type Referencia } from './referencias'

// Datos normativos usados por los cálculos. Cada bloque cita su fuente.
// Base: AEA 90364-7-770:2017 (viviendas unifamiliares). Ver docs/normativa.md.

export const TENSION_MONOFASICA = 220
export const TENSION_TRIFASICA = 380

export type GradoElectrificacion = 'minimo' | 'medio' | 'elevado' | 'superior'

export const NOMBRE_GRADO: Record<GradoElectrificacion, string> = {
  minimo: 'Mínimo',
  medio: 'Medio',
  elevado: 'Elevado',
  superior: 'Superior',
}

interface DatosGrado {
  id: GradoElectrificacion
  /** Superficie límite máxima (inclusive) en m². `null` = sin tope. */
  hastaM2: number | null
  circuitosMinimos: number
  /** Coeficiente de simultaneidad (Tabla 770.8.II). */
  coeficiente: number
}

/** AEA 770, Tabla 770.7.I y Tabla 770.8.II */
export const GRADOS: DatosGrado[] = [
  { id: 'minimo', hastaM2: 60, circuitosMinimos: 2, coeficiente: 1 },
  { id: 'medio', hastaM2: 130, circuitosMinimos: 3, coeficiente: 0.8 },
  { id: 'elevado', hastaM2: 200, circuitosMinimos: 5, coeficiente: 0.7 },
  { id: 'superior', hastaM2: null, circuitosMinimos: 6, coeficiente: 0.6 },
]

/** Valores del manual del curso (AEA 771:2006), solo para mostrar diferencias. */
export const COEFICIENTE_MANUAL_771: Record<GradoElectrificacion, number> = {
  minimo: 1,
  medio: 0.9,
  elevado: 0.8,
  superior: 0.7,
}

export type TipoCircuito = 'IUG' | 'TUG' | 'TUE'

interface DatosCircuito {
  nombre: string
  maxBocas: number
  /** Calibre máximo de la protección en A. */
  maxIn: number
  /** Sección mínima en mm². */
  seccionMinima: number
}

/** AEA 770, Tabla 770.6.I y Tabla 770.11.I */
export const CIRCUITOS: Record<TipoCircuito, DatosCircuito> = {
  IUG: { nombre: 'Iluminación de uso general', maxBocas: 15, maxIn: 16, seccionMinima: 1.5 },
  TUG: { nombre: 'Tomacorrientes de uso general', maxBocas: 15, maxIn: 20, seccionMinima: 2.5 },
  TUE: { nombre: 'Tomacorrientes de uso especial', maxBocas: 15, maxIn: 32, seccionMinima: 2.5 },
}

/** AEA 770, Tabla 770.8.I: DPMS mínima por circuito, en VA */
export const DPMS = {
  vaPorBocaIUG: 60,
  fraccionIUGSinTomas: 2 / 3,
  iugConTomas: 2200,
  tug: 2200,
  tue: 3300,
}

/** Manual del curso (AEA 771:2006): 150 VA por boca de iluminación. */
export const VA_POR_BOCA_MANUAL_771 = 150

/** Secciones comerciales en mm² */
export const SECCIONES = [1, 1.5, 2.5, 4, 6, 10, 16, 25, 35] as const

/**
 * AEA 770, Tabla 770.12.I: corriente admisible Iz en A.
 * Cables IRAM NM 247-3 en cañería (método B1), 40 °C ambiente.
 */
export const IZ_MONOFASICO: Record<number, number> = {
  1: 11,
  1.5: 15,
  2.5: 21,
  4: 28,
  6: 36,
  10: 50,
  16: 66,
  25: 88,
  35: 109,
}

export const IZ_TRIFASICO: Record<number, number> = {
  1: 10,
  1.5: 14,
  2.5: 18,
  4: 25,
  6: 32,
  10: 44,
  16: 59,
  25: 77,
  35: 96,
}

/** AEA 770, Tabla 770.12.II: factor por agrupamiento (circuitos en la misma canalización). */
export const FACTOR_AGRUPAMIENTO: Record<number, number> = { 1: 1, 2: 0.8, 3: 0.7 }

/** Calibres comerciales de PIA (IEC 60898) en A. Valores habituales, sin verificar en la 770. */
export const CALIBRES_PIA = [6, 10, 13, 16, 20, 25, 32, 40, 50, 63] as const

/**
 * AEA 770, Tabla 770.15.IV: constante c de caída de tensión en V/(A·km).
 * Monofásico, cables NM 247-3 en caño, cos φ = 0,8.
 */
export const CAIDA_C: Record<number, number> = {
  1.5: 26,
  2.5: 15,
  4: 10,
  6: 6.5,
  10: 3.8,
  16: 2.4,
  25: 1.6,
  35: 1.2,
}

/** AEA 770.15.6: caída máxima en circuitos terminales (iluminación y tomas). */
export const CAIDA_MAXIMA_PORCENTAJE = 3

/** AEA 770, Tabla 770.10.XIII: colores de los conductores. `muestra` es el color para dibujarlo. */
export const COLORES_CONDUCTORES = [
  { funcion: 'Fase L1 (R)', color: 'Castaño (marrón)', muestra: '#7b4a2a' },
  { funcion: 'Fase L2 (S)', color: 'Negro', muestra: '#1c1c1c' },
  { funcion: 'Fase L3 (T)', color: 'Rojo', muestra: '#c62828' },
  { funcion: 'Neutro (N)', color: 'Celeste', muestra: '#4fb3e8' },
  { funcion: 'Protección (PE)', color: 'Verde-amarillo', muestra: 'verde-amarillo' },
] as const

export const FUENTES = {
  colores: aea('Tabla 770.10.XIII'),
  grados: aea('Tabla 770.7.I'),
  superficieLimite: aea('770.7.3'),
  coeficientes: aea('Tabla 770.8.II'),
  dpms: aea('Tabla 770.8.I'),
  circuitos: aea('Tabla 770.6.I'),
  seccionesMinimas: aea('Tabla 770.11.I'),
  iz: aea('Tabla 770.12.I'),
  agrupamiento: aea('Tabla 770.12.II'),
  sobrecarga: aea('770.15.2.1'),
  caida: aea('770.15.6'),
  caidaTabla: aea('Tabla 770.15.IV'),
  calibres: iec60898('calibres habituales'),
} satisfies Record<string, Referencia>
