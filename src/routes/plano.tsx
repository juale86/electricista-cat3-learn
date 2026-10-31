import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft, BookOpen, Eraser, Hand, Trash2 } from 'lucide-react'

import { Confirmar } from '@/components/Confirmar'
import { ListaHallazgos } from '@/components/ListaHallazgos'
import { LienzoPlano } from '@/components/plano/Lienzo'
import { IconoSimbolo } from '@/components/plano/Simbolos'
import { Button, buttonVariants } from '@/components/ui/button'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { formatear } from '@/dominio/ejercicios'
import { NOMBRE_GRADO } from '@/dominio/normativa'
import { NOMBRE_ELEMENTO, superficies, type ClaseElemento } from '@/dominio/plano'
import { planoActual, usePlano, type Herramienta } from '@/store/plano'

export const Route = createFileRoute('/plano')({
  component: CircuitosEnElPlano,
})

const ELEMENTOS: ClaseElemento[] = ['boca', 'llave', 'toma']

function Herramientas() {
  const herramienta = usePlano((s) => s.herramienta)
  const elegir = usePlano((s) => s.elegirHerramienta)
  return (
    <ToggleGroup
      type="single"
      variant="outline"
      value={herramienta ?? 'mover'}
      onValueChange={(v) => v && elegir(v === 'mover' ? null : (v as Herramienta))}
      className="flex w-full flex-wrap"
      spacing={1}
    >
      {ELEMENTOS.map((clase) => (
        <ToggleGroupItem
          key={clase}
          value={clase}
          className="data-[state=on]:border-primary data-[state=on]:bg-primary/10 h-auto min-w-0 flex-1 flex-col gap-1 px-1 py-1.5 text-[11px] leading-tight whitespace-normal"
        >
          <IconoSimbolo clase={clase} className="text-primary size-7" />
          {NOMBRE_ELEMENTO[clase]}
        </ToggleGroupItem>
      ))}
      <ToggleGroupItem
        value="mover"
        className="data-[state=on]:border-primary data-[state=on]:bg-primary/10 h-auto min-w-0 flex-1 flex-col gap-1 px-1 py-1.5 text-[11px] leading-tight whitespace-normal"
      >
        <Hand className="size-7 p-0.5" />
        Mover
      </ToggleGroupItem>
      <ToggleGroupItem
        value="borrar"
        className="data-[state=on]:border-primary data-[state=on]:bg-primary/10 h-auto min-w-0 flex-1 flex-col gap-1 px-1 py-1.5 text-[11px] leading-tight whitespace-normal"
      >
        <Eraser className="size-7 p-0.5" />
        Borrar
      </ToggleGroupItem>
    </ToggleGroup>
  )
}

function Ayuda() {
  const herramienta = usePlano((s) => s.herramienta)
  const texto =
    herramienta === null
      ? 'Arrastrá un elemento para cambiarlo de lugar. Si lo soltás fuera de la casa, se borra.'
      : herramienta === 'borrar'
        ? 'Tocá un elemento para borrarlo.'
        : herramienta === 'boca'
          ? 'Tocá el techo de un ambiente para poner una boca.'
          : `Tocá cerca de una pared para poner ${herramienta === 'llave' ? 'una llave' : 'un toma'}: se apoya sola en la pared más cercana.`
  return <p className="text-muted-foreground text-sm">{texto}</p>
}

function DatosPlano() {
  const planoId = usePlano((s) => s.planoId)
  const { cubierta, semicubierta, grado } = superficies(planoActual(planoId))
  return (
    <dl className="bg-card grid grid-cols-2 gap-x-4 gap-y-1 rounded-xl border p-4 text-sm">
      <dt className="text-muted-foreground">Superficie cubierta</dt>
      <dd>{formatear(cubierta, 0)} m²</dd>
      <dt className="text-muted-foreground">Semicubierta (galería)</dt>
      <dd>{formatear(semicubierta, 0)} m²</dd>
      <dt className="text-muted-foreground">Grado</dt>
      <dd>{NOMBRE_GRADO[grado]}</dd>
    </dl>
  )
}

function CircuitosEnElPlano() {
  const vaciar = usePlano((s) => s.vaciar)
  const verificar = usePlano((s) => s.verificar)
  const hallazgos = usePlano((s) => s.hallazgos)
  const empezado = usePlano((s) => (s.elementos[s.planoId]?.length ?? 0) > 0)

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
          <h1 className="text-xl font-bold">Circuitos en el plano</h1>
          <p className="text-muted-foreground text-sm">
            Ubicá las bocas, llaves y tomas de una casa
          </p>
        </div>
        <Confirmar
          titulo="¿Vaciar el plano?"
          descripcion="Se borran todos los elementos que ubicaste."
          accion="Vaciar"
          onConfirmar={vaciar}
        >
          <Button variant="outline" size="sm" disabled={!empezado}>
            <Trash2 /> Vaciar
          </Button>
        </Confirmar>
      </header>

      <DatosPlano />

      <section className="space-y-3">
        <div>
          <h2 className="font-semibold">1. Ubicá los elementos</h2>
          <p className="text-muted-foreground text-sm">
            Poné en cada ambiente por lo menos las bocas de luz y los tomas que pide la norma, y una
            llave para cada luz. El tablero ya está junto a la entrada.
          </p>
        </div>
        <Herramientas />
        <Ayuda />
        <LienzoPlano className="aspect-square max-h-[75svh] w-full" />
      </section>

      <Button size="lg" onClick={verificar}>
        Verificar el plano
      </Button>
      {hallazgos && <ListaHallazgos hallazgos={hallazgos} exito="¡Los puntos mínimos están!" />}

      <p className="text-muted-foreground text-sm">
        Próximamente: trazar los circuitos desde el tablero y probar las llaves.
      </p>

      <Link
        to="/guia/$temaId"
        params={{ temaId: 'circuitos' }}
        className="text-muted-foreground inline-flex items-center gap-1.5 self-center pb-4 text-sm underline underline-offset-2"
      >
        <BookOpen className="size-4" /> Repasar Circuitos en la guía
      </Link>
    </main>
  )
}
