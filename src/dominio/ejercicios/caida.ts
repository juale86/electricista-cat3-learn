import { caidaTension } from '../calculos'
import {
  CAIDA_C,
  CAIDA_MAXIMA_PORCENTAJE,
  FUENTES,
  SECCIONES,
  TENSION_MONOFASICA,
  TENSION_TRIFASICA,
} from '../normativa'
import type { Ejercicio, Respuesta } from './tipos'
import { armarOpciones, elegir, entero, formatear } from './util'

const SECCIONES_CAIDA = [1.5, 2.5, 4, 6]

function datosBase() {
  const seccion = elegir(SECCIONES_CAIDA)
  const corriente = elegir([6, 8, 10, 12, 15, 16, 20])
  const largo = entero(2, 12) * 5
  return { seccion, corriente, largo, ...caidaTension(seccion, corriente, largo) }
}

function pasos(
  seccion: number,
  corriente: number,
  largo: number,
  volts: number,
  porcentaje: number,
) {
  return [
    'ΔU = c · I · L (L en km, distancia del tablero a la boca)',
    `c de ${formatear(seccion)} mm² = ${formatear(CAIDA_C[seccion])} V/(A·km)`,
    `ΔU = ${formatear(CAIDA_C[seccion])} · ${corriente} A · ${formatear(largo / 1000, 3)} km = ${formatear(volts)} V`,
    `ΔU% = ${formatear(volts)} V / ${TENSION_MONOFASICA} V · 100 = ${formatear(porcentaje)} %`,
  ]
}

const ATAJO =
  'Con 2,5 mm² (c = 15), cada 10 A en 10 m son 1,5 V ≈ 0,7 %. Escalá proporcional con I y con L.'

function porcentajeEjercicio(): Omit<Ejercicio, 'id'> {
  const { seccion, corriente, largo, volts, porcentaje } = datosBase()
  const respuesta: Respuesta = {
    clase: 'numero',
    valor: porcentaje,
    unidad: '%',
    decimales: 2,
    exacta: false,
  }

  return {
    tipo: 'caida',
    enunciado: '¿Qué caída de tensión porcentual tiene este circuito monofásico?',
    datos: [
      { etiqueta: 'Sección', valor: `${formatear(seccion)} mm² (NM 247-3 en caño)` },
      { etiqueta: 'Corriente', valor: `${corriente} A` },
      { etiqueta: 'Distancia tablero → boca', valor: `${largo} m` },
    ],
    respuesta,
    opciones: armarOpciones(respuesta, [
      porcentaje * 2,
      (volts / TENSION_TRIFASICA) * 100,
      volts,
      caidaTension(
        SECCIONES[SECCIONES.indexOf(seccion as (typeof SECCIONES)[number]) - 1] ?? 1.5,
        corriente,
        largo,
      ).porcentaje,
    ]),
    pasos: pasos(seccion, corriente, largo, volts, porcentaje),
    atajo: ATAJO,
    nota: 'La c de la tabla ya incluye la ida y la vuelta: no hay que duplicar el largo.',
    fuentes: [FUENTES.caida, FUENTES.caidaTabla],
  }
}

function verificaEjercicio(): Omit<Ejercicio, 'id'> {
  const { seccion, corriente } = datosBase()
  // Largo más grande para que a veces no verifique
  const largo = entero(4, 16) * 5
  const real = caidaTension(seccion, corriente, largo)
  const verifica = real.porcentaje <= CAIDA_MAXIMA_PORCENTAJE
  const respuesta: Respuesta = { clase: 'opcion', valor: verifica ? 'Verifica' : 'No verifica' }

  return {
    tipo: 'caida',
    enunciado: `¿Este circuito terminal cumple con la caída máxima del ${CAIDA_MAXIMA_PORCENTAJE} %?`,
    datos: [
      { etiqueta: 'Sección', valor: `${formatear(seccion)} mm² (NM 247-3 en caño)` },
      { etiqueta: 'Corriente', valor: `${corriente} A` },
      { etiqueta: 'Distancia tablero → boca', valor: `${largo} m` },
    ],
    respuesta,
    opciones: ['Verifica', 'No verifica'],
    pasos: [
      ...pasos(seccion, corriente, largo, real.volts, real.porcentaje),
      `${formatear(real.porcentaje)} % ${verifica ? '≤' : '>'} ${CAIDA_MAXIMA_PORCENTAJE} % → ${verifica ? 'verifica' : 'no verifica: hay que subir la sección'}`,
    ],
    atajo: `El 3 % de 220 V son 6,6 V. Compará ΔU en volts contra 6,6 V.`,
    fuentes: [FUENTES.caida, FUENTES.caidaTabla],
  }
}

export function generarCaida(): Omit<Ejercicio, 'id'> {
  return Math.random() < 0.7 ? porcentajeEjercicio() : verificaEjercicio()
}
