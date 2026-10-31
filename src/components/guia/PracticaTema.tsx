import { useState } from 'react'

import { Correccion } from '@/components/juego/Correccion'
import { TarjetaEjercicio } from '@/components/juego/TarjetaEjercicio'
import { Button } from '@/components/ui/button'
import { esCorrecta, generarEjercicio, type TipoEjercicio } from '@/dominio/ejercicios'

/**
 * Mini práctica al final de un tema. No guarda estadísticas:
 * para eso está el modo práctica con partidas.
 */
export function PracticaTema({ tipo, tema }: { tipo: TipoEjercicio; tema?: string }) {
  const [ejercicio, setEjercicio] = useState(() => generarEjercicio([tipo], {}, tema))
  const [respuesta, setRespuesta] = useState<{ entrada: string; correcta: boolean } | null>(null)

  return (
    <section className="not-prose bg-card my-6 space-y-4 rounded-xl border p-4">
      <h4 className="text-sm font-semibold">✏️ Practicá lo que leíste</h4>
      <TarjetaEjercicio
        key={ejercicio.id}
        ejercicio={ejercicio}
        formato="mental"
        enfocar={false}
        bloqueado={respuesta !== null}
        onResponder={(entrada) =>
          setRespuesta({ entrada, correcta: esCorrecta(ejercicio, entrada, 'mental') })
        }
      />
      {respuesta && (
        <>
          <Correccion ejercicio={ejercicio} {...respuesta} mostrarRepaso={false} />
          <Button
            className="w-full"
            onClick={() => {
              setRespuesta(null)
              setEjercicio(generarEjercicio([tipo], {}, tema))
            }}
          >
            Otro ejercicio
          </Button>
        </>
      )}
    </section>
  )
}
