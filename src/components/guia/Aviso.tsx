import { AlertTriangle, BookOpen, Info, Lightbulb } from 'lucide-react'

import { Ref } from '@/components/Cita'
import { cn } from '@/lib/utils'

const VARIANTES = {
  nota: { icono: Info, clase: 'border-sky-500/30 bg-sky-500/10', titulo: 'Nota' },
  atajo: { icono: Lightbulb, clase: 'border-amber-500/30 bg-amber-500/10', titulo: 'Atajo' },
  cuidado: {
    icono: AlertTriangle,
    clase: 'border-destructive/30 bg-destructive/10',
    titulo: 'Cuidado',
  },
  norma: { icono: BookOpen, clase: 'border-violet-500/30 bg-violet-500/10', titulo: 'Norma' },
} as const

interface Props {
  tipo?: keyof typeof VARIANTES
  titulo?: string
  children: React.ReactNode
}

/** Recuadro destacado para usar dentro de los temas de la guía. */
export function Aviso({ tipo = 'nota', titulo, children }: Props) {
  const { icono: Icono, clase, titulo: tituloPorDefecto } = VARIANTES[tipo]
  return (
    <aside className={cn('not-prose my-4 flex gap-3 rounded-lg border p-3 text-sm', clase)}>
      <Icono className="mt-0.5 size-4 shrink-0" />
      <div className="space-y-1">
        <p className="font-semibold">{titulo ?? tituloPorDefecto}</p>
        <div className="space-y-2 [&_li]:mt-1 [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:pl-4">
          {children}
        </div>
      </div>
    </aside>
  )
}

/** Fórmula destacada. `aea` agrega la cita con link a la cláusula de la AEA 770. */
export function Formula({
  children,
  leyenda,
  aea,
}: {
  children: React.ReactNode
  leyenda?: string
  aea?: string
}) {
  return (
    <figure className="not-prose bg-muted/50 my-4 rounded-lg border px-4 py-3 text-center">
      <div className="font-mono text-lg font-semibold">{children}</div>
      {(leyenda || aea) && (
        <figcaption className="text-muted-foreground mt-1 text-xs">
          {leyenda}
          {leyenda && aea && ' · '}
          {aea && <Ref aea={aea} />}
        </figcaption>
      )}
    </figure>
  )
}
