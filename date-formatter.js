const moment = require('moment')
const _ = require('lodash')
const {
  isNumeric,
  getPaddingPositionOrDef,
  getPaddingSymbol,
  getPadder,
  getFillStringOfSymbol
} = require('./utils')

const paddingDefault = 'end'
const defaultFormat = {
  utc: false
}

const getFormattedDateString = (date, { utc, dateFormat }) => {
  const base = moment(date)
  if (!base.isValid()) throw new Error(`Invalid date ${date}`)
  const convention = utc ? base.utc() : base
  if (!dateFormat) {
    return convention.toISOString()
  }
  return convention.format(dateFormat)
}

const dateFormatter = (map, data) => {
  try {
    if (!map) throw new Error('map is null or undefined')
    if (typeof map !== 'object') throw new Error('map is not an object')
    if (_.isEmpty(map)) throw new Error('map object is empty')
    if (typeof map.size === 'undefined') throw new Error('map size is required')
    if (map.size <= 0) throw new Error('map size must be greater than 0')
    if (isNumeric(data)) throw new Error('field has not compatible type')
    const format = { ...defaultFormat, ...map.format }
    const resDate = getFormattedDateString(data, format)
    if (_.size(resDate) > map.size)
      throw new Error(`Date ${resDate} exceed size ${map.size}`)
    return getPadder(
      getPaddingPositionOrDef(map.paddingPosition, paddingDefault)
    )(
      resDate,
      getFillStringOfSymbol(getPaddingSymbol(map.paddingSymbol))(
        map.size - _.size(resDate)
      )
    )
  } catch (error) {
    throw error
  }
}

module.exports = dateFormatter
