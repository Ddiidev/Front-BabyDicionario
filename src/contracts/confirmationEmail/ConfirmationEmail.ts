import type { Responsible } from "@/contracts/contracts_shared/responsavel"

export interface IContractEmail {
    first_name: string
    responsible: Responsible
    birth_date: Date
    email: string
    password: string
}