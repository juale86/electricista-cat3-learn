import { createFileRoute, Link } from '@tanstack/react-router'
import { ChevronRight, Dumbbell, GraduationCap, LayoutPanelTop, Zap } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: Inicio,
})

const SECCIONES = [
  {
    to: '/guia',
    icono: GraduationCap,
    titulo: 'Guía',
    descripcion:
      'Aprendé desde lo básico hasta el certificado del ERSeP, con simuladores y ejercicios.',
  },
  {
    to: '/practica',
    icono: Dumbbell,
    titulo: 'Práctica',
    descripcion:
      'Entrená los cálculos contra reloj y simulá el examen. Tu progreso queda guardado.',
  },
  {
    to: '/tablero',
    icono: LayoutPanelTop,
    titulo: 'Armá el tablero',
    descripcion: 'Elegí y ordená las protecciones de una vivienda y los colores de los cables.',
  },
] as const

function Inicio() {
  return (
    <main className="mx-auto flex min-h-svh max-w-md flex-col gap-6 p-4">
      <header className="flex items-center gap-3 pt-4">
        <div className="bg-primary text-primary-foreground flex size-11 items-center justify-center rounded-xl">
          <Zap className="size-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Electricista Cat. III</h1>
          <p className="text-muted-foreground text-sm">Instalaciones eléctricas en Córdoba</p>
        </div>
      </header>

      <nav className="space-y-3">
        {SECCIONES.map(({ to, icono: Icono, titulo, descripcion }) => (
          <Link
            key={to}
            to={to}
            className="bg-card hover:bg-muted flex items-center gap-4 rounded-xl border p-4 transition-colors"
          >
            <Icono className="text-primary size-8 shrink-0" />
            <div className="flex-1">
              <p className="font-semibold">{titulo}</p>
              <p className="text-muted-foreground text-sm">{descripcion}</p>
            </div>
            <ChevronRight className="text-muted-foreground size-5" />
          </Link>
        ))}
      </nav>
    </main>
  )
}
