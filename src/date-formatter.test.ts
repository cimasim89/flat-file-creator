import dateFormatter from './date-formatter'
import * as _ from 'lodash'
import * as moment from 'moment'

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

describe('String formatter execution result', () => {
  it('size 50 and new Date, result lenght is 50', () => {
    expect(
      _.size(
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
})
