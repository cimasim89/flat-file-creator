import * as fs from 'fs'
import { WriteOptions } from './Types'

const defaultOptions = {
  encoding: 'utf8' as const,
  mode: 0o666,
  flag: 'a',
}

const prepareOptions = (opts: Partial<WriteOptions>) => {
  let options: fs.WriteFileOptions = { ...defaultOptions }
  options = opts.encoding ? { ...options, encoding: opts.encoding } : options
  options = opts.mode ? { ...options, mode: opts.mode } : options
  options = opts.flag ? { ...options, flag: opts.flag } : options
  return { ...options }
}

const fileAppendPromise = (
  path: string,
  data: string,
  options?: Partial<WriteOptions>
) => {
  return new Promise((resolve, reject) => {
    const appendCallback = (path: string) => (err: Error) => {
      if (err) {
        return reject(err)
      }
      return resolve(path)
    }

    if (options && options.encoding) {
      return fs.appendFile(
        path,
        data,
        prepareOptions(options),
        appendCallback(path)
      )
    }
    fs.appendFile(path, data, appendCallback(path))
  })
}

export default fileAppendPromise
