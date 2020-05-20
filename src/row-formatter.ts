import * as lodash from "lodash";
import fieldFormatter from "./field-formatter";
import { FieldSpec, RowData, GlobalOptions } from "./Types";

const defaultOptions = {
  rowEnd: '',
}

const prepareToConcatData = (data: RowData) => (acc: string, field: FieldSpec) =>
  acc + fieldFormatter(field, data)

const rowFormatter = (maps: Array<FieldSpec>, data: RowData, options: Partial<GlobalOptions>) => {
  if (typeof maps !== 'object') throw new Error('mapping is not an array')
  if (lodash.isEmpty(maps)) throw new Error('mapping is empty')
  if (!data) throw new Error('data is null')
  if (typeof data !== 'object') throw new Error('data is not an object')
  const opt: GlobalOptions = { ...defaultOptions, ...options }
  return maps.reduce(prepareToConcatData(data), '') + opt.rowEnd
}

export default rowFormatter;
