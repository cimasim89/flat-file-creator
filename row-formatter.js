const lodash = require('lodash')
const fieldFormatter = require('./field-formatter')

const defaultOptions = {
  rowEnd: ''
}

const prepareToConcatData = data => (acc, field) =>
  acc + fieldFormatter(field, data)

const rowFormatter = (maps, data, options) => {
  if (typeof maps !== 'object') throw new Error('mapping is not an array')
  if (lodash.isEmpty(maps)) throw new Error('mapping is empty')
  if (!data) throw new Error('data is null')
  if (typeof data !== 'object') throw new Error('data is not an object')
  const opt = { ...defaultOptions, ...options }
  try {
    return maps.reduce(prepareToConcatData(data), '') + opt.rowEnd
  } catch (err) {
    throw err
  }
}

module.exports = rowFormatter
