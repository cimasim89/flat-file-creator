const integerFormatter = require('./integer-formatter')
const _ = require('lodash')

describe('Integer formatter execution raise Exception', () => {
  it('If map is null', () => {
    expect(() => integerFormatter(null, null)).toThrow(
      'map is null or undefined'
    )
  })

  it('If map is not an object', () => {
    expect(() => integerFormatter('something', null)).toThrow(
      'map is not an object'
    )
  })

  it('If map object is empty', () => {
    expect(() => integerFormatter({}, null)).toThrow('map object is empty')
  })

  it('If field map object not contain size', () => {
    expect(() => integerFormatter({ paddingPosition: 'end' }, null)).toThrow(
      'map size is required'
    )
  })

  it('Is size is less than 1', () => {
    expect(() => integerFormatter({ size: 0, name: 'someField' }, 100)).toThrow(
      'map size must be greater than 0'
    )
  })

  it('if length of number exceed size', () => {
    const size = 4
    const data = 100000
    expect(() => integerFormatter({ size, name: 'someField' }, data)).toThrow(
      `Value ${data} exceed size ${size}`
    )
  })

  it('If padding position is not allowed', () => {
    const paddingPosition = 'notvalidpad'
    expect(() =>
      integerFormatter({ size: 10, name: 'someField', paddingPosition }, 100)
    ).toThrow(`padding position "${paddingPosition}" not allowed`)
  })

  it('If padding symbol is more of one char', () => {
    expect(() =>
      integerFormatter(
        { size: 10, name: 'someField', paddingSymbol: '@.@' },
        100
      )
    ).toThrow('paddingSymbol cannot have length > 1')
  })

  it('If data is not an integer', () => {
    expect(() =>
      integerFormatter({ size: 10, name: 'someField', type: 0 }, 'somestring')
    ).toThrow('field has not compatible type')
  })
})

describe('Integer formatter execution result', () => {
  it('size 4 and data 10, result lenght is 4 ', () => {
    expect(_.size(integerFormatter({ size: 4 }, 10))).toBe(4)
  })

  it('size 4 and same size data 1000, result lenght is 4', () => {
    expect(_.size(integerFormatter({ size: 4 }, 1000))).toBe(4)
  })

  it("size 10 and same size data 1000, result is '1000'", () => {
    expect(integerFormatter({ size: 4 }, 1000)).toBe('1000')
  })

  it('size 10 and data 1000, result lenght is 10', () => {
    expect(_.size(integerFormatter({ size: 10 }, 1000))).toBe(10)
  })

  it('data is float 10.56666, result is rounded to 11', () => {
    expect(integerFormatter({ size: 4 }, 10.56666)).toBe('  11')
  })

  it("size 10 and data 1000, result is '      1000'", () => {
    expect(integerFormatter({ size: 10 }, 1000)).toBe('      1000')
  })

  it("paddingPosition 'start' data 1000, result is '      1000'", () => {
    expect(integerFormatter({ size: 10, paddingPosition: 'start' }, 1000)).toBe(
      '      1000'
    )
  })

  it("paddingPosition 'end' data 1000, result is '1000      '", () => {
    expect(integerFormatter({ size: 10, paddingPosition: 'end' }, 1000)).toBe(
      '1000      '
    )
  })

  it("paddingSymbol '@' data 1000, result is '@@@@@@1000'", () => {
    expect(integerFormatter({ size: 10, paddingSymbol: '@' }, 1000)).toBe(
      '@@@@@@1000'
    )
  })
  it("end paddingSymbol '@' data 1000,result is '1000@@@@@@'", () => {
    expect(
      integerFormatter(
        { size: 10, paddingPosition: 'end', paddingSymbol: '@' },
        1000
      )
    ).toBe('1000@@@@@@')
  })
})
