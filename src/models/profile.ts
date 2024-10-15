import type { Responsible } from '@/contracts/contracts_shared/responsavel';

export interface IProfileContent extends IProfile {
	_birth_date: string;
}

export interface IProfile {
	uuid?: string;
	short_uuid: string;
	name_shared_link: string;
	surname: string;
	first_name: string;
	last_name: string;
	birth_date: number;
	responsible?: Responsible;
	age: number;
	weight: number;
	sex: number;
	height: number;
	color: string;
	currentImage?: string;
	wordsCount: number;
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
		currentImage: undefined,
		wordsCount: 0,
	};
}

export function isProfile(p?: IProfile): p is IProfile {
	return p?.uuid !== undefined && p?.uuid !== '';
}
