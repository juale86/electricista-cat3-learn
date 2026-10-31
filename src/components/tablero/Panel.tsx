// Partes de la pantalla «Armá el tablero» que no son el riel.

import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react'

import { Cita } from '@/components/Cita'
import { formatear } from '@/dominio/ejercicios'
import { IZ_MONOFASICO, NOMBRE_GRADO } from '@/dominio/normativa'
import {
  COLORES_CABLE,
  NOMBRE_FUNCION,
  formatearA,
  formatearSeccion,
  type ColorCable,
  type FuncionCable,
} from '@/dominio/tablero'
import { cn } from '@/lib/utils'
import { useTablero } from '@/store/tablero'

const VERDE_AMARILLO = 'repeating-linear-gradient(135deg, #2e9e44 0 6px, #f2d22e 6px 12px)'

export function DatosCaso() {
  const caso = useTablero((s) => s.caso)
  return (
    <section className="bg-card space-y-3 rounded-xl border p-4 text-sm">
      <dl className="grid grid-cols-2 gap-x-4 gap-y-1">
        <dt className="text-muted-foreground">Grado</dt>
        <dd>{NOMBRE_GRADO[caso.grado]}</dd>
        <dt className="text-muted-foreground">DPMS</dt>
        <dd>{formatear(caso.dpms, 0)} VA</dd>
        <dt className="text-muted-foreground">Corriente de proyecto</dt>
        <dd>{formatearA(caso.ib)}</dd>
        <dt className="text-muted-foreground">Línea principal</dt>
        <dd>
          {formatearSeccion(caso.lineaSeccion)} (Iz {IZ_MONOFASICO[caso.lineaSeccion]} A)
        </dd>
      </dl>
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full">
          <thead className="bg-muted/60 text-left text-xs">
            <tr>
              <th className="px-2 py-1.5 font-medium">Circuito</th>
              <th className="px-2 py-1.5 font-medium">Alimenta</th>
              <th className="px-2 py-1.5 font-medium">Cable</th>
              <th className="px-2 py-1.5 font-medium">Ib</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {caso.circuitos.map((c) => (
              <tr key={c.id}>
                <td className="px-2 py-1.5 font-medium">{c.nombre}</td>
                <td className="px-2 py-1.5">{c.detalle}</td>
                <td className="px-2 py-1.5 whitespace-nowrap">{formatearSeccion(c.seccion)}</td>
                <td className="px-2 py-1.5 whitespace-nowrap tabular-nums">{formatearA(c.ib)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function Muestra({ color }: { color: ColorCable }) {
  const { muestra } = COLORES_CABLE[color]
  return (
    <span
      aria-hidden
      className="block h-2.5 w-8 rounded-full ring-1 ring-black/15 dark:ring-white/25"
      style={{ background: muestra === 'verde-amarillo' ? VERDE_AMARILLO : muestra }}
    />
  )
}

export function ColoresCables() {
  const colores = useTablero((s) => s.colores)
  const elegirColor = useTablero((s) => s.elegirColor)
  return (
    <section className="space-y-3">
      {(Object.keys(NOMBRE_FUNCION) as FuncionCable[]).map((funcion) => (
        <div key={funcion} className="space-y-1">
          <p className="text-sm font-medium">{NOMBRE_FUNCION[funcion]}</p>
          <div
            role="radiogroup"
            aria-label={NOMBRE_FUNCION[funcion]}
            className="flex flex-wrap gap-1.5"
          >
            {(Object.keys(COLORES_CABLE) as ColorCable[]).map((color) => {
              const elegido = colores[funcion] === color
              return (
                <button
                  key={color}
                  role="radio"
                  aria-checked={elegido}
                  onClick={() => elegirColor(funcion, color)}
                  className={cn(
                    'flex flex-col items-center gap-1 rounded-lg border px-2 py-1.5 text-[11px] transition-colors',
                    elegido
                      ? 'border-primary bg-primary/10 ring-primary/30 ring-2'
                      : 'hover:bg-muted',
                  )}
                >
                  <Muestra color={color} />
                  {COLORES_CABLE[color].nombre}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </section>
  )
}

export function Hallazgos() {
  const hallazgos = useTablero((s) => s.hallazgos)
  if (!hallazgos) return null

  const errores = hallazgos.filter((h) => h.nivel === 'error')
  const avisos = hallazgos.filter((h) => h.nivel === 'aviso')

  return (
    <section aria-live="polite" className="space-y-2">
      {errores.length === 0 ? (
        <p className="flex items-center gap-2 rounded-lg bg-emerald-500/10 p-3 font-medium text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="size-5 shrink-0" />
          ¡El tablero cumple la norma!
        </p>
      ) : (
        <p className="text-destructive flex items-center gap-2 font-medium">
          <XCircle className="size-5 shrink-0" />
          {errores.length === 1 ? 'Hay 1 error' : `Hay ${errores.length} errores`}
        </p>
      )}
      <ul className="space-y-2">
        {[...errores, ...avisos].map((h, i) => (
          <li
            key={i}
            className={cn(
              'flex gap-2 rounded-lg border p-3 text-sm',
              h.nivel === 'error'
                ? 'border-destructive/30 bg-destructive/10'
                : 'border-amber-500/30 bg-amber-500/10',
            )}
          >
            {h.nivel === 'error' ? (
              <XCircle className="text-destructive mt-0.5 size-4 shrink-0" />
            ) : (
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
            )}
            <div className="space-y-1">
              <p>{h.texto}</p>
              {h.fuente && (
                <p className="text-muted-foreground text-xs">
                  <Cita referencia={h.fuente} />
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
