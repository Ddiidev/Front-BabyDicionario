import { Responsible } from "@/contracts/contracts_shared/responsavel"
import type { ITokenContract } from "@/contracts/token/tokenJwt"

export class UserLogged {
    responsible?: Responsible
    email: string = ''
    first_name: string = ''
    last_name: string = ''
    token = {} as ITokenContract

    public getNameResponsible(): string {
        const name = this.responsible?.toString() ?? '';
        if (name.length > 0)
            return name[0].toLocaleUpperCase() + name.substring(1);
        else
            return '';
    }

    public getNameComplete(): string {
        return `${this.first_name} ${this.last_name}`;
    }
}

// TODO: Torana-lo genérico o mais breve
export function getResponsibleValue(s: string): Responsible | undefined {
    const mapping: { [key: string]: Responsible } = {
        'pai': Responsible.pai,
        'mae': Responsible.mae
    };
    return mapping[s];
}