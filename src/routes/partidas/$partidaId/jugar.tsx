import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, Timer, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { Correccion } from '@/components/juego/Correccion'
import { TarjetaEjercicio } from '@/components/juego/TarjetaEjercicio'
import { NoEncontrada } from '@/components/NoEncontrada'
import { Button, buttonVariants } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { esCorrecta, generarEjercicio, NOMBRE_TIPO } from '@/dominio/ejercicios'
import { cn } from '@/lib/utils'
import { usePartida, usePartidas } from '@/store/partidas'
import {
  EJERCICIOS_POR_EXAMEN,
  SEGUNDOS_POR_EJERCICIO_EXAMEN,
  useRonda,
  type RespuestaRonda,
} from '@/store/ronda'

export const Route = createFileRoute('/partidas/$partidaId/jugar')({
  component: Jugar,
})

const DURACION_EXAMEN_MS = EJERCICIOS_POR_EXAMEN * SEGUNDOS_POR_EJERCICIO_EXAMEN * 1000

function nuevoEjercicio(partidaId: string) {
  const partida = usePartidas.getState().partidas.find((p) => p.id === partidaId)!
  return generarEjercicio(partida.config.tipos, partida.stats)
}

function Jugar() {
  const { partidaId } = Route.useParams()
  const partida = usePartida(partidaId)
  const ronda = useRonda()
  const [ultima, setUltima] = useState<RespuestaRonda | null>(null)

  useEffect(() => {
    if (usePartidas.getState().partidas.some((p) => p.id === partidaId)) {
      useRonda.getState().empezar(partidaId, nuevoEjercicio(partidaId))
    }
  }, [partidaId])

  if (!partida) return <NoEncontrada />
  if (!ronda.ejercicio || ronda.partidaId !== partidaId) return null

  const { modo, formato } = partida.config
  const examen = modo === 'examen'
  const aciertos = ronda.respuestas.filter((r) => r.correcta).length

  function finalizarExamen() {
    const estado = useRonda.getState()
    if (estado.terminada) return
    estado.terminar()
    usePartidas.getState().registrarExamen(partidaId, {
      fecha: Date.now(),
      aciertos: estado.respuestas.filter((r) => r.correcta).length,
      total: EJERCICIOS_POR_EXAMEN,
      tiempoMs: Math.min(Date.now() - estado.inicioRonda, DURACION_EXAMEN_MS),
    })
  }

  function responder(entrada: string) {
    const ejercicio = useRonda.getState().ejercicio!
    const correcta = esCorrecta(ejercicio, entrada, formato)
    const respuesta = useRonda.getState().responder(entrada, correcta)
    if (!respuesta) return
    usePartidas
      .getState()
      .registrarRespuesta(partidaId, ejercicio.tipo, correcta, respuesta.tiempoMs)

    if (!examen) {
      setUltima(respuesta)
    } else if (useRonda.getState().respuestas.length >= EJERCICIOS_POR_EXAMEN) {
      finalizarExamen()
    } else {
      useRonda.getState().siguiente(nuevoEjercicio(partidaId))
    }
  }

  function siguiente() {
    setUltima(null)
    useRonda.getState().siguiente(nuevoEjercicio(partidaId))
  }

  if (examen && ronda.terminada) {
    return (
      <ResumenExamen
        partidaId={partidaId}
        respuestas={ronda.respuestas}
        onReintentar={() => useRonda.getState().empezar(partidaId, nuevoEjercicio(partidaId))}
      />
    )
  }

  return (
    <main className="mx-auto flex min-h-svh max-w-md flex-col gap-4 p-4">
      <header className="flex items-center gap-3 pt-2">
        <Link
          to="/partidas/$partidaId"
          params={{ partidaId }}
          className={buttonVariants({ variant: 'ghost', size: 'icon' })}
          aria-label="Salir"
        >
          <X />
        </Link>
        {examen ? (
          <>
            <Progress
              value={(ronda.respuestas.length / EJERCICIOS_POR_EXAMEN) * 100}
              className="flex-1"
            />
            <Temporizador inicio={ronda.inicioRonda} onFin={finalizarExamen} />
          </>
        ) : (
          <p className="text-muted-foreground flex-1 text-sm">
            Práctica · {aciertos}/{ronda.respuestas.length} correctas
          </p>
        )}
      </header>

      <TarjetaEjercicio
        key={ronda.ejercicio.id}
        ejercicio={ronda.ejercicio}
        formato={formato}
        bloqueado={ultima !== null}
        onResponder={responder}
      />

      {ultima && (
        <>
          <Correccion
            ejercicio={ultima.ejercicio}
            entrada={ultima.entrada}
            correcta={ultima.correcta}
          />
          <Button size="lg" className="sticky bottom-4 h-12 text-base" onClick={siguiente}>
            Siguiente <ArrowRight />
          </Button>
        </>
      )}
    </main>
  )
}

function Temporizador({ inicio, onFin }: { inicio: number; onFin: () => void }) {
  const [ahora, setAhora] = useState(() => Date.now())
  const onFinRef = useRef(onFin)

  useEffect(() => {
    onFinRef.current = onFin
  })

  const restanteMs = Math.max(0, DURACION_EXAMEN_MS - (ahora - inicio))

  useEffect(() => {
    const intervalo = setInterval(() => setAhora(Date.now()), 1000)
    return () => clearInterval(intervalo)
  }, [])

  useEffect(() => {
    if (restanteMs === 0) onFinRef.current()
  }, [restanteMs])

  const segundos = Math.ceil(restanteMs / 1000)
  const texto = `${Math.floor(segundos / 60)}:${String(segundos % 60).padStart(2, '0')}`

  return (
    <span
      className={cn(
        'flex items-center gap-1 font-mono text-sm tabular-nums',
        segundos <= 60 && 'text-destructive',
      )}
    >
      <Timer className="size-4" /> {texto}
    </span>
  )
}

function ResumenExamen({
  partidaId,
  respuestas,
  onReintentar,
}: {
  partidaId: string
  respuestas: RespuestaRonda[]
  onReintentar: () => void
}) {
  const aciertos = respuestas.filter((r) => r.correcta).length
  const sinResponder = EJERCICIOS_POR_EXAMEN - respuestas.length

  return (
    <main className="mx-auto flex min-h-svh max-w-md flex-col gap-4 p-4">
      <header className="space-y-1 pt-4 text-center">
        <p className="text-muted-foreground text-sm">Resultado del examen</p>
        <p className="text-4xl font-bold">
          {aciertos}/{EJERCICIOS_POR_EXAMEN}
        </p>
        {sinResponder > 0 && (
          <p className="text-destructive text-sm">
            Se terminó el tiempo: {sinResponder} sin responder
          </p>
        )}
      </header>

      <ol className="space-y-2">
        {respuestas.map((r, i) => (
          <li key={r.ejercicio.id}>
            <details className="rounded-lg border p-3">
              <summary className="cursor-pointer text-sm">
                <span
                  className={
                    r.correcta ? 'text-emerald-600 dark:text-emerald-400' : 'text-destructive'
                  }
                >
                  {r.correcta ? '✓' : '✗'}
                </span>{' '}
                {i + 1}. {NOMBRE_TIPO[r.ejercicio.tipo]}: {r.ejercicio.enunciado}
              </summary>
              <div className="pt-3">
                <Correccion ejercicio={r.ejercicio} entrada={r.entrada} correcta={r.correcta} />
              </div>
            </details>
          </li>
        ))}
      </ol>

      <div className="flex gap-2">
        <Link
          to="/partidas/$partidaId"
          params={{ partidaId }}
          className={buttonVariants({ variant: 'outline', className: 'flex-1' })}
        >
          Volver
        </Link>
        <Button className="flex-1" onClick={onReintentar}>
          Otro examen
        </Button>
      </div>
    </main>
  )
}
