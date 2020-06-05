# Flat File Creator

This library allows to generate a flat positional file, using an array that defines it's structure

>
> ### TL;DR
>
> The following represents a "normal" usage of the flat file creator. You configure an instance,
> then use it to convert data into a flat file.
>
> ```ts
> // Create row definition
> const rowDef = [
>   {
>     name: "firstName",
>     size: 25,
>     type: "string",
>     paddingPosition: "start",
>   },
>   {
>     name: "lastName",
>     size: 25,
>     type: "string",
>     paddingPosition: "start",
>   },
>   {
>     name: "dob",
>     size: 20,
>     type: "date",
>     format: {
>       utc: true,
>     }
>   },
>   {
>     name: "newsLetterOptIn",
>     size: "1",
>     type: "integer",
>   }
> ];
>
> // Instantiate the creator with your definitions
> const createFile = getAsyncFlatFileCreator(rowDef);
>
> // Define some data
> const rows = [
>   {
>     firstName: "Jo",
>     lastName: "Revelo",
>     dob: new Date("1986-01-01")
>   },
>   {
>     firstName: "Lux",
>     lastName: "Springfield",
>     dob: new Date("1996-01-01")
>   },
> ];
>
> // Now create a file
> createFile(rows, "/tmp/my-file.txt")
> .then(() => {
>   console.log("File created:", fs.readFileSync("/tmp/my-file.txt", "utf8"));
> });
> ```
>

## In-Depth Explanation

### Generate your asynchronous file creator:
The method `getAsyncFlatFileCreator` returns a function configured through the two required
parameters, `maps` and `options`.

The `maps` array parameter will contain the definition of the line structure of the text file.
Using this parameter, you "map" fields to their positions and lengths in the flat file. The
`options` parameter allows you to configure some general options of the file that will be created.

```ts
function getAsyncFlatFileCreator(
  maps: Array<FieldSpec>,
  options: Partial<GlobalOptions>
): (dataRows: Array<RowData>, filePath: string) => Promise<Array<unknown>>
```

Global options are as follows:

```ts
// Global configuration options
interface GlobalOptions {
  /**
   * Defines the terminator character of each line
   * @default ''
   */
  rowEnd: string

  /**
   * It's relative to the file encoding provided by the fs node module
   * @default 'utf8'
   */
  encoding?: BufferEncoding

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
```

The `maps` parameter is somewhat complicated. It is an array of field specifications, where
the position in the array marks the position of the field in the row. Field specifications are
defined as follows:

```ts
// These parameters are common to all field specs
type CommonSpec = {
  /**
   * This attribute is the reference to the name of the attribute that must be present in the
   * dataset that will be passed to the generated function to process the value and position it
   * in the desired point
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
}

// String field parameters
type StringFieldSpec =
  CommonSpec &
  {
    type: 'string'

    /**
     * Whether or not to trim whitespace from the value
     * @default true
     */
    preserveEmptySpace: boolean

    /**
     * If true, any values that are not string types will throw an exception
     */
    straight: boolean
  }

// Integer fields - there are no additional parameters
type IntegerFieldSpec =
  CommonSpec & {
    type: 'integer'
  }

// Float field parameters
type FloatFieldSpec =
  CommonSpec & {
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
  }

// Date field parameters
type DateFieldSpec =
  CommonSpec & {
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
  }

// This is a discriminated union of all field spec types
type FieldSpec = (
  | StringFieldSpec
  | FloatFieldSpec
  | IntegerFieldSpec
  | DateFieldSpec
);

```

### Use flat file creator:

Once you have defined the fields and configured your `flatFileCreator`, you'll use it to convert
zero or more rows of data to a flat file. Row data is represented as an array of `RowData` objects,
indexed by the field name:

```ts
type RowData = {
    [fieldName: string]: string | number | boolean | Date;
}
```


