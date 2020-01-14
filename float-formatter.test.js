const floatFormatter = require('./float-formatter')
const _ = require('lodash')

describe('Float formatter execution raise Exception', () => {
  it('If map is null', () => {
    expect(() => floatFormatter(null, null)).toThrow('map is null or undefined')
  })

  it('If map is not an object', () => {
    expect(() => floatFormatter('something', null)).toThrow(
      'map is not an object'
    )
  })

  it('If map object is empty', () => {
    expect(() => floatFormatter({}, null)).toThrow('map object is empty')
  })

  it('If field map object not contain size', () => {
    expect(() =>
      floatFormatter({ paddingPosition: 'end', precision: 2 }, null)
    ).toThrow('map size is required')
  })

  it('Is size is less than 1', () => {
    expect(() =>
      floatFormatter({ size: 0, name: 'someField', precision: 2 }, 100)
    ).toThrow('map size must be greater than 0')
  })

  it('precision must be specified', () => {
    expect(() => floatFormatter({ size: 10, name: 'someField' }, 100)).toThrow(
      'float precision must be specified'
    )
  })

  it('if length of number exceed size', () => {
    const size = 4
    const data = 100.0
    const precision = 2
    const res = data * Math.pow(10, precision)
    expect(() =>
      floatFormatter({ size, name: 'someField', precision }, data)
    ).toThrow(`Value ${res} exceed size ${size}`)
  })

  it('If padding position is not allowed', () => {
    const paddingPosition = 'notvalidpad'
    expect(() =>
      floatFormatter(
        { size: 10, name: 'someField', paddingPosition, precision: 2 },
        100
      )
    ).toThrow(`padding position "${paddingPosition}" not allowed`)
  })

  it('If padding symbol is more of one char', () => {
    expect(() =>
      floatFormatter(
        { size: 10, name: 'someField', paddingSymbol: '@.@', precision: 2 },
        100
      )
    ).toThrow('paddingSymbol cannot have length > 1')
  })

  it('If data is not numeric', () => {
    expect(() =>
      floatFormatter(
        { size: 10, name: 'someField', precision: 2 },
        'somestring'
      )
    ).toThrow('field [someField] has not compatible type')
  })
})

describe('Float formatter execution result', () => {
  it('size 4 and data 10, result lenght is 4 ', () => {
    expect(_.size(floatFormatter({ size: 4, precision: 0 }, 10))).toBe(4)
  })

  it('size 4 precision 2 data 10.05, result lenght is 4', () => {
    expect(_.size(floatFormatter({ size: 4, precision: 2 }, 10.05))).toBe(4)
  })

  it("size 4 precision 3 data 10.0156, result is '10015'", () => {
    expect(floatFormatter({ size: 5, precision: 3 }, 10.0156)).toBe('10015')
  })

  it('size 10 precision 3 data 10.05555, result lenght is 10', () => {
    expect(_.size(floatFormatter({ size: 10, precision: 3 }, 10.05555))).toBe(
      10
    )
  })

  it("size 10 precision 2 data 10.05), result is ''", () => {
    expect(floatFormatter({ size: 10, precision: 2 }, 10.05)).toBe('      1005')
  })

  it("paddingPosition 'start' data 10.0123, result is '      1000'", () => {
    expect(
      floatFormatter(
        { size: 10, paddingPosition: 'start', precision: 0 },
        10.0123
      )
    ).toBe('        10')
  })

  it("paddingPosition 'end' data 10.0123, result is '1001      '", () => {
    expect(
      floatFormatter(
        { size: 10, paddingPosition: 'end', precision: 2 },
        10.0123
      )
    ).toBe('1001      ')
  })

  it("paddingSymbol '@' data 10.0123, result is '@@@@@10123'", () => {
    expect(
      floatFormatter({ size: 10, precision: 3, paddingSymbol: '@' }, 10.0123)
    ).toBe('@@@@@10012')
  })

  it("end paddingSymbol '@' data 10.0123,result is '100123@@@@@'", () => {
    expect(
      floatFormatter(
        { size: 10, paddingPosition: 'end', paddingSymbol: '@', precision: 3 },
        10.0123
      )
    ).toBe('10012@@@@@')
  })

  it("data 10.0123 size 10 dotNotation ,result is '    10.012'", () => {
    expect(
      floatFormatter({ size: 10, dotNotation: true, precision: 3 }, 10.0123)
    ).toBe('    10.012')
  })
})
