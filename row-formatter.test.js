const rowFormatter = require('./row-formatter')

describe('row formatter execution exceptions', () => {
  it('If mapper not is an array throw exception', () => {
    expect(() => rowFormatter('', '')).toThrow(/array/)
  })

  it('If mapper array is empty throw exception', () => {
    expect(() => rowFormatter([], '')).toThrow(/empty/)
  })

  it('If data is null throw exception', () => {
    expect(() => rowFormatter([{}], '')).toThrow('data is null')
  })

  it('If data is not an object throw exception', () => {
    expect(() => rowFormatter([{}], 'some string')).toThrow(
      'data is not an object'
    )
  })
})
