import * as fs from 'fs'
import {
  getAsyncFlatFileReader,
  linesToData,
  parseLine,
} from './flat-file-reader'
import { FieldSpec, Moment } from '../src/Types'

export const testFields: Array<FieldSpec> = [
  {
    name: 'firstName',
    type: 'string',
    size: 20,
  },
  {
    name: 'lastName',
    type: 'string',
    size: 20,
  },
  {
    name: 'dob',
    type: 'date',
    size: 20,
  },
  {
    name: 'weightKg',
    type: 'float',
    size: 10,
    dotNotation: true,
  },
  {
    name: 'heightCm',
    type: 'float',
    size: 10,
    dotNotation: false,
    precision: 4,
  },
  {
    name: 'numFingers',
    type: 'integer',
    size: 2,
  },

  // Testing default type with this one
  {
    name: 'favoritePet',
    size: 10,
  },

  // Testing enums
  {
    name: 'status',
    size: 2,
    type: 'string',
    enum: {
      '01': 'pending',
      '02': 'approved',
    },
    default: null,
  },
]

export interface TestData {
  firstName: string
  lastName: string
  dob: Moment
  weightKg: number
  heightCm: number
  numFingers: number
  favoritePet: string
  status: 'pending' | 'approved' | null
}

describe('FlatFileReader', () => {
  // prettier-ignore
  const testLines = `Jo                  Revelo              1986-01-01          72.52     1835508   10Rocky     01\n` +
                    `Ricky               Revelo              1975-01-01          89.52321531663231    9Rolly       `

  let lines: Array<string> = []
  let correctLength: number = 0

  beforeEach(() => {
    lines = testLines.split('\n')
    correctLength = lines[0].length
  })

  describe('parseLine', () => {
    test('throws when line is not correct length', () => {
      expect(() =>
        parseLine<TestData>(lines[0] + 'abc', testFields, correctLength)
      ).toThrow(`The given line must be ${correctLength} characters long`)

      expect(() => {
        parseLine<TestData>(
          lines[0].slice(0, correctLength - 3),
          testFields,
          correctLength
        )
      }).toThrow(`The given line must be ${correctLength} characters long`)
    })

    test('does NOT throw for incorrect line length if no length spec given', () => {
      expect(() =>
        parseLine<TestData>(lines[0] + 'abc', testFields)
      ).not.toThrow(`The given line must be ${correctLength} characters long`)
    })

    test('returns correct data structures', () => {
      const data = parseLine<TestData>(lines[0], testFields, correctLength)
      expect(data.firstName).toBe('Jo')
      expect(data.lastName).toBe('Revelo')
      expect(data.dob.constructor.name).toBe('Moment')
      expect(data.dob.year()).toBe(1986)
      expect(data.weightKg).toBe(72.52)
      expect(data.heightCm).toBe(183.5508)
      expect(data.numFingers).toBe(10)
      expect(data.favoritePet).toBe('Rocky')
      expect(data.status).toBe('pending')

      // This correctly fails when uncommented because `data` is correctly typed as `TestData`
      // expect(data.nope).toBe(undefined);
    })

    test('throws when line contains bad enum', () => {
      expect(() =>
        parseLine('05', [
          { name: 'test', size: 2, type: 'string', enum: { '01': 'good' } },
        ])
      ).toThrow(
        "Incoming value for field 'test' should have been one of the accepted enum keys " +
          '["01"], but found \'05\''
      )
    })
  })

  describe('linesToData', () => {
    test('returns correct data structures when parsing lines from string', () => {
      let data: TestData
      const rows = linesToData<TestData>(testLines, testFields)

      expect(rows).toHaveLength(2)

      data = rows[0]
      expect(data.firstName).toBe('Jo')
      expect(data.lastName).toBe('Revelo')
      expect(data.dob.constructor.name).toBe('Moment')
      expect(data.dob.year()).toBe(1986)
      expect(data.weightKg).toBe(72.52)
      expect(data.heightCm).toBe(183.5508)
      expect(data.numFingers).toBe(10)
      expect(data.favoritePet).toBe('Rocky')
      expect(data.status).toBe('pending')

      data = rows[1]
      expect(data.firstName).toBe('Ricky')
      expect(data.lastName).toBe('Revelo')
      expect(data.dob.constructor.name).toBe('Moment')
      expect(data.dob.year()).toBe(1975)
      expect(data.weightKg).toBe(89.5232153)
      expect(data.heightCm).toBe(166.3231)
      expect(data.numFingers).toBe(9)
      expect(data.favoritePet).toBe('Rolly')
      expect(data.status).toBeNull()

      // This correctly fails when uncommented because `data` is correctly typed as `TestData`
      // expect(data.nope).toBe(undefined);
    })

    test('returns correct data structures when parsing array of lines', () => {
      let data: TestData
      const rows = linesToData<TestData>(lines, testFields)

      expect(rows).toHaveLength(2)

      data = rows[0]
      expect(data.firstName).toBe('Jo')
      expect(data.lastName).toBe('Revelo')
      expect(data.dob.constructor.name).toBe('Moment')
      expect(data.dob.year()).toBe(1986)
      expect(data.weightKg).toBe(72.52)
      expect(data.heightCm).toBe(183.5508)
      expect(data.numFingers).toBe(10)
      expect(data.favoritePet).toBe('Rocky')
      expect(data.status).toBe('pending')

      data = rows[1]
      expect(data.firstName).toBe('Ricky')
      expect(data.lastName).toBe('Revelo')
      expect(data.dob.constructor.name).toBe('Moment')
      expect(data.dob.year()).toBe(1975)
      expect(data.weightKg).toBe(89.5232153)
      expect(data.heightCm).toBe(166.3231)
      expect(data.numFingers).toBe(9)
      expect(data.favoritePet).toBe('Rolly')
      expect(data.status).toBeNull()

      // This correctly fails when uncommented because `data` is correctly typed as `TestData`
      // expect(data.nope).toBe(undefined);
    })

    test('throws when line length is off and options specify to throw', () => {
      expect(() => {
        linesToData<TestData>(
          lines.map((l) => l + 'abcde'),
          testFields
        )
      }).toThrow('The given line must be')
      expect(() => {
        linesToData<TestData>(
          lines.map((l) => l + 'abcde'),
          testFields,
          { throwErrors: true }
        )
      }).toThrow('The given line must be')
    })

    test("DOESN'T throw when line length is off and options specify not to throw", () => {
      expect(() => {
        linesToData<TestData>(
          lines.map((l) => l + 'abcde'),
          testFields,
          { throwErrors: false }
        )
      }).not.toThrow('The given line must be')
    })
  })

  describe('getAsyncFlatFileReader', () => {
    afterEach(() => {
      if (fs.existsSync(`./test-data.txt`)) {
        fs.unlinkSync(`./test-data.txt`)
      }
    })

    test('correctly parses test file', async () => {
      let data: TestData
      const read = getAsyncFlatFileReader<TestData>(testFields)

      fs.writeFileSync(`./test-data.txt`, testLines)
      const rows = await read(`./test-data.txt`)

      expect(rows).toHaveLength(2)

      data = rows[0]
      expect(data.firstName).toBe('Jo')
      expect(data.lastName).toBe('Revelo')
      expect(data.dob.constructor.name).toBe('Moment')
      expect(data.dob.year()).toBe(1986)
      expect(data.weightKg).toBe(72.52)
      expect(data.heightCm).toBe(183.5508)
      expect(data.numFingers).toBe(10)
      expect(data.favoritePet).toBe('Rocky')
      expect(data.status).toBe('pending')

      data = rows[1]
      expect(data.firstName).toBe('Ricky')
      expect(data.lastName).toBe('Revelo')
      expect(data.dob.constructor.name).toBe('Moment')
      expect(data.dob.year()).toBe(1975)
      expect(data.weightKg).toBe(89.5232153)
      expect(data.heightCm).toBe(166.3231)
      expect(data.numFingers).toBe(9)
      expect(data.favoritePet).toBe('Rolly')
      expect(data.status).toBeNull()
    })
  })
})
