const { makeAsyncFlatFileWriter } = require('./flat-file-writer')

describe('makeAsyncFlatFileWriter execution raise Exception', () => {
  // TODO
})

describe('makeAsyncFlatFileWriter', () => {
  it('returning a promise function', () => {
    expect(typeof makeAsyncFlatFileWriter(null)).toBe('function')
  })
})
