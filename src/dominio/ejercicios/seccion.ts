import { izCorregida, piaMaximo, piaParaCarga, seccionMinimaParaCarga } from '../calculos'
import {
  CALIBRES_PIA,
  CIRCUITOS,
  FACTOR_AGRUPAMIENTO,
  FUENTES,
  IZ_MONOFASICO,
  SECCIONES,
  type TipoCircuito,
} from '../normativa'
import type { Dato, Ejercicio, Respuesta } from './tipos'
import { armarOpciones, elegir, entero, formatear } from './util'

const SECCIONES_POR_TIPO: Record<TipoCircuito, number[]> = {
  IUG: [1.5, 2.5],
  TUG: [2.5, 4],
  TUE: [2.5, 4, 6],
}

const FUENTES_SECCION = [FUENTES.iz, FUENTES.agrupamiento, FUENTES.sobrecarga, FUENTES.circuitos]

function datosCircuito(tipo: TipoCircuito, circuitosEnCano: number): Dato[] {
  return [
    { etiqueta: 'Circuito', valor: `${tipo} (${CIRCUITOS[tipo].nombre.toLowerCase()})` },
    {
      etiqueta: 'Circuitos en el mismo caño',
      valor: circuitosEnCano === 1 ? '1 (solo)' : String(circuitosEnCano),
    },
    { etiqueta: 'Instalación', valor: 'Cable IRAM NM 247-3 en caño embutido, 40 °C' },
  ]
}

function pasoIz(seccion: number, circuitosEnCano: number): string {
  const factor = FACTOR_AGRUPAMIENTO[circuitosEnCano]
  const iz = izCorregida(seccion, circuitosEnCano)
  return factor === 1
    ? `Iz de ${formatear(seccion)} mm² = ${IZ_MONOFASICO[seccion]} A (sin agrupamiento)`
    : `Iz de ${formatear(seccion)} mm² = ${IZ_MONOFASICO[seccion]} A × ${formatear(factor)} (agrupamiento) = ${formatear(iz, 1)} A`
}

const vecinos = <T>(lista: readonly T[], valor: T) => {
  const i = lista.indexOf(valor)
  return [lista[i + 1], lista[i - 1], lista[i + 2]].filter((v) => v !== undefined)
}

function respuestaDiscreta(valor: number, unidad: string): Respuesta {
  return { clase: 'numero', valor, unidad, decimales: 1, exacta: true }
}

/** ¿Cuál es el PIA más grande que puede proteger este cable? */
function piaMaximoEjercicio(): Omit<Ejercicio, 'id'> {
  const tipo = elegir<TipoCircuito>(['IUG', 'TUG', 'TUE'])
  const seccion = elegir(SECCIONES_POR_TIPO[tipo])
  const circuitosEnCano = entero(1, 3)
  const pia = piaMaximo(seccion, circuitosEnCano, tipo)!
  const iz = izCorregida(seccion, circuitosEnCano)
  const tope = CIRCUITOS[tipo].maxIn
  const respuesta = respuestaDiscreta(pia, 'A')

  return {
    tipo: 'seccion',
    enunciado: '¿Cuál es el PIA de mayor calibre que podés poner para proteger este circuito?',
    datos: [
      ...datosCircuito(tipo, circuitosEnCano),
      { etiqueta: 'Sección', valor: `${formatear(seccion)} mm²` },
    ],
    respuesta,
    opciones: armarOpciones(respuesta, [
      piaMaximo(seccion, 1, 'TUE')!,
      tope,
      ...vecinos(CALIBRES_PIA, pia),
    ]),
    pasos: [
      pasoIz(seccion, circuitosEnCano),
      `Tope del ${tipo}: ${tope} A`,
      `In ≤ mín(${formatear(iz, 1)} A; ${tope} A) → el calibre comercial más grande es ${pia} A`,
    ],
    atajo:
      'Memorizá Iz sin agrupar: 1,5 → 15 A, 2,5 → 21 A, 4 → 28 A, 6 → 36 A. Con 2 circuitos en el caño restá 20 %; con 3, restá 30 %.',
    fuentes: FUENTES_SECCION,
  }
}

/** ¿Qué sección mínima necesita esta carga? */
function seccionEjercicio(): Omit<Ejercicio, 'id'> {
  const tipo = elegir<TipoCircuito>(['IUG', 'TUG', 'TUE'])
  const rangoIb: Record<TipoCircuito, [number, number]> = {
    IUG: [3, 12],
    TUG: [6, 18],
    TUE: [10, 28],
  }
  let circuitosEnCano = entero(1, 3)
  let ib = entero(...rangoIb[tipo])
  let seccion = seccionMinimaParaCarga(ib, circuitosEnCano, tipo)
  // Si la combinación no tiene solución dentro del tope del circuito, se baja la carga
  while (seccion === undefined) {
    circuitosEnCano = 1
    ib = Math.max(1, ib - 3)
    seccion = seccionMinimaParaCarga(ib, circuitosEnCano, tipo)
  }
  const pia = piaParaCarga(ib, seccion, circuitosEnCano)!
  const minimo = CIRCUITOS[tipo].seccionMinima
  const respuesta = respuestaDiscreta(seccion, 'mm²')
  const sinAgrupar = seccionMinimaParaCarga(ib, 1, tipo)

  return {
    tipo: 'seccion',
    enunciado: '¿Qué sección mínima de cable necesita este circuito?',
    datos: [
      ...datosCircuito(tipo, circuitosEnCano),
      { etiqueta: 'Corriente de proyecto (Ib)', valor: `${ib} A` },
    ],
    respuesta,
    opciones: armarOpciones(respuesta, [
      ...(sinAgrupar !== undefined && sinAgrupar !== seccion ? [sinAgrupar] : []),
      minimo,
      ...vecinos(SECCIONES, seccion as (typeof SECCIONES)[number]),
    ]),
    pasos: [
      `Sección mínima del ${tipo}: ${formatear(minimo)} mm²`,
      pasoIz(seccion, circuitosEnCano),
      `Se necesita un PIA con ${ib} A ≤ In ≤ ${formatear(izCorregida(seccion, circuitosEnCano), 1)} A → PIA de ${pia} A`,
      `La sección más chica que lo cumple es ${formatear(seccion)} mm²`,
    ],
    fuentes: [...FUENTES_SECCION, FUENTES.seccionesMinimas],
  }
}

/** ¿Qué PIA corresponde a esta carga y este cable? */
function piaCargaEjercicio(): Omit<Ejercicio, 'id'> {
  const tipo = elegir<TipoCircuito>(['TUG', 'TUE'])
  const seccion = elegir(SECCIONES_POR_TIPO[tipo])
  const circuitosEnCano = entero(1, 2)
  const iz = izCorregida(seccion, circuitosEnCano)
  const tope = Math.min(iz, CIRCUITOS[tipo].maxIn)
  const candidatos = CALIBRES_PIA.filter((c) => c <= tope)
  const piaObjetivo = elegir(candidatos.slice(1))
  const anterior = candidatos[candidatos.indexOf(piaObjetivo) - 1]
  const ib = entero(anterior + 1, piaObjetivo)
  const pia = piaParaCarga(ib, seccion, circuitosEnCano)!
  const respuesta = respuestaDiscreta(pia, 'A')

  return {
    tipo: 'seccion',
    enunciado: '¿Qué PIA elegís para este circuito? (el calibre más chico que cumpla la norma)',
    datos: [
      ...datosCircuito(tipo, circuitosEnCano),
      { etiqueta: 'Sección', valor: `${formatear(seccion)} mm²` },
      { etiqueta: 'Corriente de proyecto (Ib)', valor: `${ib} A` },
    ],
    respuesta,
    opciones: armarOpciones(respuesta, [anterior, ...vecinos(CALIBRES_PIA, pia)]),
    pasos: [
      pasoIz(seccion, circuitosEnCano),
      `Ib ≤ In ≤ Iz → ${ib} A ≤ In ≤ ${formatear(iz, 1)} A`,
      `El calibre comercial más chico que cumple es ${pia} A`,
      `Un PIA de ${anterior} A saltaría con la carga normal (In < Ib)`,
    ],
    fuentes: FUENTES_SECCION,
  }
}

export function generarSeccion(): Omit<Ejercicio, 'id'> {
  return elegir([piaMaximoEjercicio, seccionEjercicio, piaCargaEjercicio])()
}
