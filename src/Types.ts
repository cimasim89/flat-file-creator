import * as _ from 'lodash'
import { isNumeric } from './utils'
import { Moment } from 'moment'

// Export Moment type for downstream convenience
export { Moment }

// Options to be used to configure the file creator instance as a whole
export interface ReadOptions {
  /**
   * Defines the terminator character of each line
   * @default ''
   */
  rowEnd?: string

  /**
   * It's relative to the file encoding provided by the fs node module
   * @default 'utf8'
   */
  encoding?: BufferEncoding

  /**
   * If true, throw errors when data structure errors are encountered (such as inconsistent line
   * length or mismatched input or output data). If false errors are simply swallowed.
   * @default true
   */
  throwErrors?: boolean
}
export interface WriteOptions extends ReadOptions {
  /**
   * It's relative to the file save mode provided by the fs node module
   * @default 0o666
   */
  mode?: number

  /**
   * It's relative to the file save flag provided by the fs node module
   * @default 'a'
   */
  flag?: string
}

// Runtime data representing values to be written to the file
export type StringFieldValue = string | null | undefined
export type IntegerFieldValue = number | null | undefined
export type FloatFieldValue = number | null | undefined
export type DateFieldValue = Date | Moment | string | null | undefined
export type FieldValue =
  | StringFieldValue
  | IntegerFieldValue
  | FloatFieldValue
  | DateFieldValue
export type RowData = { [fieldName: string]: FieldValue }

// FieldSpec is a discriminated union of all possible field spec types
// Here, we make 'type' optional since field specs default to string-type
export type FieldSpec =
  | StringFieldSpec
  | FloatFieldSpec
  | IntegerFieldSpec
  | DateFieldSpec

// String field parameters
export type StringFieldSpec = CommonSpec & {
  /**
   * Type is option for string fields because when type is not specified we default to 'string'
   */
  type?: 'string'

  /**
   * If the field has a set list of values, you can specify them using the 'enum' key. Since
   * upstream providers may implement various key-value paradigms, this field is an arbitrary map
   * of string keys to string values, as opposed to an array of fields. For example:
   *
   * {
   *   "01": "received",
   *   "02": "fulfilled",
   *   "03": "rejected",
   * }
   */
  enum?: { [serializedKey: string]: string }

  /**
   * Whether or not to trim whitespace from the value
   * @default true
   */
  preserveEmptySpace?: boolean

  /**
   * If true, any values that are not string types will throw an exception
   */
  straight?: boolean

  /**
   * If provided, this value is used as the default value when no value is provided in the data.
   * If not provided, failure to provide a value for this field will result in an exception unless
   * `options.throwErrors` is set to false.
   */
  default?: string | null
}

// Integer fields - there are no additional parameters
export type IntegerFieldSpec = CommonSpec & {
  type: 'integer'

  /**
   * If provided, this value is used as the default value when no value is provided in the data.
   * If not provided, failure to provide a value for this field will result in an exception unless
   * `options.throwErrors` is set to false.
   */
  default?: number | null
}

// Float field parameters
export type FloatFieldSpec = CommonSpec & {
  type: 'float'

  /**
   * When `dotNotation` is true, represents the number of digits to the right of the decimal
   * point. When `dotNotation` is false, defines the multiplication factor used to obtain the
   * integer value of the number (see `dotNotation` below).
   */
  precision?: number

  /**
   * When false, number is represented as an integer by multiplying by 10^[precision]. For
   * example, if precision is 4, then the value `156.34235568183` would be represented as
   * the integer `1563424`.
   */
  dotNotation?: boolean

  /**
   * If provided, this value is used as the default value when no value is provided in the data.
   * If not provided, failure to provide a value for this field will result in an exception unless
   * `options.throwErrors` is set to false.
   */
  default?: number | null
}

// Date field parameters
export type DateFieldSpec = CommonSpec & {
  type: 'date'
  format?: {
    /**
     * Use UTC for times
     * @default false
     */
    utc?: boolean

    /**
     * Specify an arbitrary date format (see [`moment`](https://momentjs.com/docs/#/displaying/))
     * @default ISO format
     */
    dateFormat?: string
  }

  /**
   * If provided, this value is used as the default value when no value is provided in the data.
   * If not provided, failure to provide a value for this field will result in an exception unless
   * `options.throwErrors` is set to false.
   */
  default?: Date | Moment | string | null
}

declare type CommonSpec = {
  /**
   * This attribute is the reference to the name of the attribute that must be present in the
   * dataset that will be passed to the generated function to process the value and position it
   * in the desired point in the file
   */
  name: string

  /**
   * The total dimension that the field will have in the generated file;
   */
  size: number

  /**
   * Whether padding for this field should be at the beginning or the end
   * @default 'end' for string and date fields, 'start' for number fields
   */
  paddingPosition?: 'start' | 'end'

  /**
   * What character should be used as padding
   * @default ' ' (space)
   */
  paddingSymbol?: string

  /**
   * An optional description of the field. This can be used both for in-line
   * documentation/reference and also to produce better error messages.
   */
  desc?: string
}

// This overloaded method is used to assert that the given field spec is of the given type
export function assertFieldSpec(
  spec: any,
  type: 'string'
): asserts spec is StringFieldSpec
export function assertFieldSpec(
  spec: any,
  type: 'integer'
): asserts spec is IntegerFieldSpec
export function assertFieldSpec(
  spec: any,
  type: 'float'
): asserts spec is FloatFieldSpec
export function assertFieldSpec(
  spec: any,
  type: 'date'
): asserts spec is DateFieldSpec
export function assertFieldSpec(spec: any): asserts spec is FieldSpec
export function assertFieldSpec(
  spec: any,
  type?: string
): asserts spec is FieldSpec {
  if (!spec) {
    throw new Error('map is null or undefined')
  }
  if (typeof spec !== 'object') {
    throw new Error('map is not an object')
  }
  if (_.isEmpty(spec)) {
    throw new Error('map object is empty')
  }
  if (typeof spec.name === 'undefined') {
    throw new Error('map field name is required')
  }
  if (typeof spec.size === 'undefined') {
    throw new Error('map size is required')
  }
  if (spec.size <= 0) {
    throw new Error('map size must be greater than 0')
  }
  if (isNumeric(spec.type)) {
    throw new Error(`map field [${spec.name}] type not could be numeric`)
  }
  if (type) {
    if (type !== spec.type) {
      throw new Error(
        `map field [${spec.name}] is for ${spec.type}, not the required ${type}`
      )
    }
    if (type === 'float' && typeof spec.precision === 'undefined') {
      throw new Error('float precision must be specified')
    }
  }
}
