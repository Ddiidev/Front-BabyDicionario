export interface Profile {
    id?: string
    apelido: string
    primeiro_nome: string
    ultimo_nome: string
    data_nascimento: string
    idade: number
    peso: number
    sexo: string
    altura: number
    cor: string
    tipo_sanguineo: string
    pai?: Profile
    mae?: Profile
    irmaos: Profile[]
  }
  