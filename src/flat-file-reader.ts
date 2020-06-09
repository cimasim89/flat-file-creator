import { FieldSpec, ReadOptions } from './Types'
import { FlatFileReadLineError, FlatFileReadFieldTypeError } from './Errors'
import * as moment from 'moment'
import * as fs from 'fs'

// Return a function that can read a flat based on the given spec
export const getAsyncFlatFileReader = <T = unknown>(
  fields: Array<FieldSpec>,
  options: Partial<ReadOptions> = {}
) => {
  // The returned function is a generic function whose output can be typed by passing a type
  // argument to the call
  return (path: string): Promise<Array<T>> => {
    return new Promise((res, rej) => {
      // Determine the size of the final line according to our field specs for later validation
      const lineLength = fields.reduce(
        (n: number, f: FieldSpec) => n + f.size,
        0
      )

      // Now read the file
      fs.readFile(
        path,
        options,
        (err: NodeJS.ErrnoException | null, contents: string | Buffer) => {
          // If there was an error reading, throw
          if (err) {
            rej(err)
          }

          // Otherwise, make sure the data is a string
          const data =
            typeof contents === 'string'
              ? contents
              : contents.toString(options.encoding || 'utf8')

          // Now iterate through each line and parse
          const results: Array<T> = []
          const lines = data.split(/[\n\r]+/)
          for (let i = 0; i < lines.length; i++) {
            // Skip blank lines
            if (lines[i] === '') {
              continue
            }

            // Parse non-blank lines and push to results
            results.push(parseLine<T>(lines[i], fields, lineLength))
          }

          // Finally, return the results
          res(results)
        }
      )
    })
  }
}

/**
 * Parse a string line into a data structure and validate its type according to the spec.
 *
 * Exporting this function for the purposes of testing. However, this function is not considered
 * a primary library function.
 */
export const parseLine = <T = unknown>(
  line: string,
  fields: Array<FieldSpec>,
  expectedLineLength: number
): T => {
  // Throw an exception if any line is not as expected
  if (line.length !== expectedLineLength) {
    throw new FlatFileReadLineError(
      `FlatFileReader: The given line must be ${expectedLineLength} characters long according ` +
        `to the data specification. The current line is ${line.length} characters long.`,
      line
    )
  }

  const result: any = {}
  let cursor = 0

  // Iterate through the fields in the spec
  for (let fieldNum = 0; fieldNum < fields.length; fieldNum++) {
    const fieldSpec = fields[fieldNum]

    // Extract the value for the given field and bump the cursor
    let fieldVal = line.slice(cursor, cursor + fieldSpec.size)
    cursor += fieldSpec.size

    // Trim the value and assign it
    result[fieldSpec.name] = trim(fieldVal, fieldSpec)
  }

  // Now interpret and typecheck the runtime values of the result and return
  return interpret<T>(result, fields)
}

/**
 * Trim a value according to the field specification
 */
export const trim = (val: string, fieldSpec: FieldSpec): string => {
  const paddingChar = fieldSpec.paddingSymbol || ' '
  const pattern =
    fieldSpec.paddingPosition === 'start' ||
    (typeof fieldSpec.paddingPosition === 'undefined' &&
      (fieldSpec.type === 'integer' || fieldSpec.type === 'float'))
      ? new RegExp(`^${paddingChar}+`)
      : new RegExp(`${paddingChar}+$`)
  val = val.replace(pattern, '')

  // Now make sure that if it's a number there's no whitespace
  if (fieldSpec.type === 'integer' || fieldSpec.type === 'float') {
    val = val.trim()
  }

  return val
}

/**
 * Interpret the value according to the given field specification
 */
export const interpret = <T = unknown>(
  result: any,
  fields: Array<FieldSpec>
): T => {
  // Iterate through the fields defined in the spec
  for (let i = 0; i < fields.length; i++) {
    const field = fields[i]

    // If the field is a blank string, set it to null, or throw if non optional
    if (result[field.name] === '') {
      /*
      if (field.optional) {
        result[field.name] = null;
        continue;
      }
      */

      throw new FlatFileReadFieldTypeError(
        `Field '${field.name}' is required, but not defined`,
        field.name
      )
    }

    // Otherwise, parse the value

    // We'll use this int function in a couple different places, so make it available here
    const getInt = (val: string, fieldName: string): number => {
      if (val.match(/^-?[0-9]+$/) || val.match(/^-?[0-9]+e[0-9]+$/)) {
        return <number>JSON.parse(val)
      } else {
        throw new FlatFileReadFieldTypeError(
          `Field '${fieldName}' is supposed to be an integer but is not. Actual value: ${val}`,
          fieldName
        )
      }
    }

    switch (field.type) {
      // Integer
      case 'integer': {
        result[field.name] = getInt(result[field.name], field.name)
        break
      }

      case 'float': {
        let val: number | null = null

        // If we're using dot notation....
        if (field.dotNotation) {
          if (result[field.name].match(/^-?[0-9]*\.?[0-9]+$/)) {
            val = parseFloat(result[field.name])
          } else if (result[field.name].match(/^-?[0-9]+(\.[0-9]+)?e[0-9]+$/)) {
            val = JSON.parse(result[field.name])
          }
        } else {
          val =
            getInt(result[field.name], field.name) /
            Math.pow(10, field.precision || 0)
        }

        if (val === null) {
          throw new FlatFileReadFieldTypeError(
            `Field '${field.name}' is supposed to be a float but is not. Actual value: ` +
              result[field.name],
            field.name
          )
        }

        result[field.name] = val
        break
      }

      // TODO: Make sure this parses correctly according to the given options
      case 'date': {
        result[field.name] = moment(result[field.name])
        break
      }

      case 'string':
      case undefined: {
        // already string - nothing to do here
      }
    }
  }

  // Now that we've iterated through every field and done all our checking, it's safe to return
  // `result` as an object of type `T`
  return <T>result
}
