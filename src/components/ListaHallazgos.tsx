// Resultado de una verificación: errores primero, después avisos, cada uno con su cita.

import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react'

import { Cita } from '@/components/Cita'
import type { Referencia } from '@/dominio/referencias'
import { cn } from '@/lib/utils'

interface Hallazgo {
  nivel: 'error' | 'aviso'
  texto: string
  fuente?: Referencia
}

export function ListaHallazgos({ hallazgos, exito }: { hallazgos: Hallazgo[]; exito: string }) {
  const errores = hallazgos.filter((h) => h.nivel === 'error')
  const avisos = hallazgos.filter((h) => h.nivel === 'aviso')

  return (
    <section aria-live="polite" className="space-y-2">
      {errores.length === 0 ? (
        <p className="flex items-center gap-2 rounded-lg bg-emerald-500/10 p-3 font-medium text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="size-5 shrink-0" />
          {exito}
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
