const fs = require('fs')

const appendCallbak = (resolve, reject) => err => {
  if (err) return reject(err)
  return resolve()
}

const defaultOptions = {
  encoding: 'utf8',
  mode: 0o666,
  flag: 'a'
}

const prepareOptions = ({ encoding, mode, flag }) => {
  let options = { ...defaultOptions }
  options = encoding ? { ...options, encoding } : options
  options = mode ? { ...options, mode } : options
  options = flag ? { ...options, flag } : options
  return { ...options }
}

const fileAppendPromise = (path, data, options) =>
  new Promise((resolve, reject) => {
    if (options && options.encoding)
      return fs.appendFile(
        path,
        data,
        prepareOptions(options),
        appendCallbak(resolve, reject)
      )
    fs.appendFile(path, data, appendCallbak(resolve, reject))
  })

module.exports = fileAppendPromise
