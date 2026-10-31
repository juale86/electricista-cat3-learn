// Simuladores interactivos para la guía: el usuario cambia los datos y ve el resultado.
// Usan las mismas funciones de cálculo que los ejercicios.

import { useId, useState } from 'react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
  caidaTension,
  corrienteMonofasica,
  corrienteTrifasica,
  izCorregida,
  piaParaCarga,
  seccionMinimaParaCarga,
} from '@/dominio/calculos'
import { formatear, parsearNumero } from '@/dominio/ejercicios'
import {
  CAIDA_C,
  CAIDA_MAXIMA_PORCENTAJE,
  CIRCUITOS,
  SECCIONES,
  type TipoCircuito,
} from '@/dominio/normativa'
import { cn } from '@/lib/utils'

export function Simulador({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="not-prose border-primary/30 my-5 space-y-3 rounded-xl border-2 border-dashed p-4">
      <h4 className="text-sm font-semibold">🔧 Probalo: {titulo}</h4>
      {children}
    </section>
  )
}

export function CampoNumero({
  etiqueta,
  unidad,
  valor,
  onCambio,
}: {
  etiqueta: string
  unidad: string
  valor: string
  onCambio: (valor: string) => void
}) {
  const id = useId()
  return (
    <div className="space-y-1">
      <Label htmlFor={id} className="text-xs">
        {etiqueta}
      </Label>
      <div className="flex items-center gap-2">
        <Input
          id={id}
          inputMode="decimal"
          value={valor}
          onChange={(e) => onCambio(e.target.value)}
        />
        <span className="text-muted-foreground w-8 text-sm">{unidad}</span>
      </div>
    </div>
  )
}

export function Opciones<T extends string>({
  etiqueta,
  valor,
  opciones,
  onCambio,
}: {
  etiqueta: string
  valor: T
  opciones: { valor: T; texto: string }[]
  onCambio: (valor: T) => void
}) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium">{etiqueta}</p>
      <ToggleGroup
        type="single"
        variant="outline"
        size="sm"
        className="w-full"
        value={valor}
        onValueChange={(v) => v && onCambio(v as T)}
      >
        {opciones.map((o) => (
          <ToggleGroupItem key={o.valor} value={o.valor} className="flex-1">
            {o.texto}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  )
}

export function Resultado({ children, ok }: { children: React.ReactNode; ok?: boolean }) {
  return (
    <div
      className={cn(
        'rounded-lg p-3 text-sm',
        ok === undefined && 'bg-muted',
        ok === true && 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300',
        ok === false && 'bg-destructive/10 text-destructive',
      )}
    >
      {children}
    </div>
  )
}

export function SimuladorCorriente() {
  const [sistema, setSistema] = useState<'mono' | 'tri'>('mono')
  const [potencia, setPotencia] = useState('2200')
  const [cosPhi, setCosPhi] = useState('1')

  const p = parsearNumero(potencia)
  const c = parsearNumero(cosPhi)
  const valido = p !== null && c !== null && c > 0 && c <= 1
  const corriente = valido
    ? sistema === 'mono'
      ? corrienteMonofasica(p, c)
      : corrienteTrifasica(p, c)
    : null

  return (
    <Simulador titulo="corriente desde la potencia">
      <Opciones
        etiqueta="Sistema"
        valor={sistema}
        onCambio={setSistema}
        opciones={[
          { valor: 'mono', texto: 'Monofásico 220 V' },
          { valor: 'tri', texto: 'Trifásico 380 V' },
        ]}
      />
      <div className="grid grid-cols-2 gap-3">
        <CampoNumero etiqueta="Potencia" unidad="W" valor={potencia} onCambio={setPotencia} />
        <CampoNumero etiqueta="cos φ" unidad="" valor={cosPhi} onCambio={setCosPhi} />
      </div>
      <Resultado>
        {corriente === null ? (
          'Cargá una potencia y un cos φ entre 0 y 1.'
        ) : (
          <>
            <p className="font-mono text-xs">
              I = {formatear(p!)} / ({sistema === 'tri' ? '1,732 · 380' : '220'} · {formatear(c!)})
            </p>
            <p className="text-lg font-semibold">I = {formatear(corriente, 2)} A</p>
          </>
        )}
      </Resultado>
    </Simulador>
  )
}

export function SimuladorSeccion() {
  const [tipo, setTipo] = useState<TipoCircuito>('TUG')
  const [ib, setIb] = useState('12')
  const [enCano, setEnCano] = useState('1')

  const corriente = parsearNumero(ib)
  const circuitos = Number(enCano)
  const { seccionMinima, maxIn } = CIRCUITOS[tipo]
  const seccion =
    corriente !== null ? seccionMinimaParaCarga(corriente, circuitos, tipo) : undefined
  const pia =
    seccion !== undefined && corriente !== null
      ? piaParaCarga(corriente, seccion, circuitos)
      : undefined

  return (
    <Simulador titulo="sección y protección">
      <Opciones
        etiqueta="Circuito"
        valor={tipo}
        onCambio={setTipo}
        opciones={(['IUG', 'TUG', 'TUE'] as const).map((t) => ({ valor: t, texto: t }))}
      />
      <Opciones
        etiqueta="Circuitos en el mismo caño"
        valor={enCano}
        onCambio={setEnCano}
        opciones={['1', '2', '3'].map((n) => ({ valor: n, texto: n }))}
      />
      <CampoNumero etiqueta="Corriente de proyecto (Ib)" unidad="A" valor={ib} onCambio={setIb} />

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/60 text-xs">
            <tr>
              <th className="px-2 py-1.5 text-left">Sección</th>
              <th className="px-2 py-1.5 text-left">Iz corregida</th>
              <th className="px-2 py-1.5 text-left">¿Sirve?</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {SECCIONES.filter((s) => s >= 1.5 && s <= 10).map((s) => {
              const iz = izCorregida(s, circuitos)
              const piaS = corriente !== null ? piaParaCarga(corriente, s, circuitos) : undefined
              const motivo =
                s < seccionMinima
                  ? `menor que el mínimo del ${tipo}`
                  : piaS === undefined
                    ? 'no hay PIA con Ib ≤ In ≤ Iz'
                    : piaS > maxIn
                      ? `el PIA (${piaS} A) supera el tope del ${tipo}`
                      : `sí, con PIA de ${piaS} A`
              return (
                <tr key={s} className={cn(s === seccion && 'bg-emerald-500/10 font-medium')}>
                  <td className="px-2 py-1.5">{formatear(s)} mm²</td>
                  <td className="px-2 py-1.5 tabular-nums">{formatear(iz, 1)} A</td>
                  <td className="px-2 py-1.5 text-xs">{motivo}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <Resultado ok={seccion !== undefined}>
        {seccion !== undefined && pia !== undefined
          ? `Sección mínima: ${formatear(seccion)} mm² con PIA de ${pia} A.`
          : `Con esa corriente no entra en un ${tipo} (tope ${maxIn} A): hace falta otro tipo de circuito.`}
      </Resultado>
    </Simulador>
  )
}

export function SimuladorCaida() {
  const [seccion, setSeccion] = useState('2.5')
  const [corriente, setCorriente] = useState('10')
  const [largo, setLargo] = useState('25')

  const i = parsearNumero(corriente)
  const l = parsearNumero(largo)
  const s = Number(seccion)
  const caida = i !== null && l !== null ? caidaTension(s, i, l) : null
  const verifica = caida !== null && caida.porcentaje <= CAIDA_MAXIMA_PORCENTAJE

  return (
    <Simulador titulo="caída de tensión">
      <Opciones
        etiqueta="Sección"
        valor={seccion}
        onCambio={setSeccion}
        opciones={Object.keys(CAIDA_C)
          .map(Number)
          .filter((x) => x <= 10)
          .map((x) => ({ valor: String(x), texto: formatear(x) }))}
      />
      <div className="grid grid-cols-2 gap-3">
        <CampoNumero etiqueta="Corriente" unidad="A" valor={corriente} onCambio={setCorriente} />
        <CampoNumero etiqueta="Distancia" unidad="m" valor={largo} onCambio={setLargo} />
      </div>
      {caida && (
        <Resultado ok={verifica}>
          <p className="font-mono text-xs">
            ΔU = {formatear(CAIDA_C[s])} · {formatear(i!)} · {formatear(l! / 1000, 3)} ={' '}
            {formatear(caida.volts)} V
          </p>
          <p className="text-lg font-semibold">
            {formatear(caida.porcentaje)} % {verifica ? '✓ verifica' : '✗ no verifica'}
          </p>
          <Progress
            value={Math.min(100, (caida.porcentaje / CAIDA_MAXIMA_PORCENTAJE) * 100)}
            className="mt-2"
          />
          <p className="mt-1 text-xs">Límite: {CAIDA_MAXIMA_PORCENTAJE} % (6,6 V en 220 V)</p>
        </Resultado>
      )}
    </Simulador>
  )
}
