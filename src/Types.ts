import * as _ from "lodash";
import { isNumeric } from "./utils";

// Options to be used to configure the file creator instance as a whole
export interface GlobalOptions {
  rowEnd: string;
  encoding?: BufferEncoding;
  mode?: number;
  flag?: string;
}

// Runtime data representing values to be written to the file
export type FieldValue = string | number | boolean | Date;
export type RowData = { [fieldName: string]: FieldValue };

// Specifications for various types of fields.
// Here, we make 'type' optional since field specs default to string-type
export type FieldSpec = (StringFieldSpec | FloatFieldSpec | IntegerFieldSpec | DateFieldSpec)
  & { type?: "string" | "integer" | "float" | "date" };

export type StringFieldSpec = CommonSpec & { type: "string" } & {
  preserveEmptySpace: boolean;
  straight: boolean; // (should be "strict" - determines whether or not error is thrown if incoming data is numeric, rather than string)
};
export type IntegerFieldSpec = CommonSpec & { type: "integer" };
export type FloatFieldSpec = CommonSpec & { type: "float" } & {
  precision?: number;
  dotNotation?: boolean;
};
export type DateFieldSpec = CommonSpec & { type: "date" } & {
  format?: {
    utc?: boolean;
    dateFormat?: string;
  }
};

declare type CommonSpec = {
  name: string;
  size: number;
  paddingPosition?: "start" | "end";
  paddingSymbol?: string;
};

// This overloaded method is used to assert that the given field spec is of the given type
export function assertFieldSpec(spec: any, type: "string"): asserts spec is StringFieldSpec;
export function assertFieldSpec(spec: any, type: "integer"): asserts spec is IntegerFieldSpec;
export function assertFieldSpec(spec: any, type: "float"): asserts spec is FloatFieldSpec;
export function assertFieldSpec(spec: any, type: "date"): asserts spec is DateFieldSpec;
export function assertFieldSpec(spec: any): asserts spec is FieldSpec;
export function assertFieldSpec(spec: any, type?: string): asserts spec is FieldSpec {
  if (!spec) throw new Error('map is null or undefined')
  if (typeof spec!== 'object') throw new Error('map is not an object')
  if (_.isEmpty(spec)) throw new Error('map object is empty')
  if (typeof spec.name === 'undefined') throw new Error('map field name is required')
  if (typeof spec.size === 'undefined') throw new Error('map size is required')
  if (spec.size <= 0) throw new Error('map size must be greater than 0')
  if (isNumeric(spec.type)) throw new Error(`map field [${spec.name}] type not could be numeric`)
  if (type) {
    if (type !== spec.type) throw new Error(`map field [${spec.name}] is for ${spec.type}, not the required ${type}`);
    if (type === "float" && typeof spec.precision === 'undefined') throw new Error('float precision must be specified')
  }
}

