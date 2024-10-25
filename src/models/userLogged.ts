import { getNameResponsible, Responsible } from '@/contracts/contracts_shared/responsavel';
import type { ITokenContract } from '@/contracts/token/tokenJwt';

export class UserLogged {
	uuid?: string;
	responsible?: Responsible;
	email: string = '';
	first_name: string = '';
	last_name: string = '';
	token = {} as ITokenContract;

	public getTextResponsible(): string {
		return getNameResponsible(this.responsible)
	}

	public getNameComplete(): string {
		return `${this.first_name} ${this.last_name}`;
	}
	isLogged(): boolean {
		return !(this.uuid == undefined || this.uuid == '');
	}
}
