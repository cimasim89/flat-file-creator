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
  options: Partial<WriteOptions>
) => {
  return new Promise((resolve, reject) => {
    try {
      fs.appendFileSync(path, data, prepareOptions(options))
      resolve(path)
    } catch (error) {
      return reject(error)
    }
  })
}

export default fileAppendPromise
