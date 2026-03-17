import fieldFormatter from './field-formatter.js'
import { FieldSpec, RowData, WriteOptions } from './types/index.js'

const defaultOptions = {
  rowEnd: '',
}

const prepareToConcatData =
  <T>(data: RowData<T>) =>
  (acc: string, field: FieldSpec, i: number) => {
    try {
      return acc + fieldFormatter<T>(field, data)
    } catch (e) {
      e.message = `Row Index ${i}: ${e.message}`
      throw e
    }
  }

const rowFormatter = <T>(
  maps: Array<FieldSpec>,
  data: RowData<T>,
  options: Partial<WriteOptions>,
) => {
  if (typeof maps !== 'object') {
    throw new Error('mapping is not an array')
  }
  if (maps.length === 0) {
    throw new Error('mapping is empty')
  }
  if (!data) {
    throw new Error('data is null')
  }
  if (typeof data !== 'object') {
    throw new Error('data is not an object')
  }
  const opt: WriteOptions = { ...defaultOptions, ...options }
  return maps.reduce(prepareToConcatData<T>(data), '') + opt.rowEnd
}

export default rowFormatter
