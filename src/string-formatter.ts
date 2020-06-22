import * as _ from 'lodash'
import {
  isNumeric,
  getPaddingPositionOrDef,
  getPaddingSymbol,
  getPadder,
  getFillStringOfSymbol,
} from './utils'
import { StringFieldSpec, FieldValue, assertFieldSpec } from './Types'
import { FlatFileEnumError } from './Errors'

const paddingDefault = 'end'

const stringFormatter = (map: StringFieldSpec, data: FieldValue = '') => {
  assertFieldSpec(map, 'string')
  if (map.straight && isNumeric(data)) {
    throw new Error('field has not compatible type')
  }

  // Set initial value
  let str = data === null ? '' : data.toString()

  // If we don't want to preserve white space, trim it now
  if (map.preserveEmptySpace || map.preserveEmptySpace === undefined) {
    str = str.trim()
  }

  // If this is an enum field, conver the value to serialized form
  if (data !== null && map.enum !== undefined) {
    // If we find the string in the values of the enum, convert it to a key
    let i = Object.values(map.enum).indexOf(str)
    if (i > -1) {
      str = Object.keys(map.enum)[i]
    } else {
      // Otherwise, check to see if it's among the keys of the enum
      i = Object.keys(map.enum).indexOf(str)
      if (i === -1) {
        // If not, throw an exception
        throw new FlatFileEnumError(
          `Value for field '${
            map.name
          }' should have been one of the accepted values ["${Object.values(
            map.enum
          ).join(`", "`)}"]${
            typeof map.default !== 'undefined' && map.default === null
              ? ` or null`
              : ``
          }, but you passed '${str}'`,
          map.name
        )
      }
    }
  }

  return getPadder(
    getPaddingPositionOrDef(map.paddingPosition, paddingDefault)
  )(
    str.substring(0, map.size),
    getFillStringOfSymbol(getPaddingSymbol(map.paddingSymbol))(
      map.size - _.size(str)
    )
  )
}

export default stringFormatter
