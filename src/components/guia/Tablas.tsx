// Tablas de la norma generadas desde dominio/normativa.ts: la guía y los ejercicios
// usan exactamente los mismos valores.

import { Citas } from '@/components/Cita'
import { formatear } from '@/dominio/ejercicios'
import {
  CAIDA_C,
  CIRCUITOS,
  FACTOR_AGRUPAMIENTO,
  FUENTES,
  GRADOS,
  IZ_MONOFASICO,
  IZ_TRIFASICO,
  NOMBRE_GRADO,
  type TipoCircuito,
} from '@/dominio/normativa'
import type { Referencia } from '@/dominio/referencias'

function Tabla({
  encabezados,
  filas,
  fuentes,
  detalle,
}: {
  encabezados: string[]
  filas: (string | number)[][]
  fuentes: Referencia[]
  /** Condiciones de la tabla, p. ej. el tipo de cable */
  detalle?: string
}) {
  return (
    <figure className="not-prose my-4">
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/60">
            <tr>
              {encabezados.map((e) => (
                <th key={e} className="px-3 py-2 text-left font-medium">
                  {e}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {filas.map((fila, i) => (
              <tr key={i}>
                {fila.map((celda, j) => (
                  <td key={j} className="px-3 py-1.5 tabular-nums">
                    {celda}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <figcaption className="text-muted-foreground mt-1 text-xs">
        Fuente: <Citas referencias={fuentes} />
        {detalle && `. ${detalle}`}
      </figcaption>
    </figure>
  )
}

const SECCIONES_TABLA = [1.5, 2.5, 4, 6, 10, 16, 25, 35]

export function TablaIz() {
  return (
    <Tabla
      encabezados={['Sección (mm²)', 'Iz monofásico (A)', 'Iz trifásico (A)']}
      filas={SECCIONES_TABLA.map((s) => [formatear(s), IZ_MONOFASICO[s], IZ_TRIFASICO[s]])}
      fuentes={[FUENTES.iz]}
      detalle="Cables IRAM NM 247-3 en caño, 40 °C"
    />
  )
}

export function TablaAgrupamiento() {
  return (
    <Tabla
      encabezados={['Circuitos en la misma canalización', 'Factor']}
      filas={Object.entries(FACTOR_AGRUPAMIENTO).map(([n, f]) => [n, formatear(f)])}
      fuentes={[FUENTES.agrupamiento]}
    />
  )
}

export function TablaCaida() {
  return (
    <Tabla
      encabezados={['Sección (mm²)', 'c (V/(A·km))']}
      filas={Object.entries(CAIDA_C).map(([s, c]) => [formatear(Number(s)), formatear(c)])}
      fuentes={[FUENTES.caidaTabla]}
      detalle="Monofásico, cos φ = 0,8"
    />
  )
}

export function TablaCircuitos() {
  return (
    <Tabla
      encabezados={['Circuito', 'Máx. bocas', 'Máx. protección', 'Sección mín.']}
      filas={(Object.keys(CIRCUITOS) as TipoCircuito[]).map((tipo) => [
        `${tipo}: ${CIRCUITOS[tipo].nombre}`,
        CIRCUITOS[tipo].maxBocas,
        `${CIRCUITOS[tipo].maxIn} A`,
        `${formatear(CIRCUITOS[tipo].seccionMinima)} mm²`,
      ])}
      fuentes={[FUENTES.circuitos, FUENTES.seccionesMinimas]}
    />
  )
}

export function TablaGrados() {
  return (
    <Tabla
      encabezados={['Grado', 'Superficie límite', 'Circuitos mín.', 'Coef. simultaneidad']}
      filas={GRADOS.map((g, i) => {
        const desde = GRADOS[i - 1]?.hastaM2
        const rango =
          g.hastaM2 === null
            ? `más de ${desde} m²`
            : `${desde ? `más de ${desde} ` : ''}hasta ${g.hastaM2} m²`
        return [NOMBRE_GRADO[g.id], rango, g.circuitosMinimos, formatear(g.coeficiente)]
      })}
      fuentes={[FUENTES.grados, FUENTES.coeficientes]}
    />
  )
}
