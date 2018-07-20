const _ = require('lodash')
const { isNumeric } = require('./utils')

const checkValidPadingPosition = paddingPosition => {
  if (!['start', 'end'].includes(paddingPosition))
    throw new Error(`padding position "${paddingPosition}" not allowed`)
  return paddingPosition
}

const getPaddingPosition = paddingPosition =>
  checkValidPadingPosition(
    typeof paddingPosition !== 'undefined' ? paddingPosition : 'end'
  )

const checkValidSybol = symbol => {
  if (symbol.length > 1) throw new Error('paddingSymbol cannot have length > 1')
  return symbol
}

const getPaddingSymbol = symbol => checkValidSybol(symbol || ' ')

const getFillStringOfSymbol = symbol => length => {
  return length > 0 ? symbol.repeat(length) : ''
}

const getPadder = position => (string, fill) => {
  return position === 'start' ? fill + string : string + fill
}

const stringFormatter = (map, data = '') => {
  try {
    if (!map) throw new Error('map is null or undefined')
    if (typeof map !== 'object') throw new Error('map is not an object')
    if (_.isEmpty(map)) throw new Error('map object is empty')
    if (typeof map.size === 'undefined') throw new Error('map size is required')
    if (map.size <= 0) throw new Error('map size must be greater than 0')
    if (isNumeric(data)) throw new Error('field has not compatible type')
    const str = data.trim()
    return getPadder(getPaddingPosition(map.paddingPosition))(
      str.substring(0, map.size),
      getFillStringOfSymbol(getPaddingSymbol(map.paddingSymbol))(
        map.size - _.size(str)
      )
    )
  } catch (error) {
    throw error
  }
}

module.exports = stringFormatter
