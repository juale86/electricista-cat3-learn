// Esquemas de conexión para la guía y botones que abren cada ejercicio de conexionado.

import { useNavigate } from '@tanstack/react-router'
import { Cable } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { COLORES_CABLE, type ColorCable } from '@/dominio/tablero'
import { useConexionado } from '@/store/conexionado'

type Punto = [number, number]

/** Un cable como polilínea: contorno oscuro (para que se vea el blanco) y su color encima. */
function Conductor({ puntos, color }: { puntos: Punto[]; color: ColorCable }) {
  const d = puntos.map(([x, y], i) => `${i ? 'L' : 'M'} ${x} ${y}`).join(' ')
  const { muestra } = COLORES_CABLE[color]
  return (
    <g fill="none" strokeLinejoin="round" strokeLinecap="round">
      <path d={d} className="stroke-foreground/60" strokeWidth={6} />
      {muestra === 'verde-amarillo' ? (
        <>
          <path d={d} stroke="#2e9e44" strokeWidth={4} />
          <path d={d} stroke="#f2d22e" strokeWidth={4} strokeDasharray="6 6" />
        </>
      ) : (
        <path d={d} stroke={muestra} strokeWidth={4} />
      )}
    </g>
  )
}

function Borne({ x, y, texto, abajo }: { x: number; y: number; texto?: string; abajo?: boolean }) {
  return (
    <g>
      <circle cx={x} cy={y} r={4} className="fill-background stroke-foreground" strokeWidth={2} />
      {texto && (
        <text
          x={x}
          y={abajo ? y + 16 : y - 9}
          textAnchor="middle"
          fontSize={10}
          fontWeight={700}
          className="fill-foreground"
        >
          {texto}
        </text>
      )}
    </g>
  )
}

function Tablero() {
  return (
    <g>
      <rect x={8} y={62} width={56} height={96} rx={6} className="fill-card stroke-foreground" />
      <text x={36} y={56} textAnchor="middle" fontSize={11} className="fill-foreground">
        Tablero
      </text>
      {(['L', 'N', 'PE'] as const).map((b, i) => (
        <text
          key={b}
          x={52}
          y={88 + i * 30}
          textAnchor="end"
          fontSize={10}
          fontWeight={700}
          className="fill-foreground"
        >
          {b}
        </text>
      ))}
    </g>
  )
}

function Lampara({ x }: { x: number }) {
  return (
    <g>
      <circle cx={x} cy={28} r={14} className="fill-card stroke-foreground" strokeWidth={2} />
      <path
        d={`M ${x - 10} 18 L ${x + 10} 38 M ${x + 10} 18 L ${x - 10} 38`}
        className="stroke-foreground"
        strokeWidth={2}
      />
      <text x={x - 22} y={24} textAnchor="end" fontSize={10} className="fill-foreground">
        Lámpara
      </text>
    </g>
  )
}

/** Luz con una llave de un punto. */
function UnPunto() {
  return (
    <svg viewBox="0 0 330 210" className="w-full max-w-md" role="img" aria-labelledby="t-un-punto">
      <title id="t-un-punto">
        Fase marrón del tablero a la llave, retorno blanco de la llave a la lámpara, neutro celeste
        y PE verde-amarillo directos del tablero a la lámpara.
      </title>
      <Tablero />
      <Lampara x={270} />
      <Conductor
        puntos={[
          [64, 84],
          [140, 84],
          [140, 184],
          [176, 184],
        ]}
        color="marron"
      />
      <Conductor
        puntos={[
          [214, 184],
          [240, 184],
          [240, 62],
          [255, 62],
        ]}
        color="blanco"
      />
      <Conductor
        puntos={[
          [64, 114],
          [270, 114],
          [270, 62],
        ]}
        color="celeste"
      />
      <Conductor
        puntos={[
          [64, 144],
          [300, 144],
          [300, 62],
        ]}
        color="verde-amarillo"
      />
      {/* Llave abierta */}
      <path
        d="M 180 184 L 206 170"
        className="stroke-foreground"
        strokeWidth={3}
        strokeLinecap="round"
      />
      <Borne x={180} y={184} texto="1" abajo />
      <Borne x={210} y={184} texto="2" abajo />
      <text x={195} y={160} textAnchor="middle" fontSize={10} className="fill-foreground">
        Llave
      </text>
      <Borne x={255} y={62} texto="L" />
      <Borne x={270} y={62} />
      <Borne x={300} y={62} />
      <text x={279} y={56} fontSize={10} fontWeight={700} className="fill-foreground">
        N
      </text>
      <text x={305} y={78} fontSize={10} fontWeight={700} className="fill-foreground">
        PE
      </text>
    </svg>
  )
}

function Combinacion({ x, espejo }: { x: number; espejo?: boolean }) {
  const s = espejo ? -1 : 1
  return (
    <g>
      <path
        d={`M ${x} 184 L ${x + s * 26} 170`}
        className="stroke-foreground"
        strokeWidth={3}
        strokeLinecap="round"
      />
      <Borne x={x} y={184} texto="C" abajo />
      <Borne x={x + s * 30} y={168} />
      <Borne x={x + s * 30} y={198} />
    </g>
  )
}

/** Luz con dos llaves de combinación. */
function DosCombinaciones() {
  return (
    <svg viewBox="0 0 330 230" className="w-full max-w-md" role="img" aria-labelledby="t-comb">
      <title id="t-comb">
        Fase marrón al común de la primera combinación, dos viajeros blancos entre las llaves,
        retorno blanco del común de la segunda a la lámpara, neutro y PE directos.
      </title>
      <Tablero />
      <Lampara x={270} />
      <Conductor
        puntos={[
          [64, 84],
          [100, 84],
          [100, 184],
          [120, 184],
        ]}
        color="marron"
      />
      <Conductor
        puntos={[
          [150, 168],
          [200, 168],
        ]}
        color="blanco"
      />
      <Conductor
        puntos={[
          [150, 198],
          [200, 198],
        ]}
        color="blanco"
      />
      <Conductor
        puntos={[
          [230, 184],
          [242, 184],
          [242, 62],
          [255, 62],
        ]}
        color="blanco"
      />
      <Conductor
        puntos={[
          [64, 114],
          [270, 114],
          [270, 62],
        ]}
        color="celeste"
      />
      <Conductor
        puntos={[
          [64, 144],
          [300, 144],
          [300, 62],
        ]}
        color="verde-amarillo"
      />
      <Combinacion x={120} />
      <Combinacion x={230} espejo />
      <text x={135} y={222} textAnchor="middle" fontSize={10} className="fill-foreground">
        Combinación 1
      </text>
      <text x={215} y={222} textAnchor="middle" fontSize={10} className="fill-foreground">
        Combinación 2
      </text>
      <Borne x={255} y={62} texto="L" />
      <Borne x={270} y={62} />
      <Borne x={300} y={62} />
      <text x={279} y={56} fontSize={10} fontWeight={700} className="fill-foreground">
        N
      </text>
      <text x={305} y={78} fontSize={10} fontWeight={700} className="fill-foreground">
        PE
      </text>
    </svg>
  )
}

const ESQUEMAS = { 'un-punto': UnPunto, combinacion: DosCombinaciones }

export function EsquemaConexion({ tipo }: { tipo: keyof typeof ESQUEMAS }) {
  const Esquema = ESQUEMAS[tipo]
  return (
    <figure className="not-prose bg-card my-4 flex justify-center rounded-xl border p-3">
      <Esquema />
    </figure>
  )
}

/** Abre «Conexionado» en el ejercicio indicado. */
export function PracticarConexionado({
  escenario,
  children,
}: {
  escenario: string
  children: React.ReactNode
}) {
  const navegar = useNavigate()
  return (
    <Button
      variant="outline"
      className="not-prose my-1 mr-2"
      onClick={() => {
        useConexionado.getState().elegirEscenario(escenario)
        void navegar({ to: '/conexionado' })
      }}
    >
      <Cable /> {children}
    </Button>
  )
}
