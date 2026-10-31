import type { ClaseElemento } from '@/dominio/plano'

export type ClaseSimbolo = ClaseElemento | 'tablero'

/** Lado del cuadrado que ocupa cada símbolo, en cm */
export const TAMANO_SIMBOLO: Record<ClaseSimbolo, number> = {
  boca: 40,
  llave: 28,
  toma: 36,
  tablero: 48,
}

/** Como en los planos del curso: iluminación en rojo punteado y tomas en azul lleno. */
export const ESTILO_CIRCUITO = {
  IUG: { stroke: '#dc2626', strokeDasharray: '12 8' },
  TUG: { stroke: '#2563eb' },
} as const
