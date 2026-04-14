# flat-file-creator

Read and write fixed-width flat files from typed TypeScript data — the boring format your bank
still loves, made painless.

> **Version support**
> - **v3.x** — current development version (`npm install flat-file-creator@next`), see [Migration Guide](#migrating-from-v2-to-v3)
> - **v2.x** — stable, receives bugfixes only (`npm install flat-file-creator`)

## Install

```bash
npm install flat-file-creator@next
```

**Requirements:** Node.js ≥ 20, ESM project (`"type": "module"` or `.mjs` files).

---

## Quick start

```ts
import { getAsyncFlatFileCreator, getAsyncFlatFileReader } from 'flat-file-creator'

// 1. Describe the row layout
const fields = [
  { name: 'firstName', type: 'string',  size: 20 },
  { name: 'lastName',  type: 'string',  size: 20 },
  { name: 'dob',       type: 'date',    size: 24, format: { utc: true } },
  { name: 'score',     type: 'float',   size: 8,  precision: 2 },
]

// 2. Create writer and reader from the same definition
const writeFile = getAsyncFlatFileCreator(fields)
const readFile  = getAsyncFlatFileReader<Person>(fields)

// 3. Write
await writeFile(
  [
    { firstName: 'Jo',    lastName: 'Revelo',     dob: new Date('1986-01-01'), score: 9.75 },
    { firstName: 'Ricky', lastName: 'Springfield', dob: new Date('1975-06-15'), score: 8.50 },
  ],
  '/tmp/people.txt',
)

// 4. Read back — `rows` is fully typed as Person[]
const rows = await readFile('/tmp/people.txt')
console.log(rows[0].dob.getFullYear()) // 1986
```

---

## Field types

Every field needs at minimum `name` and `size`. The `type` defaults to `'string'` when omitted.

### `string`

```ts
{ name: 'city', type: 'string', size: 30 }
```

| Option | Type | Default | Description |
|---|---|---|---|
| `paddingPosition` | `'start' \| 'end'` | `'end'` | Where to add padding |
| `paddingSymbol` | `string` | `' '` | Character used for padding |
| `preserveEmptySpace` | `boolean` | `false` | Skip trimming whitespace |
| `straight` | `boolean` | `false` | Throw if value is numeric |
| `enum` | `{ [key: string]: string }` | — | Serialize/deserialize a set of values |
| `default` | `string \| null` | — | Fallback when value is missing |

### `integer`

```ts
{ name: 'age', type: 'integer', size: 5 }
```

Integers are left-padded with spaces by default. All standard `CommonSpec` options apply.

### `float`

```ts
{ name: 'score', type: 'float', size: 8, precision: 2 }
```

| Option | Type | Default | Description |
|---|---|---|---|
| `precision` | `number` | `0` | Decimal places |
| `dotNotation` | `boolean` | `false` | When `false`, value is stored as integer × 10^precision |

**Example** — `9.75` with `precision: 2, dotNotation: false` → `"     975"`, and back to `9.75` on read.

### `date`

```ts
{ name: 'dob', type: 'date', size: 24, format: { utc: true, dateFormat: 'yyyy-MM-dd' } }
```

| Option | Type | Default | Description |
|---|---|---|---|
| `format.dateFormat` | `string` | ISO 8601 | [date-fns format tokens](https://date-fns.org/docs/format) |
| `format.utc` | `boolean` | `false` | Format in UTC |
| `default` | `Date \| string \| null` | — | Fallback when value is missing |

On **read**, date fields are always returned as native `Date` objects.

---

## API

```ts
function getAsyncFlatFileCreator(
  maps: Array<FieldSpec>,
  options?: Partial<WriteOptions>
): (dataRows: Array<RowData>, filePath: string) => Promise<void>

function getAsyncFlatFileReader<T>(
  maps: Array<FieldSpec>,
  options?: Partial<ReadOptions>
): (filePath: string) => Promise<Array<T>>
```

> **Note:** rows are always written in the same order as the input array. Each call to the
> returned writer opens the file, streams all rows sequentially, then closes it.

---

## Options

Both `getAsyncFlatFileCreator` and `getAsyncFlatFileReader` accept an optional second argument:

```ts
interface ReadOptions {
  rowEnd?:      string          // line terminator, default ''
  encoding?:    BufferEncoding  // default 'utf8'
  throwErrors?: boolean         // throw on structural errors, default true
}

interface WriteOptions extends ReadOptions {
  mode?:        number          // file mode, default 0o666
  flag?:        string          // fs flag, default 'a' (append)
}
```

---

## Type definitions

```ts
type RowData = { [fieldName: string]: string | number | boolean | Date | null | undefined }

type CommonSpec = {
  name:             string
  size:             number
  paddingPosition?: 'start' | 'end'
  paddingSymbol?:   string
  desc?:            string
}

type StringFieldSpec = CommonSpec & {
  type?:               'string'
  enum?:               { [serializedKey: string]: string }
  preserveEmptySpace?: boolean
  straight?:           boolean
  default?:            string | null
}

type IntegerFieldSpec = CommonSpec & {
  type:     'integer'
  default?: number | null
}

type FloatFieldSpec = CommonSpec & {
  type:          'float'
  precision?:    number
  dotNotation?:  boolean
  default?:      number | null
}

type DateFieldSpec = CommonSpec & {
  type:     'date'
  format?:  { utc?: boolean; dateFormat?: string }
  default?: Date | string | null
}

type FieldSpec = StringFieldSpec | IntegerFieldSpec | FloatFieldSpec | DateFieldSpec
```

---

## Working with lines directly

If you prefer to work with strings instead of files, two lower-level helpers are available:

```ts
import { dataToLines, linesToData } from 'flat-file-creator'

const lines = dataToLines(rows, fields)       // string[]
const rows  = linesToData(lines.join('\n'), fields) // T[]
```

---

## Migrating from v2 to v3

v3 is a clean break. If you need stability or can't migrate yet, v2.x keeps receiving bugfixes.

```bash
npm install flat-file-creator        # stay on v2
npm install flat-file-creator@next   # try v3
```

### 1. Node.js ≥ 20 required

v2 supports Node.js 10+. v3 requires Node.js 20 or later.

### 2. Pure ESM — no CommonJS support

v3 is a pure ESM package and cannot be `require()`'d. If your project is still on CommonJS
and cannot migrate, stay on v2.

```ts
// v3 — ESM only
import { getAsyncFlatFileCreator } from 'flat-file-creator'
```

### 3. `moment` removed — date format tokens changed

v3 replaces `moment` with [`date-fns`](https://date-fns.org). Update your `dateFormat` tokens:

| v2 (moment) | v3 (date-fns) |
|---|---|
| `YYYY` | `yyyy` |
| `DD` | `dd` |
| `HH`, `mm`, `ss` | unchanged |

```ts
// v2
{ type: 'date', format: { dateFormat: 'DD/MM/YYYY' } }

// v3
{ type: 'date', format: { dateFormat: 'dd/MM/yyyy' } }
```

### 4. `Moment` type removed from `DateFieldValue`

`DateFieldValue` no longer accepts `moment` objects:

```ts
// v2
import moment from 'moment'
const dob = moment('1986-01-01')

// v3
const dob = new Date('1986-01-01')  // or just '1986-01-01'
```

### 5. Date fields return `Date` instead of `Moment`

```ts
// v2
rows[0].dob.year()        // moment API

// v3
rows[0].dob.getFullYear() // native Date API
```

### 6. `getAsyncFlatFileCreator` return type changed

The writer now returns `Promise<void>` instead of `Promise<string[]>`. The previous return value
was an array of file paths (one per row) with no practical use. If your code consumed it, remove it:

```ts
// before
const result = await writeFile(rows, '/tmp/out.txt') // result was string[]

// after
await writeFile(rows, '/tmp/out.txt')
```

Row ordering is now **guaranteed** — rows are always written in the same order as the input array.
If your code worked around the previous non-deterministic ordering, that workaround can be removed.
