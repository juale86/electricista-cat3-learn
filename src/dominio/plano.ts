// «Circuitos en el plano»: geometría de la planta, ubicación de los elementos sobre paredes y
// techo, y verificación de los puntos mínimos por ambiente. Sin React.

import { gradoPorSuperficie, superficieLimite } from './calculos'
import { puntosMinimos, type Ambiente, type TipoAmbiente } from './ejercicios/division'
import { aea, type Referencia } from './referencias'

export type Lado = 'norte' | 'sur' | 'este' | 'oeste'

export interface AmbientePlano {
  id: string
  tipo: TipoAmbiente
  nombre: string
  x: number
  y: number
  ancho: number
  alto: number
  /** Lados sin pared (galerías y espacios semicubiertos) */
  abiertos?: Lado[]
}

interface Abertura {
  /** Esquina superior izquierda del hueco */
  x: number
  y: number
  largo: number
  /** `h`: sobre una pared horizontal; `v`: sobre una vertical */
  orientacion: 'h' | 'v'
}

export interface Puerta extends Abertura {
  /** Hacia qué lado abre la hoja: `1` hacia +y (o +x), `-1` hacia −y (o −x) */
  hacia: 1 | -1
  /** Extremo del hueco donde está la bisagra */
  bisagra: 'inicio' | 'fin'
}

export interface Plano {
  id: string
  nombre: string
  ancho: number
  alto: number
  ambientes: AmbientePlano[]
  puertas: Puerta[]
  ventanas: Abertura[]
  /** Tablero principal, sobre la pared sur del ambiente indicado */
  tablero: { x: number; y: number; ambiente: string }
}

export type ClaseElemento = 'boca' | 'llave' | 'toma'

export interface Elemento {
  id: string
  clase: ClaseElemento
  x: number
  y: number
  /** Dirección hacia el interior del ambiente, en grados (0 = +x, 90 = +y) */
  angulo: number
  ambiente: string
}

export const NOMBRE_ELEMENTO: Record<ClaseElemento, string> = {
  boca: 'Boca de techo',
  llave: 'Llave de un punto',
  toma: 'Tomacorriente',
}

export interface Punto {
  x: number
  y: number
}

export interface Segmento {
  a: Punto
  b: Punto
  /** Normal hacia el interior del ambiente, en grados */
  angulo: number
}

/** Distancia del centro del símbolo a la pared, para que quede apoyado sobre ella */
export const SEPARACION_PARED: Record<ClaseElemento, number> = { boca: 0, llave: 14, toma: 16 }
/** Las bocas de techo quedan al menos a esta distancia de las paredes */
const MARGEN_TECHO = 30
/** Ni llaves ni tomas en las esquinas ni pegadas al marco de una puerta */
const MARGEN_PARED = 12
/** Una llave más lejos que esto de la puerta no queda a mano al entrar */
const LLAVE_A_MANO = 100

export function medidaAmbiente(a: AmbientePlano): number {
  if (a.tipo === 'galeria') return Math.max(a.ancho, a.alto) / 100
  return (a.ancho * a.alto) / 10_000
}

export function describirMedida(a: AmbientePlano): string {
  const m = (cm: number) => (cm / 100).toLocaleString('es-AR')
  if (a.tipo === 'galeria') return `${m(Math.max(a.ancho, a.alto))} m de largo`
  return `${m(a.ancho)} × ${m(a.alto)} m · ${medidaAmbiente(a).toLocaleString('es-AR')} m²`
}

export function superficies(plano: Plano) {
  let cubierta = 0
  let semicubierta = 0
  for (const a of plano.ambientes) {
    const m2 = (a.ancho * a.alto) / 10_000
    if (a.abiertos?.length) semicubierta += m2
    else cubierta += m2
  }
  const grado = gradoPorSuperficie(superficieLimite(cubierta, semicubierta)).id
  return { cubierta, semicubierta, grado }
}

function contiene(a: AmbientePlano, p: Punto) {
  return p.x >= a.x && p.x <= a.x + a.ancho && p.y >= a.y && p.y <= a.y + a.alto
}

export function ambienteEn(plano: Plano, p: Punto): AmbientePlano | undefined {
  return plano.ambientes.find((a) => contiene(a, p))
}

/** Huecos de las puertas sobre una línea, como intervalos [desde, hasta]. */
function huecosSobre(plano: Plano, orientacion: 'h' | 'v', coordenada: number) {
  return plano.puertas
    .filter(
      (p) => p.orientacion === orientacion && (orientacion === 'h' ? p.y : p.x) === coordenada,
    )
    .map((p) => {
      const desde = orientacion === 'h' ? p.x : p.y
      return [desde, desde + p.largo] as const
    })
}

/** Resta los huecos a un intervalo y deja un margen en cada extremo. */
function restarHuecos(
  desde: number,
  hasta: number,
  huecos: (readonly [number, number])[],
  margen: number,
) {
  const tramos: [number, number][] = []
  let inicio = desde
  for (const [a, b] of [...huecos].sort((x, y) => x[0] - y[0])) {
    if (b <= inicio || a >= hasta) continue
    tramos.push([inicio, a])
    inicio = b
  }
  tramos.push([inicio, hasta])
  return tramos.map(([a, b]) => [a + margen, b - margen] as const).filter(([a, b]) => b > a)
}

/** Lados con pared de un ambiente: rectas a lo largo del borde, con la normal hacia adentro. */
export function lados(a: AmbientePlano) {
  const { x, y, ancho, alto } = a
  const todos = [
    { lado: 'norte', orientacion: 'h', fijo: y, desde: x, hasta: x + ancho, angulo: 90 },
    { lado: 'sur', orientacion: 'h', fijo: y + alto, desde: x, hasta: x + ancho, angulo: 270 },
    { lado: 'oeste', orientacion: 'v', fijo: x, desde: y, hasta: y + alto, angulo: 0 },
    { lado: 'este', orientacion: 'v', fijo: x + ancho, desde: y, hasta: y + alto, angulo: 180 },
  ] as const
  return todos.filter((l) => !a.abiertos?.includes(l.lado))
}

/**
 * Tramos de pared de un ambiente, sin los huecos de las puertas. Con el margen por omisión son
 * los lugares donde se puede apoyar una llave o un toma; con margen 0, las paredes a dibujar.
 */
export function tramosDePared(plano: Plano, a: AmbientePlano, margen = MARGEN_PARED): Segmento[] {
  return lados(a).flatMap((l) =>
    restarHuecos(l.desde, l.hasta, huecosSobre(plano, l.orientacion, l.fijo), margen).map(
      ([d, h]) =>
        l.orientacion === 'h'
          ? { a: { x: d, y: l.fijo }, b: { x: h, y: l.fijo }, angulo: l.angulo }
          : { a: { x: l.fijo, y: d }, b: { x: l.fijo, y: h }, angulo: l.angulo },
    ),
  )
}

function proyectar(p: Punto, s: Segmento): Punto {
  const dx = s.b.x - s.a.x
  const dy = s.b.y - s.a.y
  const t = Math.max(
    0,
    Math.min(1, ((p.x - s.a.x) * dx + (p.y - s.a.y) * dy) / (dx * dx + dy * dy)),
  )
  return { x: s.a.x + t * dx, y: s.a.y + t * dy }
}

function distancia(p: Punto, q: Punto) {
  return Math.hypot(p.x - q.x, p.y - q.y)
}

const redondear = (n: number) => Math.round(n / 5) * 5

/**
 * Ubica un elemento donde se tocó el plano: las bocas en el techo del ambiente y las llaves y
 * los tomas sobre la pared más cercana, fuera de los huecos de las puertas.
 */
export function ubicar(
  plano: Plano,
  clase: ClaseElemento,
  punto: Punto,
): Omit<Elemento, 'id' | 'clase'> | null {
  const ambiente = ambienteEn(plano, punto)
  if (!ambiente) return null

  if (clase === 'boca') {
    const limitar = (v: number, min: number, largo: number) =>
      Math.max(min + MARGEN_TECHO, Math.min(min + largo - MARGEN_TECHO, redondear(v)))
    return {
      x: limitar(punto.x, ambiente.x, ambiente.ancho),
      y: limitar(punto.y, ambiente.y, ambiente.alto),
      angulo: 0,
      ambiente: ambiente.id,
    }
  }

  let mejor: { punto: Punto; angulo: number; d: number } | null = null
  for (const s of tramosDePared(plano, ambiente)) {
    const q = proyectar(punto, s)
    const d = distancia(punto, q)
    if (!mejor || d < mejor.d) mejor = { punto: q, angulo: s.angulo, d }
  }
  if (!mejor) return null

  const rad = (mejor.angulo * Math.PI) / 180
  const sep = SEPARACION_PARED[clase]
  return {
    x: Math.round(mejor.punto.x + Math.cos(rad) * sep),
    y: Math.round(mejor.punto.y + Math.sin(rad) * sep),
    angulo: mejor.angulo,
    ambiente: ambiente.id,
  }
}

/** Ambientes que comunica una puerta (los que tienen una pared sobre su hueco). */
function ambientesDePuerta(plano: Plano, puerta: Puerta) {
  const medio = puerta.largo / 2
  const centro =
    puerta.orientacion === 'h'
      ? { x: puerta.x + medio, y: puerta.y }
      : { x: puerta.x, y: puerta.y + medio }
  return plano.ambientes.filter((a) => contiene(a, centro)).map((a) => a.id)
}

function distanciaAPuerta(p: Punto, puerta: Puerta) {
  const fin =
    puerta.orientacion === 'h'
      ? { x: puerta.x + puerta.largo, y: puerta.y }
      : { x: puerta.x, y: puerta.y + puerta.largo }
  return distancia(p, proyectar(p, { a: { x: puerta.x, y: puerta.y }, b: fin, angulo: 0 }))
}

/**
 * Ambientes que puede comandar una llave: el suyo y, si está junto a una puerta, también el de
 * al lado (por ejemplo, la llave de la galería puesta adentro, al lado de la puerta de entrada).
 */
export function ambientesDeLlave(plano: Plano, llave: Elemento): Set<string> {
  const ambientes = new Set([llave.ambiente])
  for (const puerta of plano.puertas) {
    if (distanciaAPuerta(llave, puerta) <= LLAVE_A_MANO)
      for (const id of ambientesDePuerta(plano, puerta)) ambientes.add(id)
  }
  return ambientes
}

export interface HallazgoPlano {
  nivel: 'error' | 'aviso'
  texto: string
  fuente?: Referencia
  /** Ambiente al que se refiere, para marcarlo en el plano */
  ambiente?: string
}

function cantidad(n: number, singular: string, plural: string) {
  return `${n} ${n === 1 ? singular : plural}`
}

export function verificarPlano(plano: Plano, elementos: Elemento[]): HallazgoPlano[] {
  const hallazgos: HallazgoPlano[] = []
  if (elementos.length === 0) {
    return [{ nivel: 'error', texto: 'El plano está vacío: ubicá bocas, llaves y tomas.' }]
  }

  const { grado } = superficies(plano)
  const fuenteMinimos = aea('Tabla 770.7.III')
  const llaves = elementos.filter((e) => e.clase === 'llave')

  const sirveA = new Map(llaves.map((l) => [l.id, ambientesDeLlave(plano, l)]))

  for (const a of plano.ambientes) {
    const propios = elementos.filter((e) => e.ambiente === a.id)
    const bocas = propios.filter((e) => e.clase === 'boca').length
    const tomas = propios.filter((e) => e.clase === 'toma').length
    const ambiente: Ambiente = { tipo: a.tipo, nombre: a.nombre, medida: medidaAmbiente(a) }
    const minimo = puntosMinimos(ambiente, grado)

    if (bocas < minimo.iug)
      hallazgos.push({
        nivel: 'error',
        texto: `${a.nombre}: ${bocas === 0 ? 'no tiene bocas de iluminación' : `tiene ${cantidad(bocas, 'boca', 'bocas')} de iluminación`} y el mínimo es ${minimo.iug} (${minimo.regla}).`,
        fuente: fuenteMinimos,
        ambiente: a.id,
      })
    if (tomas < minimo.tug)
      hallazgos.push({
        nivel: 'error',
        texto: `${a.nombre}: ${tomas === 0 ? 'no tiene tomas' : `tiene ${cantidad(tomas, 'toma', 'tomas')}`} y el mínimo es ${minimo.tug} (${minimo.regla}).`,
        fuente: fuenteMinimos,
        ambiente: a.id,
      })
    if (bocas > 0 && !llaves.some((l) => sirveA.get(l.id)!.has(a.id)))
      hallazgos.push({
        nivel: 'error',
        texto: `${a.nombre}: hay luz pero ninguna llave para prenderla. Poné una en el ambiente o junto a su puerta.`,
        ambiente: a.id,
      })
  }

  for (const llave of llaves) {
    const a = plano.ambientes.find((x) => x.id === llave.ambiente)!
    const puertas = plano.puertas.filter((p) => ambientesDePuerta(plano, p).includes(a.id))
    const cerca = puertas.some((p) => distanciaAPuerta(llave, p) <= LLAVE_A_MANO)
    if (puertas.length > 0 && !cerca)
      hallazgos.push({
        nivel: 'aviso',
        texto: `${a.nombre}: hay una llave a más de 1 m de la puerta. Conviene ponerla junto a la puerta, del lado del picaporte, para encontrarla al entrar.`,
        ambiente: a.id,
      })
    const conLuz = [...sirveA.get(llave.id)!].some((id) =>
      elementos.some((e) => e.clase === 'boca' && e.ambiente === id),
    )
    if (!conLuz)
      hallazgos.push({
        nivel: 'aviso',
        texto: `${a.nombre}: hay una llave pero ninguna boca de luz para comandar.`,
        ambiente: a.id,
      })
  }

  return hallazgos
}

/** Lo que pide la tabla para cada ambiente, para mostrarlo en la corrección. */
export function resumenMinimos(plano: Plano) {
  const { grado } = superficies(plano)
  return plano.ambientes.map((a) => ({
    ambiente: a,
    ...puntosMinimos({ tipo: a.tipo, nombre: a.nombre, medida: medidaAmbiente(a) }, grado),
  }))
}
