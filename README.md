# @file/positional

Forked from: [Flat File Creator](https://github.com/cimasim89/flat-file-creator)

This library allows you to read or write flat files according to a given specification passed as
an argument.

### TL;DR

The following represents a "normal" usage of this flat file library. In general, you

1. Define the structure of the data you're working with
2. Use that structure to configure an instance of either a reader or writer
3. Use the instance to read or write data.

```ts
// Create row definition

const rowDef: Array<FieldSpec> = [
  {
    name: "firstName",
    size: 25,
    type: "string",
    paddingPosition: "start",
  },
  {
    name: "lastName",
    size: 25,
    type: "string",
    paddingPosition: "start",
  },
  {
    name: "dob",
    size: 20,
    type: "date",
    format: {
      utc: true,
    },
  },
  {
    name: "newsLetterOptIn",
    size: "1",
    type: "integer",
  },
];

// Instantiate a creator and a reader with your definitions
const createFile = getAsyncFlatFileCreator(rowDef);
const readFile = getAsyncFlatFileReader<MyData>(rowDef);

// Define some data
const rows: Array<MyData> = [
  {
    firstName: "Jo",
    lastName: "Revelo",
    dob: new Date("1986-01-01"),
  },
  {
    firstName: "Lux",
    lastName: "Springfield",
    dob: new Date("1996-01-01"),
  },
];

// Create a file using your data
await createFile(rows, "/tmp/my-file.txt");

// Now read that file back into program space
const data = await readFile("/tmp/my-file.txt");

// Now `data` is the same as `rows`
// Use it.....
```

## In-Depth Explanation

### Generate your asynchronous file creator or reader

The methods `getAsyncFlatFileCreator` and `getAsyncFlatFileReader` return functions configured
through the two required parameters, `maps` and `options`.

The `maps` array parameter will contain the definition of the line structure of the text file.
Using this parameter, you "map" fields to their positions and lengths in the flat file. The
`options` parameter allows you to configure some general options of the file that will be created
or read.

```ts
function getAsyncFlatFileCreator(
  maps: Array<FieldSpec>,
  options: Partial<WriteOptions>,
): (dataRows: Array<RowData>, filePath: string) => Promise<Array<unknown>>;
```

Options are as follows:

```ts
// Read options
export interface ReadOptions {
  /**
   * Defines the terminator character of each line
   * @default ''
   */
  rowEnd?: string;

  /**
   * It's relative to the file encoding provided by the fs node module
   * @default 'utf8'
   */
  encoding?: BufferEncoding;

  /**
   * If true, throw errors when data structure errors are encountered (such as inconsistent line
   * length or mismatched input or output data). If false errors are simply swallowed.
   * @default true
   */
  throwErrors?: boolean;
}

// Write options (extend Read Options)
export interface WriteOptions extends ReadOptions {
  /**
   * It's relative to the file save mode provided by the fs node module
   * @default 0o666
   */
  mode?: number;

  /**
   * It's relative to the file save flag provided by the fs node module
   * @default 'a'
   */
  flag?: string;
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
  name: string;

  /**
   * The total dimension that the field will have in the generated file
   */
  size: number;

  /**
   * Whether padding for this field should be at the beginning or the end
   * @default 'end' for string and date fields, 'start' for number fields
   */
  paddingPosition?: "start" | "end";

  /**
   * What character should be used as padding
   * @default ' ' (space)
   */
  paddingSymbol?: string;
};

// String field parameters
type StringFieldSpec = CommonSpec & {
  /**
   * Type is option for string fields because when type is not specified we default to 'string'
   */
  type?: "string";

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
  enum?: { [serializedKey: string]: string };

  /**
   * Whether or not to trim whitespace from the value
   * @default false
   */
  preserveEmptySpace?: boolean;

  /**
   * If true, any values that are not string types will throw an exception
   */
  straight?: boolean;

  /**
   * If provided, this value is used as the default value when no value is provided in the data.
   * If not provided, failure to provide a value for this field will result in an exception unless
   * `options.throwErrors` is set to false.
   */
  default?: string | null;

  /**
   * An optional description of the field. This can be used both for in-line
   * documentation/reference and also to produce better error messages.
   */
  desc?: string;
};

// Integer fields - there are no additional parameters
type IntegerFieldSpec = CommonSpec & {
  type: "integer";

  /**
   * If provided, this value is used as the default value when no value is provided in the data.
   * If not provided, failure to provide a value for this field will result in an exception unless
   * `options.throwErrors` is set to false.
   */
  default?: number | null;

  /**
   * An optional description of the field. This can be used both for in-line
   * documentation/reference and also to produce better error messages.
   */
  desc?: string;
};

// Float field parameters
type FloatFieldSpec = CommonSpec & {
  type: "float";

  /**
   * When `dotNotation` is true, represents the number of digits to the right of the decimal
   * point. When `dotNotation` is false, defines the multiplication factor used to obtain the
   * integer value of the number (see `dotNotation` below).
   */
  precision?: number;

  /**
   * When false, number is represented as an integer by multiplying by 10^[precision]. For
   * example, if precision is 4, then the value `156.34235568183` would be represented as
   * the integer `1563424`.
   */
  dotNotation?: boolean;

  /**
   * If provided, this value is used as the default value when no value is provided in the data.
   * If not provided, failure to provide a value for this field will result in an exception unless
   * `options.throwErrors` is set to false.
   */
  default?: number | null;

  /**
   * An optional description of the field. This can be used both for in-line
   * documentation/reference and also to produce better error messages.
   */
  desc?: string;
};

// Date field parameters
type DateFieldSpec = CommonSpec & {
  type: "date";
  format?: {
    /**
     * Use UTC for times
     * @default false
     */
    utc?: boolean;

    /**
     * Specify an arbitrary date format (see [`moment`](https://momentjs.com/docs/#/displaying/))
     * @default ISO format
     */
    dateFormat?: string;
  };

  /**
   * If provided, this value is used as the default value when no value is provided in the data.
   * If not provided, failure to provide a value for this field will result in an exception unless
   * `options.throwErrors` is set to false.
   */
  default?: Date | Moment | string | null;

  /**
   * An optional description of the field. This can be used both for in-line
   * documentation/reference and also to produce better error messages.
   */
  desc?: string;
};

// This is a discriminated union of all field spec types
type FieldSpec =
  | StringFieldSpec
  | FloatFieldSpec
  | IntegerFieldSpec
  | DateFieldSpec;
```

### Use flat file creator:

Once you have defined the fields and configured your flat file creator or reader, you'll use it to
convert read or write rows of data to a flat file. Row data is represented as an array of
`RowData` objects, indexed by the field name:

```ts
type RowData = {
  [fieldName: string]: string | number | boolean | Date;
};
```

Note that for the file reader, you can pass a type argument on instantiation of the function that
will determine the type of rows coming out of the file.
