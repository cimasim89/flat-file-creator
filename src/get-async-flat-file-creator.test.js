const { getAsyncFlatFileCreator } = require('./get-async-flat-file-creator.js')

describe('makeAsyncFlatFileWriter', () => {
  it('returning a promise function', () => {
    expect(typeof getAsyncFlatFileCreator(null)).toBe('function')
  })
})
