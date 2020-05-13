# Flat File Creator

This library allows to generate a flat positional file, using an array that defines it's structure

### Generate your asynchronous file creator:
The method `getAsyncFlatFileCreator` returns a function configured through the two required parameters, maps and options. The maps array parameter will contain the definition of the line structure of the text file, options allows you to configure some general options of the file that will be created.

`getAsyncFlatFileCreator(maps: [MapDefinitioObject], options: FlatFileOptions)`: FlatFileCreator

#### `"maps": [MapDefinitioObject]` - positional row definition param 
The array is made up of objects defines the composition of each line.

The necessary attributes of the objects contained in the array are:

- `name: string` this attribute is the reference to the name of the attribute that must be present in the dataset that will be passed to the generated function to process the value and position it in the desired point;
- `size: numeric` is the total dimension that the field will have in the generated file;
- `type: string ` is the reference to the data type related to the field and can have the following values: 

  - `string`
  - `float`
  - `integer`
  - `date`
  
  the other attributes that are needed depend on the type chosen
  
#### `options: object` additional options (optional)
Option object is optional if it not will provided file will be generated with default option.

- rowEnd: defines the terminator character of each line; `default: ''`
- encoding: it's relative to the file encoding provided by the fs node module;`default: 'utf8'`
- mode: it's relative to the file save mode provided by the fs node module;`default: 0o666`
- flag: it's relative to the file save flag provided by the fs node module;`default: 'a'`
  
#### Data types
specific attribute required by chosen data type

#### `string`

-  `preserveEmptySpace: boolean`: `default: true`
-  `paddingPosition: 'start' | 'end`: `default: 'end'`
-  `paddingSymbol: string`: `default: ' '`

#### `integer`

-  `paddingPosition: 'start' | 'end`: `default: 'start'`
-  `paddingSymbol: string`: `default: ' '`

#### `float`

-  `precision:numeric`: `default: 0`
-  `dotNotation: boolean`: dot notation use a dot to divide decimal part, instead to use zero to fill to a fixed position `default: false`
-  `paddingPosition: 'start' | 'end`: `default: 'start'`
-  `paddingSymbol: string`: `default: ' '`

#### `date`

-  `paddingPosition: 'start' | 'end`: `default: 'end'`
-  `paddingSymbol: string`: `default: ' '`
-  `format: {utc:Boolean,dateFormat: string }`: 
    dateFormnat use moment.js format style, if dateFormat is not provided will be used ISO format; `default: {utc: false}`


### Use flat file creator:
Use the generated function to create the flat file providing the dataset array and the destination file path.

`FlatFileCreator(data: [any], path: string): Promise`

- data: dataset that contains data to put into the flat file
- path: path and name of file that will be generated


