import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft, Eraser, House, Trash2 } from 'lucide-react'

import { Confirmar } from '@/components/Confirmar'
import { MesaConexionado } from '@/components/conexionado/Mesa'
import { ListaHallazgos } from '@/components/ListaHallazgos'
import { Muestra } from '@/components/tablero/Panel'
import { Button, buttonVariants } from '@/components/ui/button'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { ESCENARIOS } from '@/dominio/conexionado'
import { COLORES_CABLE, type ColorCable } from '@/dominio/tablero'
import { cn } from '@/lib/utils'
import { escenarioActual, useConexionado } from '@/store/conexionado'

export const Route = createFileRoute('/conexionado')({
  component: Conexionado,
})

function Colores() {
  const color = useConexionado((s) => s.color)
  const borrando = useConexionado((s) => s.borrando)
  const { elegirColor, alternarBorrar } = useConexionado.getState()
  return (
    <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label="Color del cable">
      {(Object.keys(COLORES_CABLE) as ColorCable[]).map((c) => {
        const elegido = !borrando && color === c
        return (
          <button
            key={c}
            role="radio"
            aria-checked={elegido}
            onClick={() => elegirColor(c)}
            className={cn(
              'flex flex-col items-center gap-1 rounded-lg border px-2 py-1.5 text-[11px] transition-colors',
              elegido ? 'border-primary bg-primary/10 ring-primary/30 ring-2' : 'hover:bg-muted',
            )}
          >
            <Muestra color={c} />
            {COLORES_CABLE[c].nombre}
          </button>
        )
      })}
      <button
        role="radio"
        aria-checked={borrando}
        onClick={alternarBorrar}
        className={cn(
          'flex flex-col items-center gap-0.5 rounded-lg border px-2 py-1 text-[11px] transition-colors',
          borrando
            ? 'border-destructive bg-destructive/10 ring-destructive/30 ring-2'
            : 'hover:bg-muted',
        )}
      >
        <Eraser className="size-4" />
        Borrar cable
      </button>
    </div>
  )
}

function Conexionado() {
  const escenarioId = useConexionado((s) => s.escenarioId)
  const hallazgos = useConexionado((s) => s.hallazgos)
  const borrando = useConexionado((s) => s.borrando)
  const hayCables = useConexionado((s) => (s.cables[s.escenarioId]?.length ?? 0) > 0)
  const { elegirEscenario, vaciar, verificar } = useConexionado.getState()
  const escenario = escenarioActual(escenarioId)

  return (
    <main className="mx-auto flex min-h-svh max-w-2xl flex-col gap-5 p-4">
      <header className="flex items-center gap-2 pt-2">
        <Link
          to="/"
          className={buttonVariants({ variant: 'ghost', size: 'icon' })}
          aria-label="Volver"
        >
          <ArrowLeft />
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-bold">Conexionado</h1>
          <p className="text-muted-foreground text-sm">Conectá cable por cable y probá</p>
        </div>
        <Confirmar
          titulo="¿Sacar todos los cables?"
          descripcion="Se borran los cables de este ejercicio."
          accion="Sacar"
          onConfirmar={vaciar}
        >
          <Button variant="outline" size="sm" disabled={!hayCables}>
            <Trash2 /> Vaciar
          </Button>
        </Confirmar>
      </header>

      <ToggleGroup
        type="single"
        variant="outline"
        value={escenarioId}
        onValueChange={(v) => v && elegirEscenario(v)}
        className="flex w-full flex-wrap"
        spacing={1}
      >
        {ESCENARIOS.map((e) => (
          <ToggleGroupItem
            key={e.id}
            value={e.id}
            className="data-[state=on]:border-primary data-[state=on]:bg-primary/10 h-auto min-w-0 flex-1 px-2 py-1.5 text-xs leading-tight whitespace-normal"
          >
            {e.nombre}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      <p className="text-sm">{escenario.consigna}</p>

      <section className="space-y-3">
        <div>
          <h2 className="font-semibold">Color del cable</h2>
          <p className="text-muted-foreground text-sm">
            {borrando
              ? 'Tocá un cable para sacarlo.'
              : 'Elegí el color y uní dos bornes: arrastrando de uno a otro, o tocando uno y después el otro. Tocá las llaves para accionarlas.'}
          </p>
        </div>
        <Colores />
        <MesaConexionado className="h-[60svh] min-h-96" />
      </section>

      <Button size="lg" onClick={verificar}>
        Verificar el conexionado
      </Button>
      {hallazgos && (
        <ListaHallazgos
          hallazgos={hallazgos}
          exito="¡Bien conectado y con los colores de la norma!"
        />
      )}

      <Link
        to="/plano"
        className="text-muted-foreground inline-flex items-center gap-1.5 self-center pb-4 text-sm underline underline-offset-2"
      >
        <House className="size-4" /> Ir a Circuitos en el plano
      </Link>
    </main>
  )
}
