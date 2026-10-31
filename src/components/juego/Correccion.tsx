import { Link } from '@tanstack/react-router'
import { BookOpen, CheckCircle2, GraduationCap, Lightbulb, XCircle } from 'lucide-react'

import { Citas } from '@/components/Cita'
import { formatearRespuesta, type Ejercicio } from '@/dominio/ejercicios'
import { buscarTema, temaDeEjercicio, temaDisponible } from '@/guia/temas'
import { cn } from '@/lib/utils'

interface Props {
  ejercicio: Ejercicio
  entrada: string
  correcta: boolean
  /** Link a la guía para repasar el tema (no tiene sentido dentro de la guía) */
  mostrarRepaso?: boolean
}

export function Correccion({ ejercicio, entrada, correcta, mostrarRepaso = true }: Props) {
  const tema = !mostrarRepaso
    ? undefined
    : ejercicio.tema
      ? buscarTema(ejercicio.tema)
      : temaDeEjercicio(ejercicio.tipo)

  return (
    <div className="space-y-3 text-sm">
      <div
        className={cn(
          'flex items-start gap-2 rounded-md p-3',
          correcta
            ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
            : 'bg-destructive/10 text-destructive',
        )}
      >
        {correcta ? (
          <CheckCircle2 className="mt-0.5 size-5 shrink-0" />
        ) : (
          <XCircle className="mt-0.5 size-5 shrink-0" />
        )}
        <div>
          <p className="font-semibold">{correcta ? '¡Correcto!' : 'Incorrecto'}</p>
          <p>
            {!correcta && (
              <>
                Respondiste: <strong>{entrada || '(sin respuesta)'}</strong> ·{' '}
              </>
            )}
            Respuesta: <strong>{formatearRespuesta(ejercicio.respuesta)}</strong>
          </p>
        </div>
      </div>

      <ol className="list-decimal space-y-1 pl-5 font-mono text-[0.8rem]">
        {ejercicio.pasos.map((paso) => (
          <li key={paso}>{paso}</li>
        ))}
      </ol>

      {ejercicio.atajo && (
        <p className="flex gap-2 rounded-md bg-amber-500/10 p-3 text-amber-800 dark:text-amber-300">
          <Lightbulb className="mt-0.5 size-4 shrink-0" />
          <span>
            <strong>Atajo:</strong> {ejercicio.atajo}
          </span>
        </p>
      )}

      {ejercicio.nota && (
        <p className="text-muted-foreground rounded-md border border-dashed p-3">
          <strong>Nota:</strong> {ejercicio.nota}
        </p>
      )}

      <p className="text-muted-foreground flex gap-2 text-xs">
        <BookOpen className="mt-0.5 size-3.5 shrink-0" />
        <span>
          <Citas referencias={ejercicio.fuentes} />
        </span>
      </p>

      {tema && temaDisponible(tema.id) && (
        <Link
          to="/guia/$temaId"
          params={{ temaId: tema.id }}
          className="text-primary flex items-center gap-2 text-xs font-medium underline-offset-4 hover:underline"
        >
          <GraduationCap className="size-4" /> Repasar en la guía: {tema.titulo}
        </Link>
      )}
    </div>
  )
}
