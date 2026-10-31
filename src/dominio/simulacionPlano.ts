// Simulación sobre el plano: con qué protecciones y llaves prende cada luz y qué tramos tienen
// tensión. El plano es unifilar (cada tramo es una cañería), así que acá no hay errores de
// cableado: eso se practica en el conexionado.

import { TABLERO, type CircuitoPlano, type Tramo } from './circuitosPlano'
import { esLlave, type Elemento } from './plano'

export interface EstadoInstalacion {
  /** Diferencial cerrado */
  diferencial: boolean
  /** Circuitos con el PIA bajado */
  apagados: Set<string>
  /** Llaves cerradas (prendidas) */
  llaves: Set<string>
}

export interface ResultadoPlano {
  tramosConTension: Set<string>
  bocasPrendidas: Set<string>
}

export function simularPlano(
  elementos: Elemento[],
  circuitos: CircuitoPlano[],
  tramos: Tramo[],
  estado: EstadoInstalacion,
): ResultadoPlano {
  const tramosConTension = new Set<string>()
  const bocasPrendidas = new Set<string>()
  if (!estado.diferencial) return { tramosConTension, bocasPrendidas }

  const porId = new Map(elementos.map((e) => [e.id, e]))
  for (const c of circuitos) {
    if (estado.apagados.has(c.id)) continue
    const propios = tramos.filter((t) => t.circuito === c.id)

    // Desde el tablero, por los tramos del circuito: todas las cajas que alcanza tienen tensión
    const conTension = new Set([TABLERO])
    let crecio = true
    while (crecio) {
      crecio = false
      for (const t of propios) {
        const [a, b] = [conTension.has(t.desde), conTension.has(t.hasta)]
        if (a !== b) {
          conTension.add(a ? t.hasta : t.desde)
          crecio = true
        }
        if (a || b) tramosConTension.add(t.id)
      }
    }

    // Una luz prende si tiene tensión y alguna de sus llaves de un punto está cerrada, o si sus
    // combinaciones están en posiciones distintas (con una sola, funciona como llave común)
    for (const id of conTension) {
      const boca = porId.get(id)
      if (boca?.clase !== 'boca') continue
      const llaves = propios
        .filter((t) => t.desde === id || t.hasta === id)
        .map((t) => porId.get(t.desde === id ? t.hasta : t.desde))
        .filter(esLlave)
      const unPunto = llaves.filter((l) => l!.clase === 'llave')
      const combinaciones = llaves.filter((l) => l!.clase === 'combinacion')
      const cambiadas = combinaciones.filter((l) => estado.llaves.has(l!.id)).length
      if (unPunto.some((l) => estado.llaves.has(l!.id)) || cambiadas % 2 === 1)
        bocasPrendidas.add(id)
    }
  }
  return { tramosConTension, bocasPrendidas }
}
