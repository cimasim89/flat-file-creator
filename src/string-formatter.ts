import * as _ from "lodash";
import {
  isNumeric,
  getPaddingPositionOrDef,
  getPaddingSymbol,
  getPadder,
  getFillStringOfSymbol,
} from './utils';
import { StringFieldSpec, FieldValue, assertFieldSpec } from "./Types";

const paddingDefault = 'end'

const stringFormatter = (map: StringFieldSpec, data: FieldValue = '') => {
  assertFieldSpec(map, "string");
  if (map.straight && isNumeric(data))
    throw new Error('field has not compatible type')
  const str = (map.preserveEmptySpace || map.perserveEmptySpace === undefined) ? data.toString() : data.toString().trim()
  return getPadder(
    getPaddingPositionOrDef(map.paddingPosition, paddingDefault)
  )(
    str.substring(0, map.size),
    getFillStringOfSymbol(getPaddingSymbol(map.paddingSymbol))(
      map.size - _.size(str)
    )
  )
}

export default stringFormatter;
