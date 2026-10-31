import { manual } from '../referencias'
import type { Ejercicio, Respuesta } from './tipos'
import { armarOpciones, elegir, formatear } from './util'

const FUENTE = manual('2.13 Potencia eléctrica, energía y calor')

interface Uso {
  aparato: string
  potenciaW: number
  horasPorDia: number
}

const USOS: Uso[] = [
  { aparato: 'Termotanque eléctrico', potenciaW: 2000, horasPorDia: 3 },
  { aparato: 'Aire acondicionado', potenciaW: 1100, horasPorDia: 6 },
  { aparato: 'Estufa de cuarzo', potenciaW: 1200, horasPorDia: 4 },
  { aparato: 'Lámpara LED', potenciaW: 10, horasPorDia: 5 },
  { aparato: 'Televisor', potenciaW: 100, horasPorDia: 4 },
  { aparato: 'Bomba de agua', potenciaW: 750, horasPorDia: 2 },
  { aparato: 'Horno eléctrico', potenciaW: 2000, horasPorDia: 1 },
]

function numero(valor: number, unidad: string, decimales = 2): Respuesta {
  return { clase: 'numero', valor, unidad, decimales, exacta: false }
}

function energiaMensual(): Omit<Ejercicio, 'id'> {
  const uso = elegir(USOS)
  const dias = 30
  const kwh = (uso.potenciaW * uso.horasPorDia * dias) / 1000
  const respuesta = numero(kwh, 'kWh', 1)

  return {
    tipo: 'energia',
    enunciado: '¿Cuánta energía consume este aparato en un mes de 30 días?',
    datos: [
      { etiqueta: 'Aparato', valor: uso.aparato },
      { etiqueta: 'Potencia', valor: `${formatear(uso.potenciaW)} W` },
      { etiqueta: 'Uso diario', valor: `${uso.horasPorDia} h` },
    ],
    respuesta,
    opciones: armarOpciones(respuesta, [
      kwh * 1000,
      (uso.potenciaW * uso.horasPorDia) / 1000,
      (uso.potenciaW * dias) / 1000,
    ]),
    pasos: [
      'E [kWh] = P [kW] · horas',
      `P = ${formatear(uso.potenciaW)} W = ${formatear(uso.potenciaW / 1000, 3)} kW`,
      `Horas en el mes = ${uso.horasPorDia} h · ${dias} días = ${uso.horasPorDia * dias} h`,
      `E = ${formatear(uso.potenciaW / 1000, 3)} kW · ${uso.horasPorDia * dias} h = ${formatear(kwh, 1)} kWh`,
    ],
    atajo: 'Pasá los watts a kW (dividí por 1000) antes de multiplicar por las horas.',
    fuentes: [FUENTE],
  }
}

function costo(): Omit<Ejercicio, 'id'> {
  const uso = elegir(USOS.filter((u) => u.potenciaW >= 750))
  const precio = elegir([100, 150, 200, 250])
  const kwh = (uso.potenciaW * uso.horasPorDia * 30) / 1000
  const total = kwh * precio
  const respuesta = numero(total, 'pesos', 0)

  return {
    tipo: 'energia',
    enunciado: '¿Cuánto cuesta por mes la energía que consume este aparato?',
    datos: [
      { etiqueta: 'Aparato', valor: uso.aparato },
      { etiqueta: 'Potencia', valor: `${formatear(uso.potenciaW)} W` },
      { etiqueta: 'Uso diario', valor: `${uso.horasPorDia} h (30 días)` },
      { etiqueta: 'Precio de la energía', valor: `$${precio} por kWh (valor de ejemplo)` },
    ],
    respuesta,
    opciones: armarOpciones(respuesta, [total * 1000, (total / 30) | 0, kwh]),
    pasos: [
      `E = ${formatear(uso.potenciaW / 1000, 3)} kW · ${uso.horasPorDia} h · 30 = ${formatear(kwh, 1)} kWh`,
      `Costo = ${formatear(kwh, 1)} kWh · $${precio} = $${formatear(total, 0)}`,
    ],
    nota: 'La factura real suma cargos fijos e impuestos; este cálculo es solo la parte de energía.',
    fuentes: [FUENTE],
  }
}

function potenciaDesdeTensionCorriente(): Omit<Ejercicio, 'id'> {
  const i = elegir([2.5, 4, 6, 8, 10, 12.5])
  const p = 220 * i
  const respuesta = numero(p, 'W', 0)

  return {
    tipo: 'energia',
    enunciado: 'Un aparato resistivo consume esta corriente en 220 V. ¿Qué potencia tiene?',
    datos: [
      { etiqueta: 'Corriente medida', valor: `${formatear(i)} A` },
      { etiqueta: 'Tensión', valor: '220 V' },
    ],
    respuesta,
    opciones: armarOpciones(respuesta, [220 / i, 380 * i, (i * 1000) / 220]),
    pasos: ['P = U · I', `P = 220 V · ${formatear(i)} A = ${formatear(p, 0)} W`],
    atajo: 'En 220 V, cada ampere son ≈ 220 W (y cada kW, ≈ 4,5 A).',
    fuentes: [FUENTE],
  }
}

export function generarEnergia(): Omit<Ejercicio, 'id'> {
  return elegir([energiaMensual, costo, potenciaDesdeTensionCorriente])()
}
