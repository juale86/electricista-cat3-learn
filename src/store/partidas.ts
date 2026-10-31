import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

import {
  TIPOS_EJERCICIO,
  type EstadisticaTipo,
  type FormatoRespuesta,
  type TipoEjercicio,
} from '@/dominio/ejercicios'

export type ModoJuego = 'practica' | 'examen'

export interface ConfigPartida {
  modo: ModoJuego
  formato: FormatoRespuesta
  tipos: TipoEjercicio[]
}

export interface ResultadoExamen {
  fecha: number
  aciertos: number
  total: number
  tiempoMs: number
}

export interface Partida {
  id: string
  nombre: string
  creada: number
  actualizada: number
  config: ConfigPartida
  stats: Partial<Record<TipoEjercicio, EstadisticaTipo>>
  examenes: ResultadoExamen[]
}

interface EstadoPartidas {
  partidas: Partida[]
  crear: (nombre: string) => string
  eliminar: (id: string) => void
  /** Empezar de cero: borra estadísticas y exámenes, conserva nombre y configuración. */
  reiniciar: (id: string) => void
  configurar: (id: string, config: Partial<ConfigPartida>) => void
  registrarRespuesta: (id: string, tipo: TipoEjercicio, correcta: boolean, tiempoMs: number) => void
  registrarExamen: (id: string, resultado: ResultadoExamen) => void
}

const CONFIG_INICIAL: ConfigPartida = {
  modo: 'practica',
  formato: 'mental',
  tipos: TIPOS_EJERCICIO,
}

function actualizar(partidas: Partida[], id: string, cambio: (p: Partida) => Partial<Partida>) {
  return partidas.map((p) => (p.id === id ? { ...p, ...cambio(p), actualizada: Date.now() } : p))
}

export const usePartidas = create<EstadoPartidas>()(
  devtools(
    persist(
      (set) => ({
        partidas: [],
        crear: (nombre) => {
          const id = crypto.randomUUID()
          const ahora = Date.now()
          set((s) => ({
            partidas: [
              ...s.partidas,
              {
                id,
                nombre,
                creada: ahora,
                actualizada: ahora,
                config: CONFIG_INICIAL,
                stats: {},
                examenes: [],
              },
            ],
          }))
          return id
        },
        eliminar: (id) => set((s) => ({ partidas: s.partidas.filter((p) => p.id !== id) })),
        reiniciar: (id) =>
          set((s) => ({
            partidas: actualizar(s.partidas, id, () => ({ stats: {}, examenes: [] })),
          })),
        configurar: (id, config) =>
          set((s) => ({
            partidas: actualizar(s.partidas, id, (p) => ({ config: { ...p.config, ...config } })),
          })),
        registrarRespuesta: (id, tipo, correcta, tiempoMs) =>
          set((s) => ({
            partidas: actualizar(s.partidas, id, (p) => {
              const previo = p.stats[tipo] ?? { intentos: 0, aciertos: 0, tiempoMs: 0 }
              return {
                stats: {
                  ...p.stats,
                  [tipo]: {
                    intentos: previo.intentos + 1,
                    aciertos: previo.aciertos + (correcta ? 1 : 0),
                    tiempoMs: previo.tiempoMs + tiempoMs,
                  },
                },
              }
            }),
          })),
        registrarExamen: (id, resultado) =>
          set((s) => ({
            partidas: actualizar(s.partidas, id, (p) => ({ examenes: [...p.examenes, resultado] })),
          })),
      }),
      {
        name: 'electricista-partidas',
        version: 3,
        // Los tipos nuevos se activan en las partidas que ya existían: v2 «cuentas», v3 «division».
        migrate: (guardado, version) => {
          const estado = guardado as Pick<EstadoPartidas, 'partidas'>
          const nuevos: [number, TipoEjercicio][] = [
            [2, 'cuentas'],
            [3, 'division'],
          ]
          for (const [desde, tipo] of nuevos) {
            if (version >= desde) continue
            for (const p of estado.partidas) {
              if (!p.config.tipos.includes(tipo)) p.config.tipos = [...p.config.tipos, tipo]
            }
          }
          return estado as EstadoPartidas
        },
      },
    ),
    { name: 'Partidas', enabled: import.meta.env.DEV },
  ),
)

export function usePartida(id: string) {
  return usePartidas((s) => s.partidas.find((p) => p.id === id))
}
