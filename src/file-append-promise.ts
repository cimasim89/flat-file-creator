import { ObjectEncodingOptions } from 'node:fs'
import fs from 'node:fs/promises'
import { WriteOptions } from './Types.js'

const defaultOptions = {
  encoding: 'utf8' as const,
  mode: 0o666,
  flag: 'a',
}

type Options = ObjectEncodingOptions & fs.FlagAndOpenMode

const prepareOptions = (opts: Partial<WriteOptions>) => {
  let options: Options = { ...defaultOptions }
  options = opts.encoding ? { ...options, encoding: opts.encoding } : options
  options = opts.mode ? { ...options, mode: opts.mode } : options
  options = opts.flag ? { ...options, flag: opts.flag } : options
  return { ...options }
}

const fileAppendPromise = async (
  path: string,
  data: string,
  options?: Partial<WriteOptions>
) => {
  if (options && options.encoding) {
    fs.appendFile(path, data, prepareOptions(options))
    return
  }
  fs.appendFile(path, data)
}

export default fileAppendPromise
