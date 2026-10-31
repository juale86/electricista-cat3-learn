// «Circuitos en el plano», etapa 2: circuitos trazados desde el tablero, su verificación contra la
// AEA 770 y el caso de «Armá el tablero» que sale de ellos. Sin React.

import { MINIMOS } from './ejercicios/division'
import { CIRCUITOS, DPMS, NOMBRE_GRADO, TENSION_MONOFASICA, type TipoCircuito } from './normativa'
import {
  ambientesDeLlave,
  NOMBRE_ELEMENTO,
  superficies,
  type Elemento,
  type HallazgoPlano,
  type Plano,
} from './plano'
import { aea } from './referencias'
import { armarCaso, type Caso, type CircuitoCaso } from './tablero'

/** Id del tablero como extremo de un tramo */
export const TABLERO = 'tablero'

export type TipoCircuitoPlano = Extract<TipoCircuito, 'IUG' | 'TUG'>

export interface CircuitoPlano {
  id: string
  tipo: TipoCircuitoPlano
  /** C1, C2…, como en los planos del curso */
  nombre: string
}

/** Un tramo de cañería con los cables de un circuito, entre dos bocas o desde el tablero */
export interface Tramo {
  id: string
  circuito: string
  desde: string
  hasta: string
}

export const NOMBRE_TIPO_CIRCUITO: Record<TipoCircuitoPlano, string> = {
  IUG: 'Iluminación (IUG)',
  TUG: 'Tomas (TUG)',
}

export function siguienteNombre(circuitos: CircuitoPlano[]) {
  const usados = new Set(circuitos.map((c) => c.nombre))
  let n = 1
  while (usados.has(`C${n}`)) n++
  return `C${n}`
}

/** Elementos alcanzados por un circuito, y cuáles de ellos llegan al tablero por sus tramos. */
function recorrer(circuito: CircuitoPlano, tramos: Tramo[]) {
  const propios = tramos.filter((t) => t.circuito === circuito.id)
  const vecinos = new Map<string, string[]>()
  for (const t of propios) {
    vecinos.set(t.desde, [...(vecinos.get(t.desde) ?? []), t.hasta])
    vecinos.set(t.hasta, [...(vecinos.get(t.hasta) ?? []), t.desde])
  }
  const alcanzados = new Set<string>()
  const pendientes = vecinos.has(TABLERO) ? [TABLERO] : []
  while (pendientes.length) {
    const id = pendientes.pop()!
    if (alcanzados.has(id)) continue
    alcanzados.add(id)
    pendientes.push(...(vecinos.get(id) ?? []))
  }
  const todos = [...vecinos.keys()].filter((id) => id !== TABLERO)
  return { todos, conectados: todos.filter((id) => alcanzados.has(id)), vecinos }
}

function lista(nombres: string[]) {
  if (nombres.length <= 1) return nombres.join('')
  return `${nombres.slice(0, -1).join(', ')} y ${nombres.at(-1)}`
}

export function verificarCircuitos(
  plano: Plano,
  elementos: Elemento[],
  circuitos: CircuitoPlano[],
  tramos: Tramo[],
): HallazgoPlano[] {
  const hallazgos: HallazgoPlano[] = []
  const error = (texto: string, extra: Partial<HallazgoPlano> = {}) =>
    hallazgos.push({ nivel: 'error', texto, ...extra })
  const aviso = (texto: string, extra: Partial<HallazgoPlano> = {}) =>
    hallazgos.push({ nivel: 'aviso', texto, ...extra })

  if (elementos.length === 0) return hallazgos
  if (circuitos.length === 0 || tramos.length === 0) {
    error('Todavía no hay circuitos: creá uno y trazalo desde el tablero hasta cada boca.')
    return hallazgos
  }

  const porId = new Map(elementos.map((e) => [e.id, e]))
  const nombreAmbiente = (id: string) => plano.ambientes.find((a) => a.id === id)?.nombre ?? id
  const describir = (e: Elemento) =>
    `${NOMBRE_ELEMENTO[e.clase].toLowerCase()} de ${nombreAmbiente(e.ambiente)}`
  const enCircuitos = new Map<string, string[]>()

  for (const c of circuitos) {
    const { todos, conectados, vecinos } = recorrer(c, tramos)
    const miembros = todos.map((id) => porId.get(id)).filter((e) => e !== undefined)
    for (const e of miembros) enCircuitos.set(e.id, [...(enCircuitos.get(e.id) ?? []), c.nombre])

    if (miembros.length === 0) {
      aviso(`${c.nombre} no tiene tramos: trazalo o borralo.`)
      continue
    }
    if (!vecinos.has(TABLERO))
      error(`${c.nombre} no sale del tablero. Todo circuito terminal arranca en su protección.`, {
        fuente: aea('770.6.5'),
      })
    else {
      const sueltos = miembros.filter((e) => !conectados.includes(e.id))
      if (sueltos.length) {
        const donde = lista([...new Set(sueltos.map((e) => nombreAmbiente(e.ambiente)))])
        const que =
          sueltos.length === 1 ? describir(sueltos[0]) : `${sueltos.length} elementos de ${donde}`
        error(
          `${c.nombre}: ${que} no ${sueltos.length === 1 ? 'llega' : 'llegan'} al tablero. Hay un tramo cortado.`,
          { fuente: aea('770.6.5') },
        )
      }
    }

    const luces = miembros.filter((e) => e.clase === 'boca')
    const tomas = miembros.filter((e) => e.clase === 'toma')
    const llaves = miembros.filter((e) => e.clase === 'llave')

    if (c.tipo === 'TUG' && luces.length + llaves.length > 0)
      error(
        `${c.nombre} es de tomas (TUG) y tiene ${luces.length ? 'bocas de luz' : 'llaves'}. En un TUG solo van tomacorrientes; la luz va en un IUG.`,
        { fuente: aea('770.6.6') },
      )
    if (c.tipo === 'IUG' && tomas.length > 0)
      aviso(
        `${c.nombre} es de iluminación y tiene ${tomas.length === 1 ? '1 toma' : `${tomas.length} tomas`}. Se puede (IUG con tomas derivados), pero el circuito pasa a contar 2200 VA en la DPMS en lugar de 60 VA por boca. Lo habitual es llevar los tomas en un TUG.`,
        { fuente: aea('Tabla 770.8.I') },
      )

    // Las cajas que solo tienen llaves no cuentan como bocas (770.6.6, nota 1)
    const bocas = luces.length + tomas.length
    const max = CIRCUITOS[c.tipo].maxBocas
    if (bocas > max)
      error(`${c.nombre} tiene ${bocas} bocas y el máximo por circuito es ${max}.`, {
        fuente: aea('Tabla 770.6.I'),
      })

    // Cada luz tiene que tener su llave, y cada llave tiene que comandar una luz
    const unidos = (e: Elemento) => (vecinos.get(e.id) ?? []).map((id) => porId.get(id))
    for (const luz of luces) {
      if (!unidos(luz).some((v) => v?.clase === 'llave'))
        error(
          `${c.nombre}: la boca de luz de ${nombreAmbiente(luz.ambiente)} no está unida a ninguna llave. Trazá un tramo de la boca a su llave (el retorno).`,
          { ambiente: luz.ambiente },
        )
    }
    for (const llave of llaves) {
      const comanda = unidos(llave).filter((v) => v?.clase === 'boca') as Elemento[]
      if (comanda.length === 0)
        error(
          `${c.nombre}: la llave de ${nombreAmbiente(llave.ambiente)} no está unida a ninguna boca de luz, así que no prende nada.`,
          { ambiente: llave.ambiente },
        )
      const alcance = ambientesDeLlave(plano, llave)
      const lejos = comanda.filter((b) => !alcance.has(b.ambiente))
      if (lejos.length)
        aviso(
          `${c.nombre}: la llave de ${nombreAmbiente(llave.ambiente)} prende la luz de ${lista([...new Set(lejos.map((b) => nombreAmbiente(b.ambiente)))])}. Conviene que cada luz se prenda desde su ambiente o desde su puerta.`,
          { ambiente: llave.ambiente },
        )
    }
  }

  // Cada boca pertenece a un solo circuito y ninguna queda afuera
  for (const e of elementos) {
    const de = enCircuitos.get(e.id) ?? []
    if (de.length > 1)
      error(
        `La ${describir(e)} está en ${lista(de)}. Cada boca pertenece a un solo circuito, con su propia protección.`,
        { ambiente: e.ambiente, fuente: aea('770.6.5') },
      )
  }
  const sinConectar = elementos.filter((e) => !enCircuitos.has(e.id))
  const porAmbiente = new Map<string, Elemento[]>()
  for (const e of sinConectar)
    porAmbiente.set(e.ambiente, [...(porAmbiente.get(e.ambiente) ?? []), e])
  for (const [ambiente, es] of porAmbiente)
    error(
      `${nombreAmbiente(ambiente)}: ${es.length === 1 ? 'hay 1 elemento' : `hay ${es.length} elementos`} sin conectar a ningún circuito.`,
      { ambiente },
    )

  // Circuitos mínimos del grado (Tabla 770.7.I)
  const { grado } = superficies(plano)
  const min = MINIMOS[grado]
  const usados = circuitos.filter((c) => tramos.some((t) => t.circuito === c.id))
  const iug = usados.filter((c) => c.tipo === 'IUG').length
  const tug = usados.filter((c) => c.tipo === 'TUG').length
  const fuente = aea('Tabla 770.7.I')
  const gradoTexto = `grado ${NOMBRE_GRADO[grado].toLowerCase()}`
  if (iug < min.iug)
    error(`Para ${gradoTexto} hacen falta por lo menos ${min.iug} IUG y hay ${iug}.`, { fuente })
  if (tug < min.tug)
    error(`Para ${gradoTexto} hacen falta por lo menos ${min.tug} TUG y hay ${tug}.`, { fuente })
  if (iug + tug < min.total)
    error(
      `Para ${gradoTexto} hacen falta por lo menos ${min.total} circuitos y hay ${iug + tug}.`,
      { fuente },
    )

  return hallazgos
}

/** El caso de «Armá el tablero» con los circuitos trazados en el plano. */
export function casoDelPlano(
  plano: Plano,
  elementos: Elemento[],
  circuitos: CircuitoPlano[],
  tramos: Tramo[],
): Caso {
  const porId = new Map(elementos.map((e) => [e.id, e]))
  const nombreAmbiente = (id: string) => plano.ambientes.find((a) => a.id === id)?.nombre ?? id
  const casos: CircuitoCaso[] = circuitos.flatMap((c) => {
    const miembros = recorrer(c, tramos)
      .todos.map((id) => porId.get(id))
      .filter((e) => e !== undefined)
    if (miembros.length === 0) return []
    const luces = miembros.filter((e) => e.clase === 'boca').length
    const tomas = miembros.filter((e) => e.clase === 'toma').length
    const ambientes = [...new Set(miembros.map((e) => nombreAmbiente(e.ambiente)))]
    const partes = [
      luces && `${luces} ${luces === 1 ? 'luz' : 'luces'}`,
      tomas && `${tomas} ${tomas === 1 ? 'toma' : 'tomas'}`,
    ].filter(Boolean)
    // Tabla 770.8.I: IUG sin tomas, 2/3 de 60 VA por boca; IUG con tomas y TUG, 2200 VA
    const va =
      c.tipo === 'IUG' && tomas === 0
        ? luces * DPMS.vaPorBocaIUG * DPMS.fraccionIUGSinTomas
        : c.tipo === 'IUG'
          ? DPMS.iugConTomas
          : DPMS.tug
    return [
      {
        id: c.id,
        nombre: `${c.nombre} (${c.tipo})`,
        tipo: c.tipo,
        detalle: `${partes.join(' y ')}: ${lista(ambientes)}`,
        seccion: CIRCUITOS[c.tipo].seccionMinima,
        ib: va / TENSION_MONOFASICA,
      },
    ]
  })
  return armarCaso(superficies(plano).grado, casos)
}
