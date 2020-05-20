import { getAsyncFlatFileCreator as f } from "./get-async-flat-file-creator";

const getAsyncFlatFileCreator: any = f;

describe('makeAsyncFlatFileWriter', () => {
  it('returning a promise function', () => {
    expect(typeof getAsyncFlatFileCreator(null)).toBe('function')
  })
})
