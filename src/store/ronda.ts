import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

import type { Ejercicio } from '@/dominio/ejercicios'

/** Ronda en curso. No se persiste: si se recarga la página, se empieza otra ronda. */

export const EJERCICIOS_POR_EXAMEN = 10
export const SEGUNDOS_POR_EJERCICIO_EXAMEN = 90

export interface RespuestaRonda {
  ejercicio: Ejercicio
  entrada: string
  correcta: boolean
  tiempoMs: number
}

interface EstadoRonda {
  partidaId: string | null
  ejercicio: Ejercicio | null
  inicioEjercicio: number
  inicioRonda: number
  respuestas: RespuestaRonda[]
  terminada: boolean
  empezar: (partidaId: string, primero: Ejercicio) => void
  responder: (entrada: string, correcta: boolean) => RespuestaRonda | null
  siguiente: (ejercicio: Ejercicio) => void
  terminar: () => void
}

export const useRonda = create<EstadoRonda>()(
  devtools(
    (set, get) => ({
      partidaId: null,
      ejercicio: null,
      inicioEjercicio: 0,
      inicioRonda: 0,
      respuestas: [],
      terminada: false,
      empezar: (partidaId, primero) => {
        const ahora = Date.now()
        set({
          partidaId,
          ejercicio: primero,
          inicioEjercicio: ahora,
          inicioRonda: ahora,
          respuestas: [],
          terminada: false,
        })
      },
      responder: (entrada, correcta) => {
        const { ejercicio, inicioEjercicio, respuestas } = get()
        if (!ejercicio) return null
        const respuesta = { ejercicio, entrada, correcta, tiempoMs: Date.now() - inicioEjercicio }
        set({ respuestas: [...respuestas, respuesta] })
        return respuesta
      },
      siguiente: (ejercicio) => set({ ejercicio, inicioEjercicio: Date.now() }),
      terminar: () => set({ terminada: true }),
    }),
    { name: 'Ronda', enabled: import.meta.env.DEV },
  ),
)
