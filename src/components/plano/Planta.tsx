// Dibujo de la planta (paredes, puertas, ventanas y nombres) en cm.

import { describirMedida, tramosDePared, type Plano, type Puerta } from '@/dominio/plano'

export const MARGEN_PLANTA = 40
const MURO = 12

function HojaPuerta({ puerta }: { puerta: Puerta }) {
  const { x, y, largo, orientacion, hacia, bisagra } = puerta
  const h = orientacion === 'h'
  const inicio = { x, y }
  const fin = h ? { x: x + largo, y } : { x, y: y + largo }
  const eje = bisagra === 'inicio' ? inicio : fin
  const libre = bisagra === 'inicio' ? fin : inicio
  const punta = h ? { x: eje.x, y: eje.y + hacia * largo } : { x: eje.x + hacia * largo, y: eje.y }
  const s = { x: libre.x - eje.x, y: libre.y - eje.y }
  const e = { x: punta.x - eje.x, y: punta.y - eje.y }
  const barrido = s.x * e.y - s.y * e.x > 0 ? 1 : 0
  return (
    <g className="stroke-muted-foreground" fill="none" strokeWidth={2}>
      <line x1={eje.x} y1={eje.y} x2={punta.x} y2={punta.y} strokeWidth={3} />
      <path
        d={`M ${libre.x} ${libre.y} A ${largo} ${largo} 0 0 ${barrido} ${punta.x} ${punta.y}`}
        strokeDasharray="6 5"
      />
    </g>
  )
}

export function Planta({ plano, marcados }: { plano: Plano; marcados: Set<string> }) {
  return (
    <svg
      width={plano.ancho + 2 * MARGEN_PLANTA}
      height={plano.alto + 2 * MARGEN_PLANTA}
      viewBox={`${-MARGEN_PLANTA} ${-MARGEN_PLANTA} ${plano.ancho + 2 * MARGEN_PLANTA} ${plano.alto + 2 * MARGEN_PLANTA}`}
      className="text-foreground block"
    >
      {plano.ambientes.map((a) => (
        <rect
          key={a.id}
          x={a.x}
          y={a.y}
          width={a.ancho}
          height={a.alto}
          className={
            marcados.has(a.id)
              ? 'fill-destructive/15'
              : a.abiertos?.length
                ? 'fill-muted/50'
                : 'fill-card'
          }
        />
      ))}

      {/* Lados abiertos de las galerías */}
      {plano.ambientes.flatMap((a) =>
        (a.abiertos ?? []).map((lado) => {
          const x2 = a.x + a.ancho
          const y2 = a.y + a.alto
          const [p, q] = {
            norte: [
              [a.x, a.y],
              [x2, a.y],
            ],
            sur: [
              [a.x, y2],
              [x2, y2],
            ],
            oeste: [
              [a.x, a.y],
              [a.x, y2],
            ],
            este: [
              [x2, a.y],
              [x2, y2],
            ],
          }[lado]
          return (
            <line
              key={`${a.id}-${lado}`}
              x1={p[0]}
              y1={p[1]}
              x2={q[0]}
              y2={q[1]}
              className="stroke-muted-foreground"
              strokeWidth={2}
              strokeDasharray="14 10"
            />
          )
        }),
      )}

      {/* Paredes, sin los huecos de las puertas */}
      <g stroke="currentColor" strokeWidth={MURO} strokeLinecap="square">
        {plano.ambientes.flatMap((a) =>
          tramosDePared(plano, a, 0).map((t) => (
            <line
              key={`${a.id}-${t.a.x}-${t.a.y}-${t.angulo}`}
              x1={t.a.x}
              y1={t.a.y}
              x2={t.b.x}
              y2={t.b.y}
            />
          )),
        )}
      </g>

      {plano.ventanas.map((v, i) => {
        const h = v.orientacion === 'h'
        return (
          <g key={i}>
            <rect
              x={h ? v.x : v.x - MURO / 2}
              y={h ? v.y - MURO / 2 : v.y}
              width={h ? v.largo : MURO}
              height={h ? MURO : v.largo}
              className="fill-background stroke-foreground"
              strokeWidth={2}
            />
            <line
              x1={v.x}
              y1={v.y}
              x2={h ? v.x + v.largo : v.x}
              y2={h ? v.y : v.y + v.largo}
              className="stroke-foreground"
              strokeWidth={2}
            />
          </g>
        )
      })}

      {plano.puertas.map((p, i) => (
        <HojaPuerta key={i} puerta={p} />
      ))}

      {plano.ambientes.map((a) => {
        const cx = a.x + a.ancho / 2
        // Ambientes angostos (pasillos): una sola línea, corrida del centro para la boca
        if (a.alto < 200)
          return (
            <text
              key={a.id}
              x={a.x + a.ancho * 0.3}
              y={a.y + a.alto / 2 + 9}
              textAnchor="middle"
              fontSize={24}
              className="fill-muted-foreground select-none"
            >
              <tspan fontWeight={600} className="fill-foreground/80">
                {a.nombre}
              </tspan>{' '}
              · {describirMedida(a)}
            </text>
          )
        // Arriba: el centro queda libre para la boca de techo y abajo abren las puertas
        const cy = a.y + 60
        return (
          <text
            key={a.id}
            x={cx}
            y={cy}
            textAnchor="middle"
            className="fill-muted-foreground select-none"
          >
            <tspan x={cx} fontSize={30} fontWeight={600} className="fill-foreground/80">
              {a.nombre}
            </tspan>
            <tspan x={cx} dy={34} fontSize={22}>
              {describirMedida(a)}
            </tspan>
          </text>
        )
      })}
    </svg>
  )
}
