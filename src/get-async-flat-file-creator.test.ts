import {
  getAsyncFlatFileCreator as f,
  dataToLines,
} from './get-async-flat-file-creator'
import { testFields, testData, TestData, testLines } from './TestData'

const getAsyncFlatFileCreator: any = f

describe('makeAsyncFlatFileWriter', () => {
  it('returning a promise function', () => {
    expect(typeof getAsyncFlatFileCreator(null)).toBe('function')
  })
})

describe('dataToLines', () => {
  it('should serialize data to an array of lines', () => {
    expect(dataToLines<TestData>(testData, testFields).join(`\n`)).toEqual(
      testLines
    )
  })

  /**
   * Uncomment this to test typescript typing
   *
  it('should not permit complex values for input', () => {
    dataToLines<{ one: Buffer }>(
      [{ one: Buffer.from("test") }],
      [
        {
          name: "one",
          size: 20,
          type: "string",
        }
      ]
    );
  });
  **/
})
