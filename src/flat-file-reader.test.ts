import {
  getAsyncFlatFileReader,
  linesToData,
  parseLine,
} from './flat-file-reader'
import { testFields, TestData } from '../test-data'

describe('FlatFileReader', () => {
  // prettier-ignore
  const testLines = `Jo                  Revelo              1986-01-01          72.52     1835508   10Rocky     \n` +
                    `Ricky               Revelo              1975-01-01          89.52321531663231    9Rolly     `

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

      // This correctly fails when uncommented because `data` is correctly typed as `TestData`
      // expect(data.nope).toBe(undefined);
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

      data = rows[1]
      expect(data.firstName).toBe('Ricky')
      expect(data.lastName).toBe('Revelo')
      expect(data.dob.constructor.name).toBe('Moment')
      expect(data.dob.year()).toBe(1975)
      expect(data.weightKg).toBe(89.5232153)
      expect(data.heightCm).toBe(166.3231)
      expect(data.numFingers).toBe(9)
      expect(data.favoritePet).toBe('Rolly')

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

      data = rows[1]
      expect(data.firstName).toBe('Ricky')
      expect(data.lastName).toBe('Revelo')
      expect(data.dob.constructor.name).toBe('Moment')
      expect(data.dob.year()).toBe(1975)
      expect(data.weightKg).toBe(89.5232153)
      expect(data.heightCm).toBe(166.3231)
      expect(data.numFingers).toBe(9)
      expect(data.favoritePet).toBe('Rolly')

      // This correctly fails when uncommented because `data` is correctly typed as `TestData`
      // expect(data.nope).toBe(undefined);
    })
  })

  describe('getAsyncFlatFileReader', () => {
    test('correctly parses test file', async () => {
      let data: TestData
      const read = getAsyncFlatFileReader<TestData>(testFields)
      const rows = await read(`./test-data/flat-file.txt`)

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

      data = rows[1]
      expect(data.firstName).toBe('Ricky')
      expect(data.lastName).toBe('Revelo')
      expect(data.dob.constructor.name).toBe('Moment')
      expect(data.dob.year()).toBe(1975)
      expect(data.weightKg).toBe(89.5232153)
      expect(data.heightCm).toBe(166.3231)
      expect(data.numFingers).toBe(9)
      expect(data.favoritePet).toBe('Rolly')
    })
  })
})
