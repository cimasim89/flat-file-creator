import { describe, expect, it } from 'vitest'
import {
  dataToLines,
  getAsyncFlatFileCreator as f,
} from './get-async-flat-file-creator.js'
import { testData, TestData, testFields, testLines } from './TestData.js'

const getAsyncFlatFileCreator: any = f

describe('makeAsyncFlatFileWriter', () => {
  it('returning a promise function', () => {
    expect(typeof getAsyncFlatFileCreator(null)).toBe('function')
  })
})

describe('dataToLines', () => {
  it('should serialize data to an array of lines', () => {
    expect(dataToLines<TestData>(testData, testFields).join('\n')).toEqual(
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
