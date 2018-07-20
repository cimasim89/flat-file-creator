const stringFormatter = require('./string-formatter')
const _ = require('lodash')

describe('String formatter execution raise Exception', () => {
  it('If map is null', () => {
    expect(() => stringFormatter(null, null)).toThrow(
      'map is null or undefined'
    )
  })
  it('If map is not an object', () => {
    expect(() => stringFormatter('something', null)).toThrow(
      'map is not an object'
    )
  })

  it('If map object is empty', () => {
    expect(() => stringFormatter({}, null)).toThrow('map object is empty')
  })

  it('If field map object not contain size', () => {
    expect(() => stringFormatter({ paddingPosition: 'end' }, null)).toThrow(
      'map size is required'
    )
  })

  it('If data is not a string', () => {
    expect(() =>
      stringFormatter({ size: 10, name: 'someField', type: 0 }, 100)
    ).toThrow('field has not compatible type')
  })

  it('Size is less than 1', () => {
    expect(() =>
      stringFormatter({ size: 0, name: 'someField', type: 0 }, 100)
    ).toThrow('map size must be greater than 0')
  })

  it('If padding position is not allowed', () => {
    const paddingPosition = 'notvalidpad'
    expect(() =>
      stringFormatter({ size: 10, name: 'someField', paddingPosition }, '')
    ).toThrow(`padding position "${paddingPosition}" not allowed`)
  })

  it('If padding symbol is more of one char', () => {
    expect(() =>
      stringFormatter({ size: 10, name: 'someField', paddingSymbol: '@.@' }, '')
    ).toThrow('paddingSymbol cannot have length > 1')
  })
})

describe('String formatter execution result', () => {
  it("size 10 and data '', result lenght is 10 ", () => {
    expect(_.size(stringFormatter({ size: 10 }, ''))).toBe(10)
  })

  it("size 10 and long data 'somelongstring', result lenght is 10 ", () => {
    expect(_.size(stringFormatter({ size: 10 }, 'somelongstring'))).toBe(10)
  })

  it("size 10 and long data 'somelongstring', result is 'somelongst'", () => {
    expect(stringFormatter({ size: 10 }, 'somelongstring')).toBe('somelongst')
  })

  it("size 10 and same size data 'somestring', result lenght is 10 ", () => {
    expect(_.size(stringFormatter({ size: 10 }, 'somestring'))).toBe(10)
  })

  it("size 10 and same size data 'somestring', result is 'somestring'", () => {
    expect(stringFormatter({ size: 10 }, 'somestring')).toBe('somestring')
  })

  it("size 10 and spaced data 'str ing', result lenght is 10", () => {
    expect(_.size(stringFormatter({ size: 10 }, 'str ing'))).toBe(10)
  })

  it("size 10 and spaced data 'str ing', result is 'str ing   '", () => {
    expect(stringFormatter({ size: 10 }, 'str ing')).toBe('str ing   ')
  })

  it("paddingPosition 'start' data = 'str ing', result is '   str ing'", () => {
    expect(
      stringFormatter({ size: 10, paddingPosition: 'start' }, 'str ing')
    ).toBe('   str ing')
  })

  it("end paddingSymbol '@' data 'str ing', result is 'str ing@@@'", () => {
    expect(stringFormatter({ size: 10, paddingSymbol: '@' }, 'str ing')).toBe(
      'str ing@@@'
    )
  })

  it("start paddingSymbol '@' data 'str ing',result is '@@@str ing'", () => {
    expect(
      stringFormatter(
        { size: 10, paddingPosition: 'start', paddingSymbol: '@' },
        'str ing'
      )
    ).toBe('@@@str ing')
  })
})
