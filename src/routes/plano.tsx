import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import {
  ArrowLeft,
  BookOpen,
  Eraser,
  Hand,
  LayoutPanelTop,
  Plus,
  Power,
  Spline,
  Trash2,
  X,
} from 'lucide-react'

import { Confirmar } from '@/components/Confirmar'
import { ListaHallazgos } from '@/components/ListaHallazgos'
import { LienzoPlano } from '@/components/plano/Lienzo'
import { IconoSimbolo } from '@/components/plano/Simbolos'
import { ESTILO_CIRCUITO } from '@/components/plano/tamanos'
import { Button, buttonVariants } from '@/components/ui/button'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { NOMBRE_TIPO_CIRCUITO, type TipoCircuitoPlano } from '@/dominio/circuitosPlano'
import { formatear } from '@/dominio/ejercicios'
import { NOMBRE_GRADO } from '@/dominio/normativa'
import { NOMBRE_ELEMENTO, superficies, type ClaseElemento } from '@/dominio/plano'
import { cn } from '@/lib/utils'
import { planoActual, usePlano, type Herramienta } from '@/store/plano'
import { useTablero } from '@/store/tablero'

export const Route = createFileRoute('/plano')({
  component: CircuitosEnElPlano,
})

const ELEMENTOS: ClaseElemento[] = ['boca', 'llave', 'combinacion', 'toma']

const ITEM =
  'data-[state=on]:border-primary data-[state=on]:bg-primary/10 h-auto min-w-0 flex-1 flex-col gap-1 px-1 py-1.5 text-[11px] leading-tight whitespace-normal'

function Herramientas() {
  const herramienta = usePlano((s) => s.herramienta)
  const elegir = usePlano((s) => s.elegirHerramienta)
  return (
    <ToggleGroup
      type="single"
      variant="outline"
      value={herramienta ?? 'mover'}
      onValueChange={(v) => v && elegir(v === 'mover' ? null : (v as Herramienta))}
      className="grid w-full grid-cols-4"
      spacing={1}
    >
      {ELEMENTOS.map((clase) => (
        <ToggleGroupItem key={clase} value={clase} className={ITEM}>
          <IconoSimbolo clase={clase} className="text-primary size-7" />
          {NOMBRE_ELEMENTO[clase]}
        </ToggleGroupItem>
      ))}
      <ToggleGroupItem value="trazar" className={ITEM}>
        <Spline className="size-7 p-0.5 text-red-600" />
        Trazar
      </ToggleGroupItem>
      <ToggleGroupItem value="probar" className={ITEM}>
        <Power className="size-7 p-0.5 text-amber-500" />
        Probar
      </ToggleGroupItem>
      <ToggleGroupItem value="mover" className={ITEM}>
        <Hand className="size-7 p-0.5" />
        Mover
      </ToggleGroupItem>
      <ToggleGroupItem value="borrar" className={ITEM}>
        <Eraser className="size-7 p-0.5" />
        Borrar
      </ToggleGroupItem>
    </ToggleGroup>
  )
}

function Ayuda() {
  const herramienta = usePlano((s) => s.herramienta)
  const activo = usePlano((s) => s.circuitos[s.planoId]?.find((c) => c.id === s.circuitoActivo))
  const inicio = usePlano((s) => s.inicioTramo)
  const texto =
    herramienta === 'probar'
      ? 'Tocá las llaves para prender y apagar las luces. Abajo están las protecciones del tablero.'
      : herramienta === 'trazar'
        ? !activo
          ? 'Creá un circuito (IUG o TUG) o elegí uno para trazarlo.'
          : inicio === null
            ? `Trazando ${activo.nombre}: tocá el tablero (o una boca del circuito) para empezar.`
            : `Trazando ${activo.nombre}: tocá la boca siguiente. Para cortar el trazo, tocá un lugar vacío.`
        : herramienta === null
          ? 'Arrastrá un elemento para cambiarlo de lugar. Si lo soltás fuera de la casa, se borra.'
          : herramienta === 'borrar'
            ? 'Tocá un elemento o un tramo para borrarlo.'
            : herramienta === 'boca'
              ? 'Tocá el techo de un ambiente para poner una boca.'
              : `Tocá cerca de una pared para poner ${herramienta === 'toma' ? 'un toma' : 'una llave'}: se apoya sola en la pared más cercana.`
  return <p className="text-muted-foreground text-sm">{texto}</p>
}

/** Interruptor del tablero para probar: palanca arriba = cerrado. */
function Palanca({
  nombre,
  detalle,
  cerrado,
  onAlternar,
}: {
  nombre: string
  detalle: string
  cerrado: boolean
  onAlternar: () => void
}) {
  return (
    <button
      role="switch"
      aria-checked={cerrado}
      onClick={onAlternar}
      className="bg-card hover:bg-muted flex w-20 flex-col items-center gap-1 rounded-lg border p-2 text-xs"
    >
      <span className="font-semibold">{nombre}</span>
      <span
        className={cn(
          'flex h-10 w-6 flex-col rounded-md border-2 p-0.5',
          cerrado ? 'justify-start border-emerald-600' : 'border-muted-foreground justify-end',
        )}
      >
        <span
          className={cn('h-4 rounded-sm', cerrado ? 'bg-emerald-600' : 'bg-muted-foreground')}
        />
      </span>
      <span className="text-muted-foreground">{cerrado ? 'Cerrado' : 'Abierto'}</span>
      <span className="text-muted-foreground leading-tight">{detalle}</span>
    </button>
  )
}

function TableroDePrueba() {
  const circuitos = usePlano((s) => s.circuitos[s.planoId])
  const prueba = usePlano((s) => s.prueba)
  const { alternarDiferencial, alternarPia } = usePlano.getState()
  return (
    <section className="space-y-2">
      <p className="text-sm font-medium">Tablero</p>
      <div className="flex flex-wrap gap-2">
        <Palanca
          nombre="ID"
          detalle="30 mA"
          cerrado={prueba.diferencial}
          onAlternar={alternarDiferencial}
        />
        {(circuitos ?? []).map((c) => (
          <Palanca
            key={c.id}
            nombre={c.nombre}
            detalle={`PIA ${c.tipo}`}
            cerrado={!prueba.apagados.includes(c.id)}
            onAlternar={() => alternarPia(c.id)}
          />
        ))}
      </div>
      <p className="text-muted-foreground text-xs">
        Si abrís el diferencial se corta todo; si abrís un PIA, solo su circuito. Los tramos con
        tensión se marcan en amarillo.
      </p>
    </section>
  )
}

const TIPOS: TipoCircuitoPlano[] = ['IUG', 'TUG']

function Circuitos() {
  const circuitos = usePlano((s) => s.circuitos[s.planoId])
  const activo = usePlano((s) => s.circuitoActivo)
  const trazando = usePlano((s) => s.herramienta === 'trazar')
  const { agregarCircuito, elegirCircuito, quitarCircuito } = usePlano.getState()
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {(circuitos ?? []).map((c) => {
        const estilo = ESTILO_CIRCUITO[c.tipo]
        const elegido = trazando && c.id === activo
        return (
          <span
            key={c.id}
            className={cn(
              'flex items-center rounded-full border text-sm',
              elegido && 'border-primary bg-primary/10 ring-primary/30 ring-2',
            )}
          >
            <button
              onClick={() => elegirCircuito(c.id)}
              aria-pressed={elegido}
              className="flex items-center gap-1.5 py-1 pr-1 pl-3 font-medium"
            >
              <svg viewBox="0 0 24 6" className="h-1.5 w-6" aria-hidden>
                <line
                  x1={0}
                  y1={3}
                  x2={24}
                  y2={3}
                  strokeWidth={4}
                  stroke={estilo.stroke}
                  strokeDasharray={'strokeDasharray' in estilo ? '6 4' : undefined}
                />
              </svg>
              {c.nombre} <span className="text-muted-foreground text-xs">{c.tipo}</span>
            </button>
            <Confirmar
              titulo={`¿Borrar ${c.nombre}?`}
              descripcion="Se borran también todos sus tramos."
              accion="Borrar"
              onConfirmar={() => quitarCircuito(c.id)}
            >
              <button
                className="text-muted-foreground hover:text-foreground rounded-full p-1.5"
                aria-label={`Borrar ${c.nombre}`}
              >
                <X className="size-3.5" />
              </button>
            </Confirmar>
          </span>
        )
      })}
      {TIPOS.map((tipo) => (
        <Button key={tipo} variant="secondary" size="sm" onClick={() => agregarCircuito(tipo)}>
          <Plus /> {NOMBRE_TIPO_CIRCUITO[tipo]}
        </Button>
      ))}
    </div>
  )
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
  const probando = usePlano((s) => s.herramienta === 'probar')
  const sinErrores = hallazgos !== null && !hallazgos.some((h) => h.nivel === 'error')
  const navegar = useNavigate()
  const armarTablero = () => {
    useTablero.getState().cargarCaso(usePlano.getState().caso())
    void navegar({ to: '/tablero' })
  }

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
            Ubicá las bocas y trazá los circuitos de una casa
          </p>
        </div>
        <Confirmar
          titulo="¿Vaciar el plano?"
          descripcion="Se borran todos los elementos y circuitos."
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
        <div className="text-muted-foreground space-y-1 text-sm">
          <p>
            <strong className="text-foreground">1. Ubicá los elementos.</strong> En cada ambiente,
            por lo menos las bocas de luz y los tomas que pide la norma, y una llave para cada luz.
            El tablero ya está junto a la entrada.
          </p>
          <p>
            <strong className="text-foreground">2. Trazá los circuitos.</strong> Creá cada circuito
            y unilo desde el tablero, boca por boca. Cada luz va unida a su llave.
          </p>
          <p>
            <strong className="text-foreground">3. Probá.</strong> Prendé las llaves y jugá con las
            protecciones del tablero para ver qué se apaga.
          </p>
        </div>
        <Herramientas />
        <Circuitos />
        <Ayuda />
        <LienzoPlano className="aspect-square max-h-[75svh] w-full" />
        {probando && <TableroDePrueba />}
      </section>

      <Button size="lg" onClick={verificar}>
        Verificar el plano
      </Button>
      {hallazgos && (
        <ListaHallazgos hallazgos={hallazgos} exito="¡La instalación del plano cumple!" />
      )}
      {sinErrores && (
        <Button size="lg" variant="outline" onClick={armarTablero}>
          <LayoutPanelTop /> Armá el tablero de esta casa
        </Button>
      )}

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
