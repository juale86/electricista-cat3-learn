// «Armá el tablero»: el caso a resolver y la verificación del tablero armado contra la AEA 770.
// Sin React: la UI solo muestra el caso, edita los dispositivos y muestra los hallazgos.

import { piaMaximo } from './calculos'
import { CALIBRES_DIFERENCIAL, proyectoTablero } from './ejercicios/division'
import {
  CALIBRES_PIA,
  CIRCUITOS,
  DPMS,
  IZ_MONOFASICO,
  TENSION_MONOFASICA,
  type GradoElectrificacion,
  type TipoCircuito,
} from './normativa'
import { aea, carpetaERSeP, type Referencia } from './referencias'

export interface CircuitoCaso {
  id: string
  nombre: string
  tipo: TipoCircuito
  /** Qué alimenta, para mostrar */
  detalle: string
  seccion: number
  /** Corriente de proyecto según la DPMS mínima del circuito */
  ib: number
}

export interface Caso {
  grado: GradoElectrificacion
  dpms: number
  ib: number
  lineaSeccion: number
  circuitos: CircuitoCaso[]
}

export type Polos = 1 | 2
export type Curva = 'B' | 'C' | 'D'

interface Base {
  id: string
  polos?: Polos
  calibre?: number
}

export type Dispositivo =
  | (Base & { clase: 'cabecera' })
  | (Base & { clase: 'diferencial'; sensibilidad?: 30 | 300 })
  | (Base & { clase: 'pia'; curva?: Curva; circuito?: string })

export type ClaseDispositivo = Dispositivo['clase']

/** Lo que se puede editar de un dispositivo (cada clase usa una parte). */
export interface CambiosDispositivo {
  polos?: Polos
  calibre?: number
  sensibilidad?: 30 | 300
  curva?: Curva
  circuito?: string
}

export const NOMBRE_DISPOSITIVO: Record<ClaseDispositivo, string> = {
  cabecera: 'Interruptor de cabecera',
  diferencial: 'Diferencial',
  pia: 'Termomagnético (PIA)',
}

export const CALIBRES: Record<ClaseDispositivo, readonly number[]> = {
  cabecera: CALIBRES_PIA.filter((c) => c >= 16),
  diferencial: CALIBRES_DIFERENCIAL,
  pia: CALIBRES_PIA.filter((c) => c <= 40),
}

export const COLORES_CABLE = {
  marron: { nombre: 'Marrón', muestra: '#7b4a2a' },
  negro: { nombre: 'Negro', muestra: '#1c1c1c' },
  rojo: { nombre: 'Rojo', muestra: '#c62828' },
  celeste: { nombre: 'Celeste', muestra: '#4fb3e8' },
  'verde-amarillo': { nombre: 'Verde-amarillo', muestra: 'verde-amarillo' },
  verde: { nombre: 'Verde', muestra: '#2e9e44' },
  amarillo: { nombre: 'Amarillo', muestra: '#f2d22e' },
  blanco: { nombre: 'Blanco', muestra: '#f4f4f4' },
} as const

export type ColorCable = keyof typeof COLORES_CABLE
export type FuncionCable = 'fase' | 'neutro' | 'pe' | 'retorno'

export const NOMBRE_FUNCION: Record<FuncionCable, string> = {
  fase: 'Fase',
  neutro: 'Neutro',
  pe: 'Protección (PE)',
  retorno: 'Retorno de llave',
}

export type Colores = Partial<Record<FuncionCable, ColorCable>>

export interface Hallazgo {
  nivel: 'error' | 'aviso'
  texto: string
  fuente?: Referencia
  /** Dispositivo al que se refiere, para marcarlo en el riel */
  dispositivo?: string
}

const COLORES_FASE: ColorCable[] = ['marron', 'negro', 'rojo']

export function generarCaso(): Caso {
  const p = proyectoTablero()
  const circuitos: CircuitoCaso[] = [
    ...p.circuitos.iugSinTomas.map((bocas, i) => ({
      id: `iug-${i + 1}`,
      nombre: `IUG ${i + 1}`,
      tipo: 'IUG' as const,
      detalle: `${bocas} bocas de luz`,
      seccion: CIRCUITOS.IUG.seccionMinima,
      ib: (bocas * DPMS.vaPorBocaIUG * DPMS.fraccionIUGSinTomas) / TENSION_MONOFASICA,
    })),
    ...Array.from({ length: p.circuitos.tug }, (_, i) => ({
      id: `tug-${i + 1}`,
      nombre: `TUG ${i + 1}`,
      tipo: 'TUG' as const,
      detalle: 'Tomas de uso general',
      seccion: CIRCUITOS.TUG.seccionMinima,
      ib: DPMS.tug / TENSION_MONOFASICA,
    })),
    ...Array.from({ length: p.circuitos.tue }, (_, i) => ({
      id: `tue-${i + 1}`,
      nombre: `TUE ${i + 1}`,
      tipo: 'TUE' as const,
      detalle: p.v.especiales.join(', '),
      seccion: CIRCUITOS.TUE.seccionMinima,
      ib: DPMS.tue / TENSION_MONOFASICA,
    })),
  ]
  return { grado: p.v.grado, dpms: p.dpms, ib: p.ib, lineaSeccion: p.linea, circuitos }
}

/** Lo que le falta elegir a un dispositivo, o lista vacía si está completo. */
function faltantes(d: Dispositivo): string[] {
  const falta: string[] = []
  if (!d.polos) falta.push('los polos')
  if (!d.calibre) falta.push('el calibre')
  if (d.clase === 'diferencial' && !d.sensibilidad) falta.push('la sensibilidad')
  if (d.clase === 'pia' && !d.curva) falta.push('la curva')
  if (d.clase === 'pia' && !d.circuito) falta.push('el circuito')
  return falta
}

function verificarDispositivos(caso: Caso, dispositivos: Dispositivo[]): Hallazgo[] {
  const hallazgos: Hallazgo[] = []
  const error = (texto: string, fuente?: Referencia, dispositivo?: string) =>
    hallazgos.push({ nivel: 'error', texto, fuente, dispositivo })
  const aviso = (texto: string, fuente?: Referencia, dispositivo?: string) =>
    hallazgos.push({ nivel: 'aviso', texto, fuente, dispositivo })

  if (dispositivos.length === 0) {
    error('El riel está vacío: agregá los dispositivos del tablero.')
    return hallazgos
  }

  const nombre = (d: Dispositivo, i: number) => {
    if (d.clase !== 'pia') return `${NOMBRE_DISPOSITIVO[d.clase]} (posición ${i + 1})`
    const circuito = caso.circuitos.find((c) => c.id === d.circuito)
    return circuito ? `PIA de ${circuito.nombre}` : `PIA (posición ${i + 1})`
  }

  dispositivos.forEach((d, i) => {
    const falta = faltantes(d)
    if (falta.length) error(`${nombre(d, i)}: falta elegir ${falta.join(', ')}.`, undefined, d.id)
    if (d.polos === 1)
      error(
        `${nombre(d, i)}: en monofásico tiene que ser bipolar (corta fase y neutro).`,
        aea('770.16.5.1'),
        d.id,
      )
  })

  // Cabecera: primera, única y con Ib ≤ In ≤ Iz de la línea principal
  const cabeceras = dispositivos.filter((d) => d.clase === 'cabecera')
  const cabecera = cabeceras[0]
  if (!cabecera) {
    error(
      'Falta el interruptor de cabecera: corta y protege toda la instalación.',
      aea('770.16.5.3'),
    )
  } else {
    if (dispositivos[0] !== cabecera)
      error(
        'El interruptor de cabecera va primero: todo lo demás queda aguas abajo.',
        aea('770.16.5.3'),
        cabecera.id,
      )
    if (cabeceras.length > 1)
      aviso('Hay más de un interruptor de cabecera; el tablero lleva uno solo.', aea('770.16.5.3'))
    if (cabecera.calibre && cabecera.calibre < caso.ib)
      error(
        `La cabecera de ${cabecera.calibre} A es menor que la corriente de proyecto (${formatearA(caso.ib)}): saltaría con el consumo normal. Tiene que cumplir Ib ≤ In.`,
        aea('770.15.2.1'),
        cabecera.id,
      )
    const izLinea = IZ_MONOFASICO[caso.lineaSeccion]
    if (cabecera.calibre && cabecera.calibre > izLinea)
      error(
        `La cabecera de ${cabecera.calibre} A no protege la línea principal de ${formatearSeccion(caso.lineaSeccion)} (Iz ${izLinea} A). Tiene que cumplir In ≤ Iz.`,
        aea('770.15.2.1'),
        cabecera.id,
      )
  }

  // Diferenciales: 30 mA, aguas abajo de la cabecera y protegiendo a todos los PIA
  const indice = (d: Dispositivo) => dispositivos.indexOf(d)
  const diferenciales = dispositivos.filter((d) => d.clase === 'diferencial')
  const pias = dispositivos.filter((d) => d.clase === 'pia')
  if (diferenciales.length === 0) {
    error(
      'Falta el diferencial: todos los circuitos terminales llevan uno de 30 mA.',
      aea('770.14.2.3'),
    )
  }
  for (const id of diferenciales) {
    if (cabecera && indice(id) < indice(cabecera))
      error(
        'El diferencial quedó antes de la cabecera: va después del interruptor principal.',
        aea('770.16.5.3'),
        id.id,
      )
    if (id.sensibilidad === 300)
      error(
        'Un diferencial de 300 mA no protege a las personas: los circuitos terminales llevan 30 mA. El de 300 mA solo se admite entre tableros.',
        aea('770.14.2.3'),
        id.id,
      )
    if (id.calibre) {
      const siguiente = diferenciales.find((otro) => indice(otro) > indice(id))
      const abajo = pias.filter(
        (p) => indice(p) > indice(id) && (!siguiente || indice(p) < indice(siguiente)),
      )
      const sumaAbajo = abajo.reduce((s, p) => s + (p.calibre ?? 0), 0)
      const cubiertoPorCabecera = cabecera?.calibre !== undefined && id.calibre >= cabecera.calibre
      if (!cubiertoPorCabecera && id.calibre < sumaAbajo)
        error(
          `El diferencial de ${id.calibre} A no está protegido contra sobrecarga: tiene que ser igual o mayor que la cabecera${cabecera?.calibre ? ` (${cabecera.calibre} A)` : ''} o que la suma de los PIA de abajo (${sumaAbajo} A).`,
          aea('770.15.2.2.5'),
          id.id,
        )
    }
  }

  // PIA: uno por circuito, aguas abajo de un diferencial, Ib ≤ In ≤ Iz y tope del tipo
  const primerDiferencial = diferenciales.length ? Math.min(...diferenciales.map(indice)) : -1
  const asignados = new Map<string, number>()
  pias.forEach((p) => {
    const i = indice(p)
    if (cabecera && i < indice(cabecera))
      error(`${nombre(p, i)}: quedó antes de la cabecera.`, aea('770.16.5.3'), p.id)
    else if (primerDiferencial !== -1 && i < primerDiferencial)
      error(
        `${nombre(p, i)}: quedó antes del diferencial, así que su circuito no tiene protección de 30 mA.`,
        aea('770.14.2.3'),
        p.id,
      )
    if (!p.circuito) return
    asignados.set(p.circuito, (asignados.get(p.circuito) ?? 0) + 1)
    const circuito = caso.circuitos.find((c) => c.id === p.circuito)!
    if (p.calibre && p.calibre < circuito.ib)
      error(
        `${nombre(p, i)}: ${p.calibre} A es menor que la corriente del circuito (${formatearA(circuito.ib)}). Tiene que cumplir Ib ≤ In.`,
        aea('770.15.2.1'),
        p.id,
      )
    const maximo = piaMaximo(circuito.seccion, 1, circuito.tipo)
    if (p.calibre && maximo && p.calibre > maximo) {
      const porTipo = CIRCUITOS[circuito.tipo].maxIn < IZ_MONOFASICO[circuito.seccion]
      error(
        porTipo && p.calibre > CIRCUITOS[circuito.tipo].maxIn
          ? `${nombre(p, i)}: un ${circuito.tipo} admite como máximo ${CIRCUITOS[circuito.tipo].maxIn} A.`
          : `${nombre(p, i)}: ${p.calibre} A no protege un cable de ${formatearSeccion(circuito.seccion)} (Iz ${IZ_MONOFASICO[circuito.seccion]} A). El máximo es ${maximo} A.`,
        porTipo ? aea('Tabla 770.6.I') : aea('770.15.2.1'),
        p.id,
      )
    }
    if (p.curva === 'D')
      aviso(
        `${nombre(p, i)}: la curva D es para motores con mucho pico de arranque, no para una vivienda.`,
        undefined,
        p.id,
      )
    else if (circuito.tipo === 'IUG' && p.curva === 'C')
      aviso(
        `${nombre(p, i)}: la carpeta del ERSeP usa curva B para iluminación.`,
        carpetaERSeP(),
        p.id,
      )
  })
  for (const circuito of caso.circuitos) {
    const veces = asignados.get(circuito.id) ?? 0
    if (veces === 0)
      error(`${circuito.nombre} no tiene PIA: cada circuito lleva el suyo.`, aea('770.16.5.3'))
    if (veces > 1) error(`${circuito.nombre} tiene ${veces} PIA: lleva uno solo.`)
  }

  return hallazgos
}

function verificarColores(colores: Colores): Hallazgo[] {
  const hallazgos: Hallazgo[] = []
  const fuente = aea('770.10.3.8.5')
  const { fase, neutro, pe, retorno } = colores
  for (const funcion of Object.keys(NOMBRE_FUNCION) as FuncionCable[]) {
    if (!colores[funcion])
      hallazgos.push({
        nivel: 'error',
        texto: `Falta elegir el color: ${NOMBRE_FUNCION[funcion]}.`,
      })
  }
  if (fase && !COLORES_FASE.includes(fase))
    hallazgos.push({
      nivel: 'error',
      texto: `La fase no puede ser ${COLORES_CABLE[fase].nombre.toLowerCase()}: va marrón, negra o roja.`,
      fuente,
    })
  if (neutro && neutro !== 'celeste')
    hallazgos.push({ nivel: 'error', texto: 'El neutro va siempre celeste.', fuente })
  if (pe && pe !== 'verde-amarillo')
    hallazgos.push({
      nivel: 'error',
      texto: 'El conductor de protección (PE) va siempre verde-amarillo.',
      fuente,
    })
  if (retorno && ['celeste', 'verde-amarillo', 'verde', 'amarillo'].includes(retorno))
    hallazgos.push({
      nivel: 'error',
      texto: `El retorno no puede ser ${COLORES_CABLE[retorno].nombre.toLowerCase()}: esos colores están reservados al neutro y al PE.`,
      fuente,
    })
  else if (retorno && COLORES_FASE.includes(retorno))
    hallazgos.push({
      nivel: 'aviso',
      texto:
        'Un color de fase para el retorno solo se admite identificado con anillos o cinta en los dos extremos. La carpeta del ERSeP usa blanco.',
      fuente,
    })
  return hallazgos
}

export function verificarTablero(
  caso: Caso,
  dispositivos: Dispositivo[],
  colores: Colores,
): Hallazgo[] {
  return [...verificarDispositivos(caso, dispositivos), ...verificarColores(colores)]
}

const formatoA = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 1 })

export function formatearA(corriente: number) {
  return `${formatoA.format(corriente)} A`
}

export function formatearSeccion(seccion: number) {
  return `${formatoA.format(seccion)} mm²`
}
