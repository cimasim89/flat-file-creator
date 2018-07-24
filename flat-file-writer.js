const fileAppendPromise = require('./file-append-promise')
const rowFormatter = require('./row-formatter')

const rowWriterMapper = (maps, path, options) => data =>
  fileAppendPromise(path, rowFormatter(maps, data, options))

const makeAsyncFlatFileWriter = (maps, options) => (data, path) =>
  Promise.all(data.map(rowWriterMapper(maps, path, options)))

module.exports = { makeAsyncFlatFileWriter }
