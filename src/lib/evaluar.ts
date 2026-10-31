// Evaluador de expresiones aritméticas para la calculadora en pantalla.
// Soporta + − × ÷ ( ) √ y coma o punto decimal. No usa eval.

type Token = { tipo: 'numero'; valor: number } | { tipo: 'op'; valor: string }

function tokenizar(expresion: string): Token[] {
  const tokens: Token[] = []
  const texto = expresion
    .replace(/\s/g, '')
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-')
  let i = 0
  while (i < texto.length) {
    const c = texto[i]
    if (/[\d.,]/.test(c)) {
      let numero = ''
      while (i < texto.length && /[\d.,]/.test(texto[i])) numero += texto[i++]
      const valor = Number(numero.replace(',', '.'))
      if (!Number.isFinite(valor)) throw new Error('Número inválido')
      tokens.push({ tipo: 'numero', valor })
      continue
    }
    if ('+-*/()√'.includes(c)) {
      tokens.push({ tipo: 'op', valor: c })
      i++
      continue
    }
    throw new Error(`Símbolo inválido: ${c}`)
  }
  return tokens
}

export function evaluar(expresion: string): number {
  const tokens = tokenizar(expresion)
  let pos = 0
  const ver = () => tokens[pos]
  const esOp = (valor: string) => ver()?.tipo === 'op' && ver()?.valor === valor

  // suma := producto (('+' | '-') producto)*
  function suma(): number {
    let valor = producto()
    while (esOp('+') || esOp('-')) {
      const op = tokens[pos++].valor
      valor = op === '+' ? valor + producto() : valor - producto()
    }
    return valor
  }

  // producto := unario (('*' | '/') unario)*
  function producto(): number {
    let valor = unario()
    while (esOp('*') || esOp('/')) {
      const op = tokens[pos++].valor
      valor = op === '*' ? valor * unario() : valor / unario()
    }
    return valor
  }

  // unario := ('-' | '√') unario | primario
  function unario(): number {
    if (esOp('-')) {
      pos++
      return -unario()
    }
    if (esOp('√')) {
      pos++
      return Math.sqrt(unario())
    }
    return primario()
  }

  function primario(): number {
    const token = tokens[pos++]
    if (!token) throw new Error('Expresión incompleta')
    if (token.tipo === 'numero') return token.valor
    if (token.valor === '(') {
      const valor = suma()
      if (!esOp(')')) throw new Error('Falta cerrar el paréntesis')
      pos++
      return valor
    }
    throw new Error('Expresión inválida')
  }

  const resultado = suma()
  if (pos < tokens.length) throw new Error('Expresión inválida')
  if (!Number.isFinite(resultado)) throw new Error('Resultado inválido')
  return resultado
}
