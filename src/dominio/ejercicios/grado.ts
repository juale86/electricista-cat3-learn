import {
  dpmsCircuito,
  dpmsVivienda,
  gradoPorSuperficie,
  superficieLimite,
  type CircuitosVivienda,
} from '../calculos'
import {
  COEFICIENTE_MANUAL_771,
  DPMS,
  FUENTES,
  GRADOS,
  NOMBRE_GRADO,
  VA_POR_BOCA_MANUAL_771,
  type GradoElectrificacion,
} from '../normativa'
import type { Ejercicio, Respuesta } from './tipos'
import { armarOpciones, elegir, elegirPonderado, entero, formatear } from './util'

const NOMBRES_GRADO = GRADOS.map((g) => NOMBRE_GRADO[g.id])

function superficies() {
  const cubierta = entero(8, 44) * 5
  const semicubierta = elegir([0, 6, 10, 12, 16, 20, 24, 30])
  return { cubierta, semicubierta, limite: superficieLimite(cubierta, semicubierta) }
}

function datosSuperficie(cubierta: number, semicubierta: number) {
  return [
    { etiqueta: 'Superficie cubierta', valor: `${cubierta} m²` },
    { etiqueta: 'Superficie semicubierta', valor: `${semicubierta} m²` },
  ]
}

function superficieLimiteEjercicio(): Omit<Ejercicio, 'id'> {
  const { cubierta, semicubierta, limite } = superficies()
  const respuesta: Respuesta = {
    clase: 'numero',
    valor: limite,
    unidad: 'm²',
    decimales: 1,
    exacta: false,
  }

  return {
    tipo: 'grado',
    enunciado: '¿Cuál es la superficie límite de aplicación de esta vivienda?',
    datos: datosSuperficie(cubierta, semicubierta),
    respuesta,
    opciones: armarOpciones(respuesta, [
      cubierta + semicubierta,
      cubierta,
      cubierta + semicubierta * 2,
    ]),
    pasos: [
      'S límite = S cubierta + 0,5 · S semicubierta',
      `S límite = ${cubierta} + 0,5 · ${semicubierta} = ${formatear(limite, 1)} m²`,
    ],
    atajo: 'La semicubierta cuenta la mitad.',
    fuentes: [FUENTES.superficieLimite],
  }
}

function gradoEjercicio(): Omit<Ejercicio, 'id'> {
  const { cubierta, semicubierta, limite } = superficies()
  const grado = gradoPorSuperficie(limite)
  const respuesta: Respuesta = { clase: 'opcion', valor: NOMBRE_GRADO[grado.id] }

  return {
    tipo: 'grado',
    enunciado: '¿Qué grado de electrificación le corresponde a esta vivienda?',
    datos: datosSuperficie(cubierta, semicubierta),
    respuesta,
    opciones: NOMBRES_GRADO,
    pasos: [
      `S límite = ${cubierta} + 0,5 · ${semicubierta} = ${formatear(limite, 1)} m²`,
      'Mínimo hasta 60 m², medio hasta 130 m², elevado hasta 200 m², superior más de 200 m²',
      `${formatear(limite, 1)} m² → grado ${NOMBRE_GRADO[grado.id].toLowerCase()}`,
    ],
    atajo: 'Límites: 60 / 130 / 200 m².',
    fuentes: [FUENTES.superficieLimite, FUENTES.grados],
  }
}

function circuitosMinimosEjercicio(): Omit<Ejercicio, 'id'> {
  const grado = elegir(GRADOS)
  const respuesta: Respuesta = {
    clase: 'numero',
    valor: grado.circuitosMinimos,
    unidad: 'circuitos',
    decimales: 0,
    exacta: true,
  }

  return {
    tipo: 'grado',
    enunciado: '¿Cuántos circuitos mínimos exige este grado de electrificación?',
    datos: [{ etiqueta: 'Grado', valor: NOMBRE_GRADO[grado.id] }],
    respuesta,
    opciones: armarOpciones(
      respuesta,
      GRADOS.filter((g) => g.id !== grado.id).map((g) => g.circuitosMinimos),
    ),
    pasos: [
      'Mínimo: 2 · Medio: 3 · Elevado: 5 · Superior: 6',
      `Grado ${NOMBRE_GRADO[grado.id].toLowerCase()} → ${grado.circuitosMinimos} circuitos`,
    ],
    nota: 'En la 770 los circuitos mínimos son solo de uso general (IUG/TUG). La 771 del manual incluye TUE en los mínimos.',
    fuentes: [FUENTES.grados],
  }
}

function describirCircuitos(c: CircuitosVivienda): string[] {
  const lineas = c.iugSinTomas.map((bocas, i) => `IUG ${i + 1} sin tomas: ${bocas} bocas`)
  if (c.iugConTomas) lineas.push(`IUG con tomas derivados: ${c.iugConTomas}`)
  lineas.push(`TUG: ${c.tug}`)
  if (c.tue) lineas.push(`TUE: ${c.tue}`)
  return lineas
}

function dpmsEjercicio(): Omit<Ejercicio, 'id'> {
  const gradoId = elegir<GradoElectrificacion>(['minimo', 'medio', 'elevado'])
  // Combinaciones IUG/TUG de la Tabla 770.7.I: mínimo 1/1, medio 2/1 o 1/2, elevado 2/3 o 3/2
  const combinaciones: Record<GradoElectrificacion, [number, number][]> = {
    minimo: [[1, 1]],
    medio: [
      [2, 1],
      [1, 2],
    ],
    elevado: [
      [2, 3],
      [3, 2],
    ],
    superior: [],
  }
  const [cantidadIUG, cantidadTUG] = elegir(combinaciones[gradoId])
  // En medio y elevado, a veces uno de los IUG tiene tomas derivados
  const iugConTomas = gradoId !== 'minimo' && Math.random() < 0.3 ? 1 : 0
  const circuitos: CircuitosVivienda = {
    iugSinTomas: Array.from({ length: cantidadIUG - iugConTomas }, () => entero(4, 13)),
    iugConTomas,
    tug: cantidadTUG,
    tue: gradoId === 'minimo' ? 0 : entero(0, 1),
  }
  const grado = GRADOS.find((g) => g.id === gradoId)!
  const suma = dpmsCircuito(circuitos)
  const dpms = dpmsVivienda(circuitos, gradoId)
  const respuesta: Respuesta = {
    clase: 'numero',
    valor: dpms,
    unidad: 'VA',
    decimales: 0,
    exacta: false,
  }

  const bocasIUG = circuitos.iugSinTomas.reduce((a, b) => a + b, 0)
  const sinIUG = suma - bocasIUG * DPMS.vaPorBocaIUG * DPMS.fraccionIUGSinTomas
  const manual =
    (sinIUG + bocasIUG * VA_POR_BOCA_MANUAL_771 * DPMS.fraccionIUGSinTomas) *
    COEFICIENTE_MANUAL_771[gradoId]

  return {
    tipo: 'grado',
    enunciado: '¿Cuál es la demanda de potencia máxima simultánea (DPMS) de la vivienda?',
    datos: [
      { etiqueta: 'Grado', valor: NOMBRE_GRADO[gradoId] },
      ...describirCircuitos(circuitos).map((valor, i) => ({
        etiqueta: `Circuito ${i + 1}`,
        valor,
      })),
    ],
    respuesta,
    opciones: armarOpciones(respuesta, [
      suma,
      (sinIUG + bocasIUG * DPMS.vaPorBocaIUG) * grado.coeficiente,
      manual,
    ]),
    pasos: [
      'IUG sin tomas: 2/3 · bocas · 60 VA · IUG con tomas y TUG: 2200 VA · TUE: 3300 VA',
      `IUG sin tomas: 2/3 · ${bocasIUG} bocas · 60 VA = ${formatear(bocasIUG * 40)} VA`,
      `Suma de circuitos = ${formatear(suma)} VA`,
      `Coeficiente de simultaneidad (${NOMBRE_GRADO[gradoId].toLowerCase()}) = ${formatear(grado.coeficiente)}`,
      `DPMS = ${formatear(suma)} · ${formatear(grado.coeficiente)} = ${formatear(dpms, 0)} VA`,
    ],
    atajo: '2/3 de 60 VA son 40 VA por boca de iluminación.',
    nota: `Con el manual del curso (771: 150 VA por boca, coeficiente ${formatear(COEFICIENTE_MANUAL_771[gradoId])}) daría ${formatear(manual, 0)} VA.`,
    fuentes: [FUENTES.dpms, FUENTES.coeficientes],
  }
}

// Circuitos mínimos y grado tienen pocas respuestas posibles: salen menos para que no se repitan.
export function generarGrado(): Omit<Ejercicio, 'id'> {
  return elegirPonderado([
    [superficieLimiteEjercicio, 3],
    [gradoEjercicio, 2],
    [circuitosMinimosEjercicio, 1],
    [dpmsEjercicio, 4],
  ] as const)()
}
