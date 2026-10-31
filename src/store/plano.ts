import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

import {
  casoDelPlano,
  siguienteNombre,
  verificarCircuitos,
  type CircuitoPlano,
  type TipoCircuitoPlano,
  type Tramo,
} from '@/dominio/circuitosPlano'
import {
  ubicar,
  verificarPlano,
  type ClaseElemento,
  type Elemento,
  type HallazgoPlano,
  type Plano,
  type Punto,
} from '@/dominio/plano'
import { generarPlano, type ModoGenerador } from '@/dominio/generadorPlanos'
import { PLANOS } from '@/dominio/planos'
import type { Caso } from '@/dominio/tablero'

export type Herramienta = ClaseElemento | 'trazar' | 'probar' | 'borrar' | null

/** Lo hecho en cada plano, por id de plano. Se guarda en el navegador para seguir otro día. */
interface EstadoPlano {
  planoId: string
  /** La última casa generada (se guarda junto con lo hecho en ella) */
  generado: Plano | null
  elegirPlano: (planoId: string) => void
  generar: (modo: ModoGenerador) => void
  elementos: Record<string, Elemento[]>
  circuitos: Record<string, CircuitoPlano[]>
  tramos: Record<string, Tramo[]>
  herramienta: Herramienta
  circuitoActivo: string | null
  /** Extremo desde el que sigue el trazo en curso */
  inicioTramo: string | null
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
  agregarCircuito: (tipo: TipoCircuitoPlano) => void
  elegirCircuito: (id: string) => void
  quitarCircuito: (id: string) => void
  /** Estado de las llaves y protecciones al probar. No se guarda: al recargar arranca todo apagado. */
  prueba: { diferencial: boolean; apagados: string[]; llaves: string[] }
  alternarLlave: (id: string) => void
  alternarPia: (circuito: string) => void
  alternarDiferencial: () => void
  /** Con la herramienta de trazar: une el extremo anterior con este y sigue desde acá */
  tocarNodo: (id: string) => void
  cortarTrazo: () => void
  quitarTramo: (id: string) => void
  verificar: () => void
  /** El caso para «Armá el tablero» con los circuitos trazados */
  caso: () => Caso
}

/** Al cambiar de casa: herramientas y prueba como al entrar */
const reinicio = {
  herramienta: 'boca',
  circuitoActivo: null,
  inicioTramo: null,
  hallazgos: null,
  prueba: { diferencial: true, apagados: [], llaves: [] },
} satisfies Partial<EstadoPlano>

const alternar = (lista: string[], id: string) =>
  lista.includes(id) ? lista.filter((x) => x !== id) : [...lista, id]

export function planoActual(planoId: string, generado: Plano | null): Plano {
  if (generado?.id === planoId) return generado
  return PLANOS.find((p) => p.id === planoId) ?? PLANOS[0]
}

export const usePlano = create<EstadoPlano>()(
  devtools(
    persist(
      (set, get) => {
        const actual = () => {
          const s = get()
          return {
            plano: planoActual(s.planoId, s.generado),
            elementos: s.elementos[s.planoId] ?? [],
            circuitos: s.circuitos[s.planoId] ?? [],
            tramos: s.tramos[s.planoId] ?? [],
          }
        }
        const cambiar = (
          fn: (a: ReturnType<typeof actual>) => Partial<Omit<ReturnType<typeof actual>, 'plano'>>,
          extra: Partial<EstadoPlano> = {},
        ) => {
          const nuevo = fn(actual())
          set((s) => ({
            ...(nuevo.elementos && { elementos: { ...s.elementos, [s.planoId]: nuevo.elementos } }),
            ...(nuevo.circuitos && { circuitos: { ...s.circuitos, [s.planoId]: nuevo.circuitos } }),
            ...(nuevo.tramos && { tramos: { ...s.tramos, [s.planoId]: nuevo.tramos } }),
            hallazgos: null,
            ...extra,
          }))
        }
        const sinElemento = (tramos: Tramo[], id: string) =>
          tramos.filter((t) => t.desde !== id && t.hasta !== id)

        return {
          planoId: PLANOS[0].id,
          generado: null,
          elegirPlano: (planoId) => set({ planoId, ...reinicio }),
          generar: (modo) =>
            set((s) => {
              const plano = generarPlano(modo)
              // Lo hecho en la casa generada anterior no se guarda
              const sin = <T>(r: Record<string, T>) =>
                Object.fromEntries(Object.entries(r).filter(([id]) => id !== s.generado?.id))
              return {
                generado: plano,
                planoId: plano.id,
                elementos: sin(s.elementos),
                circuitos: sin(s.circuitos),
                tramos: sin(s.tramos),
                ...reinicio,
              }
            }),
          elementos: {},
          circuitos: {},
          tramos: {},
          herramienta: 'boca',
          circuitoActivo: null,
          inicioTramo: null,
          hallazgos: null,
          prueba: { diferencial: true, apagados: [], llaves: [] },
          alternarLlave: (id) =>
            set(({ prueba }) => ({ prueba: { ...prueba, llaves: alternar(prueba.llaves, id) } })),
          alternarPia: (circuito) =>
            set(({ prueba }) => ({
              prueba: { ...prueba, apagados: alternar(prueba.apagados, circuito) },
            })),
          alternarDiferencial: () =>
            set(({ prueba }) => ({ prueba: { ...prueba, diferencial: !prueba.diferencial } })),
          elegirHerramienta: (herramienta) => set({ herramienta, inicioTramo: null }),
          poner: (clase, punto) => {
            const lugar = ubicar(actual().plano, clase, punto)
            if (lugar)
              cambiar(({ elementos }) => ({
                elementos: [...elementos, { id: crypto.randomUUID(), clase, ...lugar }],
              }))
          },
          arrastrar: (id, punto) =>
            cambiar(({ elementos }) => ({
              elementos: elementos.map((e) => (e.id === id ? { ...e, ...punto } : e)),
            })),
          soltar: (id) =>
            cambiar(({ plano, elementos, tramos }) => {
              const e = elementos.find((x) => x.id === id)
              const lugar = e && ubicar(plano, e.clase, e)
              // Fuera de la casa: se descarta, como tirarlo a la papelera
              if (!lugar)
                return {
                  elementos: elementos.filter((x) => x.id !== id),
                  tramos: sinElemento(tramos, id),
                }
              return { elementos: elementos.map((x) => (x.id === id ? { ...x, ...lugar } : x)) }
            }),
          quitar: (id) =>
            cambiar(({ elementos, tramos }) => ({
              elementos: elementos.filter((e) => e.id !== id),
              tramos: sinElemento(tramos, id),
            })),
          vaciar: () =>
            cambiar(() => ({ elementos: [], circuitos: [], tramos: [] }), {
              circuitoActivo: null,
              inicioTramo: null,
            }),
          agregarCircuito: (tipo) => {
            const id = crypto.randomUUID()
            cambiar(
              ({ circuitos }) => ({
                circuitos: [...circuitos, { id, tipo, nombre: siguienteNombre(circuitos) }],
              }),
              { circuitoActivo: id, herramienta: 'trazar', inicioTramo: null },
            )
          },
          elegirCircuito: (id) =>
            set({ circuitoActivo: id, herramienta: 'trazar', inicioTramo: null }),
          quitarCircuito: (id) =>
            cambiar(
              ({ circuitos, tramos }) => ({
                circuitos: circuitos.filter((c) => c.id !== id),
                tramos: tramos.filter((t) => t.circuito !== id),
              }),
              {
                circuitoActivo: get().circuitoActivo === id ? null : get().circuitoActivo,
                inicioTramo: null,
              },
            ),
          tocarNodo: (id) => {
            const { herramienta, circuitoActivo, inicioTramo } = get()
            if (herramienta !== 'trazar' || !circuitoActivo) return
            if (inicioTramo === null || inicioTramo === id) {
              set({ inicioTramo: id })
              return
            }
            cambiar(
              ({ tramos }) => {
                const repetido = tramos.some(
                  (t) =>
                    t.circuito === circuitoActivo &&
                    ((t.desde === inicioTramo && t.hasta === id) ||
                      (t.desde === id && t.hasta === inicioTramo)),
                )
                if (repetido) return {}
                const tramo = {
                  id: crypto.randomUUID(),
                  circuito: circuitoActivo,
                  desde: inicioTramo,
                  hasta: id,
                }
                return { tramos: [...tramos, tramo] }
              },
              { inicioTramo: id },
            )
          },
          cortarTrazo: () => set({ inicioTramo: null }),
          quitarTramo: (id) =>
            cambiar(({ tramos }) => ({ tramos: tramos.filter((t) => t.id !== id) })),
          verificar: () => {
            const { plano, elementos, circuitos, tramos } = actual()
            set({
              hallazgos: [
                ...verificarPlano(plano, elementos),
                ...verificarCircuitos(plano, elementos, circuitos, tramos),
              ],
            })
          },
          caso: () => {
            const { plano, elementos, circuitos, tramos } = actual()
            return casoDelPlano(plano, elementos, circuitos, tramos)
          },
        }
      },
      {
        name: 'electricista-plano',
        version: 1,
        partialize: ({ planoId, generado, elementos, circuitos, tramos }) => ({
          planoId,
          generado,
          elementos,
          circuitos,
          tramos,
        }),
      },
    ),
    { name: 'Plano', enabled: import.meta.env.DEV },
  ),
)

export const usePlanoActual = () => usePlano((s) => planoActual(s.planoId, s.generado))
