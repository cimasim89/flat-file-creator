import * as fs from 'fs'
import rowFormatter from './row-formatter'
import { FieldSpec, RowData, WriteOptions } from './Types'

export const getAsyncFlatFileCreator = <T>(
  maps: Array<FieldSpec>,
  options: Partial<WriteOptions>
) => {
  return (data: Array<RowData<T>>, path: string) =>
    new Promise<void>((resolve, reject) => {
      const stream = fs.createWriteStream(path, {
        flags: options.flag ?? 'a',
        encoding: options.encoding ?? 'utf8',
        mode: options.mode ?? 0o666,
      })
      stream.on('finish', resolve)
      stream.on('error', reject)
      try {
        for (const row of data) {
          stream.write(rowFormatter<T>(maps, row, options))
        }
        stream.end()
      } catch (err) {
        stream.destroy()
        reject(err)
      }
    })
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
