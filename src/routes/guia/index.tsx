import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft, ChevronRight } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { BLOQUES, temaDisponible } from '@/guia/temas'

export const Route = createFileRoute('/guia/')({
  component: IndiceGuia,
})

function IndiceGuia() {
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
          <h1 className="text-xl font-bold">Guía</h1>
          <p className="text-muted-foreground text-sm">
            Basada en la AEA 770 y el material del curso
          </p>
        </div>
      </header>

      {BLOQUES.map((bloque, i) => (
        <section key={bloque.id} className="space-y-2">
          <div>
            <h2 className="font-semibold">
              {i + 1}. {bloque.titulo}
            </h2>
            <p className="text-muted-foreground text-sm">{bloque.descripcion}</p>
          </div>
          <ul className="divide-y rounded-xl border">
            {bloque.temas.map((tema) => {
              const disponible = temaDisponible(tema.id)
              const contenido = (
                <>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{tema.titulo}</p>
                    <p className="text-muted-foreground text-xs">{tema.descripcion}</p>
                  </div>
                  {disponible ? (
                    <ChevronRight className="text-muted-foreground size-4 shrink-0" />
                  ) : (
                    <Badge variant="outline" className="shrink-0">
                      Próximamente
                    </Badge>
                  )}
                </>
              )
              return (
                <li key={tema.id}>
                  {disponible ? (
                    <Link
                      to="/guia/$temaId"
                      params={{ temaId: tema.id }}
                      className="hover:bg-muted flex items-center gap-3 p-3 transition-colors"
                    >
                      {contenido}
                    </Link>
                  ) : (
                    <div className="flex items-center gap-3 p-3 opacity-60">{contenido}</div>
                  )}
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </main>
  )
}
