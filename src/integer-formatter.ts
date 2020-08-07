import * as _ from 'lodash'
import {
  isNumeric,
  getPaddingPositionOrDef,
  getPaddingSymbol,
  getPadder,
  getFillStringOfSymbol,
} from './utils'
import { IntegerFieldSpec, IntegerFieldValue, assertFieldSpec } from './Types'

const paddingDefault = 'start'

const integerFormatter = (
  map: IntegerFieldSpec,
  data: IntegerFieldValue = null
) => {
  assertFieldSpec(map, 'integer')

  // If the data is null or undefined and has a default value defined, use that, otherwise set
  // to incoming data
  data = data === undefined || data === null ? map.default : data

  let num: string

  if (data === undefined) {
    throw new Error(`No value supplied and no default set`)
  } else if (data === null) {
    num = ''
  } else {
    if (!isNumeric(data)) {
      throw new Error('field has not compatible type')
    }
    num = Math.round(data).toString()
    if (_.size(num) > map.size) {
      throw new Error(`Value ${num} exceed size ${map.size}`)
    }
  }

  return getPadder(
    getPaddingPositionOrDef(map.paddingPosition, paddingDefault)
  )(
    num,
    getFillStringOfSymbol(getPaddingSymbol(map.paddingSymbol))(
      map.size - _.size(num)
    )
  )
}

export default integerFormatter
