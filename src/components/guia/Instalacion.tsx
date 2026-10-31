// Componentes visuales del bloque Instalación domiciliaria.

import { ArrowDown } from 'lucide-react'

import { Cita, Citas } from '@/components/Cita'
import { COLORES_CONDUCTORES, FUENTES } from '@/dominio/normativa'
import { aea, carpetaERSeP, type Referencia } from '@/dominio/referencias'
import { cn } from '@/lib/utils'

const VERDE_AMARILLO = 'repeating-linear-gradient(135deg, #2e9e44 0 10px, #f2d22e 10px 20px)'

/** Un tramo de cable dibujado con su color. */
function Cable({ muestra }: { muestra: string }) {
  return (
    <span
      aria-hidden
      className="block h-3 w-16 shrink-0 rounded-full ring-1 ring-black/10 dark:ring-white/20"
      style={{ background: muestra === 'verde-amarillo' ? VERDE_AMARILLO : muestra }}
    />
  )
}

export function ColoresConductores() {
  return (
    <figure className="not-prose my-4">
      <ul className="divide-y rounded-lg border">
        {COLORES_CONDUCTORES.map((c) => (
          <li key={c.funcion} className="flex items-center gap-3 px-3 py-2 text-sm">
            <Cable muestra={c.muestra} />
            <span className="font-medium">{c.funcion}</span>
            <span className="text-muted-foreground ml-auto text-right">{c.color}</span>
          </li>
        ))}
      </ul>
      <figcaption className="text-muted-foreground mt-1 text-xs">
        Fuente: <Cita referencia={FUENTES.colores} />
      </figcaption>
    </figure>
  )
}

interface Paso {
  nombre: string
  dispositivo: string
  quien: 'Distribuidora' | 'Instalador'
  /** Paso que no siempre está */
  opcional?: boolean
}

const RECORRIDO: Paso[] = [
  {
    nombre: 'Red de EPEC y acometida',
    dispositivo: 'Protección de la distribuidora',
    quien: 'Distribuidora',
  },
  { nombre: 'Medidor', dispositivo: 'Mide la energía (kWh)', quien: 'Distribuidora' },
  {
    nombre: 'TPA (tablero de protección de la acometida)',
    dispositivo: 'Termomagnético bipolar, p. ej. C32 de 6 kA',
    quien: 'Instalador',
  },
  {
    nombre: 'Línea principal',
    dispositivo: 'Cable hasta el tablero principal (TPU)',
    quien: 'Instalador',
  },
  {
    nombre: 'Cabecera del TPU',
    dispositivo:
      'Interruptor automático bipolar (≤ 63 A), o el diferencial si el TPA ya protege la línea',
    quien: 'Instalador',
  },
  {
    nombre: 'DPS',
    dispositivo: 'Protector de sobretensiones, cuando corresponde',
    quien: 'Instalador',
    opcional: true,
  },
  { nombre: 'Diferencial', dispositivo: '30 mA, p. ej. 2 × 40 A', quien: 'Instalador' },
  {
    nombre: 'Un PIA por circuito',
    dispositivo: 'Bipolares, p. ej. B10 para IUG y C10 para TUG (3 kA)',
    quien: 'Instalador',
  },
  { nombre: 'Circuitos', dispositivo: 'IUG, TUG, TUE…', quien: 'Instalador' },
]

const FUENTES_RECORRIDO: Referencia[] = [
  aea('770.16.5.3'),
  aea('770.16.5.4'),
  carpetaERSeP('esquema unifilar'),
]

/** Recorrido de la energía desde la red hasta los circuitos, en el orden en que se conectan. */
export function RecorridoTablero() {
  return (
    <figure className="not-prose my-4">
      <ol className="space-y-1">
        {RECORRIDO.map((p, i) => (
          <li key={p.nombre}>
            {i > 0 && <ArrowDown className="text-muted-foreground mx-auto mb-1 size-4" />}
            <div
              className={cn(
                'rounded-lg border px-3 py-2 text-sm',
                p.quien === 'Distribuidora' && 'bg-muted/60',
                p.opcional && 'border-dashed',
              )}
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-medium">
                  {i + 1}. {p.nombre}
                </span>
                <span className="text-muted-foreground shrink-0 text-xs">{p.quien}</span>
              </div>
              <p className="text-muted-foreground">{p.dispositivo}</p>
            </div>
          </li>
        ))}
      </ol>
      <figcaption className="text-muted-foreground mt-2 text-xs">
        Los recuadros grises son de la distribuidora; el punteado no siempre va. Fuente:{' '}
        <Citas referencias={FUENTES_RECORRIDO} />
      </figcaption>
    </figure>
  )
}
