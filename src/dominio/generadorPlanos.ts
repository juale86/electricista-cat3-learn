// Generador de plantas para «Circuitos en el plano». Arma casas de una planta por franjas:
// al fondo los dormitorios, los baños y la cocina; adelante el estar-comedor; a veces un pasillo
// entre el fondo y el estar, y una galería sobre el frente. Medidas en cm, de a 10 cm.

import { entero, mezclar } from './ejercicios/util'
import type { AmbientePlano, Plano, Puerta } from './plano'

export type ModoGenerador = 'azar' | 'chica' | 'grande' | 'pasillo'

export const MODOS_GENERADOR: Record<ModoGenerador, { nombre: string; detalle: string }> = {
  azar: { nombre: 'Al azar', detalle: 'Cualquier casa' },
  chica: { nombre: 'Casa chica', detalle: 'Un dormitorio, grado mínimo' },
  grande: { nombre: 'Casa grande', detalle: 'Tres dormitorios, grado elevado' },
  pasillo: { nombre: 'Con pasillo', detalle: 'Pasillo de más de 3 m: combinación' },
}

interface Programa {
  dormitorios: number
  banos: number
  pasillo: boolean
  galeria: boolean
  /** Escala de las medidas: 0 = lo más chico, 1 = lo más grande */
  tamano: [number, number]
}

function programa(modo: ModoGenerador): Programa {
  switch (modo) {
    case 'chica':
      return { dormitorios: 1, banos: 1, pasillo: false, galeria: false, tamano: [0, 0.3] }
    case 'grande':
      return { dormitorios: 3, banos: 2, pasillo: true, galeria: true, tamano: [0, 0.4] }
    case 'pasillo':
      return {
        dormitorios: entero(2, 3),
        banos: 1,
        pasillo: true,
        galeria: Math.random() < 0.5,
        tamano: [0.2, 0.8],
      }
    case 'azar': {
      const dormitorios = entero(1, 3)
      return {
        dormitorios,
        banos: dormitorios === 3 ? entero(1, 2) : 1,
        pasillo: dormitorios >= 2 && Math.random() < 0.6,
        galeria: Math.random() < 0.5,
        tamano: [0, 1],
      }
    }
  }
}

/** Una medida entre `min` y `max`, según la escala elegida, redondeada a 10 cm. */
function medida(min: number, max: number, [desde, hasta]: [number, number]) {
  const t = desde + Math.random() * (hasta - desde)
  return Math.round((min + t * (max - min)) / 10) * 10
}

/** Hueco de puerta dentro de un tramo, lejos de las esquinas. */
function puerta(desde: number, hasta: number, y: number, largo: number, hacia: 1 | -1): Puerta {
  const libre = hasta - desde - largo - 2 * 30
  const x = desde + 30 + Math.round((Math.random() * Math.max(0, libre)) / 10) * 10
  return {
    x,
    y,
    largo,
    orientacion: 'h',
    hacia,
    bisagra: Math.random() < 0.5 ? 'inicio' : 'fin',
  }
}

/** Ventana centrada en un tramo de pared horizontal. */
function ventana(desde: number, hasta: number, y: number, largo: number) {
  const l = Math.min(largo, hasta - desde - 80)
  return { x: Math.round((desde + hasta - l) / 20) * 10, y, largo: l, orientacion: 'h' as const }
}

export function generarPlano(modo: ModoGenerador): Plano {
  const p = programa(modo)
  const t = p.tamano

  // Franja del fondo: dormitorios y baños (y la cocina, salvo que haya pasillo)
  const fondo = medida(300, 380, t)
  const privados = mezclar([
    ...Array.from({ length: p.dormitorios }, (_, i) => ({
      tipo: 'dormitorio' as const,
      nombre: p.dormitorios > 1 ? `Dormitorio ${i + 1}` : 'Dormitorio',
      ancho: medida(300, 420, t),
    })),
    ...Array.from({ length: p.banos }, (_, i) => ({
      tipo: 'bano' as const,
      nombre: p.banos > 1 ? `Baño ${i + 1}` : 'Baño',
      ancho: medida(180, 260, t),
    })),
  ])
  const cocinaAncho = medida(250, 380, t)
  const pasilloAlto = p.pasillo ? medida(100, 120, t) : 0

  const ambientes: AmbientePlano[] = []
  const puertas: Puerta[] = []
  const ventanas: Plano['ventanas'] = []
  let x = 0
  for (const [i, r] of privados.entries()) {
    ambientes.push({ id: `${r.tipo}-${i}`, ...r, x, y: 0, alto: fondo })
    puertas.push(puerta(x, x + r.ancho, fondo, r.tipo === 'bano' ? 70 : 80, -1))
    ventanas.push(ventana(x, x + r.ancho, 0, r.tipo === 'bano' ? 60 : 150))
    x += r.ancho
  }
  const anchoPrivados = x
  const ancho = anchoPrivados + cocinaAncho

  // Pasillo debajo de los privados; la cocina ocupa también su franja
  const yEstar = fondo + pasilloAlto
  if (p.pasillo) {
    ambientes.push({
      id: 'pasillo',
      tipo: 'pasillo',
      nombre: 'Pasillo',
      x: 0,
      y: fondo,
      ancho: anchoPrivados,
      alto: pasilloAlto,
    })
    // Al estar, por el extremo del pasillo más cercano a la cocina
    puertas.push({
      x: anchoPrivados - 110,
      y: yEstar,
      largo: 80,
      orientacion: 'h',
      hacia: -1,
      bisagra: 'fin',
    })
  }
  ambientes.push({
    id: 'cocina',
    tipo: 'cocina',
    nombre: 'Cocina',
    x: anchoPrivados,
    y: 0,
    ancho: cocinaAncho,
    alto: yEstar,
  })
  puertas.push(puerta(anchoPrivados, ancho, yEstar, 80, -1))
  ventanas.push(ventana(anchoPrivados, ancho, 0, 140))

  // Estar-comedor adelante, a todo el ancho, con la entrada sobre el frente
  const estarAlto = medida(350, 480, t)
  const frente = yEstar + estarAlto
  ambientes.push({
    id: 'estar',
    tipo: 'estar',
    nombre: 'Estar-comedor',
    x: 0,
    y: yEstar,
    ancho,
    alto: estarAlto,
  })
  const entrada = puerta(Math.round(ancho * 0.25), Math.round(ancho * 0.55), frente, 90, -1)
  puertas.push(entrada)
  ventanas.push({
    x: 0,
    y: yEstar + Math.round((estarAlto - 160) / 20) * 10,
    largo: 160,
    orientacion: 'v',
  })
  const tablero = { x: entrada.x + entrada.largo + 60, y: frente, ambiente: 'estar' }
  // Ventana del frente, a la derecha del tablero si entra
  const desdeVentana = tablero.x + 80
  if (ancho - desdeVentana >= 200) ventanas.push(ventana(desdeVentana, ancho, frente, 160))

  let alto = frente
  if (p.galeria) {
    const galeriaAlto = 200
    ambientes.push({
      id: 'galeria',
      tipo: 'galeria',
      nombre: 'Galería',
      x: 0,
      y: frente,
      ancho,
      alto: galeriaAlto,
      abiertos: ['sur', 'este', 'oeste'],
    })
    alto += galeriaAlto
  }

  return {
    id: `generado-${crypto.randomUUID().slice(0, 8)}`,
    nombre: `${MODOS_GENERADOR[modo].nombre}`,
    ancho,
    alto,
    ambientes,
    puertas,
    ventanas,
    tablero,
  }
}
