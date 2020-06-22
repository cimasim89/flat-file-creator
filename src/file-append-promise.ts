import * as fs from 'fs'
import { GlobalOptions } from './Types'

const defaultOptions = {
  encoding: 'utf8' as const,
  mode: 0o666,
  flag: 'a',
}

const prepareOptions = (opts: Partial<GlobalOptions>) => {
  let options: fs.WriteFileOptions = { ...defaultOptions }
  options = opts.encoding ? { ...options, encoding: opts.encoding } : options
  options = opts.mode ? { ...options, mode: opts.mode } : options
  options = opts.flag ? { ...options, flag: opts.flag } : options
  return { ...options }
}

const fileAppendPromise = (
  path: string,
  data: string,
  options?: Partial<GlobalOptions>
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
