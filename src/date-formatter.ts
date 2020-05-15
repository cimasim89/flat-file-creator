import * as moment from "moment";
import * as _ from "lodash";
import {
  isNumeric,
  getPaddingPositionOrDef,
  getPaddingSymbol,
  getPadder,
  getFillStringOfSymbol,
} from './utils';
import { FormatterOptions, DateFieldSpec, FieldValue, assertFieldSpec } from "./Types";

const paddingDefault = 'end'
const defaultFormat = {
  utc: false,
}

const getFormattedDateString = (date: Date, opts: FormatterOptions.Date["format"]) => {
  const base = moment(date)
  if (!base.isValid()) throw new Error(`Invalid date ${date}`)
  const convention = opts.utc ? base.utc() : base
  if (!opts.dateFormat) {
    return convention.toISOString()
  }
  return convention.format(opts.dateFormat)
}

const dateFormatter = (map: DateFieldSpec, data: FieldValue) => {
  assertFieldSpec(map);

  if (isNumeric(data)) throw new Error('field has not compatible type')
  const format = { ...defaultFormat, ...map.format }
  const resDate = getFormattedDateString(data, format)
  if (_.size(resDate) > map.size)
    throw new Error(`Date ${resDate} exceed size ${map.size}`)
  return getPadder(
    getPaddingPositionOrDef(map.paddingPosition, paddingDefault)
  )(
    resDate,
    getFillStringOfSymbol(getPaddingSymbol(map.paddingSymbol))(
      map.size - _.size(resDate)
    )
  )
}

export default dateFormatter;
