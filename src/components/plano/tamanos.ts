import type { ClaseElemento } from '@/dominio/plano'

export type ClaseSimbolo = ClaseElemento | 'tablero'

/** Lado del cuadrado que ocupa cada símbolo, en cm */
export const TAMANO_SIMBOLO: Record<ClaseSimbolo, number> = {
  boca: 40,
  llave: 28,
  toma: 36,
  tablero: 48,
}
