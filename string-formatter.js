const _ = require('lodash')
const {
  isNumeric,
  getPaddingPositionOrDef,
  getPaddingSymbol,
  getPadder,
  getFillStringOfSymbol
} = require('./utils')

const paddingDefault = 'end'

const stringFormatter = (map, data = '') => {
  try {
    if (!map) throw new Error('map is null or undefined')
    if (typeof map !== 'object') throw new Error('map is not an object')
    if (_.isEmpty(map)) throw new Error('map object is empty')
    if (typeof map.size === 'undefined') throw new Error('map size is required')
    if (map.size <= 0) throw new Error('map size must be greater than 0')
    if (map.straight && isNumeric(data))
      throw new Error('field has not compatible type')
    const str = data.toString().trim()
    return getPadder(
      getPaddingPositionOrDef(map.paddingPosition, paddingDefault)
    )(
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
