import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CALIBRES, NOMBRE_DISPOSITIVO, type Dispositivo } from '@/dominio/tablero'
import { cn } from '@/lib/utils'
import { useTablero } from '@/store/tablero'

interface PropsCampo {
  etiqueta: string
  valor: string | undefined
  opciones: { valor: string; texto: string }[]
  onCambio: (valor: string) => void
}

function Campo({ etiqueta, valor, opciones, onCambio }: PropsCampo) {
  return (
    <label className="flex flex-col gap-1 text-xs">
      <span className="text-muted-foreground">{etiqueta}</span>
      <Select value={valor ?? ''} onValueChange={onCambio}>
        <SelectTrigger size="sm" className="w-full min-w-20">
          <SelectValue placeholder="Elegí" />
        </SelectTrigger>
        <SelectContent>
          {opciones.map((o) => (
            <SelectItem key={o.valor} value={o.valor}>
              {o.texto}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </label>
  )
}

const POLOS = [
  { valor: '1', texto: 'Unipolar' },
  { valor: '2', texto: 'Bipolar' },
]

function Tarjeta({ dispositivo, posicion }: { dispositivo: Dispositivo; posicion: number }) {
  const caso = useTablero((s) => s.caso)
  const hallazgos = useTablero((s) => s.hallazgos)
  const actualizar = useTablero((s) => s.actualizar)
  const quitar = useTablero((s) => s.quitar)
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: dispositivo.id })

  const conError = hallazgos?.some((h) => h.dispositivo === dispositivo.id && h.nivel === 'error')
  const d = dispositivo
  const cambiar = (cambios: Parameters<typeof actualizar>[1]) => actualizar(d.id, cambios)

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        'bg-card rounded-xl border p-3',
        isDragging && 'relative z-10 shadow-lg',
        conError && 'border-destructive ring-destructive/30 ring-2',
      )}
    >
      <div className="mb-2 flex items-center gap-2">
        <button
          ref={setActivatorNodeRef}
          {...attributes}
          {...listeners}
          className="text-muted-foreground hover:text-foreground -m-1 cursor-grab touch-none p-1 active:cursor-grabbing"
          aria-label={`Mover ${NOMBRE_DISPOSITIVO[d.clase]}`}
        >
          <GripVertical className="size-5" />
        </button>
        <span className="text-muted-foreground text-xs tabular-nums">{posicion}.</span>
        <span className="flex-1 text-sm font-medium">{NOMBRE_DISPOSITIVO[d.clase]}</span>
        <Button
          variant="ghost"
          size="icon"
          className="size-7"
          onClick={() => quitar(d.id)}
          aria-label={`Quitar ${NOMBRE_DISPOSITIVO[d.clase]}`}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Campo
          etiqueta="Polos"
          valor={d.polos?.toString()}
          opciones={POLOS}
          onCambio={(v) => cambiar({ polos: Number(v) as 1 | 2 })}
        />
        <Campo
          etiqueta="Calibre"
          valor={d.calibre?.toString()}
          opciones={CALIBRES[d.clase].map((c) => ({ valor: String(c), texto: `${c} A` }))}
          onCambio={(v) => cambiar({ calibre: Number(v) })}
        />
        {d.clase === 'diferencial' && (
          <Campo
            etiqueta="Sensibilidad"
            valor={d.sensibilidad?.toString()}
            opciones={[
              { valor: '30', texto: '30 mA' },
              { valor: '300', texto: '300 mA' },
            ]}
            onCambio={(v) => cambiar({ sensibilidad: Number(v) as 30 | 300 })}
          />
        )}
        {d.clase === 'pia' && (
          <>
            <Campo
              etiqueta="Curva"
              valor={d.curva}
              opciones={['B', 'C', 'D'].map((c) => ({ valor: c, texto: `Curva ${c}` }))}
              onCambio={(v) => cambiar({ curva: v as 'B' | 'C' | 'D' })}
            />
            <Campo
              etiqueta="Circuito"
              valor={d.circuito}
              opciones={caso.circuitos.map((c) => ({ valor: c.id, texto: c.nombre }))}
              onCambio={(v) => cambiar({ circuito: v })}
            />
          </>
        )}
      </div>
    </li>
  )
}

/** Dispositivos del tablero en orden, de arriba (alimentación) hacia abajo (circuitos). */
export function Riel() {
  const dispositivos = useTablero((s) => s.dispositivos)
  const mover = useTablero((s) => s.mover)
  const sensores = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const alSoltar = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return
    const desde = dispositivos.findIndex((d) => d.id === active.id)
    const hasta = dispositivos.findIndex((d) => d.id === over.id)
    mover(desde, hasta)
  }

  if (dispositivos.length === 0) {
    return (
      <p className="text-muted-foreground rounded-xl border border-dashed p-6 text-center text-sm">
        El riel está vacío. Agregá dispositivos con los botones de arriba.
      </p>
    )
  }

  return (
    <DndContext sensors={sensores} collisionDetection={closestCenter} onDragEnd={alSoltar}>
      <SortableContext items={dispositivos} strategy={verticalListSortingStrategy}>
        <ol className="space-y-2">
          {dispositivos.map((d, i) => (
            <Tarjeta key={d.id} dispositivo={d} posicion={i + 1} />
          ))}
        </ol>
      </SortableContext>
    </DndContext>
  )
}
