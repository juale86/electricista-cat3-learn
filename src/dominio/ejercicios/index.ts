import { generarCaida } from './caida'
import { generarConceptos } from './conceptos'
import { generarCorriente } from './corriente'
import { generarCuentas } from './cuentas'
import { generarEnergia } from './energia'
import { generarGrado } from './grado'
import { generarOhm } from './ohm'
import { generarSeccion } from './seccion'
import type { Ejercicio, TipoEjercicio } from './tipos'
import { formatearRespuesta, parsearNumero } from './util'

export * from './tipos'
export { formatear, formatearRespuesta, parsearNumero } from './util'

export type FormatoRespuesta = 'mental' | 'calculadora' | 'opciones'

export const NOMBRE_FORMATO: Record<FormatoRespuesta, string> = {
  mental: 'Cálculo mental',
  calculadora: 'Con calculadora',
  opciones: 'Opción múltiple',
}

/** Tolerancia relativa aceptada en respuestas numéricas no discretas. */
export const TOLERANCIA: Record<FormatoRespuesta, number> = {
  mental: 0.05,
  calculadora: 0.01,
  opciones: 0,
}

/** `tema` filtra el banco de preguntas de teoría; los demás generadores lo ignoran. */
const GENERADORES: Record<TipoEjercicio, (tema?: string) => Omit<Ejercicio, 'id'>> = {
  cuentas: generarCuentas,
  ohm: generarOhm,
  energia: generarEnergia,
  conceptos: generarConceptos,
  corriente: generarCorriente,
  seccion: generarSeccion,
  caida: generarCaida,
  grado: generarGrado,
}

export interface EstadisticaTipo {
  intentos: number
  aciertos: number
  tiempoMs: number
}

/**
 * Elige el tipo de ejercicio dando más peso a los que más se erran,
 * así se repasa más lo que cuesta.
 */
function elegirTipo(
  tipos: TipoEjercicio[],
  stats: Partial<Record<TipoEjercicio, EstadisticaTipo>>,
) {
  const pesos = tipos.map((tipo) => {
    const s = stats[tipo]
    if (!s || s.intentos === 0) return 1
    return 1 + 2 * ((s.intentos - s.aciertos) / s.intentos)
  })
  let azar = Math.random() * pesos.reduce((a, b) => a + b, 0)
  for (let i = 0; i < tipos.length; i++) {
    azar -= pesos[i]
    if (azar <= 0) return tipos[i]
  }
  return tipos[tipos.length - 1]
}

/** Cuántos ejercicios recientes se recuerdan para no repetirlos. */
const MEMORIA_RECIENTES = 12
const INTENTOS_SIN_REPETIR = 20
const recientes: string[] = []

function firma(ejercicio: Omit<Ejercicio, 'id'>) {
  return [ejercicio.tipo, ejercicio.enunciado, ...ejercicio.datos.map((d) => d.valor)].join('|')
}

/**
 * Genera un ejercicio evitando los últimos que salieron. Si el banco es chico y no queda
 * ninguno nuevo, devuelve el que salió hace más tiempo.
 */
export function generarEjercicio(
  tipos: TipoEjercicio[],
  stats: Partial<Record<TipoEjercicio, EstadisticaTipo>> = {},
  tema?: string,
): Ejercicio {
  const tipo = elegirTipo(tipos, stats)
  let elegido = GENERADORES[tipo](tema)
  let antiguedad = recientes.lastIndexOf(firma(elegido))
  for (let i = 1; i < INTENTOS_SIN_REPETIR && antiguedad !== -1; i++) {
    const candidato = GENERADORES[tipo](tema)
    const posicion = recientes.lastIndexOf(firma(candidato))
    if (posicion < antiguedad) {
      elegido = candidato
      antiguedad = posicion
    }
  }
  recientes.push(firma(elegido))
  if (recientes.length > MEMORIA_RECIENTES) recientes.shift()
  return { id: crypto.randomUUID(), ...elegido }
}

export function esCorrecta(
  ejercicio: Ejercicio,
  entrada: string,
  formato: FormatoRespuesta,
): boolean {
  const { respuesta } = ejercicio
  if (respuesta.clase === 'opcion' || formato === 'opciones') {
    return entrada === formatearRespuesta(respuesta) || entrada === respuesta.valor
  }
  const numero = parsearNumero(entrada)
  if (numero === null) return false
  if (respuesta.exacta) return numero === respuesta.valor
  const tolerancia = Math.max(
    TOLERANCIA[formato] * Math.abs(respuesta.valor),
    10 ** -respuesta.decimales / 2,
  )
  return Math.abs(numero - respuesta.valor) <= tolerancia
}

/** Las respuestas por opción siempre se muestran como botones, sin importar el formato. */
export function usaOpciones(ejercicio: Ejercicio, formato: FormatoRespuesta): boolean {
  return formato === 'opciones' || ejercicio.respuesta.clase === 'opcion'
}
