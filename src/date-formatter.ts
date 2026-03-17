import { parseISO, format, isValid } from 'date-fns'
import { formatInTimeZone } from 'date-fns-tz'
import * as _ from 'lodash'
import {
  getPaddingPositionOrDef,
  getPaddingSymbol,
  getPadder,
  getFillStringOfSymbol,
} from './utils'
import { DateFieldSpec, DateFieldValue, assertFieldSpec } from './types'

const paddingDefault = 'end'

const getFormattedDateString = (
  date: Date | string,
  opts: Partial<NonNullable<DateFieldSpec['format']>>,
) => {
  const parsed = typeof date === 'string' ? parseISO(date) : date
  if (!isValid(parsed)) {
    throw new Error(`Invalid date ${date}`)
  }
  if (!opts.dateFormat) {
    return parsed.toISOString()
  }
  if (opts.utc) {
    return formatInTimeZone(parsed, 'UTC', opts.dateFormat)
  }
  return format(parsed, opts.dateFormat)
}

function assertDateFieldValue(
  d: any,
  fieldName: string,
): asserts d is DateFieldValue {
  if (
    d !== null &&
    typeof d !== 'undefined' &&
    typeof d !== 'string' &&
    !(d instanceof Date)
  ) {
    throw new Error(
      `Value for date field ${fieldName} must be a date or a string representation of a date`,
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
    throw new Error(`No value supplied and no default set`)
  } else if (data === null) {
    resDate = ''
  } else {
    assertDateFieldValue(data, map.name)

    resDate = data ? getFormattedDateString(data, map.format || {}) : ''

    if (_.size(resDate) > map.size) {
      throw new Error(`Date ${resDate} exceed size ${map.size}`)
    }
  }

  return getPadder(
    getPaddingPositionOrDef(map.paddingPosition, paddingDefault),
  )(
    resDate,
    getFillStringOfSymbol(getPaddingSymbol(map.paddingSymbol))(
      map.size - _.size(resDate),
    ),
  )
}

export default dateFormatter
