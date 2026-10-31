import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { ArrowLeft, ChevronLeft, ChevronRight, Dumbbell } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { programaUTN, urlReferencia } from '@/dominio/referencias'
import { buscarTema, cargarContenido, TEMAS, temaDisponible } from '@/guia/temas'

export const Route = createFileRoute('/guia/$temaId')({
  loader: async ({ params }) => {
    const tema = buscarTema(params.temaId)
    const cargar = cargarContenido(params.temaId)
    if (!tema || !cargar) throw notFound()
    const { default: Contenido } = await cargar()
    return { tema, Contenido }
  },
  component: PaginaTema,
  notFoundComponent: () => (
    <main className="mx-auto max-w-md space-y-4 p-4">
      <p>Este tema todavía no está escrito.</p>
      <Link to="/guia" className={buttonVariants({ variant: 'outline' })}>
        Volver a la guía
      </Link>
    </main>
  ),
})

function PaginaTema() {
  const { tema, Contenido } = Route.useLoaderData()
  const disponibles = TEMAS.filter((t) => temaDisponible(t.id))
  const posicion = disponibles.findIndex((t) => t.id === tema.id)
  const anterior = disponibles[posicion - 1]
  const siguiente = disponibles[posicion + 1]

  return (
    <main className="mx-auto flex min-h-svh max-w-2xl flex-col gap-4 p-4">
      <header className="flex items-start gap-2 pt-2">
        <Link
          to="/guia"
          className={buttonVariants({ variant: 'ghost', size: 'icon' })}
          aria-label="Volver a la guía"
        >
          <ArrowLeft />
        </Link>
        <div className="space-y-1">
          <p className="text-muted-foreground text-xs">{tema.bloque.titulo}</p>
          <h1 className="text-xl leading-tight font-bold">{tema.titulo}</h1>
          <div className="flex flex-wrap gap-1">
            {tema.unidadesUTN.map((u) => (
              <Badge key={u} variant="secondary" asChild>
                <a
                  href={urlReferencia(programaUTN(u)) ?? undefined}
                  target="_blank"
                  rel="noreferrer"
                  title="Abre el programa del curso en esa unidad"
                >
                  Unidad {u} UTN
                </a>
              </Badge>
            ))}
          </div>
        </div>
      </header>

      <article className="prose prose-sm dark:prose-invert prose-headings:scroll-mt-4 prose-table:text-sm max-w-none">
        <Contenido />
      </article>

      {tema.ejercicio && (
        <Link
          to="/practica"
          className={buttonVariants({ variant: 'outline', className: 'w-full' })}
        >
          <Dumbbell /> Entrenar este tema en Práctica
        </Link>
      )}

      <nav className="grid grid-cols-2 gap-2 pb-4">
        {anterior ? (
          <Link
            to="/guia/$temaId"
            params={{ temaId: anterior.id }}
            className="hover:bg-muted flex items-center gap-1 rounded-lg border p-3 text-sm"
          >
            <ChevronLeft className="size-4 shrink-0" />
            <span className="truncate">{anterior.titulo}</span>
          </Link>
        ) : (
          <span />
        )}
        {siguiente && (
          <Link
            to="/guia/$temaId"
            params={{ temaId: siguiente.id }}
            className="hover:bg-muted flex items-center justify-end gap-1 rounded-lg border p-3 text-right text-sm"
          >
            <span className="truncate">{siguiente.titulo}</span>
            <ChevronRight className="size-4 shrink-0" />
          </Link>
        )}
      </nav>
    </main>
  )
}
