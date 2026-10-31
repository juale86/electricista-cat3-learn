import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft, BookOpen, Plus, RefreshCw } from 'lucide-react'

import { Confirmar } from '@/components/Confirmar'
import { ColoresCables, DatosCaso, Hallazgos } from '@/components/tablero/Panel'
import { Riel } from '@/components/tablero/Riel'
import { Button, buttonVariants } from '@/components/ui/button'
import { NOMBRE_DISPOSITIVO, type ClaseDispositivo } from '@/dominio/tablero'
import { useTablero } from '@/store/tablero'

export const Route = createFileRoute('/tablero')({
  component: ArmaElTablero,
})

const BANDEJA: ClaseDispositivo[] = ['cabecera', 'diferencial', 'pia']

function ArmaElTablero() {
  const agregar = useTablero((s) => s.agregar)
  const nuevoCaso = useTablero((s) => s.nuevoCaso)
  const verificar = useTablero((s) => s.verificar)
  const empezado = useTablero((s) => s.dispositivos.length > 0)

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
          <h1 className="text-xl font-bold">Armá el tablero</h1>
          <p className="text-muted-foreground text-sm">
            Elegí y ordená las protecciones del tablero principal
          </p>
        </div>
        {empezado ? (
          <Confirmar
            titulo="¿Pasar a otro caso?"
            descripcion="Se pierde el tablero que estás armando."
            accion="Otro caso"
            onConfirmar={nuevoCaso}
          >
            <Button variant="outline" size="sm">
              <RefreshCw /> Otro caso
            </Button>
          </Confirmar>
        ) : (
          <Button variant="outline" size="sm" onClick={nuevoCaso}>
            <RefreshCw /> Otro caso
          </Button>
        )}
      </header>

      <section className="space-y-2">
        <h2 className="font-semibold">La vivienda</h2>
        <DatosCaso />
      </section>

      <section className="space-y-3">
        <div>
          <h2 className="font-semibold">1. Armá el riel</h2>
          <p className="text-muted-foreground text-sm">
            De arriba hacia abajo: de la alimentación a los circuitos. Para cambiar el orden,
            arrastrá desde la manija de cada dispositivo.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {BANDEJA.map((clase) => (
            <Button key={clase} variant="secondary" size="sm" onClick={() => agregar(clase)}>
              <Plus /> {NOMBRE_DISPOSITIVO[clase]}
            </Button>
          ))}
        </div>
        <Riel />
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold">2. Elegí los colores de los cables</h2>
        <ColoresCables />
      </section>

      <Button size="lg" onClick={verificar}>
        Verificar el tablero
      </Button>
      <Hallazgos />

      <Link
        to="/guia/$temaId"
        params={{ temaId: 'tablero' }}
        className="text-muted-foreground inline-flex items-center gap-1.5 self-center pb-4 text-sm underline underline-offset-2"
      >
        <BookOpen className="size-4" /> Repasar Tableros en la guía
      </Link>
    </main>
  )
}
