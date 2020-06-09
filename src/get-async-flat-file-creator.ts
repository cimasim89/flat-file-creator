import fileAppendPromise from './file-append-promise'
import rowFormatter from './row-formatter'
import { FieldSpec, RowData, WriteOptions } from './Types'

const rowWriterMapper = (
  maps: Array<FieldSpec>,
  path: string,
  options: Partial<WriteOptions>
) => {
  return (data: RowData) =>
    fileAppendPromise(path, rowFormatter(maps, data, options), options)
}

export const getAsyncFlatFileCreator = (
  maps: Array<FieldSpec>,
  options: Partial<WriteOptions>
) => {
  return (data: Array<RowData>, path: string) =>
    Promise.all(data.map(rowWriterMapper(maps, path, options)))
}
