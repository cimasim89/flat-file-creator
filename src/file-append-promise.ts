import * as fs from 'fs'
import { WriteOptions } from './Types'

const defaultOptions = {
  encoding: 'utf8' as 'utf8',
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
    const appendCallback = (err: Error) => {
      if (err) {
        return reject(err)
      }
      return resolve()
    }

    if (options && options.encoding) {
      return fs.appendFile(path, data, prepareOptions(options), appendCallback)
    }
    fs.appendFile(path, data, appendCallback)
  })
}

export default fileAppendPromise
