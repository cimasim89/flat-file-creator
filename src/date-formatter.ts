import * as moment from "moment";
import * as _ from "lodash";
import {
  getPaddingPositionOrDef,
  getPaddingSymbol,
  getPadder,
  getFillStringOfSymbol,
} from './utils';
import { DateFieldSpec, FieldValue, assertFieldSpec } from "./Types";

const paddingDefault = 'end'
const defaultFormat = {
  utc: false,
}

const getFormattedDateString = (date: Date | string, opts: Partial<NonNullable<DateFieldSpec["format"]>>) => {
  const base = moment(date)
  if (!base.isValid()) throw new Error(`Invalid date ${date}`)
  const convention = opts.utc ? base.utc() : base
  if (!opts.dateFormat) {
    return convention.toISOString()
  }
  return convention.format(opts.dateFormat)
}

function assertDate(d: any, fieldName: string): asserts d is Date | string {
  if (typeof d !== "string" && typeof d.toISOString === "undefined") {
    throw new Error(`Value for date field ${fieldName} must be a date or a string representation of a date`);
  }
}

const dateFormatter = (map: DateFieldSpec, data: FieldValue) => {
  assertFieldSpec(map);
  assertDate(data, map.name);

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
