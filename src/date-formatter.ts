import _ from 'lodash'
import moment from 'moment'
import { DateFieldSpec, DateFieldValue, assertFieldSpec } from './Types.js'
import {
  getFillStringOfSymbol,
  getPadder,
  getPaddingPositionOrDef,
  getPaddingSymbol,
} from './utils.js'

const paddingDefault = 'end'
const defaultFormat = {
  utc: false,
}

const getFormattedDateString = (
  date: Date | moment.Moment | string,
  opts: Partial<NonNullable<DateFieldSpec['format']>>
) => {
  const base = moment(date)
  if (!base.isValid()) {
    throw new Error(`Invalid date ${date}`)
  }
  const convention = opts.utc ? base.utc() : base
  if (!opts.dateFormat) {
    return convention.toISOString()
  }
  return convention.format(opts.dateFormat)
}

function assertDateFieldValue(
  d: any,
  fieldName: string
): asserts d is DateFieldValue {
  if (
    d !== null &&
    typeof d !== 'undefined' &&
    typeof d !== 'string' &&
    typeof d.toISOString === 'undefined' &&
    typeof d.year === 'undefined'
  ) {
    throw new Error(
      `Value for date field ${fieldName} must be a date or a string representation of a date`
    )
  }
}

const dateFormatter = (map: DateFieldSpec, data: DateFieldValue) => {
  assertFieldSpec(map)

  // If the data is null or undefined and has a default value defined, use that, otherwise set
  // to incoming data
  data = data === undefined || data === null ? map.default : data

  let resDate: string

  if (data === undefined) {
    throw new Error('No value supplied and no default set')
  } else if (data === null) {
    resDate = ''
  } else {
    assertDateFieldValue(data, map.name)

    const format = { ...defaultFormat, ...map.format }
    resDate = data ? getFormattedDateString(data, format) : ''

    if (_.size(resDate) > map.size) {
      throw new Error(`Date ${resDate} exceed size ${map.size}`)
    }
  }

  return getPadder(
    getPaddingPositionOrDef(map.paddingPosition, paddingDefault)
  )(
    resDate,
    getFillStringOfSymbol(getPaddingSymbol(map.paddingSymbol))(
      map.size - _.size(resDate)
    )
  )
}

export default dateFormatter
