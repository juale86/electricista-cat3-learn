import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

import {
  ubicar,
  verificarPlano,
  type ClaseElemento,
  type Elemento,
  type HallazgoPlano,
  type Plano,
  type Punto,
} from '@/dominio/plano'
import { PLANOS } from '@/dominio/planos'

export type Herramienta = ClaseElemento | 'borrar' | null

/** Elementos ubicados en cada plano. Se guardan en el navegador para seguir otro día. */
interface EstadoPlano {
  planoId: string
  elementos: Record<string, Elemento[]>
  herramienta: Herramienta
  /** `null` mientras no se verificó o después de cambiar algo */
  hallazgos: HallazgoPlano[] | null
  elegirHerramienta: (h: Herramienta) => void
  poner: (clase: ClaseElemento, punto: Punto) => void
  /** Mientras se arrastra: sigue al dedo sin acomodarse */
  arrastrar: (id: string, punto: Punto) => void
  /** Al soltar: se apoya en la pared o el techo del ambiente donde quedó */
  soltar: (id: string) => void
  quitar: (id: string) => void
  vaciar: () => void
  verificar: () => void
}

export function planoActual(planoId: string): Plano {
  return PLANOS.find((p) => p.id === planoId) ?? PLANOS[0]
}

export const usePlano = create<EstadoPlano>()(
  devtools(
    persist(
      (set, get) => {
        const cambiar = (fn: (elementos: Elemento[]) => Elemento[]) =>
          set((s) => ({
            elementos: { ...s.elementos, [s.planoId]: fn(s.elementos[s.planoId] ?? []) },
            hallazgos: null,
          }))

        return {
          planoId: PLANOS[0].id,
          elementos: {},
          herramienta: 'boca',
          hallazgos: null,
          elegirHerramienta: (herramienta) => set({ herramienta }),
          poner: (clase, punto) => {
            const lugar = ubicar(planoActual(get().planoId), clase, punto)
            if (lugar) cambiar((es) => [...es, { id: crypto.randomUUID(), clase, ...lugar }])
          },
          arrastrar: (id, punto) =>
            cambiar((es) => es.map((e) => (e.id === id ? { ...e, ...punto } : e))),
          soltar: (id) =>
            cambiar((es) =>
              es.flatMap((e) => {
                if (e.id !== id) return [e]
                const lugar = ubicar(planoActual(get().planoId), e.clase, e)
                // Fuera de la casa: se descarta, como tirarlo a la papelera
                return lugar ? [{ ...e, ...lugar }] : []
              }),
            ),
          quitar: (id) => cambiar((es) => es.filter((e) => e.id !== id)),
          vaciar: () => cambiar(() => []),
          verificar: () => {
            const { planoId, elementos } = get()
            set({ hallazgos: verificarPlano(planoActual(planoId), elementos[planoId] ?? []) })
          },
        }
      },
      {
        name: 'electricista-plano',
        version: 1,
        partialize: ({ planoId, elementos }) => ({ planoId, elementos }),
      },
    ),
    { name: 'Plano', enabled: import.meta.env.DEV },
  ),
)
