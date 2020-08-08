import * as _ from 'lodash'
import {
  isNumeric,
  getPaddingPositionOrDef,
  getPaddingSymbol,
  getPadder,
  getFillStringOfSymbol,
} from './utils'
import { FloatFieldSpec, FloatFieldValue, assertFieldSpec } from './Types'

const paddingDefault = 'start'

const floatFormatter = (map: FloatFieldSpec, data: FloatFieldValue = null) => {
  assertFieldSpec(map, 'float')

  // If the data is null or undefined and has a default value defined, use that, otherwise set
  // to incoming data
  data = data === undefined || data === null ? map.default : data

  let str: string

  if (data === undefined) {
    throw new Error(`No value supplied and no default set`)
  } else if (data === null) {
    str = ''
  } else {
    if (!isNumeric(data)) {
      throw new Error(`field [${map.name}] has not compatible type`)
    }
    const precision = !map.precision ? 0 : map.precision
    const num = data.toFixed(precision + 1)
    str = !map.dotNotation
      ? Math.trunc(Number(num) * Math.pow(10, precision)).toString()
      : data.toFixed(precision).toString()
    if (_.size(str) > map.size) {
      throw new Error(`Value ${str} exceed size ${map.size}`)
    }
  }

  return getPadder(
    getPaddingPositionOrDef(map.paddingPosition, paddingDefault)
  )(
    str,
    getFillStringOfSymbol(getPaddingSymbol(map.paddingSymbol))(
      map.size - _.size(str)
    )
  )
}

export default floatFormatter
