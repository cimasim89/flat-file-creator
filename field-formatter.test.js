const fieldFormatter = require('./field-formatter')
const _ = require('lodash')
const moment = require('moment')

describe('Field formatter execution raise Exception', () => {
  it('If field map is null', () => {
    expect(() => fieldFormatter(null, null)).toThrow(
      'fieldMap is null or undefined'
    )
  })

  it('If field map is not an object', () => {
    expect(() => fieldFormatter('something', null)).toThrow(
      'fieldMap is not an object'
    )
  })

  it('If field map object is empty', () => {
    expect(() => fieldFormatter({}, null)).toThrow('fieldMap object is empty')
  })

  it('If field map object not contain name', () => {
    expect(() => fieldFormatter({ size: 10, type: 'string' }, null)).toThrow(
      'map field name is required'
    )
  })

  it('If field map object not contain size', () => {
    expect(() =>
      fieldFormatter({ name: 'someField', type: 'string' }, null)
    ).toThrow('map size is required')
  })

  it('If field map type is numeric', () => {
    expect(() =>
      fieldFormatter({ size: 10, name: 'someField', type: 0 }, null)
    ).toThrow('map field type not could be numeric')
  })

  it('If field map size is less or equal 0', () => {
    expect(() =>
      fieldFormatter({ size: 0, type: 'string', name: 'someField' }, null)
    ).toThrow('map size must be great than 0')
  })

  it('If field map type not exists', () => {
    expect(() =>
      fieldFormatter(
        { size: 10, type: 'notexistinftype', name: 'someField' },
        null
      )
    ).toThrow('required field type is not present')
  })

  it('if type not selected passed integer', () => {
    expect(() =>
      fieldFormatter({ name: 'test', size: 4 }, { test: 10 })
    ).toThrow('field has not compatible type')
  })
})

describe('Field formatter String execution result', () => {
  it('size 4, result lenght is 4 ', () => {
    expect(
      _.size(fieldFormatter({ name: 'test', size: 4 }, { test: 'hello' }))
    ).toBe(4)
  })

  it('size 10, result is', () => {
    expect(
      fieldFormatter(
        { name: 'test', size: 10, type: 'string' },
        { test: 'hello' }
      )
    ).toBe('hello     ')
  })
})

describe('Field formatter Float execution result', () => {
  it('size 4, result lenght is 4 ', () => {
    expect(
      _.size(
        fieldFormatter(
          { name: 'test', size: 4, type: 'float', precision: 2 },
          { test: 10.4 }
        )
      )
    ).toBe(4)
  })

  it('size 4 precision 2, result is 1040 ', () => {
    expect(
      fieldFormatter(
        { name: 'test', size: 4, type: 'float', precision: 2 },
        { test: 10.4 }
      )
    ).toBe('1040')
  })
})

describe('Field formatter Date execution result', () => {
  it('size 10, result lenght is 10 utc', () => {
    expect(
      _.size(
        fieldFormatter(
          {
            name: 'test',
            size: 10,
            type: 'date',
            format: { utc: true, dateFormat: 'YYYY/MM/DD' }
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
      fieldFormatter(
        {
          name: 'test',
          size: 25,
          type: 'date',
          format: { utc: false, dateFormat: format }
        },
        { test: date }
      )
    ).toBe(result)
  })
})

describe('Field formatter Integer execution result', () => {
  it('size 10, result lenght is 10', () => {
    expect(
      _.size(
        fieldFormatter(
          {
            name: 'test',
            size: 10,
            type: 'integer'
          },
          { test: 10000 }
        )
      )
    ).toBe(10)
  })

  it("size 10, result is ' 1000'", () => {
    expect(
      fieldFormatter(
        {
          name: 'test',
          size: 5,
          type: 'integer'
        },
        { test: 1000 }
      )
    ).toBe(' 1000')
  })

  it("size 10 end padded with #, result is '1000#'", () => {
    expect(
      fieldFormatter(
        {
          name: 'test',
          size: 5,
          type: 'integer',
          paddingPosition: 'end',
          paddingSymbol: '#'
        },
        { test: 1000 }
      )
    ).toBe('1000#')
  })
})
