import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { formatear } from '@/dominio/ejercicios'
import { evaluar } from '@/lib/evaluar'

const TECLAS = [
  '7',
  '8',
  '9',
  '÷',
  '4',
  '5',
  '6',
  '×',
  '1',
  '2',
  '3',
  '−',
  '0',
  ',',
  '√',
  '+',
  '(',
  ')',
]

interface Props {
  onUsar: (valor: string) => void
}

export function Calculadora({ onUsar }: Props) {
  const [expresion, setExpresion] = useState('')
  const [resultado, setResultado] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  function calcular() {
    try {
      setResultado(evaluar(expresion))
      setError(null)
    } catch (e) {
      setResultado(null)
      setError(e instanceof Error ? e.message : 'Error')
    }
  }

  function tocar(tecla: string) {
    setExpresion((actual) => actual + tecla)
    setError(null)
  }

  return (
    <div className="bg-muted/40 rounded-lg border p-3">
      <div className="bg-background mb-2 min-h-14 rounded-md px-3 py-2 text-right font-mono">
        <div className="text-muted-foreground truncate text-sm">{expresion || '0'}</div>
        <div className="text-lg font-semibold">
          {error ?? (resultado !== null ? formatear(resultado, 4) : ' ')}
        </div>
      </div>
      <div className="grid grid-cols-4 gap-1.5">
        {TECLAS.map((tecla) => (
          <Button
            key={tecla}
            type="button"
            variant="outline"
            className="h-10 text-base"
            onClick={() => tocar(tecla)}
          >
            {tecla}
          </Button>
        ))}
        <Button
          type="button"
          variant="outline"
          className="h-10"
          onClick={() => setExpresion((a) => a.slice(0, -1))}
        >
          ⌫
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-10"
          onClick={() => {
            setExpresion('')
            setResultado(null)
            setError(null)
          }}
        >
          C
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="col-span-2 h-10 text-base"
          onClick={calcular}
        >
          =
        </Button>
        <Button
          type="button"
          className="col-span-4 h-10"
          disabled={resultado === null}
          onClick={() => resultado !== null && onUsar(formatear(resultado, 4))}
        >
          Usar resultado
        </Button>
      </div>
    </div>
  )
}
