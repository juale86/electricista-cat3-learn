import { manual } from '../referencias'
import type { Ejercicio, Respuesta } from './tipos'
import { armarOpciones, elegir, formatear } from './util'

const FUENTE_OHM = manual('2.4 Ley de Ohm')
const FUENTE_AGRUPAMIENTO = manual('2.9 Agrupamiento de resistencias')

function numero(valor: number, unidad: string, decimales = 2): Respuesta {
  return { clase: 'numero', valor, unidad, decimales, exacta: false }
}

/** Corriente que consume una resistencia de calefacción. */
function corrienteResistencia(): Omit<Ejercicio, 'id'> {
  const r = elegir([22, 24.2, 32.3, 44, 48.4, 55, 88])
  const i = 220 / r
  const respuesta = numero(i, 'A', 1)

  return {
    tipo: 'ohm',
    enunciado: '¿Qué corriente circula por esta resistencia de calefacción conectada a 220 V?',
    datos: [
      { etiqueta: 'Resistencia', valor: `${formatear(r)} Ω` },
      { etiqueta: 'Tensión', valor: '220 V' },
    ],
    respuesta,
    opciones: armarOpciones(respuesta, [220 * r, r / 220, 380 / r]),
    pasos: ['I = U / R', `I = 220 V / ${formatear(r)} Ω = ${formatear(i, 1)} A`],
    atajo:
      'Triángulo de Ohm: tapá lo que buscás. U arriba, I y R abajo: I = U / R, R = U / I, U = I · R.',
    fuentes: [FUENTE_OHM],
  }
}

/** Corriente a través del cuerpo humano: conecta con seguridad eléctrica. */
function corrienteCuerpo(): Omit<Ejercicio, 'id'> {
  const r = elegir([1000, 1500, 2000, 2500])
  const u = elegir([24, 50, 220])
  const ma = (u / r) * 1000
  const respuesta = numero(ma, 'mA', 1)

  return {
    tipo: 'ohm',
    enunciado: '¿Qué corriente circula por el cuerpo de una persona que toca esta tensión?',
    datos: [
      { etiqueta: 'Tensión de contacto', valor: `${u} V` },
      { etiqueta: 'Resistencia del cuerpo', valor: `${formatear(r)} Ω` },
    ],
    respuesta,
    opciones: armarOpciones(respuesta, [r / u, (u * r) / 1000, ma * 10]),
    pasos: [
      'I = U / R',
      `I = ${u} V / ${formatear(r)} Ω = ${formatear(u / r, 4)} A`,
      `En mA (× 1000): ${formatear(ma, 1)} mA`,
      ma > 10
        ? 'Supera los 10 mA del umbral de no soltar: es peligroso.'
        : 'Está por debajo de los 10 mA del umbral de no soltar.',
    ],
    nota: 'Umbrales en CA (Manual Cat. III, 2.19): percepción 0,5 mA, no soltar 10 mA. El diferencial de 30 mA corta antes de que se llegue a la fibrilación.',
    fuentes: [FUENTE_OHM, manual('2.19 Efectos fisiológicos de la corriente')],
  }
}

/** Tensión que cae en un cable o empalme. */
function caidaEnResistencia(): Omit<Ejercicio, 'id'> {
  const r = elegir([0.1, 0.2, 0.25, 0.3, 0.5])
  const i = elegir([5, 8, 10, 15, 20])
  const u = i * r
  const respuesta = numero(u, 'V')

  return {
    tipo: 'ohm',
    enunciado: '¿Cuántos volts caen en este cable?',
    datos: [
      { etiqueta: 'Resistencia del cable (ida y vuelta)', valor: `${formatear(r)} Ω` },
      { etiqueta: 'Corriente', valor: `${i} A` },
    ],
    respuesta,
    opciones: armarOpciones(respuesta, [i / r, r / i, u * 2]),
    pasos: ['U = I · R', `U = ${i} A · ${formatear(r)} Ω = ${formatear(u)} V`],
    fuentes: [FUENTE_OHM],
  }
}

function serie(): Omit<Ejercicio, 'id'> {
  const resistencias = [elegir([10, 22, 47, 100]), elegir([33, 56, 68, 150]), elegir([12, 82, 220])]
  const total = resistencias.reduce((a, b) => a + b, 0)
  const respuesta = numero(total, 'Ω', 1)
  const paralelo = 1 / resistencias.reduce((a, r) => a + 1 / r, 0)

  return {
    tipo: 'ohm',
    enunciado:
      '¿Cuál es la resistencia equivalente de estas tres resistencias conectadas en serie?',
    datos: resistencias.map((r, i) => ({ etiqueta: `R${i + 1}`, valor: `${r} Ω` })),
    respuesta,
    opciones: armarOpciones(respuesta, [paralelo, total / 3, Math.max(...resistencias)]),
    pasos: [
      'En serie se suman: Req = R1 + R2 + R3',
      `Req = ${resistencias.join(' + ')} = ${formatear(total, 1)} Ω`,
    ],
    atajo: 'En serie, la equivalente siempre es mayor que la más grande.',
    fuentes: [FUENTE_AGRUPAMIENTO],
  }
}

function paralelo(): Omit<Ejercicio, 'id'> {
  const r1 = elegir([10, 20, 30, 40, 60, 100])
  const r2 = elegir([10, 20, 30, 60, 120])
  const total = (r1 * r2) / (r1 + r2)
  const respuesta = numero(total, 'Ω', 1)

  return {
    tipo: 'ohm',
    enunciado: '¿Cuál es la resistencia equivalente de estas dos resistencias en paralelo?',
    datos: [
      { etiqueta: 'R1', valor: `${r1} Ω` },
      { etiqueta: 'R2', valor: `${r2} Ω` },
    ],
    respuesta,
    opciones: armarOpciones(respuesta, [r1 + r2, (r1 + r2) / 2, Math.min(r1, r2)]),
    pasos: [
      'Dos en paralelo: Req = (R1 · R2) / (R1 + R2)',
      `Req = (${r1} · ${r2}) / (${r1} + ${r2}) = ${formatear(total, 1)} Ω`,
    ],
    atajo:
      'En paralelo, la equivalente siempre es menor que la más chica. Si son iguales, es la mitad.',
    fuentes: [FUENTE_AGRUPAMIENTO],
  }
}

export function generarOhm(): Omit<Ejercicio, 'id'> {
  return elegir([corrienteResistencia, corrienteCuerpo, caidaEnResistencia, serie, paralelo])()
}
