import {
  CAIDA_C,
  CALIBRES_PIA,
  CIRCUITOS,
  DPMS,
  FACTOR_AGRUPAMIENTO,
  GRADOS,
  IZ_MONOFASICO,
  SECCIONES,
  TENSION_MONOFASICA,
  TENSION_TRIFASICA,
  type GradoElectrificacion,
  type TipoCircuito,
} from './normativa'

export function corrienteMonofasica(potenciaW: number, cosPhi = 1): number {
  return potenciaW / (TENSION_MONOFASICA * cosPhi)
}

export function corrienteTrifasica(potenciaW: number, cosPhi = 1): number {
  return potenciaW / (Math.sqrt(3) * TENSION_TRIFASICA * cosPhi)
}

export function superficieLimite(cubiertaM2: number, semicubiertaM2: number): number {
  return cubiertaM2 + 0.5 * semicubiertaM2
}

export function gradoPorSuperficie(superficieM2: number) {
  return GRADOS.find((g) => g.hastaM2 === null || superficieM2 <= g.hastaM2)!
}

export interface CircuitosVivienda {
  /** Bocas de cada IUG sin tomas derivados */
  iugSinTomas: number[]
  iugConTomas: number
  tug: number
  tue: number
}

export function dpmsCircuito(circuitos: CircuitosVivienda): number {
  const iug = circuitos.iugSinTomas.reduce(
    (total, bocas) => total + bocas * DPMS.vaPorBocaIUG * DPMS.fraccionIUGSinTomas,
    0,
  )
  return (
    iug +
    circuitos.iugConTomas * DPMS.iugConTomas +
    circuitos.tug * DPMS.tug +
    circuitos.tue * DPMS.tue
  )
}

export function dpmsVivienda(circuitos: CircuitosVivienda, grado: GradoElectrificacion): number {
  const coeficiente = GRADOS.find((g) => g.id === grado)!.coeficiente
  return dpmsCircuito(circuitos) * coeficiente
}

export function izCorregida(seccion: number, circuitosEnCano: number): number {
  return IZ_MONOFASICO[seccion] * FACTOR_AGRUPAMIENTO[circuitosEnCano]
}

/** Mayor calibre de PIA que cumple In ≤ Iz y el tope del tipo de circuito. */
export function piaMaximo(seccion: number, circuitosEnCano: number, tipo: TipoCircuito) {
  const tope = Math.min(izCorregida(seccion, circuitosEnCano), CIRCUITOS[tipo].maxIn)
  return [...CALIBRES_PIA].reverse().find((calibre) => calibre <= tope)
}

/** Menor calibre de PIA que cumple Ib ≤ In ≤ Iz. */
export function piaParaCarga(ib: number, seccion: number, circuitosEnCano: number) {
  const iz = izCorregida(seccion, circuitosEnCano)
  return CALIBRES_PIA.find((calibre) => calibre >= ib && calibre <= iz)
}

/** Menor sección que admite un PIA con Ib ≤ In ≤ Iz, respetando la sección mínima del circuito. */
export function seccionMinimaParaCarga(ib: number, circuitosEnCano: number, tipo: TipoCircuito) {
  const { seccionMinima, maxIn } = CIRCUITOS[tipo]
  return SECCIONES.find((seccion) => {
    if (seccion < seccionMinima) return false
    const pia = piaParaCarga(ib, seccion, circuitosEnCano)
    return pia !== undefined && pia <= maxIn
  })
}

export function caidaTension(seccion: number, corriente: number, largoM: number) {
  const volts = CAIDA_C[seccion] * corriente * (largoM / 1000)
  return { volts, porcentaje: (volts / TENSION_MONOFASICA) * 100 }
}
