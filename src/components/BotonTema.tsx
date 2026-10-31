import { Moon, Sun } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { temaEfectivo, useTema } from '@/store/tema'

export function BotonTema() {
  const tema = useTema((s) => s.tema)
  const alternar = useTema((s) => s.alternar)
  const oscuro = temaEfectivo(tema) === 'oscuro'
  const etiqueta = oscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'

  return (
    <Button variant="ghost" size="icon" onClick={alternar} aria-label={etiqueta} title={etiqueta}>
      {oscuro ? <Sun /> : <Moon />}
    </Button>
  )
}
