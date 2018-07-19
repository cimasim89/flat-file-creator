const { fieldFormatter } = require('./field-formatter')

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
})
