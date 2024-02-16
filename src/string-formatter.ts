import lodash from 'lodash'
import { FlatFileEnumError } from './Errors.js'
import { StringFieldSpec, StringFieldValue, assertFieldSpec } from './Types.js'
import {
  getFillStringOfSymbol,
  getPadder,
  getPaddingPositionOrDef,
  getPaddingSymbol,
  isNumeric,
} from './utils.js'

const paddingDefault = 'end'

const stringFormatter = (map: StringFieldSpec, data: StringFieldValue) => {
  assertFieldSpec(map, 'string')
  if (map.straight && isNumeric(data)) {
    throw new Error('field has not compatible type')
  }

  // If the data is null or undefined and has a default value defined, use that, otherwise set
  // to incoming data
  data = data === undefined || data === null ? map.default : data

  let str: string

  if (data === undefined) {
    throw new Error('No value supplied and no default set')
  } else if (data === null) {
    str = ''
  } else {
    str = data
    // If we don't want to preserve white space, trim it now
    if (!map.preserveEmptySpace) {
      str = str.trim()
    }

    // If this is an enum field, convert the value to serialized form
    if (map.enum !== undefined) {
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
            ).join('", "')}"]${
              typeof map.default !== 'undefined' && map.default === null
                ? ' or null'
                : ''
            }, but you passed '${str}'`,
            map.name
          )
        }
      }
    }
  }

  return getPadder(
    getPaddingPositionOrDef(map.paddingPosition, paddingDefault)
  )(
    str.substring(0, map.size),
    getFillStringOfSymbol(getPaddingSymbol(map.paddingSymbol))(
      map.size - lodash.size(str)
    )
  )
}

export default stringFormatter
