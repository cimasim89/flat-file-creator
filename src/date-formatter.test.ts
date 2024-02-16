import lodash from 'lodash'
import moment from 'moment'
import { describe, expect, it, test } from 'vitest'
import dateFormatter from './date-formatter.js'

// Version of dateFormatter with type-checking turned off to test runtime functionality
const rtDateFormatter: any = dateFormatter

describe('Date formatter execution raise Exception', () => {
  it('If map is null', () => {
    expect(() => rtDateFormatter(null, null)).toThrow(
      'map is null or undefined'
    )
  })

  it('If map is not an object', () => {
    expect(() => rtDateFormatter('something', null)).toThrow(
      'map is not an object'
    )
  })

  it('If map object is empty', () => {
    expect(() => rtDateFormatter({}, null)).toThrow('map object is empty')
  })

  it('If field map object not contain size', () => {
    expect(() =>
      rtDateFormatter({ name: 'test', paddingPosition: 'end' }, null)
    ).toThrow('map size is required')
  })

  it('If data is not a date', () => {
    const date = 'richard pryor'
    expect(() =>
      rtDateFormatter({ size: 10, name: 'someField' }, date)
    ).toThrow(`Invalid date ${date}`)
  })

  it('Size is less than 1', () => {
    expect(() => rtDateFormatter({ size: 0, name: 'someField' }, '')).toThrow(
      'map size must be greater than 0'
    )
  })

  it('If padding position is not allowed', () => {
    const date = new Date()
    const paddingPosition = 'notvalidpad'
    expect(() =>
      rtDateFormatter({ size: 50, name: 'someField', paddingPosition }, date)
    ).toThrow(`padding position "${paddingPosition}" not allowed`)
  })

  it('If padding symbol is more of one char', () => {
    const date = new Date()
    expect(() =>
      rtDateFormatter(
        { size: 50, name: 'someField', paddingSymbol: '@.@' },
        date
      )
    ).toThrow('paddingSymbol cannot have length > 1')
  })
})

describe('Date formatter execution result', () => {
  it('size 50 and new Date, result length is 50', () => {
    expect(
      lodash.size(
        rtDateFormatter(
          { size: 50, name: 'someField', type: 'date' },
          new Date()
        )
      )
    ).toBe(50)
  })

  it(
    "size 30 date '2018-01-01'," +
      " result iso string '2018-01-01T00:00:00.000Z      '",
    () => {
      expect(
        rtDateFormatter(
          { size: 30, name: 'someField', type: 'date' },
          '2018-01-01'
        )
      ).toBe('2018-01-01T00:00:00.000Z      ')
    }
  )

  it(
    "size 24 date '2018-01-01'," +
      " result iso string '2018-01-01T00:00:00.000Z'",
    () => {
      expect(
        rtDateFormatter(
          { size: 24, name: 'someField', type: 'date' },
          '2018-01-01'
        )
      ).toBe('2018-01-01T00:00:00.000Z')
    }
  )

  it(
    "size 10, date '2018-01-01', utc true, dateFormat 'YYYY-MM-DD'," +
      " result iso string '2018-01-01'",
    () => {
      expect(
        rtDateFormatter(
          {
            size: 10,
            format: { dateFormat: 'YYYY-MM-DD' },
            name: 'someField',
            type: 'date',
          },
          '2018-01-01'
        )
      ).toBe('2018-01-01')
    }
  )

  it(
    "size 10, date '2018-01-01', utc true, dateFormat 'YYYY-MM-DD'," +
      " result iso string '2018-01-01'",
    () => {
      expect(
        rtDateFormatter(
          {
            size: 10,
            format: { utc: true, dateFormat: 'YYYY-MM-DD' },
            name: 'someField',
            type: 'date',
          },
          '2018-01-01'
        )
      ).toBe('2018-01-01')
    }
  )

  it(
    "size 20, date '2018-01-01', utc true, dateFormat 'YYYY-MM-DD HH:mm:ss'," +
      " result iso string '2018-01-01 00:00:00 '",
    () => {
      expect(
        rtDateFormatter(
          {
            size: 20,
            format: { utc: true, dateFormat: 'YYYY-MM-DD HH:mm:ss' },
            name: 'someField',
            type: 'date',
          },
          '2018-01-01'
        )
      ).toBe('2018-01-01 00:00:00 ')
    }
  )

  it(
    "size 20, date '2018-01-01', utc true, dateFormat 'YYYY-MM-DD HH:mm:ss'," +
      " paddingSymbol '@'" +
      " result iso string '2018-01-01 00:00:00@'",
    () => {
      expect(
        rtDateFormatter(
          {
            size: 20,
            paddingSymbol: '@',
            format: { utc: true, dateFormat: 'YYYY-MM-DD HH:mm:ss' },
            name: 'someField',
            type: 'date',
          },
          '2018-01-01'
        )
      ).toBe('2018-01-01 00:00:00@')
    }
  )

  it(
    "size 20, date '2018-01-01', utc true, dateFormat 'YYYY-MM-DD HH:mm:ss'," +
      " paddingSymbol '@', paddingPosition start" +
      " result iso string '@2018-01-01 00:00:00'",
    () => {
      expect(
        rtDateFormatter(
          {
            size: 20,
            paddingSymbol: '@',
            paddingPosition: 'start',
            format: { utc: true, dateFormat: 'YYYY-MM-DD HH:mm:ss' },
            name: 'someField',
            type: 'date',
          },
          '2018-01-01'
        )
      ).toBe('@2018-01-01 00:00:00')
    }
  )

  it(
    "size 20, date moment() , dateFormat 'YYYY-MM-DD HH:mm:ss'," +
      " paddingSymbol '@', paddingPosition start" +
      " result iso string '@2018-01-01 00:00:00'",
    () => {
      const date = moment()
      expect(
        rtDateFormatter(
          {
            size: 20,
            paddingSymbol: '@',
            paddingPosition: 'start',
            format: { dateFormat: 'YYYY-MM-DD HH:mm:ss' },
            name: 'someField',
            type: 'date',
          },
          date
        )
      ).toBe(`@${date.format('YYYY-MM-DD HH:mm:ss')}`)
    }
  )

  const t = [0, 1]
  t.map((n) => {
    const v = n === 0 ? null : undefined
    test(`uses default when set and given '${v}' as value`, () => {
      expect(
        rtDateFormatter(
          {
            size: 20,
            paddingSymbol: '@',
            paddingPosition: 'start',
            format: { dateFormat: 'YYYY-MM-DD HH:mm:ss' },
            name: 'someField',
            type: 'date',
            default: '2020-01-01 08:00:00',
          },
          v
        )
      ).toBe('@2020-01-01 08:00:00')
    })
  })

  t.map((n) => {
    const v = n === 0 ? null : undefined
    test(`throws error when '${v}' given as value and no default set`, () => {
      expect(() => {
        rtDateFormatter(
          {
            size: 20,
            paddingSymbol: '@',
            paddingPosition: 'start',
            format: { dateFormat: 'YYYY-MM-DD HH:mm:ss' },
            name: 'someField',
            type: 'date',
          },
          v
        )
      }).toThrow('No value supplied and no default set')
    })
  })

  test('supplies empty string when default is null', () => {
    expect(
      rtDateFormatter(
        {
          size: 5,
          paddingSymbol: '@',
          paddingPosition: 'start',
          format: { dateFormat: 'YYYY-MM-DD HH:mm:ss' },
          name: 'someField',
          type: 'date',
          default: null,
        },
        null
      )
    ).toBe('@@@@@')
  })
})
