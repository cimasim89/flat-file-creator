import integerFormatter from './integer-formatter'
import * as _ from 'lodash'

// Version of formatter with type-checking turned off to test runtime functionality
const rtIntegerFormatter: any = integerFormatter

describe('Integer formatter execution raise Exception', () => {
  it('If map is null', () => {
    expect(() => rtIntegerFormatter(null, null)).toThrow(
      'map is null or undefined'
    )
  })

  it('If map is not an object', () => {
    expect(() => rtIntegerFormatter('something', null)).toThrow(
      'map is not an object'
    )
  })

  it('If map object is empty', () => {
    expect(() => rtIntegerFormatter({}, null)).toThrow('map object is empty')
  })

  it('If field map object not contain size', () => {
    expect(() =>
      rtIntegerFormatter({ paddingPosition: 'end', name: 'someField' }, null)
    ).toThrow('map size is required')
  })

  it('Is size is less than 1', () => {
    expect(() =>
      rtIntegerFormatter({ size: 0, name: 'someField' }, 100)
    ).toThrow('map size must be greater than 0')
  })

  it('if length of number exceed size', () => {
    const size = 4
    const data = 100000
    expect(() =>
      rtIntegerFormatter({ size, name: 'someField', type: 'integer' }, data)
    ).toThrow(`Value ${data} exceed size ${size}`)
  })

  it('If padding position is not allowed', () => {
    const paddingPosition = 'notvalidpad'
    expect(() =>
      rtIntegerFormatter(
        { size: 10, name: 'someField', paddingPosition, type: 'integer' },
        100
      )
    ).toThrow(`padding position "${paddingPosition}" not allowed`)
  })

  it('If padding symbol is more of one char', () => {
    expect(() =>
      rtIntegerFormatter(
        { size: 10, name: 'someField', paddingSymbol: '@.@', type: 'integer' },
        100
      )
    ).toThrow('paddingSymbol cannot have length > 1')
  })

  it('If data is not an integer', () => {
    expect(() =>
      rtIntegerFormatter({ size: 10, name: 'someField', type: 0 }, 'somestring')
    ).toThrow('map field [someField] type not could be numeric')
  })
})

describe('Integer formatter execution result', () => {
  it('size 4 and data 10, result lenght is 4 ', () => {
    expect(
      _.size(
        rtIntegerFormatter({ size: 4, name: 'someField', type: 'integer' }, 10)
      )
    ).toBe(4)
  })

  it('size 4 and same size data 1000, result lenght is 4', () => {
    expect(
      _.size(
        rtIntegerFormatter(
          { size: 4, name: 'someField', type: 'integer' },
          1000
        )
      )
    ).toBe(4)
  })

  it("size 10 and same size data 1000, result is '1000'", () => {
    expect(
      rtIntegerFormatter({ size: 4, name: 'someField', type: 'integer' }, 1000)
    ).toBe('1000')
  })

  it('size 10 and data 1000, result lenght is 10', () => {
    expect(
      _.size(
        rtIntegerFormatter(
          { size: 10, name: 'someField', type: 'integer' },
          1000
        )
      )
    ).toBe(10)
  })

  it('data is float 10.56666, result is rounded to 11', () => {
    expect(
      rtIntegerFormatter(
        { size: 4, name: 'someField', type: 'integer' },
        10.56666
      )
    ).toBe('  11')
  })

  it("size 10 and data 1000, result is '      1000'", () => {
    expect(
      rtIntegerFormatter({ size: 10, name: 'someField', type: 'integer' }, 1000)
    ).toBe('      1000')
  })

  it("paddingPosition 'start' data 1000, result is '      1000'", () => {
    expect(
      rtIntegerFormatter(
        {
          size: 10,
          paddingPosition: 'start',
          name: 'someField',
          type: 'integer',
        },
        1000
      )
    ).toBe('      1000')
  })

  it("paddingPosition 'end' data 1000, result is '1000      '", () => {
    expect(
      rtIntegerFormatter(
        {
          size: 10,
          paddingPosition: 'end',
          name: 'someField',
          type: 'integer',
        },
        1000
      )
    ).toBe('1000      ')
  })

  it("paddingSymbol '@' data 1000, result is '@@@@@@1000'", () => {
    expect(
      rtIntegerFormatter(
        { size: 10, paddingSymbol: '@', name: 'someField', type: 'integer' },
        1000
      )
    ).toBe('@@@@@@1000')
  })
  it("end paddingSymbol '@' data 1000,result is '1000@@@@@@'", () => {
    expect(
      rtIntegerFormatter(
        {
          size: 10,
          paddingPosition: 'end',
          paddingSymbol: '@',
          name: 'someField',
          type: 'integer',
        },
        1000
      )
    ).toBe('1000@@@@@@')
  })
})
