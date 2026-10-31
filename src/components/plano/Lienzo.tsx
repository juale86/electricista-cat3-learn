// Plano interactivo con React Flow: la planta va de fondo como un nodo fijo y cada elemento
// ubicado es un nodo. En la etapa de circuitos, los bornes de cada símbolo serán sus handles.

import {
  Controls,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type Node,
  type NodeChange,
  type NodeProps,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useMemo, type MouseEvent } from 'react'

import type { Elemento, Plano } from '@/dominio/plano'
import { cn } from '@/lib/utils'
import { planoActual, usePlano } from '@/store/plano'
import { temaEfectivo, useTema } from '@/store/tema'

import { MARGEN_PLANTA, Planta } from './Planta'
import { IconoSimbolo } from './Simbolos'
import { TAMANO_SIMBOLO, type ClaseSimbolo } from './tamanos'

type NodoPlanta = Node<{ plano: Plano; marcados: Set<string> }, 'planta'>
type NodoSimbolo = Node<{ clase: ClaseSimbolo; angulo: number; borrando: boolean }, 'simbolo'>

function NodoDePlanta({ data }: NodeProps<NodoPlanta>) {
  return <Planta plano={data.plano} marcados={data.marcados} />
}

function NodoDeSimbolo({ data }: NodeProps<NodoSimbolo>) {
  return (
    <IconoSimbolo
      clase={data.clase}
      angulo={data.angulo}
      className={cn(
        'size-full',
        data.clase === 'tablero' ? 'text-foreground' : 'text-primary',
        data.borrando && 'hover:text-destructive cursor-pointer',
      )}
    />
  )
}

const TIPOS_NODO = { planta: NodoDePlanta, simbolo: NodoDeSimbolo }

/** Separación del centro del tablero a la pared: queda medio embutido. */
const SEPARACION_TABLERO = 10

function nodoTablero(plano: Plano): NodoSimbolo {
  const t = TAMANO_SIMBOLO.tablero
  return {
    id: 'tablero',
    type: 'simbolo',
    position: { x: plano.tablero.x, y: plano.tablero.y - SEPARACION_TABLERO },
    data: { clase: 'tablero', angulo: 270, borrando: false },
    width: t,
    height: t,
    draggable: false,
  }
}

function nodoElemento(e: Elemento, borrando: boolean): NodoSimbolo {
  const t = TAMANO_SIMBOLO[e.clase]
  return {
    id: e.id,
    type: 'simbolo',
    position: { x: e.x, y: e.y },
    data: { clase: e.clase, angulo: e.angulo, borrando },
    width: t,
    height: t,
    draggable: !borrando,
  }
}

function Lienzo() {
  const planoId = usePlano((s) => s.planoId)
  const elementos = usePlano((s) => s.elementos[s.planoId])
  const herramienta = usePlano((s) => s.herramienta)
  const hallazgos = usePlano((s) => s.hallazgos)
  const { poner, arrastrar, soltar, quitar } = usePlano.getState()
  const tema = useTema((s) => s.tema)
  const { screenToFlowPosition } = useReactFlow()

  const plano = planoActual(planoId)
  const marcados = useMemo(
    () =>
      new Set(
        (hallazgos ?? []).filter((h) => h.nivel === 'error' && h.ambiente).map((h) => h.ambiente!),
      ),
    [hallazgos],
  )

  const nodos = useMemo<Node[]>(() => {
    const borrando = herramienta === 'borrar'
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
    return [planta, nodoTablero(plano), ...(elementos ?? []).map((e) => nodoElemento(e, borrando))]
  }, [plano, marcados, elementos, herramienta])

  const alTocar = (evento: MouseEvent) => {
    if (herramienta === null || herramienta === 'borrar') return
    poner(herramienta, screenToFlowPosition({ x: evento.clientX, y: evento.clientY }))
  }

  const alCambiar = (cambios: NodeChange[]) => {
    for (const c of cambios) {
      if (c.type !== 'position' || c.id === 'planta' || c.id === 'tablero') continue
      if (c.position) arrastrar(c.id, c.position)
      if (c.dragging === false) soltar(c.id)
    }
  }

  return (
    <ReactFlow
      nodes={nodos}
      nodeTypes={TIPOS_NODO}
      nodeOrigin={[0.5, 0.5]}
      onNodesChange={alCambiar}
      onPaneClick={alTocar}
      onNodeClick={(evento, nodo) => {
        if (nodo.id === 'planta') alTocar(evento)
        else if (herramienta === 'borrar' && nodo.id !== 'tablero') quitar(nodo.id)
      }}
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
