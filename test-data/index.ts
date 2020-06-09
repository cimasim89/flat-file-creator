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
]

export interface TestData {
  firstName: string
  lastName: string
  dob: Moment
  weightKg: number
  heightCm: number
  numFingers: number
  favoritePet: string
}
