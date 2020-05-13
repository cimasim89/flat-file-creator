const _ = require('lodash')
const {
  isNumeric,
  getPaddingPositionOrDef,
  getPaddingSymbol,
  getPadder,
  getFillStringOfSymbol,
} = require('./utils')

const paddingDefault = 'start'

const floatFormatter = (map, data) => {
  if (!map) throw new Error('map is null or undefined')
  if (typeof map !== 'object') throw new Error('map is not an object')
  if (_.isEmpty(map)) throw new Error('map object is empty')
  if (typeof map.size === 'undefined') throw new Error('map size is required')
  if (map.size <= 0) throw new Error('map size must be greater than 0')
  if (typeof map.precision === 'undefined')
    throw new Error('float precision must be specified')
  if (!isNumeric(data))
    throw new Error(`field [${map.name}] has not compatible type`)
  const precision = !map.precision ? 0 : map.precision
  const num = data.toFixed(precision + 1)
  const str = !map.dotNotation
    ? Math.trunc(num * Math.pow(10, precision)).toString()
    : data.toFixed(precision).toString()
  if (_.size(str) > map.size)
    throw new Error(`Value ${str} exceed size ${map.size}`)
  return getPadder(
    getPaddingPositionOrDef(map.paddingPosition, paddingDefault)
  )(
    str,
    getFillStringOfSymbol(getPaddingSymbol(map.paddingSymbol))(
      map.size - _.size(str)
    )
  )
}

module.exports = floatFormatter
