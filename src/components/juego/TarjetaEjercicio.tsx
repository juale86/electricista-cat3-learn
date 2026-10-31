import { Calculator } from 'lucide-react'
import { useState } from 'react'

import { Calculadora } from '@/components/juego/Calculadora'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  NOMBRE_TIPO,
  usaOpciones,
  type Ejercicio,
  type FormatoRespuesta,
} from '@/dominio/ejercicios'
import { cn } from '@/lib/utils'

interface Props {
  ejercicio: Ejercicio
  formato: FormatoRespuesta
  bloqueado: boolean
  /** Enfocar el campo de respuesta al aparecer (no conviene dentro de la guía) */
  enfocar?: boolean
  onResponder: (entrada: string) => void
}

export function TarjetaEjercicio({
  ejercicio,
  formato,
  bloqueado,
  enfocar = true,
  onResponder,
}: Props) {
  const [entrada, setEntrada] = useState('')
  const [verCalculadora, setVerCalculadora] = useState(formato === 'calculadora')
  const conOpciones = usaOpciones(ejercicio, formato)
  const unidad = ejercicio.respuesta.clase === 'numero' ? ejercicio.respuesta.unidad : ''

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Badge variant="secondary">{NOMBRE_TIPO[ejercicio.tipo]}</Badge>
        <h2 className="text-lg leading-snug font-semibold">{ejercicio.enunciado}</h2>
      </div>

      {ejercicio.datos.length > 0 && (
        <dl className="divide-y rounded-lg border text-sm">
          {ejercicio.datos.map((dato) => (
            <div key={dato.etiqueta} className="flex justify-between gap-4 px-3 py-2">
              <dt className="text-muted-foreground">{dato.etiqueta}</dt>
              <dd className="text-right font-medium">{dato.valor}</dd>
            </div>
          ))}
        </dl>
      )}

      {conOpciones ? (
        <div
          className={cn(
            'grid gap-2',
            ejercicio.opciones.some((o) => o.length > 18) ? 'grid-cols-1' : 'grid-cols-2',
          )}
        >
          {ejercicio.opciones.map((opcion) => (
            <Button
              key={opcion}
              variant="outline"
              className="h-auto min-h-12 py-2 text-base whitespace-normal"
              disabled={bloqueado}
              onClick={() => onResponder(opcion)}
            >
              {opcion}
            </Button>
          ))}
        </div>
      ) : (
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault()
            if (entrada.trim()) onResponder(entrada)
          }}
        >
          <div className="flex items-center gap-2">
            <Input
              autoFocus={enfocar}
              inputMode="decimal"
              autoComplete="off"
              placeholder="Tu respuesta"
              className="h-12 text-lg"
              value={entrada}
              disabled={bloqueado}
              onChange={(e) => setEntrada(e.target.value)}
            />
            <span className="text-muted-foreground min-w-12">{unidad}</span>
          </div>
          <div className="flex gap-2">
            {formato === 'calculadora' && (
              <Button
                type="button"
                variant="outline"
                size="icon-lg"
                aria-label={verCalculadora ? 'Ocultar calculadora' : 'Mostrar calculadora'}
                onClick={() => setVerCalculadora((v) => !v)}
              >
                <Calculator />
              </Button>
            )}
            <Button type="submit" className="h-9 flex-1" disabled={bloqueado || !entrada.trim()}>
              Responder
            </Button>
          </div>
          {formato === 'calculadora' && verCalculadora && !bloqueado && (
            <Calculadora onUsar={setEntrada} />
          )}
        </form>
      )}
    </div>
  )
}
