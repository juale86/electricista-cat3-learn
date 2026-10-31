import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft, Play } from 'lucide-react'

import { NoEncontrada } from '@/components/NoEncontrada'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
  NOMBRE_FORMATO,
  NOMBRE_TIPO,
  TIPOS_EJERCICIO,
  formatear,
  type FormatoRespuesta,
  type TipoEjercicio,
} from '@/dominio/ejercicios'
import { usePartida, usePartidas, type ModoJuego } from '@/store/partidas'
import { EJERCICIOS_POR_EXAMEN, SEGUNDOS_POR_EJERCICIO_EXAMEN } from '@/store/ronda'

export const Route = createFileRoute('/partidas/$partidaId/')({
  component: PantallaPartida,
})

const DESCRIPCION_MODO: Record<ModoJuego, string> = {
  practica: 'Sin reloj. Te corrige al instante, con los pasos y la norma.',
  examen: `${EJERCICIOS_POR_EXAMEN} ejercicios con ${(EJERCICIOS_POR_EXAMEN * SEGUNDOS_POR_EJERCICIO_EXAMEN) / 60} minutos en total. La corrección se ve al final.`,
}

const DESCRIPCION_FORMATO: Record<FormatoRespuesta, string> = {
  mental: 'Escribís el resultado sin calculadora. Se acepta ±5 %.',
  calculadora: 'Tenés una calculadora en pantalla. Se acepta ±1 %.',
  opciones: 'Elegís entre 4 opciones. Las incorrectas son errores típicos.',
}

const fecha = new Intl.DateTimeFormat('es-AR', { dateStyle: 'short' })

function PantallaPartida() {
  const { partidaId } = Route.useParams()
  const partida = usePartida(partidaId)
  const configurar = usePartidas((s) => s.configurar)

  if (!partida) return <NoEncontrada />
  const { config } = partida

  return (
    <main className="mx-auto flex min-h-svh max-w-md flex-col gap-5 p-4">
      <header className="flex items-center gap-2 pt-2">
        <Link
          to="/practica"
          className={buttonVariants({ variant: 'ghost', size: 'icon' })}
          aria-label="Volver"
        >
          <ArrowLeft />
        </Link>
        <h1 className="truncate text-xl font-bold">{partida.nombre}</h1>
      </header>

      <section className="space-y-2">
        <h2 className="text-sm font-medium">Modo</h2>
        <ToggleGroup
          type="single"
          variant="outline"
          className="w-full"
          value={config.modo}
          onValueChange={(modo) => modo && configurar(partidaId, { modo: modo as ModoJuego })}
        >
          <ToggleGroupItem value="practica" className="flex-1">
            Práctica
          </ToggleGroupItem>
          <ToggleGroupItem value="examen" className="flex-1">
            Examen
          </ToggleGroupItem>
        </ToggleGroup>
        <p className="text-muted-foreground text-xs">{DESCRIPCION_MODO[config.modo]}</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-medium">Forma de responder</h2>
        <ToggleGroup
          type="single"
          variant="outline"
          className="w-full"
          value={config.formato}
          onValueChange={(formato) =>
            formato && configurar(partidaId, { formato: formato as FormatoRespuesta })
          }
        >
          {(Object.keys(NOMBRE_FORMATO) as FormatoRespuesta[]).map((formato) => (
            <ToggleGroupItem key={formato} value={formato} className="flex-1 text-xs">
              {NOMBRE_FORMATO[formato]}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <p className="text-muted-foreground text-xs">{DESCRIPCION_FORMATO[config.formato]}</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-medium">Ejercicios</h2>
        <ToggleGroup
          type="multiple"
          variant="outline"
          orientation="vertical"
          className="w-full"
          value={config.tipos}
          onValueChange={(tipos) =>
            tipos.length && configurar(partidaId, { tipos: tipos as TipoEjercicio[] })
          }
        >
          {TIPOS_EJERCICIO.map((tipo) => (
            <ToggleGroupItem key={tipo} value={tipo} className="w-full justify-start">
              {NOMBRE_TIPO[tipo]}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </section>

      <Link
        to="/partidas/$partidaId/jugar"
        params={{ partidaId }}
        className={buttonVariants({ size: 'lg', className: 'h-12 w-full text-base' })}
      >
        <Play /> {config.modo === 'examen' ? 'Empezar examen' : 'Practicar'}
      </Link>

      <Card size="sm">
        <CardHeader>
          <CardTitle>Estadísticas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {TIPOS_EJERCICIO.map((tipo) => {
            const s = partida.stats[tipo]
            const porcentaje = s && s.intentos ? Math.round((s.aciertos / s.intentos) * 100) : 0
            return (
              <div key={tipo} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>{NOMBRE_TIPO[tipo]}</span>
                  <span className="text-muted-foreground">
                    {s?.intentos
                      ? `${s.aciertos}/${s.intentos} · ${porcentaje} % · ${formatear(s.tiempoMs / s.intentos / 1000, 0)} s prom.`
                      : 'sin datos'}
                  </span>
                </div>
                <Progress value={porcentaje} />
              </div>
            )
          })}
          {partida.examenes.length > 0 && (
            <div className="space-y-1 pt-2">
              <h3 className="text-xs font-medium">Últimos exámenes</h3>
              <ul className="text-muted-foreground text-xs">
                {partida.examenes
                  .slice(-5)
                  .reverse()
                  .map((examen) => (
                    <li key={examen.fecha}>
                      {fecha.format(examen.fecha)}: {examen.aciertos}/{examen.total} en{' '}
                      {formatear(examen.tiempoMs / 60000, 1)} min
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
