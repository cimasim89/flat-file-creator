export function isNumeric(n: any) {
  return !isNaN(parseFloat(n)) && isFinite(n)
}

export const checkValidPaddingPosition = (paddingPosition: "start" | "end") => {
  if (!['start', 'end'].includes(paddingPosition))
    throw new Error(`padding position "${paddingPosition}" not allowed`)
  return paddingPosition
}

export const getPaddingPositionOrDef = (paddingPosition: "start" | "end" | undefined | null, def: "start" | "end") =>
  checkValidPaddingPosition(
    typeof paddingPosition !== 'undefined' ? paddingPosition : def
  )

export const checkValidSymbol = (symbol: string) => {
  if (symbol.length > 1) throw new Error('paddingSymbol cannot have length > 1')
  return symbol
}

export const getPaddingSymbol = (symbol: string | undefined | null) => checkValidSymbol(symbol || ' ')

export const getFillStringOfSymbol = (symbol: string | undefined | null) => (length) => {
  return length > 0 ? symbol.repeat(length) : ''
}

export const getPadder = (position: "start" | "end") => (str: string, fill: string) => {
  return position === 'start' ? fill + str : str + fill
}

