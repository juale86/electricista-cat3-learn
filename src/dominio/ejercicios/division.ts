// Dividir una vivienda en circuitos y armar su tablero principal, en el orden de un proyecto:
// bocas mínimas por ambiente → circuitos → cabecera → composición del tablero.

import {
  corrienteMonofasica,
  dpmsCircuito,
  dpmsVivienda,
  gradoPorSuperficie,
  superficieLimite,
  type CircuitosVivienda,
} from '../calculos'
import {
  CALIBRES_PIA,
  CIRCUITOS,
  GRADOS,
  IZ_MONOFASICO,
  NOMBRE_GRADO,
  SECCIONES,
  TENSION_MONOFASICA,
  type GradoElectrificacion,
} from '../normativa'
import { aea, carpetaERSeP } from '../referencias'
import type { Dato, Ejercicio, Respuesta } from './tipos'
import { armarOpciones, elegir, elegirPonderado, entero, formatear, mezclar } from './util'

type TipoAmbiente = 'estar' | 'dormitorio' | 'cocina' | 'bano' | 'lavadero' | 'galeria'

interface Ambiente {
  tipo: TipoAmbiente
  nombre: string
  /** Superficie en m²; en la galería, el largo en m. */
  medida: number
}

interface Vivienda {
  ambientes: Ambiente[]
  cubierta: number
  semicubierta: number
  grado: GradoElectrificacion
  /** Aparatos que van a un circuito de uso especial (TUE) */
  especiales: string[]
}

const ANCHO_GALERIA = 2
/** La superficie cubierta suma un 15 % a los ambientes por pasillos y muros. */
const FACTOR_CIRCULACION = 1.15

const ESPECIALES = [
  [],
  [],
  ['Aire acondicionado de 3000 frigorías'],
  ['Aire acondicionado de 3000 frigorías', 'Aire acondicionado de 2250 frigorías'],
  ['Horno eléctrico de 2500 W'],
] as const

/** Corriente asignada de diferenciales habituales en el mercado (IEC 61008), en A. */
export const CALIBRES_DIFERENCIAL = [25, 40, 63] as const

const FUENTES_BOCAS = [aea('Tabla 770.7.III')]
const FUENTES_DIVISION = [aea('Tabla 770.7.I'), aea('Tabla 770.6.I')]
const FUENTES_CABECERA = [aea('Tabla 770.8.I'), aea('Tabla 770.8.II'), aea('770.16.5.3')]
const FUENTES_TABLERO = [
  aea('770.16.5.3'),
  aea('770.15.2.2.5'),
  aea('770.16.5.1'),
  carpetaERSeP('esquema unifilar'),
]

/** Tamaños de vivienda, para que salgan todos los grados (la galería suma aparte). */
const PERFILES = {
  chica: {
    estar: [12, 20],
    dormitorios: [1, 1],
    dormitorio: [8, 12],
    cocina: [5, 8],
    banos: [1, 1],
  },
  mediana: {
    estar: [16, 32],
    dormitorios: [1, 3],
    dormitorio: [9, 16],
    cocina: [7, 12],
    banos: [1, 2],
  },
  grande: {
    estar: [30, 45],
    dormitorios: [3, 4],
    dormitorio: [12, 20],
    cocina: [12, 18],
    banos: [2, 2],
  },
} satisfies Record<string, Record<string, [number, number]>>

function generarVivienda(): Vivienda {
  const perfil =
    PERFILES[
      elegirPonderado([
        ['chica', 1],
        ['mediana', 2],
        ['grande', 1],
      ] as const)
    ]
  const rango = ([min, max]: [number, number]) => entero(min, max)
  const ambientes: Ambiente[] = [
    { tipo: 'estar', nombre: 'Estar-comedor', medida: rango(perfil.estar) },
  ]
  const dormitorios = rango(perfil.dormitorios)
  for (let i = 1; i <= dormitorios; i++) {
    ambientes.push({
      tipo: 'dormitorio',
      nombre: dormitorios > 1 ? `Dormitorio ${i}` : 'Dormitorio',
      medida: rango(perfil.dormitorio),
    })
  }
  ambientes.push({ tipo: 'cocina', nombre: 'Cocina', medida: rango(perfil.cocina) })
  const banos = rango(perfil.banos)
  for (let i = 1; i <= banos; i++) {
    ambientes.push({ tipo: 'bano', nombre: banos > 1 ? `Baño ${i}` : 'Baño', medida: entero(3, 6) })
  }
  if (Math.random() < 0.5)
    ambientes.push({ tipo: 'lavadero', nombre: 'Lavadero', medida: entero(3, 6) })
  if (Math.random() < 0.5)
    ambientes.push({ tipo: 'galeria', nombre: 'Galería', medida: entero(3, 12) })

  const interiores = ambientes.filter((a) => a.tipo !== 'galeria')
  const cubierta = Math.round(interiores.reduce((s, a) => s + a.medida, 0) * FACTOR_CIRCULACION)
  const galeria = ambientes.find((a) => a.tipo === 'galeria')
  const semicubierta = galeria ? galeria.medida * ANCHO_GALERIA : 0
  const grado = gradoPorSuperficie(superficieLimite(cubierta, semicubierta)).id
  return { ambientes, cubierta, semicubierta, grado, especiales: [...elegir(ESPECIALES)] }
}

/** Puntos mínimos de la Tabla 770.7.III para un ambiente. */
function puntosMinimos(ambiente: Ambiente, grado: GradoElectrificacion) {
  const { tipo, medida } = ambiente
  switch (tipo) {
    case 'estar':
      return {
        iug: Math.max(1, Math.ceil(medida / 18)),
        tug: Math.max(2, Math.ceil(medida / 6)),
        regla: '1 luz cada 18 m² y 1 toma cada 6 m² (mín. 2)',
      }
    case 'dormitorio':
      return medida < 10
        ? { iug: 1, tug: 2, regla: 'menos de 10 m²: 1 luz y 2 tomas' }
        : { iug: 1, tug: 3, regla: '10 a 36 m²: 1 luz y 3 tomas' }
    case 'cocina':
      return {
        iug: grado === 'minimo' ? 1 : 2,
        tug: grado === 'superior' ? 4 : 3,
        regla: `grado ${NOMBRE_GRADO[grado].toLowerCase()}: ${grado === 'minimo' ? '1 luz' : '2 luces'} y ${grado === 'superior' ? 4 : 3} tomas (más los módulos para artefactos fijos)`,
      }
    case 'bano':
      return { iug: 1, tug: 1, regla: '1 luz y 1 toma' }
    case 'lavadero':
      return grado === 'minimo'
        ? { iug: 1, tug: 1, regla: 'grado mínimo: 1 luz y 1 toma' }
        : { iug: 1, tug: 2, regla: '1 luz y 2 tomas' }
    case 'galeria':
      return { iug: Math.ceil(medida / 5), tug: 0, regla: '1 luz cada 5 m de largo' }
  }
}

function datosVivienda(v: Vivienda): Dato[] {
  return [
    ...v.ambientes.map((a) => ({
      etiqueta: a.nombre,
      valor: a.tipo === 'galeria' ? `${a.medida} m de largo` : `${a.medida} m²`,
    })),
    { etiqueta: 'Grado', valor: NOMBRE_GRADO[v.grado] },
  ]
}

function totalBocas(v: Vivienda) {
  return v.ambientes.reduce(
    (total, a) => {
      const p = puntosMinimos(a, v.grado)
      return { iug: total.iug + p.iug, tug: total.tug + p.tug }
    },
    { iug: 0, tug: 0 },
  )
}

function exacta(valor: number, unidad: string): Respuesta {
  return { clase: 'numero', valor, unidad, decimales: 0, exacta: true }
}

function bocasEjercicio(clase: 'iug' | 'tug'): Omit<Ejercicio, 'id'> {
  const v = generarVivienda()
  const total = totalBocas(v)[clase]
  const respuesta = exacta(total, 'bocas')
  const queCuenta = clase === 'iug' ? 'bocas de iluminación (IUG)' : 'bocas de tomacorriente (TUG)'
  const conPuntos = v.ambientes.map((a) => ({ a, p: puntosMinimos(a, v.grado) }))
  const sinRedondear = v.ambientes.reduce((s, a) => {
    if (a.tipo !== 'estar') return s + puntosMinimos(a, v.grado)[clase]
    return s + a.medida / (clase === 'iug' ? 18 : 6)
  }, 0)

  return {
    tipo: 'division',
    tema: 'circuitos',
    enunciado: `¿Cuántas ${queCuenta} tiene que tener como mínimo esta vivienda?`,
    datos: datosVivienda(v),
    respuesta,
    opciones: armarOpciones(respuesta, [
      Math.floor(sinRedondear),
      total + v.ambientes.filter((a) => a.tipo === 'dormitorio').length,
      total - 1,
      total + 2,
    ]),
    pasos: [
      ...conPuntos
        .filter(({ p }) => p[clase] > 0)
        .map(({ a, p }) => `${a.nombre}: ${p[clase]} (${p.regla})`),
      `Total: ${total} bocas`,
    ],
    atajo:
      clase === 'iug'
        ? 'Una luz por ambiente, salvo el estar (1 cada 18 m²), la cocina (2 desde grado medio) y la galería (1 cada 5 m).'
        : 'Dormitorio grande 3, chico 2, baño 1, estar 1 cada 6 m². Las fracciones siempre se redondean para arriba.',
    fuentes: FUENTES_BOCAS,
  }
}

interface Division {
  iug: number
  tug: number
  tue: number
}

/** Circuitos mínimos de la Tabla 770.7.I, separados en IUG y TUG. */
const MINIMOS: Record<GradoElectrificacion, { iug: number; tug: number; total: number }> = {
  minimo: { iug: 1, tug: 1, total: 2 },
  medio: { iug: 1, tug: 1, total: 3 },
  elevado: { iug: 2, tug: 2, total: 5 },
  // El 6.º circuito del grado superior es de libre elección; acá se cuenta como de uso general.
  superior: { iug: 2, tug: 2, total: 6 },
}

function textoDivision(d: Division) {
  const partes = [d.iug && `${d.iug} IUG`, d.tug && `${d.tug} TUG`, d.tue && `${d.tue} TUE`].filter(
    Boolean,
  )
  return partes.join(' + ')
}

function esValida(d: Division, bocas: { iug: number; tug: number }, v: Vivienda) {
  const min = MINIMOS[v.grado]
  return (
    d.iug >= Math.max(min.iug, Math.ceil(bocas.iug / CIRCUITOS.IUG.maxBocas)) &&
    d.tug >= Math.max(min.tug, Math.ceil(bocas.tug / CIRCUITOS.TUG.maxBocas)) &&
    d.iug + d.tug >= min.total &&
    (v.especiales.length === 0 || d.tue >= 1)
  )
}

/** La división válida con menos circuitos: suma donde hay más bocas por circuito. */
function divisionMinima(bocas: { iug: number; tug: number }, v: Vivienda): Division {
  const min = MINIMOS[v.grado]
  const d: Division = {
    iug: Math.max(min.iug, Math.ceil(bocas.iug / CIRCUITOS.IUG.maxBocas)),
    tug: Math.max(min.tug, Math.ceil(bocas.tug / CIRCUITOS.TUG.maxBocas)),
    tue: v.especiales.length > 0 ? 1 : 0,
  }
  while (d.iug + d.tug < min.total) {
    if (bocas.tug / d.tug >= bocas.iug / d.iug) d.tug++
    else d.iug++
  }
  return d
}

function divisionEjercicio(): Omit<Ejercicio, 'id'> {
  // Bocas por encima del mínimo, como en un proyecto real, para que a veces haga falta partir circuitos.
  const v = generarVivienda()
  const minimas = totalBocas(v)
  const bocas = { iug: minimas.iug + entero(0, 8), tug: minimas.tug + entero(0, 10) }
  const correcta = divisionMinima(bocas, v)

  const candidatas: Division[] = [
    { ...correcta, iug: correcta.iug - 1 },
    { ...correcta, tug: correcta.tug - 1 },
    { ...correcta, tue: 0, tug: correcta.tug + (v.especiales.length ? 0 : -1) },
    { iug: 1, tug: 1, tue: correcta.tue },
    { iug: correcta.iug - 1, tug: correcta.tug + 1, tue: correcta.tue },
    { iug: correcta.iug + 1, tug: correcta.tug - 1, tue: correcta.tue },
    { iug: Math.ceil(bocas.iug / 20), tug: Math.ceil(bocas.tug / 20), tue: correcta.tue },
  ]
  const textoCorrecto = textoDivision(correcta)
  const incorrectas = [
    ...new Set(
      candidatas
        .filter((d) => d.iug >= 0 && d.tug >= 0 && d.iug + d.tug > 0 && !esValida(d, bocas, v))
        .map(textoDivision),
    ),
  ].filter((t) => t !== textoCorrecto)
  const respuesta: Respuesta = { clase: 'opcion', valor: textoCorrecto }
  const min = MINIMOS[v.grado]

  return {
    tipo: 'division',
    tema: 'circuitos',
    enunciado: '¿Qué división en circuitos cumple la norma con la menor cantidad de circuitos?',
    datos: [
      { etiqueta: 'Grado', valor: NOMBRE_GRADO[v.grado] },
      { etiqueta: 'Bocas de iluminación', valor: `${bocas.iug}` },
      { etiqueta: 'Bocas de tomas', valor: `${bocas.tug}` },
      {
        etiqueta: 'Aparatos especiales',
        valor: v.especiales.length ? v.especiales.join(', ') : 'Ninguno',
      },
    ],
    respuesta,
    opciones: mezclar([textoCorrecto, ...mezclar(incorrectas).slice(0, 3)]),
    pasos: [
      `Máximo 15 bocas por circuito: IUG ⌈${bocas.iug} / 15⌉ = ${Math.ceil(bocas.iug / 15)}, TUG ⌈${bocas.tug} / 15⌉ = ${Math.ceil(bocas.tug / 15)}`,
      `Grado ${NOMBRE_GRADO[v.grado].toLowerCase()}: al menos ${min.total} circuitos de uso general, con ${min.iug} IUG y ${min.tug} TUG como mínimo`,
      v.especiales.length
        ? `${v.especiales.join(' y ')}: van a un circuito TUE (toma de 20 A), no a los TUG`
        : 'Sin aparatos especiales: no hace falta TUE',
      `Resultado: ${textoCorrecto}`,
    ],
    atajo:
      'Primero dividí las bocas por 15 (redondeando para arriba); después completá hasta el mínimo del grado. Los TUE no cuentan para el mínimo.',
    nota: 'La 771 del manual incluye TUE en los circuitos mínimos; la 770 no.',
    fuentes: FUENTES_DIVISION,
  }
}

/** Arma los circuitos de una división con las bocas repartidas en partes iguales. */
function circuitosDe(d: Division, bocasIUG: number): CircuitosVivienda {
  const base = Math.floor(bocasIUG / d.iug)
  const resto = bocasIUG % d.iug
  return {
    iugSinTomas: Array.from({ length: d.iug }, (_, i) => base + (i < resto ? 1 : 0)),
    iugConTomas: 0,
    tug: d.tug,
    tue: d.tue,
  }
}

/** Vivienda con sus circuitos y el tablero principal que le corresponde. */
export function proyectoTablero() {
  const v = generarVivienda()
  const bocas = totalBocas(v)
  const division = divisionMinima(bocas, v)
  const circuitos = circuitosDe(division, bocas.iug)
  const dpms = dpmsVivienda(circuitos, v.grado)
  const ib = corrienteMonofasica(dpms)
  const cabecera = CALIBRES_PIA.find((c) => c >= ib)!
  const diferencial = CALIBRES_DIFERENCIAL.find((c) => c >= cabecera)!
  const linea = SECCIONES.find((s) => s >= 4 && IZ_MONOFASICO[s] >= cabecera)!
  const datos: Dato[] = [
    { etiqueta: 'Grado', valor: NOMBRE_GRADO[v.grado] },
    ...circuitos.iugSinTomas.map((b, i) => ({ etiqueta: `IUG ${i + 1}`, valor: `${b} bocas` })),
    { etiqueta: 'TUG', valor: `${circuitos.tug} circuito${circuitos.tug > 1 ? 's' : ''}` },
    ...(circuitos.tue ? [{ etiqueta: 'TUE', valor: v.especiales.join(', ') }] : []),
  ]
  return { v, division, circuitos, dpms, ib, cabecera, diferencial, linea, datos }
}

function cabeceraEjercicio(): Omit<Ejercicio, 'id'> {
  const p = proyectoTablero()
  const coeficiente = GRADOS.find((g) => g.id === p.v.grado)!.coeficiente
  const respuesta = exacta(p.cabecera, 'A')
  const sinCoeficiente = corrienteMonofasica(dpmsCircuito(p.circuitos))

  return {
    tipo: 'division',
    tema: 'tablero',
    enunciado:
      '¿Qué calibre mínimo tiene que tener el interruptor de cabecera del tablero principal?',
    datos: p.datos,
    respuesta,
    // Distractores: siempre calibres comerciales (sin coeficiente, uno menos, uno y dos más).
    opciones: armarOpciones(respuesta, [
      CALIBRES_PIA.find((c) => c >= sinCoeficiente) ?? 63,
      [...CALIBRES_PIA].reverse().find((c) => c < p.cabecera) ?? 63,
      CALIBRES_PIA.find((c) => c > p.cabecera) ?? 6,
      CALIBRES_PIA.filter((c) => c > p.cabecera)[1] ?? 10,
      [...CALIBRES_PIA].reverse().filter((c) => c < p.cabecera)[1] ?? 13,
    ]),
    pasos: [
      `DPMS = (suma de los circuitos) · ${formatear(coeficiente)} = ${formatear(dpmsCircuito(p.circuitos), 0)} VA · ${formatear(coeficiente)} = ${formatear(p.dpms, 0)} VA`,
      `Ib = ${formatear(p.dpms, 0)} VA / ${TENSION_MONOFASICA} V = ${formatear(p.ib, 1)} A`,
      `Calibre comercial que cumple Ib ≤ In: ${p.cabecera} A`,
      `La línea principal tiene que aguantarlo (In ≤ Iz): ${formatear(p.linea)} mm² (Iz ${IZ_MONOFASICO[p.linea]} A).`,
    ],
    atajo:
      'IUG: 40 VA por boca. TUG: 2200 VA. TUE: 3300 VA. Multiplicá por el coeficiente del grado y dividí por 220 (≈ kVA × 4,5).',
    fuentes: FUENTES_CABECERA,
  }
}

function composicionEjercicio(): Omit<Ejercicio, 'id'> {
  const p = proyectoTablero()
  const n = p.division.iug + p.division.tug + p.division.tue
  const pias = `${n} PIA bipolares`
  const correcta = `Cabecera 2 × ${p.cabecera} A → Diferencial 2 × ${p.diferencial} A 30 mA → ${pias}`
  const diferencialChico = [...CALIBRES_DIFERENCIAL].reverse().find((c) => c < p.cabecera)
  const incorrectas = [
    `Cabecera 2 × ${p.cabecera} A → Diferencial 2 × ${p.diferencial} A 300 mA → ${pias}`,
    `Cabecera 2 × ${p.cabecera} A → Diferencial 2 × ${p.diferencial} A 30 mA → ${n} PIA unipolares`,
    `Diferencial 2 × ${p.diferencial} A 30 mA → Cabecera 2 × ${p.cabecera} A → ${pias}`,
    `Cabecera 2 × ${p.cabecera} A → ${pias} → Diferencial 2 × ${p.diferencial} A 30 mA`,
    ...(diferencialChico
      ? [`Cabecera 2 × ${p.cabecera} A → Diferencial 2 × ${diferencialChico} A 30 mA → ${pias}`]
      : []),
    `Cabecera 2 × ${p.cabecera} A → Diferencial 2 × ${p.diferencial} A 30 mA → ${Math.max(1, n - 1)} PIA bipolares`,
  ]
  const respuesta: Respuesta = { clase: 'opcion', valor: correcta }

  return {
    tipo: 'division',
    tema: 'tablero',
    enunciado: '¿Cómo queda el tablero principal de esta vivienda?',
    datos: [...p.datos, { etiqueta: 'Corriente de proyecto', valor: `${formatear(p.ib, 1)} A` }],
    respuesta,
    opciones: mezclar([correcta, ...mezclar(incorrectas).slice(0, 3)]),
    pasos: [
      `Cabecera: el calibre comercial que cumple Ib ≤ In → ${p.cabecera} A, bipolar`,
      `Diferencial: 30 mA, con corriente asignada igual o mayor que la cabecera → 2 × ${p.diferencial} A`,
      `Un PIA bipolar por circuito: ${textoDivision(p.division)} = ${n} PIA`,
      'Orden: cabecera → diferencial → PIA de cada circuito',
    ],
    atajo:
      'Primero se corta todo, después se protege a las personas, al final cada cable. En monofásico todo es bipolar.',
    nota: 'Si la cabecera ya está en el TPA (Córdoba), el tablero de adentro puede arrancar con el diferencial.',
    fuentes: FUENTES_TABLERO,
  }
}

export function generarDivision(): Omit<Ejercicio, 'id'> {
  return elegirPonderado([
    [() => bocasEjercicio('iug'), 2],
    [() => bocasEjercicio('tug'), 2],
    [divisionEjercicio, 3],
    [cabeceraEjercicio, 2],
    [composicionEjercicio, 2],
  ] as const)()
}
