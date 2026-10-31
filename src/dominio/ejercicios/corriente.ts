import { corrienteMonofasica, corrienteTrifasica } from '../calculos'
import { TENSION_MONOFASICA, TENSION_TRIFASICA } from '../normativa'
import { manual } from '../referencias'
import type { Ejercicio, Respuesta } from './tipos'
import { armarOpciones, elegir, formatear } from './util'

interface Aparato {
  nombre: string
  potenciasW: number[]
  cosPhi: number
}

const APARATOS_MONOFASICOS: Aparato[] = [
  { nombre: 'Termotanque eléctrico', potenciasW: [1500, 2000], cosPhi: 1 },
  { nombre: 'Horno eléctrico', potenciasW: [1800, 2200, 2500], cosPhi: 1 },
  { nombre: 'Pava eléctrica', potenciasW: [1800, 2200], cosPhi: 1 },
  { nombre: 'Estufa de cuarzo', potenciasW: [1200, 1600], cosPhi: 1 },
  { nombre: 'Anafe eléctrico', potenciasW: [3000, 3500], cosPhi: 1 },
  { nombre: 'Aire acondicionado', potenciasW: [1100, 1500, 2200], cosPhi: 0.85 },
  { nombre: 'Bomba de agua', potenciasW: [550, 750, 1100], cosPhi: 0.8 },
  { nombre: 'Lavarropas', potenciasW: [2000, 2200], cosPhi: 0.9 },
]

const MOTORES_TRIFASICOS_KW = [1.5, 2.2, 3, 4, 5.5, 7.5, 11]

const FUENTES_CORRIENTE = [
  manual('2.17 Corriente alternada'),
  manual('2.18 Sistemas monofásicos y trifásicos'),
]

function respuestaAmperes(valor: number): Respuesta {
  return { clase: 'numero', valor, unidad: 'A', decimales: 1, exacta: false }
}

function monofasico(): Omit<Ejercicio, 'id'> {
  const aparato = elegir(APARATOS_MONOFASICOS)
  const potencia = elegir(aparato.potenciasW)
  const { cosPhi } = aparato
  const corriente = corrienteMonofasica(potencia, cosPhi)
  const respuesta = respuestaAmperes(corriente)
  const resistivo = cosPhi === 1

  return {
    tipo: 'corriente',
    enunciado: '¿Qué corriente consume este aparato en 220 V monofásica?',
    datos: [
      { etiqueta: 'Aparato', valor: aparato.nombre },
      { etiqueta: 'Potencia', valor: `${formatear(potencia)} W` },
      { etiqueta: 'Tensión', valor: `${TENSION_MONOFASICA} V` },
      { etiqueta: 'cos φ', valor: resistivo ? '1 (carga resistiva)' : formatear(cosPhi) },
    ],
    respuesta,
    opciones: armarOpciones(respuesta, [
      potencia / TENSION_TRIFASICA,
      resistivo ? potencia / (Math.sqrt(3) * TENSION_MONOFASICA) : potencia / TENSION_MONOFASICA,
      (potencia * cosPhi) / TENSION_MONOFASICA,
      potencia / (Math.sqrt(3) * TENSION_TRIFASICA),
    ]),
    pasos: [
      'I = P / (U · cos φ)',
      `I = ${formatear(potencia)} W / (${TENSION_MONOFASICA} V · ${formatear(cosPhi)})`,
      `I = ${formatear(corriente, 1)} A`,
    ],
    atajo: resistivo
      ? `En 220 V cada kW son ≈ 4,5 A (1000 / 220 = 4,55). ${formatear(potencia / 1000)} kW × 4,5 ≈ ${formatear((potencia / 1000) * 4.5, 1)} A.`
      : `Primero sacá la corriente como si fuera resistiva (kW × 4,5) y después dividí por el cos φ: ${formatear(((potencia / 1000) * 4.5) / cosPhi, 1)} A.`,
    fuentes: FUENTES_CORRIENTE,
  }
}

function trifasico(): Omit<Ejercicio, 'id'> {
  const potenciaKW = elegir(MOTORES_TRIFASICOS_KW)
  const potencia = potenciaKW * 1000
  const cosPhi = 0.85
  const corriente = corrienteTrifasica(potencia, cosPhi)
  const respuesta = respuestaAmperes(corriente)

  return {
    tipo: 'corriente',
    enunciado: '¿Qué corriente de línea consume un motor trifásico en 3 × 380 V?',
    datos: [
      { etiqueta: 'Potencia', valor: `${formatear(potenciaKW)} kW` },
      { etiqueta: 'Tensión de línea', valor: `${TENSION_TRIFASICA} V` },
      { etiqueta: 'cos φ', valor: formatear(cosPhi) },
    ],
    respuesta,
    opciones: armarOpciones(respuesta, [
      potencia / (TENSION_TRIFASICA * cosPhi),
      potencia / (Math.sqrt(3) * TENSION_TRIFASICA),
      potencia / (Math.sqrt(3) * TENSION_MONOFASICA * cosPhi),
      potencia / (3 * TENSION_TRIFASICA * cosPhi),
    ]),
    pasos: [
      'I = P / (√3 · U · cos φ)',
      `I = ${formatear(potencia)} W / (1,732 · ${TENSION_TRIFASICA} V · ${formatear(cosPhi)})`,
      `I = ${formatear(corriente, 1)} A`,
    ],
    atajo: `En 3 × 380 V con cos φ 0,85 cada kW son ≈ 1,8 A. ${formatear(potenciaKW)} kW × 1,8 ≈ ${formatear(potenciaKW * 1.8, 1)} A.`,
    fuentes: FUENTES_CORRIENTE,
  }
}

export function generarCorriente(): Omit<Ejercicio, 'id'> {
  return Math.random() < 0.65 ? monofasico() : trifasico()
}
