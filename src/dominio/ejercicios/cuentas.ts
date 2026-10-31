// Cuentas sueltas para practicar la aritmética que aparece en los cálculos de la instalación.
// Cada variante trae un atajo de cálculo mental.

import { IZ_MONOFASICO } from '../normativa'
import { programaUTN } from '../referencias'
import type { Ejercicio, Respuesta } from './tipos'
import { armarOpciones, elegir, entero, formatear } from './util'

const FUENTES = [programaUTN(2)]

function numero(valor: number, unidad: string, decimales = 2): Respuesta {
  return { clase: 'numero', valor, unidad, decimales, exacta: false }
}

function cuenta(
  enunciado: string,
  respuesta: Respuesta,
  distractores: number[],
  pasos: string[],
  atajo: string,
): Omit<Ejercicio, 'id'> {
  return {
    tipo: 'cuentas',
    tema: 'matematica',
    enunciado,
    datos: [],
    respuesta,
    opciones: armarOpciones(respuesta, distractores),
    pasos,
    atajo,
    fuentes: FUENTES,
  }
}

function dividirPor220() {
  const potencia = entero(2, 40) * 110
  const resultado = potencia / 220
  return cuenta(
    `¿Cuánto es ${formatear(potencia)} ÷ 220?`,
    numero(resultado, '', 2),
    [potencia / 380, potencia / 22, resultado * 1.73],
    [`${formatear(potencia)} ÷ 220 = ${formatear(resultado, 2)}`],
    `Dividir por 220 es casi lo mismo que pasar a miles y multiplicar por 4,5: ${formatear(potencia / 1000, 2)} × 4,5 ≈ ${formatear((potencia / 1000) * 4.5, 2)}.`,
  )
}

function multiplicarPor220() {
  const corriente = entero(2, 60) / 2
  const resultado = corriente * 220
  return cuenta(
    `¿Cuánto es ${formatear(corriente, 1)} × 220?`,
    numero(resultado, '', 0),
    [corriente * 380, corriente * 22, resultado / 2],
    [`${formatear(corriente, 1)} × 220 = ${formatear(resultado, 0)}`],
    `× 220 = × 200 + × 20: ${formatear(corriente * 200, 0)} + ${formatear(corriente * 20, 0)} = ${formatear(resultado, 0)}.`,
  )
}

function factorDeCorreccion() {
  const iz = IZ_MONOFASICO[elegir([1.5, 2.5, 4, 6, 10, 16])]
  const factor = elegir([0.8, 0.7])
  const resultado = iz * factor
  const resta = 1 - factor
  return cuenta(
    `¿Cuánto es ${iz} × ${formatear(factor)}?`,
    numero(resultado, '', 1),
    [iz * (1 + resta), iz * resta, iz * (factor === 0.8 ? 0.7 : 0.8)],
    [`${iz} × ${formatear(factor)} = ${formatear(resultado, 1)}`],
    `× ${formatear(factor)} es restar el ${formatear(resta * 100)} %: ${iz} − ${formatear(iz * resta, 1)} = ${formatear(resultado, 1)}. Es la cuenta de la Iz corregida por agrupamiento.`,
  )
}

function porcentaje() {
  const tension = elegir([220, 380])
  const pct = elegir([1, 2, 3, 5])
  const resultado = (tension * pct) / 100
  return cuenta(
    `¿Cuánto es el ${pct} % de ${tension} V?`,
    numero(resultado, 'V', 2),
    [tension * pct, (tension * pct) / 10, (tension * pct) / 1000],
    [`${tension} × ${pct} / 100 = ${formatear(resultado, 2)} V`],
    `El 1 % de ${tension} es ${formatear(tension / 100, 2)} (correr la coma dos lugares). Por ${pct}: ${formatear(resultado, 2)} V.`,
  )
}

function quePorcentaje() {
  const pct = elegir([1, 1.5, 2, 2.5, 3, 4, 5])
  const caida = (220 * pct) / 100
  return cuenta(
    `En 220 V caen ${formatear(caida, 2)} V. ¿Qué porcentaje es?`,
    numero(pct, '%', 1),
    [pct * 10, pct / 10, (caida / 380) * 100],
    [`% = ${formatear(caida, 2)} / 220 × 100 = ${formatear(pct, 1)} %`],
    'Cada 2,2 V es 1 % de 220 V: dividí la caída por 2,2.',
  )
}

function raizDeTres() {
  const variante = elegir(['fase', 'linea', 'corriente'] as const)
  if (variante === 'fase') {
    return cuenta(
      '¿Cuánto es 380 ÷ √3?',
      numero(380 / Math.sqrt(3), 'V', 0),
      [380 * Math.sqrt(3), 380 / 3, 380 / 2],
      ['380 ÷ 1,732 = 219,4 ≈ 220 V'],
      'Es la tensión de fase de una red de 380 V: dividir por √3 da 220 V. Para dividir por √3, multiplicá por 0,58.',
    )
  }
  if (variante === 'linea') {
    return cuenta(
      '¿Cuánto es 220 × √3?',
      numero(220 * Math.sqrt(3), 'V', 0),
      [220 / Math.sqrt(3), 220 * 3, 220 * 2],
      ['220 × 1,732 = 381 ≈ 380 V'],
      '√3 ≈ 1,73. Entre dos fases de 220 V hay 380 V.',
    )
  }
  const corriente = entero(4, 30)
  const resultado = corriente * Math.sqrt(3)
  return cuenta(
    `¿Cuánto es ${corriente} × √3?`,
    numero(resultado, '', 1),
    [corriente / Math.sqrt(3), corriente * 3, corriente * 1.41],
    [`${corriente} × 1,732 = ${formatear(resultado, 1)}`],
    `√3 ≈ 1,73: sumale al número un poco menos de sus tres cuartos. ${corriente} + ${formatear(corriente * 0.73, 1)} = ${formatear(resultado, 1)}.`,
  )
}

function unidades() {
  const variante = elegir(['WakW', 'kWaW', 'mAaA', 'AamA'] as const)
  if (variante === 'WakW') {
    const watts = elegir([75, 150, 600, 1100, 1500, 2200, 3300, 4500])
    return cuenta(
      `¿Cuántos kW son ${formatear(watts)} W?`,
      numero(watts / 1000, 'kW', 3),
      [watts * 1000, watts / 100, watts / 10],
      [`${formatear(watts)} ÷ 1000 = ${formatear(watts / 1000, 3)} kW`],
      'kilo = mil: correr la coma tres lugares a la izquierda.',
    )
  }
  if (variante === 'kWaW') {
    const kw = elegir([0.5, 0.75, 1.1, 1.5, 2.2, 3.5, 5.5, 7.5])
    return cuenta(
      `¿Cuántos W son ${formatear(kw)} kW?`,
      numero(kw * 1000, 'W', 0),
      [kw * 100, kw * 10000, kw * 10],
      [`${formatear(kw)} × 1000 = ${formatear(kw * 1000, 0)} W`],
      'kilo = mil: correr la coma tres lugares a la derecha.',
    )
  }
  if (variante === 'mAaA') {
    const ma = elegir([10, 30, 100, 300, 500])
    return cuenta(
      `¿Cuántos A son ${ma} mA?`,
      numero(ma / 1000, 'A', 3),
      [ma / 100, ma * 1000, ma / 10],
      [`${ma} ÷ 1000 = ${formatear(ma / 1000, 3)} A`],
      'mili = milésima: 30 mA = 0,03 A. Sirve para la cuenta de Ra × IΔn.',
    )
  }
  const amperes = elegir([0.01, 0.03, 0.1, 0.3, 0.5])
  return cuenta(
    `¿Cuántos mA son ${formatear(amperes, 3)} A?`,
    numero(amperes * 1000, 'mA', 0),
    [amperes * 100, amperes * 10, amperes * 10000],
    [`${formatear(amperes, 3)} × 1000 = ${formatear(amperes * 1000, 0)} mA`],
    'mili = milésima: multiplicar por 1000 (correr la coma tres lugares a la derecha).',
  )
}

function despeje() {
  const coeficiente = elegir([2.5, 4, 1.5, 0.8, 220, 15])
  const x = elegir([2, 3, 4, 5, 6, 8, 10, 12, 16, 20])
  const producto = coeficiente * x
  return cuenta(
    `Si ${formatear(coeficiente)} · x = ${formatear(producto)}, ¿cuánto vale x?`,
    numero(x, '', 2),
    [producto * coeficiente, producto - coeficiente, x * 10],
    [`x = ${formatear(producto)} ÷ ${formatear(coeficiente)} = ${formatear(x)}`],
    'Lo que multiplica a x pasa al otro lado dividiendo.',
  )
}

const VARIANTES = [
  dividirPor220,
  multiplicarPor220,
  factorDeCorreccion,
  porcentaje,
  quePorcentaje,
  raizDeTres,
  unidades,
  despeje,
]

export function generarCuentas(): Omit<Ejercicio, 'id'> {
  return elegir(VARIANTES)()
}
