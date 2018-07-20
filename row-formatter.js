const lodash = require('lodash')
const fieldFormatter = require('./field-formatter')

const prepareToConcatData = data => (acc, field) =>
  acc + fieldFormatter(field, data)

const rowFormatter = (maps, data) => {
  try {
    if (typeof maps !== 'object') throw new Error('mapping is not an array')
    if (lodash.isEmpty(maps)) throw new Error('mapping is empty')
    if (!data) throw new Error('data is null')
    if (typeof data !== 'object') throw new Error('data is not an object')
    return maps.reduce(prepareToConcatData(data), '')
  } catch (err) {
    throw err
  }
}

module.exports = rowFormatter
