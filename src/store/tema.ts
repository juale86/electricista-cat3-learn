import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Tema = 'claro' | 'oscuro'

interface EstadoTema {
  /** `null` = seguir la preferencia del sistema operativo. */
  tema: Tema | null
  alternar: () => void
}

const consultaOscuro = window.matchMedia('(prefers-color-scheme: dark)')

export function temaEfectivo(tema: Tema | null): Tema {
  return tema ?? (consultaOscuro.matches ? 'oscuro' : 'claro')
}

function aplicar(tema: Tema | null) {
  document.documentElement.classList.toggle('dark', temaEfectivo(tema) === 'oscuro')
}

// La clave la lee también el script de index.html para evitar el destello al cargar.
export const useTema = create<EstadoTema>()(
  persist(
    (set, get) => ({
      tema: null,
      alternar: () => set({ tema: temaEfectivo(get().tema) === 'oscuro' ? 'claro' : 'oscuro' }),
    }),
    { name: 'electricista-tema', version: 1 },
  ),
)

aplicar(useTema.getState().tema)
useTema.subscribe((estado) => aplicar(estado.tema))
consultaOscuro.addEventListener('change', () => aplicar(useTema.getState().tema))
