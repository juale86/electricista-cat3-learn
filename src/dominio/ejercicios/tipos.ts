import type { Referencia } from '../referencias'

export type TipoEjercicio =
  | 'cuentas'
  | 'ohm'
  | 'energia'
  | 'conceptos'
  | 'corriente'
  | 'seccion'
  | 'caida'
  | 'grado'
  | 'division'

export const TIPOS_EJERCICIO: TipoEjercicio[] = [
  'cuentas',
  'ohm',
  'energia',
  'conceptos',
  'corriente',
  'seccion',
  'caida',
  'grado',
  'division',
]

export const NOMBRE_TIPO: Record<TipoEjercicio, string> = {
  cuentas: 'Cuentas rápidas',
  ohm: 'Ley de Ohm y resistencias',
  energia: 'Potencia y energía',
  conceptos: 'Preguntas de teoría',
  corriente: 'Corriente desde potencia',
  seccion: 'Sección y protección',
  caida: 'Caída de tensión',
  grado: 'Grado y demanda (DPMS)',
  division: 'División de circuitos y tablero',
}

export type Respuesta =
  | {
      clase: 'numero'
      valor: number
      unidad: string
      decimales: number
      /** Valores discretos (sección, calibre): no admiten tolerancia. */
      exacta: boolean
    }
  | { clase: 'opcion'; valor: string }

export interface Dato {
  etiqueta: string
  valor: string
}

export interface Ejercicio {
  id: string
  tipo: TipoEjercicio
  /** Tema de la guía, si el ejercicio pertenece a uno en particular */
  tema?: string
  enunciado: string
  datos: Dato[]
  respuesta: Respuesta
  /** Cuatro opciones (incluye la correcta) para el formato de opción múltiple. */
  opciones: string[]
  pasos: string[]
  atajo?: string
  /** Diferencia con el manual del curso (AEA 771:2006), si la hay. */
  nota?: string
  fuentes: Referencia[]
}
