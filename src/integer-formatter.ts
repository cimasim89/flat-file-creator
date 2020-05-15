import * as _ from "lodash";
import {
  isNumeric,
  getPaddingPositionOrDef,
  getPaddingSymbol,
  getPadder,
  getFillStringOfSymbol,
} from './utils';
import { IntegerFieldSpec, FieldValue, assertFieldSpec } from "./Types";

const paddingDefault = 'start'

const integerFormatter = (map: IntegerFieldSpec, data: FieldValue = '') => {
  assertFieldSpec(map, "integer");
  if (!isNumeric(data)) throw new Error('field has not compatible type')
  const num = Math.round(data).toString()
  if (_.size(num) > map.size)
    throw new Error(`Value ${num} exceed size ${map.size}`)
  return getPadder(
    getPaddingPositionOrDef(map.paddingPosition, paddingDefault)
  )(
    num,
    getFillStringOfSymbol(getPaddingSymbol(map.paddingSymbol))(
      map.size - _.size(num)
    )
  )
}

export default integerFormatter;
