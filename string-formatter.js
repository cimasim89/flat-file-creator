const _ = require('lodash')
const { isNumeric } = require('./utils')

const stringFormatter = (map, data = '') => {
  try {
    if (!map) throw new Error('map is null or undefined')
    if (typeof map !== 'object') throw new Error('map is not an object')
    if (_.isEmpty(map)) throw new Error('map object is empty')
    if (typeof map.size === 'undefined') throw new Error('map size is required')
    if (map.size <= 0) throw new Error('map size must be great than 0')
    if (isNumeric(data)) throw new Error('field has not compatible type')
    const str = data.trim()
    const strLenght = _.size(str)
    if (strLenght >= map.size) {
      return str.substring(0, map.size)
    }
    const symbol = map.paddingSymbol ? map.paddingSymbol : ' '
    if (symbol.length > 1)
      throw new Error('padding_symbol can not have length > 1')
    const fixedSymb = symbol.repeat(map.size - strLenght)
    const paddingPosition =
      typeof map.paddingPosition !== 'undefined' &&
      ['start', 'end'].includes(map.paddingPosition)
        ? map.paddingPosition
        : 'end'
    switch (paddingPosition) {
      case 'start':
        return fixedSymb + str
      default:
        return str + fixedSymb
    }
  } catch (error) {
    throw error
  }
}

module.exports = stringFormatter
