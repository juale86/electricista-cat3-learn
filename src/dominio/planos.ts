// Plantas dibujadas para el modo «Circuitos en el plano». Medidas en cm, con el origen arriba
// a la izquierda (x hacia la derecha, y hacia abajo). Los ambientes son rectángulos medidos
// por dentro; las paredes se dibujan sobre sus bordes.

import type { Plano } from './plano'

/**
 * Casa tipo con la distribución del plano del curso: dormitorio, baño y cocina al fondo,
 * estar-comedor adelante y galería sobre el frente.
 */
const CASA_TIPO: Plano = {
  id: 'casa-tipo',
  nombre: 'Casa tipo',
  ancho: 900,
  alto: 900,
  ambientes: [
    {
      id: 'dormitorio',
      tipo: 'dormitorio',
      nombre: 'Dormitorio',
      x: 0,
      y: 0,
      ancho: 400,
      alto: 300,
    },
    { id: 'bano', tipo: 'bano', nombre: 'Baño', x: 400, y: 0, ancho: 200, alto: 300 },
    { id: 'cocina', tipo: 'cocina', nombre: 'Cocina', x: 600, y: 0, ancho: 300, alto: 300 },
    { id: 'estar', tipo: 'estar', nombre: 'Estar-comedor', x: 0, y: 300, ancho: 900, alto: 400 },
    {
      id: 'galeria',
      tipo: 'galeria',
      nombre: 'Galería',
      x: 0,
      y: 700,
      ancho: 900,
      alto: 200,
      abiertos: ['sur', 'este', 'oeste'],
    },
  ],
  puertas: [
    { x: 280, y: 300, largo: 80, orientacion: 'h', hacia: -1, bisagra: 'fin' },
    { x: 460, y: 300, largo: 70, orientacion: 'h', hacia: -1, bisagra: 'inicio' },
    { x: 640, y: 300, largo: 80, orientacion: 'h', hacia: -1, bisagra: 'inicio' },
    { x: 400, y: 700, largo: 90, orientacion: 'h', hacia: -1, bisagra: 'inicio' },
  ],
  ventanas: [
    { x: 120, y: 0, largo: 150, orientacion: 'h' },
    { x: 470, y: 0, largo: 60, orientacion: 'h' },
    { x: 680, y: 0, largo: 140, orientacion: 'h' },
    { x: 0, y: 420, largo: 160, orientacion: 'v' },
    { x: 650, y: 700, largo: 160, orientacion: 'h' },
  ],
  tablero: { x: 560, y: 700, ambiente: 'estar' },
}

export const PLANOS: Plano[] = [CASA_TIPO]
