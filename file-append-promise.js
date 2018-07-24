const fs = require('fs')

const appendCallbak = (resolve, reject) => err => {
  if (err) return reject(err)
  return resolve()
}

const fileAppendPromise = (path, data, options) =>
  new Promise((resolve, reject) => {
    if (options)
      return fs.appendFile(path, data, options, appendCallbak(resolve, reject))
    fs.appendFile(path, data, appendCallbak(resolve, reject))
  })

module.exports = fileAppendPromise
