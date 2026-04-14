import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'

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

describe('Use AsyncFlatFileWriter', () => {
  let tmpFile: string

  beforeEach(() => {
    tmpFile = path.join(os.tmpdir(), `flat-file-creator-test-${Date.now()}.txt`)
  })

  afterEach(() => {
    if (fs.existsSync(tmpFile)) {
      fs.unlinkSync(tmpFile)
    }
  })

  it('Generate a multiline txt file using \\n as rowEnd attribute must preserve data sequence', async () => {
    const flatFileCreator = getAsyncFlatFileCreator(testFields, {
      rowEnd: '\n',
    })
    await flatFileCreator(testData, tmpFile)
    expect(fs.readFileSync(tmpFile).toString()).toEqual(`${testLines}\n`)
  })
})

describe('dataToLines', () => {
  it('should serialize data to an array of lines', () => {
    expect(dataToLines<TestData>(testData, testFields).join(`\n`)).toEqual(
      testLines,
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
