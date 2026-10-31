// Plano interactivo con React Flow: la planta va de fondo como un nodo fijo, cada elemento
// ubicado es un nodo y cada tramo de un circuito es una arista entre los centros de dos símbolos.

import {
  Controls,
  Handle,
  Position,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type Edge,
  type Node,
  type NodeChange,
  type NodeProps,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useMemo, type MouseEvent } from 'react'

import { TABLERO, type CircuitoPlano, type Tramo } from '@/dominio/circuitosPlano'
import { esLlave, type Elemento, type Plano } from '@/dominio/plano'
import { simularPlano } from '@/dominio/simulacionPlano'
import { cn } from '@/lib/utils'
import { usePlanoActual, usePlano } from '@/store/plano'
import { temaEfectivo, useTema } from '@/store/tema'

import { MARGEN_PLANTA, Planta } from './Planta'
import { IconoSimbolo } from './Simbolos'
import { ESTILO_CIRCUITO, TAMANO_SIMBOLO, type ClaseSimbolo } from './tamanos'

type NodoPlanta = Node<{ plano: Plano; marcados: Set<string> }, 'planta'>
type NodoSimbolo = Node<
  {
    clase: ClaseSimbolo
    angulo: number
    borrando: boolean
    inicio: boolean
    /** Al probar: luz prendida o llave cerrada */
    encendido?: boolean
    tocable?: boolean
  },
  'simbolo'
>

function NodoDePlanta({ data }: NodeProps<NodoPlanta>) {
  return <Planta plano={data.plano} marcados={data.marcados} />
}

/** Los tramos van de centro a centro: un borne invisible en el medio del símbolo. */
const BORNE =
  'pointer-events-none !top-1/2 !left-1/2 !min-h-0 !min-w-0 !size-px !border-0 !opacity-0'

function NodoDeSimbolo({ data }: NodeProps<NodoSimbolo>) {
  return (
    <div
      className={cn(
        'size-full rounded-full',
        data.inicio && 'bg-amber-400/25 ring-4 ring-amber-500',
        data.encendido && 'bg-yellow-300/70 shadow-[0_0_24px_8px] shadow-yellow-300/80',
        data.tocable && 'cursor-pointer',
      )}
    >
      <IconoSimbolo
        clase={data.clase}
        angulo={data.angulo}
        className={cn(
          'size-full',
          data.clase === 'tablero' ? 'text-foreground' : 'text-primary',
          data.borrando && 'hover:text-destructive cursor-pointer',
        )}
      />
      <Handle type="source" position={Position.Top} isConnectable={false} className={BORNE} />
      <Handle type="target" position={Position.Top} isConnectable={false} className={BORNE} />
    </div>
  )
}

const TIPOS_NODO = { planta: NodoDePlanta, simbolo: NodoDeSimbolo }

/** Separación del centro del tablero a la pared: queda medio embutido. */
const SEPARACION_TABLERO = 10

function nodoTablero(plano: Plano, inicio: boolean): NodoSimbolo {
  const t = TAMANO_SIMBOLO.tablero
  return {
    id: TABLERO,
    type: 'simbolo',
    position: { x: plano.tablero.x, y: plano.tablero.y - SEPARACION_TABLERO },
    data: { clase: 'tablero', angulo: 270, borrando: false, inicio },
    width: t,
    height: t,
    draggable: false,
  }
}

function nodoElemento(
  e: Elemento,
  moviendo: boolean,
  borrando: boolean,
  inicio: boolean,
  encendido?: boolean,
): NodoSimbolo {
  const t = TAMANO_SIMBOLO[e.clase]
  return {
    id: e.id,
    type: 'simbolo',
    position: { x: e.x, y: e.y },
    data: {
      clase: e.clase,
      angulo: e.angulo,
      borrando,
      inicio,
      encendido,
      tocable: encendido !== undefined && esLlave(e),
    },
    width: t,
    height: t,
    draggable: moviendo,
  }
}

function aristaTramo(
  t: Tramo,
  circuito: CircuitoPlano | undefined,
  activo: boolean,
  borrando: boolean,
  conTension: boolean,
): Edge {
  const desdeTablero = t.desde === TABLERO || t.hasta === TABLERO
  return {
    id: t.id,
    source: t.desde,
    target: t.hasta,
    type: 'straight',
    className: conTension ? 'con-tension' : undefined,
    label: desdeTablero ? circuito?.nombre : undefined,
    labelStyle: { fontSize: 20, fontWeight: 700 },
    labelBgPadding: [6, 3],
    style: {
      ...(circuito ? ESTILO_CIRCUITO[circuito.tipo] : {}),
      strokeWidth: activo ? 6 : 4,
      opacity: activo ? 1 : 0.7,
      cursor: borrando ? 'pointer' : undefined,
    },
  }
}

function Lienzo() {
  const elementos = usePlano((s) => s.elementos[s.planoId])
  const circuitos = usePlano((s) => s.circuitos[s.planoId])
  const tramos = usePlano((s) => s.tramos[s.planoId])
  const herramienta = usePlano((s) => s.herramienta)
  const circuitoActivo = usePlano((s) => s.circuitoActivo)
  const inicioTramo = usePlano((s) => s.inicioTramo)
  const hallazgos = usePlano((s) => s.hallazgos)
  const prueba = usePlano((s) => s.prueba)
  const { poner, arrastrar, soltar, quitar, tocarNodo, cortarTrazo, quitarTramo, alternarLlave } =
    usePlano.getState()
  const tema = useTema((s) => s.tema)
  const { screenToFlowPosition } = useReactFlow()

  const plano = usePlanoActual()
  const marcados = useMemo(
    () =>
      new Set(
        (hallazgos ?? []).filter((h) => h.nivel === 'error' && h.ambiente).map((h) => h.ambiente!),
      ),
    [hallazgos],
  )

  const probando = herramienta === 'probar'
  const simulacion = useMemo(
    () =>
      probando
        ? simularPlano(elementos ?? [], circuitos ?? [], tramos ?? [], {
            diferencial: prueba.diferencial,
            apagados: new Set(prueba.apagados),
            llaves: new Set(prueba.llaves),
          })
        : null,
    [probando, elementos, circuitos, tramos, prueba],
  )

  const nodos = useMemo<Node[]>(() => {
    const borrando = herramienta === 'borrar'
    const moviendo = herramienta === null
    const planta: NodoPlanta = {
      id: 'planta',
      type: 'planta',
      position: { x: -MARGEN_PLANTA, y: -MARGEN_PLANTA },
      origin: [0, 0],
      data: { plano, marcados },
      draggable: false,
      selectable: false,
      zIndex: -1,
    }
    return [
      planta,
      nodoTablero(plano, inicioTramo === TABLERO),
      ...(elementos ?? []).map((e) =>
        nodoElemento(
          e,
          moviendo,
          borrando,
          inicioTramo === e.id,
          simulacion === null || e.clase === 'toma'
            ? undefined
            : e.clase === 'boca'
              ? simulacion.bocasPrendidas.has(e.id)
              : prueba.llaves.includes(e.id),
        ),
      ),
    ]
  }, [plano, marcados, elementos, herramienta, inicioTramo, simulacion, prueba])

  const aristas = useMemo<Edge[]>(() => {
    const porId = new Map((circuitos ?? []).map((c) => [c.id, c]))
    const trazando = herramienta === 'trazar'
    return (tramos ?? []).map((t) =>
      aristaTramo(
        t,
        porId.get(t.circuito),
        !trazando || t.circuito === circuitoActivo,
        herramienta === 'borrar',
        simulacion?.tramosConTension.has(t.id) ?? false,
      ),
    )
  }, [circuitos, tramos, herramienta, circuitoActivo, simulacion])

  const alTocar = (evento: MouseEvent) => {
    if (herramienta === 'trazar') return cortarTrazo()
    if (herramienta === null || herramienta === 'borrar' || probando) return
    poner(herramienta, screenToFlowPosition({ x: evento.clientX, y: evento.clientY }))
  }

  const alCambiar = (cambios: NodeChange[]) => {
    for (const c of cambios) {
      if (c.type !== 'position' || c.id === 'planta' || c.id === TABLERO) continue
      if (c.position) arrastrar(c.id, c.position)
      if (c.dragging === false) soltar(c.id)
    }
  }

  return (
    <ReactFlow
      nodes={nodos}
      edges={aristas}
      nodeTypes={TIPOS_NODO}
      nodeOrigin={[0.5, 0.5]}
      onNodesChange={alCambiar}
      onPaneClick={alTocar}
      onNodeClick={(evento, nodo) => {
        if (nodo.id === 'planta') alTocar(evento)
        else if (herramienta === 'trazar') tocarNodo(nodo.id)
        else if (probando && esLlave(elementos?.find((e) => e.id === nodo.id)))
          alternarLlave(nodo.id)
        else if (herramienta === 'borrar' && nodo.id !== TABLERO) quitar(nodo.id)
      }}
      onEdgeClick={(_, arista) => herramienta === 'borrar' && quitarTramo(arista.id)}
      elementsSelectable={false}
      nodesConnectable={false}
      fitView
      fitViewOptions={{ padding: 0.04 }}
      minZoom={0.2}
      maxZoom={4}
      colorMode={temaEfectivo(tema) === 'oscuro' ? 'dark' : 'light'}
      className="bg-muted/40"
    >
      <Controls showInteractive={false} position="top-right" />
    </ReactFlow>
  )
}

export function LienzoPlano({ className }: { className?: string }) {
  return (
    <div className={cn('overflow-hidden rounded-xl border', className)}>
      <ReactFlowProvider>
        <Lienzo />
      </ReactFlowProvider>
    </div>
  )
}
