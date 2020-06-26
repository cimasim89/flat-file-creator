import {
  getAsyncFlatFileCreator as f,
  dataToLines,
} from './get-async-flat-file-creator'
import { testFields, testData, testLines } from './TestData'

const getAsyncFlatFileCreator: any = f

describe('makeAsyncFlatFileWriter', () => {
  it('returning a promise function', () => {
    expect(typeof getAsyncFlatFileCreator(null)).toBe('function')
  })

  it('should serialize data to an array of lines', () => {
    expect(dataToLines(testData, testFields).join(`\n`)).toEqual(testLines)
  })
})
