import stringFormatter from './string-formatter'
import dateFormatter from './date-formatter'
import integerFormatter from './integer-formatter'
import floatFormatter from './float-formatter'
import { FieldSpec, StringFieldSpec, RowData, assertFieldSpec } from './Types'

const fieldFormatter = <T>(map: FieldSpec, data: RowData<T>) => {
  assertFieldSpec(map)
  const fieldName = <keyof T>map.name
  switch (map.type) {
    case 'string':
      return stringFormatter(map, data[fieldName])
    case 'integer':
      return integerFormatter(map, data[fieldName])
    case 'float':
      return floatFormatter(map, data[fieldName])
    case 'date':
      return dateFormatter(map, data[fieldName])
    case undefined:
      return stringFormatter(
        { ...(map as StringFieldSpec), type: 'string' },
        data[fieldName]
      )
    default:
      throw new Error('required field type is not present')
  }
}

export default fieldFormatter
