export class FlatFileError extends Error implements NodeJS.ErrnoException {
  public readonly code: string
  public constructor(msg: string, code?: string) {
    super(msg)
    this.code = `ER_FLAT_FILE` + (code ? `_${code}` : ``)
  }
}

export class FlatFileReadLineError extends FlatFileError {
  public constructor(msg: string, public readonly lineData: string) {
    super(msg, `READ_LINE`)
  }
}

export class FlatFileReadFieldTypeError extends FlatFileError {
  public constructor(msg: string, public readonly fieldName: string) {
    super(msg, `READ_FIELD_TYPE`)
  }
}
