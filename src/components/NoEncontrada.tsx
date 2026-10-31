import { Link } from '@tanstack/react-router'

import { buttonVariants } from '@/components/ui/button'

export function NoEncontrada() {
  return (
    <main className="mx-auto max-w-md space-y-4 p-4">
      <p>No se encontró la partida.</p>
      <Link to="/practica" className={buttonVariants({ variant: 'outline' })}>
        Volver a la práctica
      </Link>
    </main>
  )
}
