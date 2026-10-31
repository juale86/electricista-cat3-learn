import type { Respuesta } from './tipos'

const formateadores = new Map<number, Intl.NumberFormat>()

export function formatear(valor: number, decimales = 2): string {
  let formateador = formateadores.get(decimales)
  if (!formateador) {
    formateador = new Intl.NumberFormat('es-AR', { maximumFractionDigits: decimales })
    formateadores.set(decimales, formateador)
  }
  return formateador.format(valor)
}

export function formatearRespuesta(respuesta: Respuesta): string {
  if (respuesta.clase === 'opcion') return respuesta.valor
  return `${formatear(respuesta.valor, respuesta.decimales)} ${respuesta.unidad}`.trimEnd()
}

/** Acepta coma o punto decimal y separador de miles con punto ("1.234,5"). */
export function parsearNumero(texto: string): number | null {
  const limpio = texto.trim().replace(/\s/g, '')
  if (!limpio) return null
  const conMiles = limpio.includes(',') || /^\d{1,3}(\.\d{3})+$/.test(limpio)
  const normalizado = conMiles ? limpio.replace(/\./g, '').replace(',', '.') : limpio
  const numero = Number(normalizado)
  return Number.isFinite(numero) ? numero : null
}

export function entero(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function elegir<T>(lista: readonly T[]): T {
  return lista[Math.floor(Math.random() * lista.length)]
}

/** Elige con probabilidad proporcional al peso de cada opción. */
export function elegirPonderado<T>(opciones: readonly (readonly [T, number])[]): T {
  let azar = Math.random() * opciones.reduce((suma, [, peso]) => suma + peso, 0)
  for (const [opcion, peso] of opciones) {
    azar -= peso
    if (azar <= 0) return opcion
  }
  return opciones[opciones.length - 1][0]
}

export function mezclar<T>(lista: T[]): T[] {
  const copia = [...lista]
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copia[i], copia[j]] = [copia[j], copia[i]]
  }
  return copia
}

/**
 * Arma 4 opciones: la correcta más distractores (errores típicos).
 * Si faltan distractores distintos, completa con variaciones de la correcta.
 */
export function armarOpciones(respuesta: Respuesta, distractores: (number | string)[]): string[] {
  const aTexto = (valor: number | string) =>
    respuesta.clase === 'numero' && typeof valor === 'number'
      ? formatearRespuesta({ ...respuesta, valor })
      : String(valor)

  const correcta = formatearRespuesta(respuesta)
  const opciones = new Set([correcta])
  for (const distractor of distractores) {
    if (opciones.size === 4) break
    if (typeof distractor === 'number' && (!Number.isFinite(distractor) || distractor <= 0))
      continue
    opciones.add(aTexto(distractor))
  }
  const factores = [1.5, 0.6, 2, 0.75, 1.25]
  for (const factor of factores) {
    if (opciones.size === 4 || respuesta.clase !== 'numero') break
    opciones.add(aTexto(respuesta.valor * factor))
  }
  return mezclar([...opciones])
}
