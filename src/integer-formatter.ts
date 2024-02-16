import lodash from 'lodash'
import {
  IntegerFieldSpec,
  IntegerFieldValue,
  assertFieldSpec,
} from './Types.js'
import {
  getFillStringOfSymbol,
  getPadder,
  getPaddingPositionOrDef,
  getPaddingSymbol,
  isNumeric,
} from './utils.js'

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
    throw new Error('No value supplied and no default set')
  } else if (data === null) {
    num = ''
  } else {
    if (!isNumeric(data)) {
      throw new Error('field has not compatible type')
    }
    num = Math.round(data).toString()
    if (lodash.size(num) > map.size) {
      throw new Error(`Value ${num} exceed size ${map.size}`)
    }
  }

  return getPadder(
    getPaddingPositionOrDef(map.paddingPosition, paddingDefault)
  )(
    num,
    getFillStringOfSymbol(getPaddingSymbol(map.paddingSymbol))(
      map.size - lodash.size(num)
    )
  )
}

export default integerFormatter
