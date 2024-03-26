export interface IProfile {
    id?: string
    apelido: string
    first_nam: string
    last_name: string
    birth_date: string
    age: number
    weight: number
    sex: string
    height: number
    color: string
    father?: IProfile
    mother?: IProfile
    brothers: IProfile[]
  }
  