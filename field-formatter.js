const lodash = require('lodash')
const { isNumeric } = require('./utils')
const stringFormatter = require('./string-formatter')

const fieldFormatter = (map, data) => {
  try {
    if (!map) throw new Error('fieldMap is null or undefined')
    if (typeof map !== 'object') throw new Error('fieldMap is not an object')
    if (lodash.isEmpty(map)) throw new Error('fieldMap object is empty')
    if (typeof map.name === 'undefined')
      throw new Error('map field name is required')
    if (typeof map.size === 'undefined') throw new Error('map size is required')
    if (map.size <= 0) throw new Error('map size must be great than 0')
    if (isNumeric(map.type))
      throw new Error('map field type not could be numeric')
    const type = map.type ? map.type.toLowerCase() : 'string'
    switch (type) {
      case 'string':
        return stringFormatter(map, data)
      case 'integer':
        console.log(map)
        break
      case 'float':
        console.log(map)
        break
      case 'date':
        console.log(map)
        break
      default:
        throw new Error('required field type is not present')
    }
  } catch (error) {
    throw error
  }
}

module.exports = { fieldFormatter }
