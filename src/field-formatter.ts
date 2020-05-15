import * as lodash from "lodash";
import { isNumeric } from "./utils";
import stringFormatter from "./string-formatter";
import dateFormatter from "./date-formatter";
import integerFormatter from "./integer-formatter";
import floatFormatter from "float-formatter";
import { FieldSpec, FieldData, GlobalOptions, assertFieldSpec } from "./Types";

const fieldFormatter = (map: FieldSpec, data: FieldData) => {
  assertFieldSpec(map);
  const fieldName = map.name
  switch (map.type) {
    case 'string':
      return stringFormatter(map, data[fieldName])
    case 'integer':
      return integerFormatter(map, data[fieldName])
    case 'float':
      return floatFormatter(map, data[fieldName])
    case 'date':
      return dateFormatter(map, data[fieldName])
    case undefined:
      return dateFormatter({ ...map, type: "string" }, data[fieldName])
    default:
      throw new Error('required field type is not present')
  }
}

export default fieldFormatter;
