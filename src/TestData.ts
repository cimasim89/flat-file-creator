import { FieldSpec, Moment } from './Types'

// prettier-ignore
export const testLines =
  `Jo                  Revelo              1986-01-01T00:00:00.000Z   72.5200   183550810Rocky     01\n` +
  `Ricky               Revelo              1975-01-01T00:00:00.000Z85239.5232   1663231 9Rolly       `

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
    size: 24,
  },
  {
    name: 'weightKg',
    type: 'float',
    size: 10,
    dotNotation: true,
    precision: 4,
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

  // Testing enums
  {
    name: 'status',
    size: 2,
    type: 'string',
    enum: {
      '01': 'pending',
      '02': 'approved',
    },
    default: null,
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
  status: 'pending' | 'approved' | null
}

export const testData = [
  {
    firstName: `Jo`,
    lastName: `Revelo`,
    dob: new Date(`1986-01-01`),
    weightKg: 72.52,
    heightCm: 183.5508,
    numFingers: 10,
    favoritePet: `Rocky`,
    status: `pending`,
  },
  {
    firstName: `Ricky`,
    lastName: `Revelo`,
    dob: new Date(`1975-01-01`),
    weightKg: 85239.5232,
    heightCm: 166.32313992,
    numFingers: 9,
    favoritePet: `Rolly`,
    status: null,
  },
]
