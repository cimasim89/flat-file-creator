function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n)
}

const checkValidPaddingPosition = (paddingPosition) => {
  if (!['start', 'end'].includes(paddingPosition))
    throw new Error(`padding position "${paddingPosition}" not allowed`)
  return paddingPosition
}

const getPaddingPositionOrDef = (paddingPosition, def) =>
  checkValidPaddingPosition(
    typeof paddingPosition !== 'undefined' ? paddingPosition : def
  )

const checkValidSybol = (symbol) => {
  if (symbol.length > 1) throw new Error('paddingSymbol cannot have length > 1')
  return symbol
}

const getPaddingSymbol = (symbol) => checkValidSybol(symbol || ' ')

const getFillStringOfSymbol = (symbol) => (length) => {
  return length > 0 ? symbol.repeat(length) : ''
}

const getPadder = (position) => (string, fill) => {
  return position === 'start' ? fill + string : string + fill
}

module.exports = {
  isNumeric,
  getPaddingPositionOrDef,
  getFillStringOfSymbol,
  getPaddingSymbol,
  getPadder,
}
