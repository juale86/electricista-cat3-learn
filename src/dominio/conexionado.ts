// Conexionado cable por cable: bornes de cada pieza, cables con color y una simulación por
// conectividad (union-find). Para saber si una lámpara prende alcanza con ver qué bornes quedan
// unidos a la fase y al neutro; no hace falta resolver tensiones ni corrientes.

import { aea, type Referencia } from './referencias'
import { COLORES_CABLE, type ColorCable } from './tablero'

export type ClasePieza =
  | 'tablero'
  | 'lampara'
  | 'ventilador'
  | 'timbre'
  | 'llave'
  | 'combinacion'
  | 'pulsador'
  | 'fotocontrol'
  | 'minutero'
  | 'toma'

export const BORNES: Record<ClasePieza, readonly string[]> = {
  /** Salida del PIA del circuito y la barra de tierra */
  tablero: ['L', 'N', 'PE'],
  /** Portalámparas en la boca de techo; el PE va a la masa del artefacto */
  lampara: ['L', 'N', 'PE'],
  ventilador: ['L', 'N', 'PE'],
  /** Timbre de doble aislación: sin PE */
  timbre: ['L', 'N'],
  llave: ['1', '2'],
  /** Común y dos viajeros */
  combinacion: ['C', '1', '2'],
  /** Contacto que cierra solo mientras se aprieta */
  pulsador: ['1', '2'],
  /** Alimentación (L y N) y salida a la carga (S), que se activa de noche */
  fotocontrol: ['L', 'N', 'S'],
  /** Automático de escalera: alimentación, entrada de los pulsadores (P) y salida (S) */
  minutero: ['L', 'N', 'P', 'S'],
  toma: ['L', 'N', 'PE'],
}

export const NOMBRE_PIEZA: Record<ClasePieza, string> = {
  tablero: 'Tablero',
  lampara: 'Lámpara',
  ventilador: 'Ventilador de techo',
  timbre: 'Timbre',
  llave: 'Llave de un punto',
  combinacion: 'Llave de combinación',
  pulsador: 'Pulsador',
  fotocontrol: 'Fotocontrol',
  minutero: 'Minutero',
  toma: 'Tomacorriente',
}

/** Piezas que consumen: prenden, andan o suenan si quedan entre fase y neutro */
export const CARGAS: ClasePieza[] = ['lampara', 'ventilador', 'timbre']
/** Piezas con estado que se acciona: llaves, pulsadores, día/noche y temporizador */
export const MANIOBRAS: ClasePieza[] = [
  'llave',
  'combinacion',
  'pulsador',
  'fotocontrol',
  'minutero',
]
/** Equipos que necesitan fase y neutro para conmutar su salida */
const EQUIPOS: ClasePieza[] = ['fotocontrol', 'minutero']

const ANDANDO: Record<string, [string, string]> = {
  lampara: ['prendida', 'apagada'],
  ventilador: ['andando', 'parado'],
  timbre: ['sonando', 'callado'],
}

/**
 * Cómo tiene que funcionar cada carga: seguir el estado de una pieza (prendida si la llave está
 * cerrada, el pulsador apretado, es de noche o el minutero está temporizando), o cambiar de
 * estado con cada maniobra de cualquiera de varias piezas (combinación).
 */
export type Regla = { tipo: 'sigue'; pieza: string } | { tipo: 'conmuta'; piezas: string[] }

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
  /** Por id de carga */
  reglas: Record<string, Regla>
  /** Se agrega al error cuando una carga no funciona como debe */
  pista?: string
}

/** Extremo de un cable: `pieza.borne` */
export type Extremo = `${string}.${string}`

export interface Cable {
  id: string
  desde: Extremo
  hasta: Extremo
  color: ColorCable
}

/**
 * Por id de pieza. Llave: cerrada. Combinación: el común unido al viajero 2 (si no, al 1).
 * Pulsador: apretado. Fotocontrol: de noche. Minutero: temporizando.
 */
export type EstadoLlaves = Record<string, boolean>

const CLASE_I = 'El artefacto es metálico (clase I), así que su masa va al PE.'

export const ESCENARIOS: Escenario[] = [
  {
    id: 'un-punto',
    nombre: 'Luz con una llave',
    consigna: `Conectá la lámpara para que la prenda y la apague la llave. ${CLASE_I} Usá los colores de la norma.`,
    piezas: [
      { id: 'tablero', clase: 'tablero', nombre: 'Tablero (PIA C1)', x: 0, y: 260 },
      { id: 'lampara', clase: 'lampara', nombre: 'Boca de techo', x: 320, y: 0 },
      { id: 'llave', clase: 'llave', nombre: 'Llave', x: 320, y: 280 },
    ],
    reglas: { lampara: { tipo: 'sigue', pieza: 'llave' } },
  },
  {
    id: 'toma',
    nombre: 'Tomacorriente',
    consigna: 'Conectá el toma: fase, neutro y protección, cada uno en su borne y con su color.',
    piezas: [
      { id: 'tablero', clase: 'tablero', nombre: 'Tablero (PIA C2)', x: 0, y: 120 },
      { id: 'toma', clase: 'toma', nombre: 'Toma', x: 320, y: 120 },
    ],
    reglas: {},
  },
  {
    id: 'combinacion',
    nombre: 'Luz con combinación',
    consigna: `Una luz que se prende y se apaga desde dos lugares (pasillo o escalera): cada llave tiene que cambiar el estado de la luz, sin importar cómo esté la otra. ${CLASE_I}`,
    piezas: [
      { id: 'tablero', clase: 'tablero', nombre: 'Tablero (PIA C1)', x: 0, y: 300 },
      { id: 'lampara', clase: 'lampara', nombre: 'Boca de techo', x: 330, y: 0 },
      { id: 'llave1', clase: 'combinacion', nombre: 'Combinación 1', x: 200, y: 320 },
      { id: 'llave2', clase: 'combinacion', nombre: 'Combinación 2', x: 460, y: 320 },
    ],
    reglas: { lampara: { tipo: 'conmuta', piezas: ['llave1', 'llave2'] } },
    pista:
      'En una combinación, el común de una llave va a la fase, el de la otra a la lámpara, y los dos viajeros unen las llaves.',
  },
  {
    id: 'ventilador',
    nombre: 'Ventilador con luz',
    consigna: `Un ventilador de techo con luz, comandados por separado desde una llave de dos efectos (dos teclas en la misma caja). La fase llega a una tecla y se puentea a la otra. El ventilador y la luz son metálicos: los dos van al PE.`,
    piezas: [
      { id: 'tablero', clase: 'tablero', nombre: 'Tablero (PIA C1)', x: 0, y: 300 },
      { id: 'lampara', clase: 'lampara', nombre: 'Luz del ventilador', x: 230, y: 0 },
      { id: 'ventilador', clase: 'ventilador', nombre: 'Motor del ventilador', x: 450, y: 0 },
      { id: 'tecla1', clase: 'llave', nombre: 'Tecla luz', x: 230, y: 320 },
      { id: 'tecla2', clase: 'llave', nombre: 'Tecla ventilador', x: 430, y: 320 },
    ],
    reglas: {
      lampara: { tipo: 'sigue', pieza: 'tecla1' },
      ventilador: { tipo: 'sigue', pieza: 'tecla2' },
    },
    pista:
      'Cada tecla corta la fase de su carga: un retorno de la tecla de luz a la lámpara y otro de la tecla del ventilador al motor. El neutro va directo a los dos.',
  },
  {
    id: 'timbre',
    nombre: 'Timbre',
    consigna:
      'Un timbre que suena solo mientras se aprieta el pulsador de la puerta. El timbre es de doble aislación (clase II): no lleva PE.',
    piezas: [
      { id: 'tablero', clase: 'tablero', nombre: 'Tablero (PIA C1)', x: 0, y: 260 },
      { id: 'timbre', clase: 'timbre', nombre: 'Timbre', x: 320, y: 0 },
      { id: 'pulsador', clase: 'pulsador', nombre: 'Pulsador', x: 320, y: 280 },
    ],
    reglas: { timbre: { tipo: 'sigue', pieza: 'pulsador' } },
    pista: 'El pulsador se conecta como una llave de un punto: corta la fase del timbre.',
  },
  {
    id: 'fotocontrol',
    nombre: 'Fotocontrol',
    consigna: `Una luz exterior que se prende sola de noche. El fotocontrol necesita fase y neutro para funcionar, y su salida (S) alimenta la lámpara. ${CLASE_I}`,
    piezas: [
      { id: 'tablero', clase: 'tablero', nombre: 'Tablero (PIA C1)', x: 0, y: 260 },
      { id: 'lampara', clase: 'lampara', nombre: 'Luz exterior', x: 340, y: 0 },
      { id: 'foto', clase: 'fotocontrol', nombre: 'Fotocontrol', x: 340, y: 280 },
    ],
    reglas: { lampara: { tipo: 'sigue', pieza: 'foto' } },
    pista:
      'Fase y neutro al fotocontrol; de su salida (S) un retorno a la lámpara, y el neutro de la lámpara directo al tablero.',
  },
  {
    id: 'palier',
    nombre: 'Palier con minutero',
    consigna: `La luz de un palier o escalera: dos pulsadores, uno en cada piso, disparan el minutero, que prende la luz un rato y la apaga solo. El minutero necesita fase y neutro; los pulsadores le mandan fase a su entrada P. ${CLASE_I}`,
    piezas: [
      { id: 'tablero', clase: 'tablero', nombre: 'Tablero (PIA C1)', x: 0, y: 300 },
      { id: 'minutero', clase: 'minutero', nombre: 'Minutero', x: 230, y: 330 },
      { id: 'lampara', clase: 'lampara', nombre: 'Luz del palier', x: 470, y: 0 },
      { id: 'pulsador1', clase: 'pulsador', nombre: 'Pulsador PB', x: 0, y: 0 },
      { id: 'pulsador2', clase: 'pulsador', nombre: 'Pulsador 1.er piso', x: 230, y: 0 },
    ],
    reglas: { lampara: { tipo: 'sigue', pieza: 'minutero' } },
    pista:
      'Los pulsadores van en paralelo: los dos toman la fase y los dos llevan su retorno a la entrada P del minutero. La salida S del minutero alimenta la lámpara.',
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
  /** Cargas (lámparas, ventiladores, timbres) entre fase y neutro */
  cargas: Map<string, boolean>
  /** Tomas con fase y neutro (en cualquier orden) */
  tomas: Map<string, boolean>
  /** Minuteros con fase en su entrada P: un pulsador los está disparando */
  disparos: Set<string>
  /** Bornes unidos a la fase (para marcar los cables con tensión) */
  conFase: (e: Extremo) => boolean
  /** Bornes por donde circula corriente de vuelta: el neutro, si hay alguna carga andando */
  conCorrienteDeNeutro: (e: Extremo) => boolean
}

function unirCables(cables: Cable[]) {
  const u = new Conjuntos()
  for (const c of cables) u.unir(c.desde, c.hasta)
  return u
}

function unirTodo(escenario: Escenario, cables: Cable[], estado: EstadoLlaves) {
  const u = unirCables(cables)
  for (const p of escenario.piezas) {
    const [a, b] = [extremo(p.id, '1'), extremo(p.id, '2')]
    if ((p.clase === 'llave' || p.clase === 'pulsador') && estado[p.id]) u.unir(a, b)
    if (p.clase === 'combinacion') u.unir(extremo(p.id, 'C'), estado[p.id] ? b : a)
  }
  // Fotocontroles y minuteros conmutan solo si tienen fase en L y neutro en N. Su salida puede
  // alimentar a otro equipo, así que se repite hasta que no cambie nada.
  const activos = new Set<string>()
  let cambio = true
  while (cambio) {
    cambio = false
    for (const p of escenario.piezas) {
      if (!EQUIPOS.includes(p.clase) || !estado[p.id] || activos.has(p.id)) continue
      if (u.juntos(extremo(p.id, 'L'), FASE) && u.juntos(extremo(p.id, 'N'), NEUTRO)) {
        u.unir(extremo(p.id, 'L'), extremo(p.id, 'S'))
        activos.add(p.id)
        cambio = true
      }
    }
  }
  return u
}

export function simular(escenario: Escenario, cables: Cable[], estado: EstadoLlaves): Resultado {
  const u = unirTodo(escenario, cables, estado)
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
  const de = (clases: ClasePieza[]) =>
    new Map(
      escenario.piezas.filter((p) => clases.includes(p.clase)).map((p) => [p.id, alimentado(p)]),
    )
  const cargas = de(CARGAS)
  const disparos = new Set(
    escenario.piezas
      .filter((p) => p.clase === 'minutero' && !falla && u.juntos(extremo(p.id, 'P'), FASE))
      .map((p) => p.id),
  )
  const hayConsumo = [...cargas.values()].some(Boolean)
  return {
    falla,
    cargas,
    tomas: de(['toma']),
    disparos,
    conFase: (e) => !falla && u.juntos(e, FASE),
    conCorrienteDeNeutro: (e) => !falla && hayConsumo && u.juntos(e, NEUTRO),
  }
}

/** Todos los estados posibles de las piezas que se accionan. */
function combinaciones(escenario: Escenario): EstadoLlaves[] {
  const maniobras = escenario.piezas.filter((p) => MANIOBRAS.includes(p.clase))
  return Array.from({ length: 2 ** maniobras.length }, (_, n) =>
    Object.fromEntries(maniobras.map((l, i) => [l.id, Boolean(n & (1 << i))])),
  )
}

/** Cómo se dice el estado de una pieza, para los mensajes. */
export function describirEstado(pieza: Pieza, valor: boolean): string {
  const nombre = pieza.nombre.toLowerCase()
  switch (pieza.clase) {
    case 'llave':
      return `la ${nombre} ${valor ? 'cerrada' : 'abierta'}`
    case 'pulsador':
      return `el ${nombre} ${valor ? 'apretado' : 'suelto'}`
    case 'fotocontrol':
      return valor ? 'de noche' : 'de día'
    case 'minutero':
      return `el minutero ${valor ? 'temporizando' : 'en reposo'}`
    default:
      return `${nombre} en ${valor ? '2' : '1'}`
  }
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

  const piezas = new Map(escenario.piezas.map((p) => [p.id, p]))
  const resultados = combinaciones(escenario).map((e) => ({
    estado: e,
    r: simular(escenario, cables, e),
  }))
  const cargas = escenario.piezas.filter((p) => CARGAS.includes(p.clase))
  const tomas = escenario.piezas.filter((p) => p.clase === 'toma')
  const hayManiobras = escenario.piezas.some((p) => MANIOBRAS.includes(p.clase))

  // Fallas en algún estado de las llaves
  const corto = resultados.find((x) => x.r.falla === 'cortocircuito')
  if (corto)
    error(
      hayManiobras && resultados.some((x) => x.r.falla !== 'cortocircuito')
        ? 'Hay un cortocircuito (fase con neutro) al accionar alguna llave o pulsador: salta el PIA.'
        : 'Hay un cortocircuito: la fase está unida al neutro y salta el PIA.',
    )
  const fuga = resultados.find((x) => x.r.falla === 'fuga')
  if (fuga)
    error(
      'La fase o el neutro tocan el conductor de protección: hay corriente de fuga a tierra y salta el diferencial. El PE solo va a las masas y al borne de tierra.',
      aea('770.14.4.5'),
    )

  // Cargas: tienen que funcionar como dice su regla
  const sinFalla = resultados.filter((x) => !x.r.falla)
  for (const c of cargas) {
    const [si, no] = ANDANDO[c.clase]
    const anda = (x: (typeof resultados)[number]) => x.r.cargas.get(c.id) ?? false
    const regla = escenario.reglas[c.id]
    const pista = escenario.pista ? ` ${escenario.pista}` : ''
    if (sinFalla.length && sinFalla.every((x) => !anda(x))) {
      error(`${c.nombre}: no queda ${si} en ningún caso.${pista}`)
    } else if (sinFalla.length && sinFalla.every(anda) && hayManiobras) {
      error(`${c.nombre}: queda siempre ${si}, se accione lo que se accione.${pista}`)
    } else if (regla?.tipo === 'sigue') {
      const pieza = piezas.get(regla.pieza)!
      const mal = sinFalla.find((x) => anda(x) !== Boolean(x.estado[regla.pieza]))
      if (mal) {
        const debe = Boolean(mal.estado[regla.pieza])
        error(
          `${c.nombre}: con ${describirEstado(pieza, debe)} tendría que estar ${debe ? si : no} y está ${debe ? no : si}.${pista}`,
        )
      }
    } else if (regla?.tipo === 'conmuta') {
      // Cada maniobra de cualquiera de las piezas, desde cualquier estado, cambia la carga
      const igual = (a: EstadoLlaves, b: EstadoLlaves) => Object.keys(a).every((k) => a[k] === b[k])
      const falla = sinFalla.some((x) =>
        regla.piezas.some((id) => {
          const otro = sinFalla.find((y) => igual(y.estado, { ...x.estado, [id]: !x.estado[id] }))
          return otro !== undefined && anda(otro) === anda(x)
        }),
      )
      if (falla)
        error(
          `${c.nombre}: hay posiciones en las que una de las llaves no la cambia. Cada llave tiene que prender o apagar sin importar cómo esté la otra.${pista}`,
        )
    }

    // Llave en el neutro: con la carga parada, uno de sus bornes sigue unido a la fase
    const paradaConFase = sinFalla.some(
      ({ r }) =>
        !r.cargas.get(c.id) && (r.conFase(extremo(c.id, 'L')) || r.conFase(extremo(c.id, 'N'))),
    )
    if (sinFalla.some(anda) && paradaConFase)
      error(
        `${c.nombre}: la maniobra corta el neutro en lugar de la fase. Se apaga, pero queda con tensión y da patada al tocarla. Llaves, pulsadores y equipos cortan siempre la fase.`,
      )
  }

  // Minuteros: se disparan solo con un pulsador apretado
  for (const m of escenario.piezas.filter((p) => p.clase === 'minutero')) {
    const pulsadores = escenario.piezas.filter((p) => p.clase === 'pulsador')
    const apretado = (e: EstadoLlaves) => pulsadores.some((p) => e[p.id])
    const siempre = sinFalla.find((x) => !apretado(x.estado) && x.r.disparos.has(m.id))
    if (siempre)
      error(
        `${m.nombre}: queda disparado sin apretar ningún pulsador, así que la luz no se apaga nunca. A la entrada P le llega fase solo a través de los pulsadores.`,
      )
    for (const p of pulsadores) {
      const solo = sinFalla.find(
        (x) => x.estado[p.id] && pulsadores.every((q) => q === p || !x.estado[q.id]),
      )
      if (solo && !solo.r.disparos.has(m.id))
        error(`${p.nombre}: al apretarlo no le llega fase a la entrada P del minutero.`)
    }
  }

  // Desde acá, solo los cables (sin pasar por las llaves): qué está unido fijo a fase, neutro y PE
  const u = unirCables(cables)

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

  // Protección: cada masa con borne de tierra unida a la barra de tierra
  for (const p of escenario.piezas) {
    if (p.clase === 'tablero' || !BORNES[p.clase].includes('PE')) continue
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
