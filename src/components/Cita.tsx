import { ExternalLink } from 'lucide-react'

import {
  aea,
  carpetaERSeP,
  manual,
  notaDocumento,
  programaUTN,
  textoReferencia,
  urlReferencia,
  type Referencia,
} from '@/dominio/referencias'
import { cn } from '@/lib/utils'

/** Muestra una referencia como link al PDF (en la página citada) o como texto si no hay PDF público. */
export function Cita({ referencia, className }: { referencia: Referencia; className?: string }) {
  const url = urlReferencia(referencia)
  const texto = textoReferencia(referencia)
  const nota = notaDocumento(referencia)

  if (!url) {
    return (
      <span className={className} title={nota}>
        {texto}
      </span>
    )
  }
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      title={nota ? `${nota}. Abre el PDF en otra pestaña.` : 'Abre el PDF en otra pestaña.'}
      className={cn('inline-flex items-baseline gap-0.5 underline underline-offset-2', className)}
    >
      {texto}
      <ExternalLink className="size-3 shrink-0 self-center" />
    </a>
  )
}

/** Lista de citas separadas por punto medio. */
export function Citas({ referencias }: { referencias: Referencia[] }) {
  return (
    <>
      {referencias.map((referencia, i) => (
        <span key={i}>
          {i > 0 && ' · '}
          <Cita referencia={referencia} />
        </span>
      ))}
    </>
  )
}

interface PropsRef {
  /** Cláusula o tabla de la AEA 770, p. ej. "770.15.6" o "Tabla 770.12.I" */
  aea?: string
  /** Sección del manual del ERSeP, p. ej. "2.19" */
  manual?: string
  /** Unidad del programa UTN */
  utn?: number
  /** Carpeta técnica modelo del ERSeP */
  carpeta?: boolean | string
}

/** Atajo para citar dentro de los MDX de la guía: <Ref aea="770.15.6" />. */
export function Ref(props: PropsRef) {
  const referencia = props.aea
    ? aea(props.aea)
    : props.manual
      ? manual(props.manual)
      : props.utn
        ? programaUTN(props.utn)
        : carpetaERSeP(typeof props.carpeta === 'string' ? props.carpeta : undefined)
  return <Cita referencia={referencia} />
}
