import floatFormatter from './float-formatter'
import * as _ from 'lodash'

// Version of formatter with type-checking turned off to test runtime functionality
const rtFloatFormatter: any = floatFormatter

describe('Float formatter execution raise Exception', () => {
  it('If map is null', () => {
    expect(() => rtFloatFormatter(null, null)).toThrow(
      'map is null or undefined'
    )
  })

  it('If map is not an object', () => {
    expect(() => rtFloatFormatter('something', null)).toThrow(
      'map is not an object'
    )
  })

  it('If map object is empty', () => {
    expect(() => rtFloatFormatter({}, null)).toThrow('map object is empty')
  })

  it('If field map object not contain size', () => {
    expect(() =>
      rtFloatFormatter(
        { name: 'test', paddingPosition: 'end', precision: 2 },
        null
      )
    ).toThrow('map size is required')
  })

  it('Is size is less than 1', () => {
    expect(() =>
      rtFloatFormatter({ size: 0, name: 'someField', precision: 2 }, 100)
    ).toThrow('map size must be greater than 0')
  })

  it('precision must be specified', () => {
    expect(() =>
      rtFloatFormatter({ size: 10, name: 'someField', type: 'float' }, 100)
    ).toThrow('float precision must be specified')
  })

  it('if length of number exceed size', () => {
    const size = 4
    const data = 100.0
    const precision = 2
    const res = data * Math.pow(10, precision)
    expect(() =>
      rtFloatFormatter(
        { size, name: 'someField', precision, type: 'float' },
        data
      )
    ).toThrow(`Value ${res} exceed size ${size}`)
  })

  it('If padding position is not allowed', () => {
    const paddingPosition = 'notvalidpad'
    expect(() =>
      rtFloatFormatter(
        {
          size: 10,
          name: 'someField',
          paddingPosition,
          precision: 2,
          type: 'float',
        },
        100
      )
    ).toThrow(`padding position "${paddingPosition}" not allowed`)
  })

  it('If padding symbol is more of one char', () => {
    expect(() =>
      rtFloatFormatter(
        {
          size: 10,
          name: 'someField',
          paddingSymbol: '@.@',
          precision: 2,
          type: 'float',
        },
        100
      )
    ).toThrow('paddingSymbol cannot have length > 1')
  })

  it('If data is not numeric', () => {
    expect(() =>
      rtFloatFormatter(
        { size: 10, name: 'someField', precision: 2, type: 'float' },
        'somestring'
      )
    ).toThrow('field [someField] has not compatible type')
  })
})

describe('Float formatter execution result', () => {
  it('size 4 and data 10, result lenght is 4 ', () => {
    expect(
      _.size(
        rtFloatFormatter(
          { size: 4, precision: 0, name: 'test', type: 'float' },
          10
        )
      )
    ).toBe(4)
  })

  it('size 4 precision 2 data 10.05, result lenght is 4', () => {
    expect(
      _.size(
        rtFloatFormatter(
          { size: 4, precision: 2, name: 'test', type: 'float' },
          10.05
        )
      )
    ).toBe(4)
  })

  it("size 4 precision 3 data 10.0156, result is '10015'", () => {
    expect(
      rtFloatFormatter(
        { size: 5, precision: 3, name: 'test', type: 'float' },
        10.0156
      )
    ).toBe('10015')
  })

  it('size 10 precision 3 data 10.05555, result lenght is 10', () => {
    expect(
      _.size(
        rtFloatFormatter(
          { size: 10, precision: 3, name: 'test', type: 'float' },
          10.05555
        )
      )
    ).toBe(10)
  })

  it("size 10 precision 2 data 10.05), result is ''", () => {
    expect(
      rtFloatFormatter(
        { size: 10, precision: 2, name: 'test', type: 'float' },
        10.05
      )
    ).toBe('      1005')
  })

  it("paddingPosition 'start' data 10.0123, result is '      1000'", () => {
    expect(
      rtFloatFormatter(
        {
          size: 10,
          paddingPosition: 'start',
          precision: 0,
          name: 'test',
          type: 'float',
        },
        10.0123
      )
    ).toBe('        10')
  })

  it("paddingPosition 'end' data 10.0123, result is '1001      '", () => {
    expect(
      rtFloatFormatter(
        {
          size: 10,
          paddingPosition: 'end',
          precision: 2,
          name: 'test',
          type: 'float',
        },
        10.0123
      )
    ).toBe('1001      ')
  })

  it("paddingSymbol '@' data 10.0123, result is '@@@@@10123'", () => {
    expect(
      rtFloatFormatter(
        {
          size: 10,
          precision: 3,
          paddingSymbol: '@',
          name: 'test',
          type: 'float',
        },
        10.0123
      )
    ).toBe('@@@@@10012')
  })

  it("end paddingSymbol '@' data 10.0123,result is '100123@@@@@'", () => {
    expect(
      rtFloatFormatter(
        {
          size: 10,
          paddingPosition: 'end',
          paddingSymbol: '@',
          precision: 3,
          name: 'test',
          type: 'float',
        },
        10.0123
      )
    ).toBe('10012@@@@@')
  })

  it("data 10.0123 size 10 dotNotation ,result is '    10.012'", () => {
    expect(
      rtFloatFormatter(
        {
          size: 10,
          dotNotation: true,
          precision: 3,
          name: 'test',
          type: 'float',
        },
        10.0123
      )
    ).toBe('    10.012')
  })
})
