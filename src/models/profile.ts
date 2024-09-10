import type { Responsible } from "@/contracts/contracts_shared/responsavel"

export interface IProfile {
  uuid?: string
  short_uuid: string
  name_shared_link: string
  surname: string
  first_name: string
  last_name: string
  birth_date: number
  responsible?: Responsible
  age: number
  weight: number
  sex: number
  height: number
  color: string
  father?: IProfile
  mother?: IProfile
  brothers: IProfile[]
}

export function newEmptyProfile(): IProfile {
  return {
    short_uuid: '',
    name_shared_link: '',
    surname: '',
    first_name: '',
    last_name: '',
    birth_date: 0,
    age: 0,
    weight: 0,
    sex: 0,
    height: 0,
    color: '',
    father: undefined,
    mother: undefined,
    brothers: []
  }
}

export function isProfile(p?: IProfile): p is IProfile {
  return p !== undefined &&
    typeof p.father !== 'undefined' &&
    typeof p.mother !== 'undefined' &&
    (Array.isArray(p.brothers) && p.brothers.every(isProfile))
} 