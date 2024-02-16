import lodash from 'lodash'
import moment from 'moment'
import { describe, expect, it } from 'vitest'
import fieldFormatter from './field-formatter.js'

// Version of fieldFormatter with type-checking turned off to test runtime functionality
const rtFieldFormatter: any = fieldFormatter

describe('Field formatter execution raise Exception', () => {
  it('If field map is null', () => {
    expect(() => rtFieldFormatter(null, null)).toThrow(
      'map is null or undefined'
    )
  })

  it('If field map is not an object', () => {
    expect(() => rtFieldFormatter('something', null)).toThrow(
      'map is not an object'
    )
  })

  it('If field map object is empty', () => {
    expect(() => rtFieldFormatter({}, null)).toThrow('map object is empty')
  })

  it('If field map object not contain name', () => {
    expect(() => rtFieldFormatter({ size: 10, type: 'string' }, null)).toThrow(
      'map field name is required'
    )
  })

  it('If field map object not contain size', () => {
    expect(() =>
      rtFieldFormatter({ name: 'someField', type: 'string' }, null)
    ).toThrow('map size is required')
  })

  it('If field map type is numeric', () => {
    expect(() =>
      rtFieldFormatter({ size: 10, name: 'someField', type: 0 }, null)
    ).toThrow('map field [someField] type not could be numeric')
  })

  it('If field map size is less or equal 0', () => {
    expect(() =>
      rtFieldFormatter({ size: 0, type: 'string', name: 'someField' }, null)
    ).toThrow('map size must be greater than 0')
  })

  it('If field map type not exists', () => {
    expect(() =>
      rtFieldFormatter(
        { size: 10, type: 'notexistinftype', name: 'someField' },
        null
      )
    ).toThrow('required field type is not present')
  })

  it('if type not selected with straight passed integer', () => {
    expect(() =>
      rtFieldFormatter({ name: 'test', size: 4, straight: true }, { test: 10 })
    ).toThrow('field has not compatible type')
  })
})

describe('Field formatter String execution result', () => {
  it('size 4, result length is 4 ', () => {
    expect(
      lodash.size(
        rtFieldFormatter({ name: 'test', size: 4 }, { test: 'hello' })
      )
    ).toBe(4)
  })

  it('size 10, result is', () => {
    expect(
      rtFieldFormatter(
        { name: 'test', size: 10, type: 'string' },
        { test: 'hello' }
      )
    ).toBe('hello     ')
  })
})

describe('Field formatter Float execution result', () => {
  it('size 4, result length is 4 ', () => {
    expect(
      lodash.size(
        rtFieldFormatter(
          { name: 'test', size: 4, type: 'float', precision: 2 },
          { test: 10.4 }
        )
      )
    ).toBe(4)
  })

  it('size 4 precision 2, result is 1040 ', () => {
    expect(
      rtFieldFormatter(
        { name: 'test', size: 4, type: 'float', precision: 2 },
        { test: 10.4 }
      )
    ).toBe('1040')
  })
})

describe('Field formatter Date execution result', () => {
  it('size 10, result length is 10 utc', () => {
    expect(
      lodash.size(
        rtFieldFormatter(
          {
            name: 'test',
            size: 10,
            type: 'date',
            format: { utc: true, dateFormat: 'YYYY/MM/DD' },
          },
          { test: moment() }
        )
      )
    ).toBe(10)
  })

  it('size 10, result is 10', () => {
    const date = moment()
    const format = 'YYYY/MM/DD HH:mm:ss'
    const result = `${date.format(format)}      `
    expect(
      rtFieldFormatter(
        {
          name: 'test',
          size: 25,
          type: 'date',
          format: { utc: false, dateFormat: format },
        },
        { test: date }
      )
    ).toBe(result)
  })
})

describe('Field formatter Integer execution result', () => {
  it('size 10, result length is 10', () => {
    expect(
      lodash.size(
        rtFieldFormatter(
          {
            name: 'test',
            size: 10,
            type: 'integer',
          },
          { test: 10000 }
        )
      )
    ).toBe(10)
  })

  it("size 10, result is ' 1000'", () => {
    expect(
      rtFieldFormatter(
        {
          name: 'test',
          size: 5,
          type: 'integer',
        },
        { test: 1000 }
      )
    ).toBe(' 1000')
  })

  it("size 10 end padded with #, result is '1000#'", () => {
    expect(
      rtFieldFormatter(
        {
          name: 'test',
          size: 5,
          type: 'integer',
          paddingPosition: 'end',
          paddingSymbol: '#',
        },
        { test: 1000 }
      )
    ).toBe('1000#')
  })
})
