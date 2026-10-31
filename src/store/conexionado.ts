import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

import {
  ESCENARIOS,
  verificarConexionado,
  type Cable,
  type EstadoLlaves,
  type Extremo,
  type HallazgoConexionado,
} from '@/dominio/conexionado'
import type { ColorCable } from '@/dominio/tablero'

/** Cables de cada escenario. Se guardan en el navegador; las llaves arrancan apagadas. */
interface EstadoConexionado {
  escenarioId: string
  cables: Record<string, Cable[]>
  color: ColorCable
  borrando: boolean
  llaves: EstadoLlaves
  hallazgos: HallazgoConexionado[] | null
  elegirEscenario: (id: string) => void
  elegirColor: (color: ColorCable) => void
  alternarBorrar: () => void
  conectar: (desde: Extremo, hasta: Extremo) => void
  quitar: (id: string) => void
  vaciar: () => void
  accionar: (llave: string) => void
  verificar: () => void
}

export function escenarioActual(id: string) {
  return ESCENARIOS.find((e) => e.id === id) ?? ESCENARIOS[0]
}

export const useConexionado = create<EstadoConexionado>()(
  devtools(
    persist(
      (set, get) => {
        const cambiar = (fn: (cables: Cable[]) => Cable[]) =>
          set((s) => ({
            cables: { ...s.cables, [s.escenarioId]: fn(s.cables[s.escenarioId] ?? []) },
            hallazgos: null,
          }))
        return {
          escenarioId: ESCENARIOS[0].id,
          cables: {},
          color: 'marron',
          borrando: false,
          llaves: {},
          hallazgos: null,
          elegirEscenario: (escenarioId) =>
            set({ escenarioId, llaves: {}, hallazgos: null, borrando: false }),
          elegirColor: (color) => set({ color, borrando: false }),
          alternarBorrar: () => set((s) => ({ borrando: !s.borrando })),
          conectar: (desde, hasta) => {
            if (desde === hasta) return
            const { color } = get()
            cambiar((cs) =>
              cs.some(
                (c) =>
                  (c.desde === desde && c.hasta === hasta) ||
                  (c.desde === hasta && c.hasta === desde),
              )
                ? cs
                : [...cs, { id: crypto.randomUUID(), desde, hasta, color }],
            )
          },
          quitar: (id) => cambiar((cs) => cs.filter((c) => c.id !== id)),
          vaciar: () => cambiar(() => []),
          accionar: (llave) => set((s) => ({ llaves: { ...s.llaves, [llave]: !s.llaves[llave] } })),
          verificar: () => {
            const { escenarioId, cables } = get()
            set({
              hallazgos: verificarConexionado(
                escenarioActual(escenarioId),
                cables[escenarioId] ?? [],
              ),
            })
          },
        }
      },
      {
        name: 'electricista-conexionado',
        version: 1,
        partialize: ({ escenarioId, cables, color }) => ({ escenarioId, cables, color }),
      },
    ),
    { name: 'Conexionado', enabled: import.meta.env.DEV },
  ),
)
