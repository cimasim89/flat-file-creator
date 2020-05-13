const dateFormatter = require('./date-formatter')
const _ = require('lodash')
const moment = require('moment')

describe('Date formatter execution raise Exception', () => {
  it('If map is null', () => {
    expect(() => dateFormatter(null, null)).toThrow('map is null or undefined')
  })

  it('If map is not an object', () => {
    expect(() => dateFormatter('something', null)).toThrow(
      'map is not an object'
    )
  })

  it('If map object is empty', () => {
    expect(() => dateFormatter({}, null)).toThrow('map object is empty')
  })

  it('If field map object not contain size', () => {
    expect(() => dateFormatter({ paddingPosition: 'end' }, null)).toThrow(
      'map size is required'
    )
  })

  it('If data is not a date', () => {
    const date = ''
    expect(() => dateFormatter({ size: 10, name: 'someField' }, date)).toThrow(
      `Invalid date ${date}`
    )
  })

  it('Size is less than 1', () => {
    expect(() => dateFormatter({ size: 0, name: 'someField' }, '')).toThrow(
      'map size must be greater than 0'
    )
  })

  it('If padding position is not allowed', () => {
    const date = new Date()
    const paddingPosition = 'notvalidpad'
    expect(() =>
      dateFormatter({ size: 50, name: 'someField', paddingPosition }, date)
    ).toThrow(`padding position "${paddingPosition}" not allowed`)
  })

  it('If padding symbol is more of one char', () => {
    const date = new Date()
    expect(() =>
      dateFormatter({ size: 50, name: 'someField', paddingSymbol: '@.@' }, date)
    ).toThrow('paddingSymbol cannot have length > 1')
  })
})

describe('String formatter execution result', () => {
  it('size 50 and new Date, result lenght is 50', () => {
    expect(_.size(dateFormatter({ size: 50 }, new Date()))).toBe(50)
  })

  it(
    "size 30 date '2018-01-01'," +
      " result iso string '2017-12-31T23:00:00.000Z      '",
    () => {
      expect(dateFormatter({ size: 30 }, '2018-01-01')).toBe(
        '2017-12-31T23:00:00.000Z      '
      )
    }
  )

  it(
    "size 24 date '2018-01-01'," +
      " result iso string '2017-12-31T23:00:00.000Z'",
    () => {
      expect(dateFormatter({ size: 24 }, '2018-01-01')).toBe(
        '2017-12-31T23:00:00.000Z'
      )
    }
  )

  it(
    "size 10, date '2018-01-01', utc true, dateFormat 'YYYY-MM-DD'," +
      " result iso string '2018-01-01'",
    () => {
      expect(
        dateFormatter(
          { size: 10, format: { dateFormat: 'YYYY-MM-DD' } },
          '2018-01-01'
        )
      ).toBe('2018-01-01')
    }
  )

  it(
    "size 10, date '2018-01-01', utc true, dateFormat 'YYYY-MM-DD'," +
      " result iso string '2017-12-31'",
    () => {
      expect(
        dateFormatter(
          { size: 10, format: { utc: true, dateFormat: 'YYYY-MM-DD' } },
          '2018-01-01'
        )
      ).toBe('2017-12-31')
    }
  )

  it(
    "size 20, date '2018-01-01', utc true, dateFormat 'YYYY-MM-DD HH:mm:ss'," +
      " result iso string '2017-12-31 23:00:00 '",
    () => {
      expect(
        dateFormatter(
          {
            size: 20,
            format: { utc: true, dateFormat: 'YYYY-MM-DD HH:mm:ss' },
          },
          '2018-01-01'
        )
      ).toBe('2017-12-31 23:00:00 ')
    }
  )

  it(
    "size 20, date '2018-01-01', utc true, dateFormat 'YYYY-MM-DD HH:mm:ss'," +
      " paddingSymbol '@'" +
      " result iso string '2017-12-31 23:00:00@'",
    () => {
      expect(
        dateFormatter(
          {
            size: 20,
            paddingSymbol: '@',
            format: { utc: true, dateFormat: 'YYYY-MM-DD HH:mm:ss' },
          },
          '2018-01-01'
        )
      ).toBe('2017-12-31 23:00:00@')
    }
  )

  it(
    "size 20, date '2018-01-01', utc true, dateFormat 'YYYY-MM-DD HH:mm:ss'," +
      " paddingSymbol '@', paddingPosition start" +
      " result iso string '@2017-12-31 23:00:00'",
    () => {
      expect(
        dateFormatter(
          {
            size: 20,
            paddingSymbol: '@',
            paddingPosition: 'start',
            format: { utc: true, dateFormat: 'YYYY-MM-DD HH:mm:ss' },
          },
          '2018-01-01'
        )
      ).toBe('@2017-12-31 23:00:00')
    }
  )

  it(
    "size 20, date moment() , dateFormat 'YYYY-MM-DD HH:mm:ss'," +
      " paddingSymbol '@', paddingPosition start" +
      " result iso string '@2017-12-31 23:00:00'",
    () => {
      const date = moment()
      expect(
        dateFormatter(
          {
            size: 20,
            paddingSymbol: '@',
            paddingPosition: 'start',
            format: { dateFormat: 'YYYY-MM-DD HH:mm:ss' },
          },
          date
        )
      ).toBe(`@${date.format('YYYY-MM-DD HH:mm:ss')}`)
    }
  )
})
