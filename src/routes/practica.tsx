import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Plus, RotateCcw, Trash2 } from 'lucide-react'
import { useState } from 'react'

import { Confirmar } from '@/components/Confirmar'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { usePartidas, type Partida } from '@/store/partidas'

export const Route = createFileRoute('/practica')({
  component: Practica,
})

const fecha = new Intl.DateTimeFormat('es-AR', { dateStyle: 'short', timeStyle: 'short' })

function resumen(partida: Partida) {
  const stats = Object.values(partida.stats)
  const intentos = stats.reduce((a, s) => a + s.intentos, 0)
  const aciertos = stats.reduce((a, s) => a + s.aciertos, 0)
  if (intentos === 0) return 'Sin ejercicios todavía'
  return `${intentos} ejercicios · ${Math.round((aciertos / intentos) * 100)} % de aciertos`
}

function Practica() {
  const partidas = usePartidas((s) => s.partidas)
  const { crear, eliminar, reiniciar } = usePartidas.getState()
  const navigate = useNavigate()
  const [nombre, setNombre] = useState('')

  const ordenadas = [...partidas].sort((a, b) => b.actualizada - a.actualizada)

  return (
    <main className="mx-auto flex min-h-svh max-w-md flex-col gap-6 p-4">
      <header className="flex items-center gap-2 pt-2">
        <Link
          to="/"
          className={buttonVariants({ variant: 'ghost', size: 'icon' })}
          aria-label="Volver"
        >
          <ArrowLeft />
        </Link>
        <div>
          <h1 className="text-xl font-bold">Práctica</h1>
          <p className="text-muted-foreground text-sm">
            Ejercicios de cálculo con partidas guardadas
          </p>
        </div>
      </header>

      <form
        className="space-y-2"
        onSubmit={(e) => {
          e.preventDefault()
          const id = crear(nombre.trim() || `Partida ${partidas.length + 1}`)
          setNombre('')
          navigate({ to: '/partidas/$partidaId', params: { partidaId: id } })
        }}
      >
        <Label htmlFor="nombre">Nueva partida</Label>
        <div className="flex gap-2">
          <Input
            id="nombre"
            placeholder="Ej.: Repaso examen"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <Button type="submit">
            <Plus /> Crear
          </Button>
        </div>
      </form>

      <section className="space-y-3">
        <h2 className="text-muted-foreground text-sm font-medium">
          {partidas.length ? 'Tus partidas' : 'Todavía no tenés partidas. Creá una para empezar.'}
        </h2>
        {ordenadas.map((partida) => (
          <Card key={partida.id} size="sm">
            <CardHeader>
              <CardTitle>{partida.nombre}</CardTitle>
              <CardDescription>
                {resumen(partida)}
                <br />
                Última actividad: {fecha.format(partida.actualizada)}
              </CardDescription>
              <CardAction className="flex gap-1">
                <Confirmar
                  titulo="¿Empezar de cero?"
                  descripcion={`Se borran las estadísticas y los exámenes de "${partida.nombre}". La configuración se mantiene.`}
                  accion="Empezar de cero"
                  onConfirmar={() => reiniciar(partida.id)}
                >
                  <Button variant="ghost" size="icon" aria-label="Empezar de cero">
                    <RotateCcw />
                  </Button>
                </Confirmar>
                <Confirmar
                  titulo="¿Eliminar la partida?"
                  descripcion={`Se elimina "${partida.nombre}" con todo su progreso. No se puede deshacer.`}
                  accion="Eliminar"
                  onConfirmar={() => eliminar(partida.id)}
                >
                  <Button variant="ghost" size="icon" aria-label="Eliminar partida">
                    <Trash2 />
                  </Button>
                </Confirmar>
              </CardAction>
            </CardHeader>
            <CardFooter className="pb-3">
              <Link
                to="/partidas/$partidaId"
                params={{ partidaId: partida.id }}
                className={buttonVariants({ className: 'w-full' })}
              >
                Continuar
              </Link>
            </CardFooter>
          </Card>
        ))}
      </section>
    </main>
  )
}
