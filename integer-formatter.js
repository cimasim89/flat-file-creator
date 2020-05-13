const _ = require('lodash')
const {
  isNumeric,
  getPaddingPositionOrDef,
  getPaddingSymbol,
  getPadder,
  getFillStringOfSymbol,
} = require('./utils')

const paddingDefault = 'start'

const integerFormatter = (map, data) => {
  if (!map) throw new Error('map is null or undefined')
  if (typeof map !== 'object') throw new Error('map is not an object')
  if (_.isEmpty(map)) throw new Error('map object is empty')
  if (typeof map.size === 'undefined') throw new Error('map size is required')
  if (map.size <= 0) throw new Error('map size must be greater than 0')
  if (!isNumeric(data)) throw new Error('field has not compatible type')
  const num = Math.round(data).toString()
  if (_.size(num) > map.size)
    throw new Error(`Value ${num} exceed size ${map.size}`)
  return getPadder(
    getPaddingPositionOrDef(map.paddingPosition, paddingDefault)
  )(
    num,
    getFillStringOfSymbol(getPaddingSymbol(map.paddingSymbol))(
      map.size - _.size(num)
    )
  )
}

module.exports = integerFormatter
