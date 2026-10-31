import type { ComponentType } from 'react'

import type { TipoEjercicio } from '@/dominio/ejercicios'

export interface Tema {
  id: string
  titulo: string
  descripcion: string
  /** Unidades del programa del curso UTN FRC Cat. III 2025 */
  unidadesUTN: number[]
  /** Ejercicios del modo práctica relacionados con el tema */
  ejercicio?: TipoEjercicio
}

export interface Bloque {
  id: string
  titulo: string
  descripcion: string
  temas: Tema[]
}

export const BLOQUES: Bloque[] = [
  {
    id: 'fundamentos',
    titulo: 'Fundamentos',
    descripcion: 'Lo básico antes de tocar una instalación.',
    temas: [
      {
        id: 'matematica',
        titulo: 'Matemática aplicada',
        descripcion: 'Despejes, porcentajes, potencias, √3 y unidades con prefijos.',
        unidadesUTN: [2, 8],
        ejercicio: 'cuentas',
      },
      {
        id: 'electricidad-basica',
        titulo: 'Tensión, corriente y resistencia',
        descripcion: 'Ley de Ohm, circuitos serie y paralelo, conductores y aislantes.',
        unidadesUTN: [1, 2],
        ejercicio: 'ohm',
      },
      {
        id: 'potencia-energia',
        titulo: 'Potencia y energía',
        descripcion: 'Watt y kWh, efecto Joule y cómo leer la factura de EPEC.',
        unidadesUTN: [4],
        ejercicio: 'energia',
      },
      {
        id: 'corriente-alterna',
        titulo: 'Corriente alterna',
        descripcion: 'Valor eficaz, 50 Hz, monofásica y trifásica, cos φ.',
        unidadesUTN: [5, 9],
      },
      {
        id: 'seguridad',
        titulo: 'Seguridad eléctrica',
        descripcion: 'Efectos en el cuerpo, contacto directo e indirecto, reglas de oro y EPP.',
        unidadesUTN: [3, 6],
      },
      {
        id: 'mediciones',
        titulo: 'Mediciones',
        descripcion: 'Multímetro, pinza amperométrica, megóhmetro y telurímetro.',
        unidadesUTN: [2],
      },
    ],
  },
  {
    id: 'instalacion',
    titulo: 'Instalación domiciliaria',
    descripcion: 'Materiales, circuitos, protecciones y tablero, en el orden de una obra.',
    temas: [
      {
        id: 'conductores-colores',
        titulo: 'Conductores y colores',
        descripcion: 'Tipos de cable IRAM, secciones mínimas y código de colores.',
        unidadesUTN: [1],
      },
      {
        id: 'canalizaciones',
        titulo: 'Canalizaciones y cajas',
        descripcion: 'Caños, ocupación, curvas, cajas de paso y uniones.',
        unidadesUTN: [1],
      },
      {
        id: 'circuitos',
        titulo: 'Tipos de circuito y grado de electrificación',
        descripcion: 'IUG, TUG, TUE y específicos; grados y puntos mínimos por ambiente.',
        unidadesUTN: [5, 11],
        ejercicio: 'division',
      },
      {
        id: 'conexionado',
        titulo: 'Conexionado',
        descripcion: 'Llave de un punto, combinación, tomas, PE en las bocas y uniones.',
        unidadesUTN: [3, 5, 6, 7],
      },
      {
        id: 'protecciones',
        titulo: 'Protecciones',
        descripcion: 'Termomagnético (PIA), diferencial, DPS y fusibles.',
        unidadesUTN: [11],
      },
      {
        id: 'tablero',
        titulo: 'Tableros',
        descripcion: 'Tablero principal y seccional, orden de los dispositivos, barras.',
        unidadesUTN: [11],
      },
      {
        id: 'puesta-tierra',
        titulo: 'Puesta a tierra',
        descripcion: 'Jabalina, conductor PE, esquema TT y medición.',
        unidadesUTN: [6, 11],
      },
      {
        id: 'locales-especiales',
        titulo: 'Locales especiales',
        descripcion: 'Zonas del baño, locales húmedos y mojados, exteriores.',
        unidadesUTN: [11],
      },
    ],
  },
  {
    id: 'calculos',
    titulo: 'Cálculos',
    descripcion: 'Las cuentas que hay que hacer rápido y bien.',
    temas: [
      {
        id: 'calculo-corriente',
        titulo: 'Corriente desde la potencia',
        descripcion: 'Monofásica y trifásica, con cos φ y atajos de cálculo mental.',
        unidadesUTN: [4, 9],
        ejercicio: 'corriente',
      },
      {
        id: 'calculo-seccion-proteccion',
        titulo: 'Sección del cable y protección',
        descripcion: 'Corriente admisible, agrupamiento y la regla Ib ≤ In ≤ Iz.',
        unidadesUTN: [5, 6, 11],
        ejercicio: 'seccion',
      },
      {
        id: 'calculo-caida-tension',
        titulo: 'Caída de tensión',
        descripcion: 'Fórmula, método por tabla y el límite del 3 %.',
        unidadesUTN: [6],
        ejercicio: 'caida',
      },
      {
        id: 'calculo-grado-dpms',
        titulo: 'Grado de electrificación y DPMS',
        descripcion: 'Superficie límite, circuitos mínimos y demanda simultánea.',
        unidadesUTN: [11],
        ejercicio: 'grado',
      },
    ],
  },
  {
    id: 'planos',
    titulo: 'Planos y documentación',
    descripcion: 'Leer y dibujar lo que se instala.',
    temas: [
      {
        id: 'simbologia',
        titulo: 'Simbología',
        descripcion: 'Bocas, tomas, llaves, tableros y cañerías en planta.',
        unidadesUTN: [7],
      },
      {
        id: 'unifilar',
        titulo: 'Esquema unifilar',
        descripcion: 'Cómo se representa el tablero y sus circuitos.',
        unidadesUTN: [11],
      },
      {
        id: 'croquis',
        titulo: 'Croquis y escalas',
        descripcion: 'Formatos A3 y A4, escalas y rótulo.',
        unidadesUTN: [8],
      },
    ],
  },
  {
    id: 'profesional',
    titulo: 'Profesional (ERSeP)',
    descripcion: 'Lo que pide la ley para trabajar habilitado.',
    temas: [
      {
        id: 'ley-10281',
        titulo: 'Ley 10281 y categorías',
        descripcion: 'Qué puede certificar un Cat. III, ERSeP y habilitación.',
        unidadesUTN: [11],
      },
      {
        id: 'certificado',
        titulo: 'Certificado de instalación apta',
        descripcion: 'Memoria, unifilar, planta, materiales, fotos y ensayos.',
        unidadesUTN: [11],
      },
      {
        id: 'presupuesto',
        titulo: 'Presupuesto y materiales',
        descripcion: 'Lista de materiales, tiempos de obra y facturación.',
        unidadesUTN: [11],
      },
    ],
  },
  {
    id: 'complementarios',
    titulo: 'Complementarios',
    descripcion: 'Temas del programa que van más allá de la vivienda básica.',
    temas: [
      {
        id: 'motores-contactores',
        titulo: 'Motores y contactores',
        descripcion:
          'Contactor, enclavamiento, motores monofásicos y trifásicos, estrella-triángulo.',
        unidadesUTN: [10, 14],
      },
      {
        id: 'generacion-distribuida',
        titulo: 'Generación distribuida',
        descripcion: 'Paneles fotovoltaicos, inversores, on grid y off grid.',
        unidadesUTN: [12],
      },
      {
        id: 'vehiculo-electrico',
        titulo: 'Carga de vehículos eléctricos',
        descripcion: 'Modos de carga, conectores y la instalación del tomacorriente.',
        unidadesUTN: [13],
      },
    ],
  },
]

const CONTENIDOS = import.meta.glob<{ default: ComponentType }>('./contenido/*.mdx')

export function cargarContenido(id: string) {
  return CONTENIDOS[`./contenido/${id}.mdx`]
}

export function temaDisponible(id: string) {
  return cargarContenido(id) !== undefined
}

export const TEMAS = BLOQUES.flatMap((b) => b.temas.map((t) => ({ ...t, bloque: b })))

export function buscarTema(id: string) {
  return TEMAS.find((t) => t.id === id)
}

export function temaDeEjercicio(tipo: TipoEjercicio) {
  return TEMAS.find((t) => t.ejercicio === tipo)
}
