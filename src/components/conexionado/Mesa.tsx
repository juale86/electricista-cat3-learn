// Mesa de conexionado con React Flow: cada pieza es un nodo con sus bornes (handles) y cada cable
// es una arista de su color. Se conecta arrastrando de un borne a otro, o tocando uno y después
// el otro. La simulación corre en vivo: las llaves se accionan tocándolas.

import {
  BaseEdge,
  ConnectionMode,
  Controls,
  getBezierPath,
  Handle,
  Position,
  ReactFlow,
  ReactFlowProvider,
  useNodesState,
  type Connection,
  type Edge,
  type EdgeProps,
  type Node,
  type NodeProps,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { Lightbulb, LightbulbOff, Plug, Zap } from 'lucide-react'
import { useEffect, useMemo } from 'react'

import {
  BORNES,
  extremo,
  simular,
  type Cable,
  type ClasePieza,
  type Extremo,
  type Pieza,
  type Resultado,
} from '@/dominio/conexionado'
import { COLORES_CABLE } from '@/dominio/tablero'
import { cn } from '@/lib/utils'
import { escenarioActual, useConexionado } from '@/store/conexionado'
import { temaEfectivo, useTema } from '@/store/tema'

type NodoPieza = Node<
  { pieza: Pieza; resultado: Resultado; cerrada: boolean; onAccionar: () => void },
  'pieza'
>
type AristaCable = Edge<{ color: Cable['color'] }, 'cable'>

/** Lado de la pieza donde están sus bornes */
const LADO: Record<ClasePieza, Position> = {
  tablero: Position.Right,
  lampara: Position.Bottom,
  llave: Position.Top,
  combinacion: Position.Top,
  toma: Position.Left,
}

function Bornes({ pieza }: { pieza: Pieza }) {
  const lado = LADO[pieza.clase]
  const bornes = BORNES[pieza.clase]
  const vertical = lado === Position.Left || lado === Position.Right
  return bornes.map((borne, i) => {
    const pos = `${((i + 1) * 100) / (bornes.length + 1)}%`
    return (
      <Handle
        key={borne}
        id={borne}
        type="source"
        position={lado}
        style={vertical ? { top: pos } : { left: pos }}
        className="!bg-background !border-foreground flex !size-5 items-center justify-center !border-2"
      >
        <span
          className={cn(
            'pointer-events-none absolute text-[11px] font-bold whitespace-nowrap',
            lado === Position.Top && 'bottom-5',
            lado === Position.Bottom && 'top-5',
            lado === Position.Left && 'right-5',
            lado === Position.Right && 'left-5',
          )}
        >
          {borne}
        </span>
      </Handle>
    )
  })
}

function Contenido({ data }: { data: NodoPieza['data'] }) {
  const { pieza, resultado, cerrada, onAccionar } = data
  switch (pieza.clase) {
    case 'tablero':
      return (
        <p
          className={cn(
            'text-xs font-medium',
            resultado.falla ? 'text-destructive' : 'text-emerald-700 dark:text-emerald-400',
          )}
        >
          {resultado.falla === 'cortocircuito'
            ? '¡Saltó el PIA! (cortocircuito)'
            : resultado.falla === 'fuga'
              ? '¡Saltó el diferencial! (fuga a tierra)'
              : 'PIA y diferencial cerrados'}
        </p>
      )
    case 'lampara': {
      const prendida = resultado.lamparas.get(pieza.id)
      const Icono = prendida ? Lightbulb : LightbulbOff
      return (
        <Icono
          className={cn(
            'mx-auto size-10',
            prendida
              ? 'fill-yellow-300 text-yellow-600 drop-shadow-[0_0_12px_rgb(250_204_21)]'
              : 'text-muted-foreground',
          )}
          aria-label={prendida ? 'Prendida' : 'Apagada'}
        />
      )
    }
    case 'toma': {
      const conTension = resultado.tomas.get(pieza.id)
      return (
        <p className="flex items-center justify-center gap-1 text-xs">
          <Plug className="size-5" />
          {conTension ? (
            <span className="flex items-center text-amber-600 dark:text-amber-400">
              <Zap className="size-4" /> 220 V
            </span>
          ) : (
            <span className="text-muted-foreground">sin tensión</span>
          )}
        </p>
      )
    }
    case 'llave':
    case 'combinacion':
      return (
        <button
          onClick={onAccionar}
          role="switch"
          aria-checked={cerrada}
          aria-label={`Accionar ${pieza.nombre}`}
          className="nodrag hover:bg-muted mx-auto flex flex-col items-center rounded-md border px-3 py-1 text-xs"
        >
          <span
            className={cn(
              'my-0.5 h-5 w-9 rounded-sm border-2 transition-transform',
              cerrada ? 'bg-primary border-primary' : 'bg-background border-muted-foreground',
            )}
          />
          {pieza.clase === 'llave'
            ? cerrada
              ? 'Cerrada'
              : 'Abierta'
            : `C con ${cerrada ? '2' : '1'}`}
        </button>
      )
  }
}

function NodoDePieza({ data }: NodeProps<NodoPieza>) {
  return (
    <div className="bg-card w-36 rounded-xl border-2 px-3 py-2.5 text-center shadow-sm">
      {/* Los bornes quedan fuera del space-y: si no, sus márgenes los corren de lugar */}
      <div className="space-y-1.5">
        <p className="text-xs font-semibold">{data.pieza.nombre}</p>
        <Contenido data={data} />
      </div>
      <Bornes pieza={data.pieza} />
    </div>
  )
}

function CableDeColor({ id, data, style, ...props }: EdgeProps<AristaCable>) {
  const [ruta] = getBezierPath(props)
  const color = data?.color ?? 'negro'
  const { muestra } = COLORES_CABLE[color]
  if (muestra === 'verde-amarillo')
    return (
      <>
        <BaseEdge id={id} path={ruta} style={{ ...style, stroke: '#2e9e44', strokeWidth: 6 }} />
        <path
          d={ruta}
          fill="none"
          stroke="#f2d22e"
          strokeWidth={6}
          strokeDasharray="10 10"
          pointerEvents="none"
        />
      </>
    )
  return (
    <BaseEdge
      id={id}
      path={ruta}
      style={{
        ...style,
        stroke: muestra,
        strokeWidth: 6,
        // El blanco no se vería sobre el fondo claro
        filter: color === 'blanco' ? 'drop-shadow(0 0 1px rgb(0 0 0 / 0.8))' : undefined,
      }}
    />
  )
}

const TIPOS_NODO = { pieza: NodoDePieza }
const TIPOS_ARISTA = { cable: CableDeColor }

const separar = (e: Extremo) => e.split('.') as [string, string]

function Mesa() {
  const escenarioId = useConexionado((s) => s.escenarioId)
  const cables = useConexionado((s) => s.cables[s.escenarioId])
  const llaves = useConexionado((s) => s.llaves)
  const borrando = useConexionado((s) => s.borrando)
  const { conectar, quitar, accionar } = useConexionado.getState()
  const tema = useTema((s) => s.tema)

  const escenario = escenarioActual(escenarioId)
  const resultado = useMemo(
    () => simular(escenario, cables ?? [], llaves),
    [escenario, cables, llaves],
  )

  // Las piezas se pueden acomodar a mano; al cambiar de escenario vuelven a su lugar
  const [nodos, setNodos, alCambiarNodos] = useNodesState<NodoPieza>([])
  useEffect(() => {
    setNodos((previos) =>
      escenario.piezas.map((pieza) => {
        const previo = previos.find((n) => n.id === pieza.id && n.data.pieza === pieza)
        return {
          id: pieza.id,
          type: 'pieza',
          position: previo?.position ?? { x: pieza.x, y: pieza.y },
          data: {
            pieza,
            resultado,
            cerrada: Boolean(llaves[pieza.id]),
            onAccionar: () => accionar(pieza.id),
          },
        }
      }),
    )
  }, [escenario, resultado, llaves, setNodos, accionar])

  const aristas = useMemo<AristaCable[]>(
    () =>
      (cables ?? []).map((c) => {
        const [source, sourceHandle] = separar(c.desde)
        const [target, targetHandle] = separar(c.hasta)
        return {
          id: c.id,
          type: 'cable',
          source,
          sourceHandle,
          target,
          targetHandle,
          data: { color: c.color },
          className: cn(
            (resultado.conFase(c.desde) || resultado.conCorrienteDeNeutro(c.desde)) &&
              'con-tension sin-brillo',
            borrando && 'cursor-pointer',
          ),
        }
      }),
    [cables, resultado, borrando],
  )

  const alConectar = ({ source, sourceHandle, target, targetHandle }: Connection) => {
    if (sourceHandle && targetHandle)
      conectar(extremo(source, sourceHandle), extremo(target, targetHandle))
  }

  return (
    <ReactFlow
      nodes={nodos}
      edges={aristas}
      nodeTypes={TIPOS_NODO}
      edgeTypes={TIPOS_ARISTA}
      onNodesChange={alCambiarNodos}
      onConnect={alConectar}
      onEdgeClick={(_, arista) => borrando && quitar(arista.id)}
      connectionMode={ConnectionMode.Loose}
      connectionRadius={30}
      elementsSelectable={false}
      fitView
      fitViewOptions={{ padding: 0.15 }}
      minZoom={0.3}
      maxZoom={3}
      colorMode={temaEfectivo(tema) === 'oscuro' ? 'dark' : 'light'}
      className="bg-muted/40"
    >
      <Controls showInteractive={false} position="top-right" />
    </ReactFlow>
  )
}

export function MesaConexionado({ className }: { className?: string }) {
  const escenarioId = useConexionado((s) => s.escenarioId)
  return (
    <div className={cn('overflow-hidden rounded-xl border', className)}>
      {/* Otra instancia por escenario, para que el encuadre inicial se recalcule */}
      <ReactFlowProvider key={escenarioId}>
        <Mesa />
      </ReactFlowProvider>
    </div>
  )
}
