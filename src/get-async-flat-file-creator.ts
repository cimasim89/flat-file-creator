import fileAppendPromise from "./file-append-promise";
import rowFormatter from "./row-formatter";
import { FieldSpec, FieldData, GlobalOptions } from "./Types";

const rowWriterMapper = (maps: Array<FieldSpec>, path: string, options: Partial<GlobalOptions>) => {
  return (data: FieldData) => fileAppendPromise(path, rowFormatter(maps, data, options), options);
}

export const getAsyncFlatFileCreator = (maps: Array<FieldSpec>, options: Partial<GlobalOptions>) => {
  return (data: Array<FieldData>, path: string) => Promise.all(data.map(rowWriterMapper(maps, path, options)));
}

