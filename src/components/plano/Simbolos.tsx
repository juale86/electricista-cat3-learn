// Símbolos de plano según el material del curso, dibujados en cm y centrados en (0, 0).
// Los que van en la pared se dibujan con la pared a la izquierda; se rotan según el lado.

import { TAMANO_SIMBOLO, type ClaseSimbolo } from './tamanos'

const trazo = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2.5,
  strokeLinecap: 'round',
} as const

/** Boca de techo: círculo con una cruz. */
function Boca() {
  return (
    <g {...trazo}>
      <circle r={14} />
      <path d="M -10 -10 L 10 10 M 10 -10 L -10 10" />
    </g>
  )
}

/** Llave de un punto: círculo chico con un trazo oblicuo. */
function Llave() {
  return (
    <g {...trazo}>
      <circle r={5} fill="currentColor" />
      <path d="M 3.5 -3.5 L 11 -11" />
    </g>
  )
}

/** Llave de combinación: como la de un punto, con un trazo para cada lado. */
function Combinacion() {
  return (
    <g {...trazo}>
      <circle r={5} fill="currentColor" />
      <path d="M 3.5 -3.5 L 11 -11 M -3.5 3.5 L -11 11" />
    </g>
  )
}

/** Tomacorriente: medio círculo apoyado en la pared con las dos patas. */
function Toma() {
  return (
    <g {...trazo}>
      <path d="M -16 -10 A 10 10 0 0 1 -16 10 Z" transform="translate(6 0)" />
      <path d="M 0 -5 L 8 -5 M 0 5 L 8 5" />
    </g>
  )
}

/** Tablero: rectángulo con una X, apoyado en la pared. */
function Tablero() {
  return (
    <g {...trazo}>
      <rect x={-18} y={-22} width={14} height={44} fill="var(--background)" />
      <path d="M -18 -22 L -4 22 M -4 -22 L -18 22" />
    </g>
  )
}

const DIBUJO: Record<ClaseSimbolo, () => React.JSX.Element> = {
  boca: Boca,
  llave: Llave,
  combinacion: Combinacion,
  toma: Toma,
  tablero: Tablero,
}

/** El símbolo como grupo SVG, para usar dentro de otro dibujo. */
export function Simbolo({ clase, angulo = 0 }: { clase: ClaseSimbolo; angulo?: number }) {
  const Dibujo = DIBUJO[clase]
  return (
    <g transform={`rotate(${angulo})`}>
      <Dibujo />
    </g>
  )
}

/** El símbolo suelto, del tamaño que le dé el CSS. */
export function IconoSimbolo({
  clase,
  angulo = 0,
  className,
}: {
  clase: ClaseSimbolo
  angulo?: number
  className?: string
}) {
  const t = TAMANO_SIMBOLO[clase]
  return (
    <svg viewBox={`${-t / 2} ${-t / 2} ${t} ${t}`} className={className} aria-hidden>
      <Simbolo clase={clase} angulo={angulo} />
    </svg>
  )
}
