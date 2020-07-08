import fileAppendPromise from './file-append-promise'
import rowFormatter from './row-formatter'
import { FieldSpec, RowData, WriteOptions } from './Types'

const rowWriterMapper = <T>(
  maps: Array<FieldSpec>,
  path: string,
  options: Partial<WriteOptions>
) => {
  return (data: RowData<T>) =>
    fileAppendPromise(path, rowFormatter<T>(maps, data, options), options)
}

export const getAsyncFlatFileCreator = <T>(
  maps: Array<FieldSpec>,
  options: Partial<WriteOptions>
) => {
  return (data: Array<RowData<T>>, path: string) =>
    Promise.all(data.map(rowWriterMapper(maps, path, options)))
}

/**
 * This function simply takes rows of data and serializes them into an array of lines (strings).
 * This is roughly the reverse of the `linesToData` function in `src/flat-file-reader.ts`, except
 * that it's output is an array, rather than a single string. (This allows the user to specify
 * which line ending characters they wish to use.)
 */
export const dataToLines = <T>(
  data: Array<RowData<T>>,
  fields: Array<FieldSpec>,
  options?: { throwErrors?: boolean }
): Array<string> => {
  return data.map((d) => rowFormatter<T>(fields, d, options || {}))
}
