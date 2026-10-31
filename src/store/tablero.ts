import { arrayMove } from '@dnd-kit/sortable'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

import {
  generarCaso,
  verificarTablero,
  type CambiosDispositivo,
  type Caso,
  type ClaseDispositivo,
  type ColorCable,
  type Colores,
  type Dispositivo,
  type FuncionCable,
  type Hallazgo,
} from '@/dominio/tablero'

/** Tablero en armado. No se persiste: al recargar se arranca otro caso. */

interface EstadoTablero {
  caso: Caso
  dispositivos: Dispositivo[]
  colores: Colores
  /** `null` mientras no se verificó o después de cambiar algo */
  hallazgos: Hallazgo[] | null
  nuevoCaso: () => void
  /** Arranca con un caso dado, por ejemplo el de los circuitos trazados en el plano */
  cargarCaso: (caso: Caso) => void
  agregar: (clase: ClaseDispositivo) => void
  quitar: (id: string) => void
  actualizar: (id: string, cambios: CambiosDispositivo) => void
  mover: (desde: number, hasta: number) => void
  elegirColor: (funcion: FuncionCable, color: ColorCable) => void
  verificar: () => void
}

export const useTablero = create<EstadoTablero>()(
  devtools(
    (set, get) => ({
      caso: generarCaso(),
      dispositivos: [],
      colores: {},
      hallazgos: null,
      nuevoCaso: () => set({ caso: generarCaso(), dispositivos: [], colores: {}, hallazgos: null }),
      cargarCaso: (caso) => set({ caso, dispositivos: [], colores: {}, hallazgos: null }),
      agregar: (clase) =>
        set((s) => ({
          dispositivos: [...s.dispositivos, { id: crypto.randomUUID(), clase } as Dispositivo],
          hallazgos: null,
        })),
      quitar: (id) =>
        set((s) => ({ dispositivos: s.dispositivos.filter((d) => d.id !== id), hallazgos: null })),
      actualizar: (id, cambios) =>
        set((s) => ({
          dispositivos: s.dispositivos.map((d) =>
            d.id === id ? ({ ...d, ...cambios } as Dispositivo) : d,
          ),
          hallazgos: null,
        })),
      mover: (desde, hasta) =>
        set((s) => ({ dispositivos: arrayMove(s.dispositivos, desde, hasta), hallazgos: null })),
      elegirColor: (funcion, color) =>
        set((s) => ({ colores: { ...s.colores, [funcion]: color }, hallazgos: null })),
      verificar: () => {
        const { caso, dispositivos, colores } = get()
        set({ hallazgos: verificarTablero(caso, dispositivos, colores) })
      },
    }),
    { name: 'Tablero', enabled: import.meta.env.DEV },
  ),
)
