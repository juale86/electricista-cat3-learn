import { useState } from 'react'

import { CampoNumero, Opciones, Resultado, Simulador } from '@/components/guia/Simuladores'
import { formatear, parsearNumero } from '@/dominio/ejercicios'
import { cn } from '@/lib/utils'

type Incognita = 'U' | 'I' | 'R'

export function SimuladorOhm() {
  const [incognita, setIncognita] = useState<Incognita>('I')
  const [u, setU] = useState('220')
  const [i, setI] = useState('10')
  const [r, setR] = useState('22')

  const U = parsearNumero(u)
  const I = parsearNumero(i)
  const R = parsearNumero(r)

  let resultado: string | null = null
  if (incognita === 'I' && U !== null && R)
    resultado = `I = ${formatear(U)} / ${formatear(R)} = ${formatear(U / R)} A`
  if (incognita === 'R' && U !== null && I)
    resultado = `R = ${formatear(U)} / ${formatear(I)} = ${formatear(U / I)} Ω`
  if (incognita === 'U' && I !== null && R !== null)
    resultado = `U = ${formatear(I)} · ${formatear(R)} = ${formatear(I * R)} V`

  return (
    <Simulador titulo="ley de Ohm">
      <Opciones
        etiqueta="¿Qué querés calcular?"
        valor={incognita}
        onCambio={setIncognita}
        opciones={[
          { valor: 'U', texto: 'Tensión (U)' },
          { valor: 'I', texto: 'Corriente (I)' },
          { valor: 'R', texto: 'Resistencia (R)' },
        ]}
      />
      <div className="grid grid-cols-2 gap-3">
        {incognita !== 'U' && (
          <CampoNumero etiqueta="Tensión" unidad="V" valor={u} onCambio={setU} />
        )}
        {incognita !== 'I' && (
          <CampoNumero etiqueta="Corriente" unidad="A" valor={i} onCambio={setI} />
        )}
        {incognita !== 'R' && (
          <CampoNumero etiqueta="Resistencia" unidad="Ω" valor={r} onCambio={setR} />
        )}
      </div>
      <Resultado>
        <p className="text-lg font-semibold">
          {resultado ?? 'Completá los dos datos (sin dividir por cero).'}
        </p>
      </Resultado>
    </Simulador>
  )
}

export function SimuladorSerieParalelo() {
  const [conexion, setConexion] = useState<'serie' | 'paralelo'>('serie')
  const [r1, setR1] = useState('484')
  const [r2, setR2] = useState('484')

  const R1 = parsearNumero(r1)
  const R2 = parsearNumero(r2)
  const validos = R1 !== null && R2 !== null && R1 > 0 && R2 > 0

  return (
    <Simulador titulo="serie y paralelo a 220 V">
      <Opciones
        etiqueta="Conexión"
        valor={conexion}
        onCambio={setConexion}
        opciones={[
          { valor: 'serie', texto: 'Serie' },
          { valor: 'paralelo', texto: 'Paralelo' },
        ]}
      />
      <div className="grid grid-cols-2 gap-3">
        <CampoNumero etiqueta="R1" unidad="Ω" valor={r1} onCambio={setR1} />
        <CampoNumero etiqueta="R2" unidad="Ω" valor={r2} onCambio={setR2} />
      </div>
      {validos && (
        <Resultado>
          {conexion === 'serie' ? (
            <SerieResultado r1={R1} r2={R2} />
          ) : (
            <ParaleloResultado r1={R1} r2={R2} />
          )}
        </Resultado>
      )}
      <p className="text-muted-foreground text-xs">
        484 Ω es la resistencia (en caliente) de una lámpara incandescente de 100 W en 220 V.
      </p>
    </Simulador>
  )
}

function SerieResultado({ r1, r2 }: { r1: number; r2: number }) {
  const req = r1 + r2
  const i = 220 / req
  return (
    <ul className="space-y-1">
      <li>
        Req = {formatear(r1)} + {formatear(r2)} = <strong>{formatear(req)} Ω</strong>
      </li>
      <li>
        Corriente (la misma en las dos): <strong>{formatear(i, 3)} A</strong>
      </li>
      <li>
        Tensión en R1: <strong>{formatear(i * r1, 1)} V</strong> · en R2:{' '}
        <strong>{formatear(i * r2, 1)} V</strong>
      </li>
      <li>
        Potencia total: <strong>{formatear(220 * i, 1)} W</strong>
      </li>
    </ul>
  )
}

function ParaleloResultado({ r1, r2 }: { r1: number; r2: number }) {
  const req = (r1 * r2) / (r1 + r2)
  return (
    <ul className="space-y-1">
      <li>
        Req = ({formatear(r1)} · {formatear(r2)}) / ({formatear(r1)} + {formatear(r2)}) ={' '}
        <strong>{formatear(req, 1)} Ω</strong>
      </li>
      <li>
        Tensión (la misma en las dos): <strong>220 V</strong>
      </li>
      <li>
        Corriente en R1: <strong>{formatear(220 / r1, 3)} A</strong> · en R2:{' '}
        <strong>{formatear(220 / r2, 3)} A</strong>
      </li>
      <li>
        Corriente total: <strong>{formatear(220 / req, 3)} A</strong> · Potencia total:{' '}
        <strong>{formatear(220 ** 2 / req, 1)} W</strong>
      </li>
    </ul>
  )
}

export function SimuladorEnergia() {
  const [potencia, setPotencia] = useState('2000')
  const [horas, setHoras] = useState('3')
  const [dias, setDias] = useState('30')
  const [precio, setPrecio] = useState('150')

  const P = parsearNumero(potencia)
  const H = parsearNumero(horas)
  const D = parsearNumero(dias)
  const precioKwh = parsearNumero(precio)
  const kwh = P !== null && H !== null && D !== null ? (P / 1000) * H * D : null

  return (
    <Simulador titulo="consumo y costo">
      <div className="grid grid-cols-2 gap-3">
        <CampoNumero etiqueta="Potencia" unidad="W" valor={potencia} onCambio={setPotencia} />
        <CampoNumero etiqueta="Uso por día" unidad="h" valor={horas} onCambio={setHoras} />
        <CampoNumero etiqueta="Días" unidad="días" valor={dias} onCambio={setDias} />
        <CampoNumero
          etiqueta="Precio (ejemplo)"
          unidad="$/kWh"
          valor={precio}
          onCambio={setPrecio}
        />
      </div>
      {kwh !== null && (
        <Resultado>
          <p className="font-mono text-xs">
            E = {formatear(P! / 1000, 3)} kW · {formatear(H!)} h · {formatear(D!)} días
          </p>
          <p className="text-lg font-semibold">
            {formatear(kwh, 1)} kWh{precioKwh !== null && ` · $${formatear(kwh * precioKwh, 0)}`}
          </p>
        </Resultado>
      )}
    </Simulador>
  )
}

const ZONAS_CUERPO = [
  { hastaMa: 0.5, texto: 'No se percibe.', clase: 'bg-emerald-500' },
  {
    hastaMa: 10,
    texto: 'Se siente un cosquilleo o dolor, pero se puede soltar.',
    clase: 'bg-yellow-500',
  },
  {
    hastaMa: 30,
    texto: 'No se puede soltar (tetanización). Si se prolonga, cuesta respirar.',
    clase: 'bg-orange-500',
  },
  {
    hastaMa: Infinity,
    texto:
      'Riesgo de fibrilación ventricular si el contacto se prolonga. El diferencial tiene que cortar.',
    clase: 'bg-red-600',
  },
]

export function SimuladorCuerpo() {
  const [tension, setTension] = useState('220')
  const [resistencia, setResistencia] = useState('2500')

  const U = parsearNumero(tension)
  const R = parsearNumero(resistencia)
  const ma = U !== null && R ? (U / R) * 1000 : null
  const zona = ma !== null ? ZONAS_CUERPO.find((z) => ma < z.hastaMa)! : null

  return (
    <Simulador titulo="corriente por el cuerpo">
      <div className="grid grid-cols-2 gap-3">
        <CampoNumero
          etiqueta="Tensión de contacto"
          unidad="V"
          valor={tension}
          onCambio={setTension}
        />
        <CampoNumero
          etiqueta="Resistencia del cuerpo"
          unidad="Ω"
          valor={resistencia}
          onCambio={setResistencia}
        />
      </div>
      {ma !== null && zona && (
        <Resultado>
          <div className="flex items-center gap-2">
            <span className={cn('size-3 shrink-0 rounded-full', zona.clase)} />
            <p className="text-lg font-semibold">{formatear(ma, 1)} mA</p>
          </div>
          <p>{zona.texto}</p>
        </Resultado>
      )}
      <p className="text-muted-foreground text-xs">
        Umbrales del manual (2.19): percepción 0,5 mA, no soltar 10 mA. El límite de 30 mA es el del
        diferencial; el riesgo real depende también del tiempo y del recorrido. Valores
        orientativos.
      </p>
    </Simulador>
  )
}

/** Diagrama de la onda de 220 V / 50 Hz. */
export function OndaSenoidal() {
  const ancho = 320
  const alto = 160
  const medio = alto / 2
  const amplitud = 62
  const eficaz = amplitud / Math.SQRT2
  const puntos = Array.from({ length: 101 }, (_, k) => {
    const x = 30 + (k / 100) * (ancho - 50)
    const y = medio - amplitud * Math.sin((k / 100) * 2 * Math.PI)
    return `${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')

  return (
    <figure className="not-prose my-4">
      <svg
        viewBox={`0 0 ${ancho} ${alto}`}
        className="text-foreground w-full max-w-md"
        role="img"
        aria-label="Onda senoidal de 50 Hz con valor máximo de 311 V y valor eficaz de 220 V"
      >
        <line
          x1="30"
          y1={medio}
          x2={ancho - 10}
          y2={medio}
          stroke="currentColor"
          strokeOpacity="0.3"
        />
        <line x1="30" y1="10" x2="30" y2={alto - 10} stroke="currentColor" strokeOpacity="0.3" />
        <line
          x1="30"
          y1={medio - eficaz}
          x2={ancho - 10}
          y2={medio - eficaz}
          stroke="currentColor"
          strokeDasharray="4 4"
          strokeOpacity="0.6"
        />
        <polyline points={puntos} fill="none" stroke="var(--primary)" strokeWidth="2.5" />
        <text x="34" y={medio - amplitud - 4} fontSize="10" fill="currentColor">
          311 V (máximo)
        </text>
        <text
          x={ancho - 12}
          y={medio - eficaz - 4}
          fontSize="10"
          fill="currentColor"
          textAnchor="end"
        >
          220 V (eficaz)
        </text>
        <text x={ancho - 12} y={medio + 14} fontSize="10" fill="currentColor" textAnchor="end">
          20 ms
        </text>
      </svg>
      <figcaption className="text-muted-foreground text-xs">
        Un ciclo de la red: 50 ciclos por segundo, cada uno dura 20 ms.
      </figcaption>
    </figure>
  )
}
