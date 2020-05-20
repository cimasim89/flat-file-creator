export function isNumeric(n: any): n is number {
  return !isNaN(parseFloat(n)) && isFinite(n)
}

export const checkValidPaddingPosition = (paddingPosition: "start" | "end") => {
  if (!['start', 'end'].includes(paddingPosition))
    throw new Error(`padding position "${paddingPosition}" not allowed`)
  return paddingPosition
}

export const getPaddingPositionOrDef = (paddingPosition: "start" | "end" | undefined | null, def: "start" | "end") =>
  checkValidPaddingPosition(paddingPosition ? paddingPosition : def)

export const checkValidSymbol = (sym: string) => {
  if (sym.length > 1) throw new Error('paddingSymbol cannot have length > 1')
  return sym
}

export const getPaddingSymbol = (sym: string | undefined | null) => checkValidSymbol(sym || ' ')

export const getFillStringOfSymbol = (sym: string) => (length: number) => {
  return length > 0 ? sym.repeat(length) : ''
}

export const getPadder = (position: "start" | "end") => (str: string, fill: string) => {
  return position === 'start' ? fill + str : str + fill
}

