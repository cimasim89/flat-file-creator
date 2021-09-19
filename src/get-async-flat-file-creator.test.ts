import * as fs from 'fs'
import * as path from 'path'
import * as rimraf from 'rimraf'

import {
  getAsyncFlatFileCreator as f,
  dataToLines,
} from './get-async-flat-file-creator'
import { testFields, testData, TestData, testLines } from './TestData'

const TEST_FOLDER = './test_assets'
const getAsyncFlatFileCreator: any = f

describe('makeAsyncFlatFileWriter', () => {
  it('returning a promise function', () => {
    expect(typeof getAsyncFlatFileCreator(null)).toBe('function')
  })
})

describe('Use AsyncFlatFileWriter', () => {
  beforeEach(() => {
    if (!fs.existsSync(TEST_FOLDER)) {
      fs.mkdirSync(TEST_FOLDER)
    }
  })
  afterEach(() => {
    if (fs.existsSync(TEST_FOLDER)) {
      rimraf.sync(TEST_FOLDER)
    }
  })
  it('Generate a multiline txt file using \\n as rowEnd attribute must preserve data sequence', async () => {
    const filePath = path.join(TEST_FOLDER, 'test.txt')
    const options = { rowEnd: '\n' }
    const flatFileCreator = getAsyncFlatFileCreator(testFields, options)
    await flatFileCreator(testData, filePath)
    expect(fs.readFileSync(filePath).toString()).toEqual(`${testLines}\n`)
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
