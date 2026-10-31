// Conexionado cable por cable: bornes de cada pieza, cables con color y una simulación por
// conectividad (union-find). Para saber si una lámpara prende alcanza con ver qué bornes quedan
// unidos a la fase y al neutro; no hace falta resolver tensiones ni corrientes.

import { aea, type Referencia } from './referencias'
import { COLORES_CABLE, type ColorCable } from './tablero'

export type ClasePieza = 'tablero' | 'lampara' | 'llave' | 'combinacion' | 'toma'

export const BORNES: Record<ClasePieza, readonly string[]> = {
  /** Salida del PIA del circuito y la barra de tierra */
  tablero: ['L', 'N', 'PE'],
  /** Portalámparas en la boca de techo; el PE va a la masa del artefacto */
  lampara: ['L', 'N', 'PE'],
  llave: ['1', '2'],
  /** Común y dos viajeros */
  combinacion: ['C', '1', '2'],
  toma: ['L', 'N', 'PE'],
}

export const NOMBRE_PIEZA: Record<ClasePieza, string> = {
  tablero: 'Tablero',
  lampara: 'Lámpara',
  llave: 'Llave de un punto',
  combinacion: 'Llave de combinación',
  toma: 'Tomacorriente',
}

export interface Pieza {
  id: string
  clase: ClasePieza
  nombre: string
  x: number
  y: number
}

export interface Escenario {
  id: string
  nombre: string
  consigna: string
  piezas: Pieza[]
}

/** Extremo de un cable: `pieza.borne` */
export type Extremo = `${string}.${string}`

export interface Cable {
  id: string
  desde: Extremo
  hasta: Extremo
  color: ColorCable
}

/** Llave de un punto: cerrada. Combinación: el común unido al viajero 1 (`false`) o al 2 (`true`). */
export type EstadoLlaves = Record<string, boolean>

export const ESCENARIOS: Escenario[] = [
  {
    id: 'un-punto',
    nombre: 'Luz con una llave',
    consigna:
      'Conectá la lámpara para que la prenda y la apague la llave. El artefacto es metálico (clase I), así que su masa va al PE. Usá los colores de la norma.',
    piezas: [
      { id: 'tablero', clase: 'tablero', nombre: 'Tablero (PIA C1)', x: 0, y: 260 },
      { id: 'lampara', clase: 'lampara', nombre: 'Boca de techo', x: 320, y: 0 },
      { id: 'llave', clase: 'llave', nombre: 'Llave', x: 320, y: 280 },
    ],
  },
  {
    id: 'toma',
    nombre: 'Tomacorriente',
    consigna: 'Conectá el toma: fase, neutro y protección, cada uno en su borne y con su color.',
    piezas: [
      { id: 'tablero', clase: 'tablero', nombre: 'Tablero (PIA C2)', x: 0, y: 120 },
      { id: 'toma', clase: 'toma', nombre: 'Toma', x: 320, y: 120 },
    ],
  },
  {
    id: 'combinacion',
    nombre: 'Luz con combinación',
    consigna:
      'Una luz que se prende y se apaga desde dos lugares (pasillo o escalera): cada llave tiene que cambiar el estado de la luz, sin importar cómo esté la otra. El artefacto es metálico (clase I): su masa va al PE.',
    piezas: [
      { id: 'tablero', clase: 'tablero', nombre: 'Tablero (PIA C1)', x: 0, y: 300 },
      { id: 'lampara', clase: 'lampara', nombre: 'Boca de techo', x: 330, y: 0 },
      { id: 'llave1', clase: 'combinacion', nombre: 'Combinación 1', x: 200, y: 320 },
      { id: 'llave2', clase: 'combinacion', nombre: 'Combinación 2', x: 460, y: 320 },
    ],
  },
]

export const extremo = (pieza: string, borne: string): Extremo => `${pieza}.${borne}`

const FASE = extremo('tablero', 'L')
const NEUTRO = extremo('tablero', 'N')
const TIERRA = extremo('tablero', 'PE')

class Conjuntos {
  private padre = new Map<string, string>()
  raiz(x: string): string {
    const p = this.padre.get(x) ?? x
    if (p === x) return x
    const r = this.raiz(p)
    this.padre.set(x, r)
    return r
  }
  unir(a: string, b: string) {
    this.padre.set(this.raiz(a), this.raiz(b))
  }
  juntos(a: string, b: string) {
    return this.raiz(a) === this.raiz(b)
  }
}

export type Falla = 'cortocircuito' | 'fuga'

export interface Resultado {
  /** Si hay una falla, saltó la protección y no hay tensión en ningún lado */
  falla: Falla | null
  lamparas: Map<string, boolean>
  /** Tomas con fase y neutro (en cualquier orden) */
  tomas: Map<string, boolean>
  /** Bornes unidos a la fase (para marcar los cables con tensión) */
  conFase: (e: Extremo) => boolean
  /** Bornes por donde circula corriente de vuelta: el neutro, si hay alguna lámpara prendida */
  conCorrienteDeNeutro: (e: Extremo) => boolean
}

function unirTodo(escenario: Escenario, cables: Cable[], llaves: EstadoLlaves) {
  const u = new Conjuntos()
  for (const c of cables) u.unir(c.desde, c.hasta)
  for (const p of escenario.piezas) {
    if (p.clase === 'llave' && llaves[p.id]) u.unir(extremo(p.id, '1'), extremo(p.id, '2'))
    if (p.clase === 'combinacion')
      u.unir(extremo(p.id, 'C'), extremo(p.id, llaves[p.id] ? '2' : '1'))
  }
  return u
}

export function simular(escenario: Escenario, cables: Cable[], llaves: EstadoLlaves): Resultado {
  const u = unirTodo(escenario, cables, llaves)
  // Fase con neutro: corto, salta el PIA. Fase o neutro con tierra: fuga, salta el diferencial.
  const falla: Falla | null = u.juntos(FASE, NEUTRO)
    ? 'cortocircuito'
    : u.juntos(FASE, TIERRA) || u.juntos(NEUTRO, TIERRA)
      ? 'fuga'
      : null
  const alimentado = (p: Pieza) => {
    if (falla) return false
    const l = extremo(p.id, 'L')
    const n = extremo(p.id, 'N')
    return (u.juntos(l, FASE) && u.juntos(n, NEUTRO)) || (u.juntos(l, NEUTRO) && u.juntos(n, FASE))
  }
  const de = (clase: ClasePieza) =>
    new Map(escenario.piezas.filter((p) => p.clase === clase).map((p) => [p.id, alimentado(p)]))
  return {
    falla,
    lamparas: de('lampara'),
    tomas: de('toma'),
    conFase: (e) => !falla && u.juntos(e, FASE),
    conCorrienteDeNeutro: (e) =>
      !falla &&
      u.juntos(e, NEUTRO) &&
      escenario.piezas.some((p) => p.clase === 'lampara' && alimentado(p)),
  }
}

/** Todas las posiciones posibles de las llaves del escenario. */
function combinaciones(escenario: Escenario): EstadoLlaves[] {
  const llaves = escenario.piezas.filter((p) => p.clase === 'llave' || p.clase === 'combinacion')
  return Array.from({ length: 2 ** llaves.length }, (_, n) =>
    Object.fromEntries(llaves.map((l, i) => [l.id, Boolean(n & (1 << i))])),
  )
}

export interface HallazgoConexionado {
  nivel: 'error' | 'aviso'
  texto: string
  fuente?: Referencia
}

/** Tabla 770.10.XIII: los colores de las líneas (fases) */
const COLORES_FASE: ColorCable[] = ['marron', 'negro', 'rojo']
const COLORES_PROHIBIDOS_RETORNO: ColorCable[] = ['celeste', 'verde', 'amarillo', 'verde-amarillo']

export function verificarConexionado(escenario: Escenario, cables: Cable[]): HallazgoConexionado[] {
  const hallazgos: HallazgoConexionado[] = []
  const error = (texto: string, fuente?: Referencia) =>
    hallazgos.push({ nivel: 'error', texto, fuente })
  const aviso = (texto: string, fuente?: Referencia) =>
    hallazgos.push({ nivel: 'aviso', texto, fuente })

  if (cables.length === 0) return [{ nivel: 'error', texto: 'Todavía no hay cables.' }]

  const estados = combinaciones(escenario)
  const resultados = estados.map((e) => ({ estado: e, r: simular(escenario, cables, e) }))
  const lamparas = escenario.piezas.filter((p) => p.clase === 'lampara')
  const tomas = escenario.piezas.filter((p) => p.clase === 'toma')
  const llaves = escenario.piezas.filter((p) => p.clase === 'llave' || p.clase === 'combinacion')

  // Fallas en alguna posición de las llaves
  const corto = resultados.find((x) => x.r.falla === 'cortocircuito')
  if (corto)
    error(
      llaves.length && resultados.some((x) => x.r.falla !== 'cortocircuito')
        ? 'Hay un cortocircuito (fase con neutro) en alguna posición de las llaves: al accionarlas salta el PIA.'
        : 'Hay un cortocircuito: la fase está unida al neutro y salta el PIA.',
    )
  const fuga = resultados.find((x) => x.r.falla === 'fuga')
  if (fuga)
    error(
      'La fase o el neutro tocan el conductor de protección: hay corriente de fuga a tierra y salta el diferencial. El PE solo va a las masas y al borne de tierra.',
      aea('770.14.4.5'),
    )

  // Lámparas: tienen que prender y apagarse con las llaves
  for (const l of lamparas) {
    const prendida = resultados.map((x) => x.r.lamparas.get(l.id) ?? false)
    if (prendida.every((p) => !p)) {
      if (!corto && !fuga)
        error(`${l.nombre}: la lámpara no prende en ninguna posición de las llaves.`)
    } else if (prendida.every((p) => p)) {
      error(`${l.nombre}: la lámpara queda siempre prendida; la llave no la comanda.`)
    } else if (escenario.piezas.some((p) => p.clase === 'combinacion')) {
      // Combinación: cualquier llave, desde cualquier posición, tiene que cambiar el estado
      const falla = resultados.some(({ estado }, i) =>
        llaves.some((ll) => {
          const j = resultados.findIndex((y) =>
            Object.entries(y.estado).every(([k, v]) =>
              k === ll.id ? v !== estado[k] : v === estado[k],
            ),
          )
          return prendida[i] === prendida[j]
        }),
      )
      if (falla)
        error(
          `${l.nombre}: hay posiciones en las que una de las llaves no cambia la luz. En una combinación, cada llave tiene que prender o apagar sin importar cómo esté la otra: el común de una va a la fase, el de la otra a la lámpara, y los dos viajeros unen las llaves.`,
        )
    }

    // Llave en el neutro: con la luz apagada, el portalámparas sigue unido a la fase
    const apagadaConFase = resultados.some(
      ({ r }) =>
        !r.falla &&
        !r.lamparas.get(l.id) &&
        (r.conFase(extremo(l.id, 'L')) || r.conFase(extremo(l.id, 'N'))),
    )
    if (prendida.some((p) => p) && apagadaConFase)
      error(
        `${l.nombre}: la llave corta el neutro en lugar de la fase. La luz se apaga, pero el portalámparas queda con tensión y da patada al cambiar la lámpara. La llave va siempre sobre la fase.`,
      )
  }

  // Desde acá, solo los cables (sin pasar por las llaves): qué está unido fijo a fase, neutro y PE
  const u = new Conjuntos()
  for (const c of cables) u.unir(c.desde, c.hasta)

  // Tomas: fase, neutro y tierra en su borne
  for (const t of tomas) {
    const l = extremo(t.id, 'L')
    const n = extremo(t.id, 'N')
    if (!resultados.some((x) => x.r.tomas.get(t.id)) && !corto && !fuga)
      error(`${t.nombre}: el toma no tiene fase y neutro.`)
    else if (u.juntos(l, NEUTRO) && u.juntos(n, FASE))
      error(
        `${t.nombre}: la fase y el neutro están invertidos. Cada conductor va en el borne destinado a él.`,
        aea('770.19.3.1'),
      )
  }

  // Protección: cada masa unida a la barra de tierra
  for (const p of [...lamparas, ...tomas]) {
    if (!u.juntos(extremo(p.id, 'PE'), TIERRA))
      error(
        p.clase === 'toma'
          ? `${p.nombre}: falta el conductor de protección (PE) en el borne de tierra del toma.`
          : `${p.nombre}: falta el conductor de protección (PE). Recorre toda la instalación, también las bocas de luz, y un artefacto metálico (clase I) lleva su masa conectada a él.`,
        aea(p.clase === 'toma' ? '770.19.3.1' : '770.14.4.5'),
      )
  }

  // Colores según la función de cada cable. Con un corto o una fuga los conjuntos se mezclan y
  // no se sabe qué función tiene cada uno: primero hay que resolver la falla.
  if (corto || fuga) return hallazgos
  const fuenteColores = aea('770.10.3.8.5')
  const funcion = (c: Cable) =>
    u.juntos(c.desde, TIERRA)
      ? 'pe'
      : u.juntos(c.desde, NEUTRO)
        ? 'neutro'
        : u.juntos(c.desde, FASE)
          ? 'fase'
          : 'retorno'
  const nombre = (c: ColorCable) => COLORES_CABLE[c].nombre.toLowerCase()
  const avisados = new Set<string>()
  const una = (clave: string, fn: () => void) => {
    if (!avisados.has(clave)) {
      avisados.add(clave)
      fn()
    }
  }
  for (const c of cables) {
    const f = funcion(c)
    if (f === 'fase' && !COLORES_FASE.includes(c.color))
      una(`fase-${c.color}`, () =>
        error(
          `Hay un cable de fase ${nombre(c.color)}: la fase va en marrón, negro o rojo.`,
          fuenteColores,
        ),
      )
    if (f === 'neutro' && c.color !== 'celeste')
      una(`neutro-${c.color}`, () =>
        error(`Hay un neutro ${nombre(c.color)}: el neutro va en celeste.`, fuenteColores),
      )
    if (f === 'pe' && c.color !== 'verde-amarillo')
      una(`pe-${c.color}`, () =>
        error(
          `Hay un conductor de protección ${nombre(c.color)}: el PE va en verde-amarillo.`,
          fuenteColores,
        ),
      )
    if (f === 'retorno' && COLORES_PROHIBIDOS_RETORNO.includes(c.color))
      una(`retorno-${c.color}`, () =>
        error(
          `Hay un retorno (o viajero) ${nombre(c.color)}: esos colores están reservados al neutro y a la protección.`,
          fuenteColores,
        ),
      )
    if (f === 'retorno' && COLORES_FASE.includes(c.color))
      una(`retorno-fase`, () =>
        aviso(
          'Hay un retorno (o viajero) con color de fase. Se admite por fuerza mayor, identificándolo en los dos extremos; lo indicado es otro color, por ejemplo blanco.',
          fuenteColores,
        ),
      )
  }

  return hallazgos
}
