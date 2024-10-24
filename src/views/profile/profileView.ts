import type { IContractApi } from '@/contracts/api/contractApi';
import type { IProfileContent } from '@/models/profile';
import { refreshToken } from '@/auth/auth';
import getToken from '@/constants/token';
import confs from '@/constants/conf';
import { reactive } from 'vue';
import axios from 'axios';
import { unixDateToString } from '../utils';

export async function getProfile(
	uuid: string,
	name?: string,
): Promise<IProfileContent> {
	let result = {} as IProfileContent;
	try {
		const tok = getToken();

		if (uuid === '') uuid = localStorage.getItem('current_id') ?? '';

		if (name === '') name = localStorage.getItem('name') ?? '';

		const res = await axios.get<IContractApi<IProfileContent>>(
			`${confs.server}/profile/${uuid}/${name}`,
			{
				headers: { Authorization: `Bearer ${tok.access_token}` },
			},
		);

		res.data.content!._birth_date = unixDateToString(
			res.data.content?.birth_date!,
		);

		result = res.data.content ?? ({} as IProfileContent);
	} catch (err: any) {
		if (err.response.status == 401) {
			await refreshToken();

			return await getProfile(uuid);
		}
	}

	return result;
}

export const currentProfile = reactive<IProfileContent>({
	surname: 'Pitxhico',
	first_name: 'Dante',
	short_uuid: '',
	name_shared_link: '',
	age: 2.3,
	last_name: '',
	birth_date: 0,
	_birth_date: '05/08/2021',
	weight: 11.5,
	sex: 0,
	height: 0,
	color: '',
	wordsCount: 0
});

export function resenha(): string {
	if (currentProfile.age < 1)
		return `${currentProfile.first_name} o RN mais lindo!`;
	else if (currentProfile.age < 3)
		return `${currentProfile.first_name} está na fase da adolecência do bebê.\nBoa sorte!`;
	else
		return `${currentProfile.first_name} irá fazer perguntas que o papai e a mamãe não consegue imaginar!`;
}

export function idadeBebe(): string {
	if (currentProfile.age < 1) return `${currentProfile.age} (RN)`;
	else if (currentProfile.age < 2) return `${currentProfile.age} ano`;
	else return `${currentProfile.age} anos`;
}

export function quantidadeIrmaos(): string {
	return '0';
}
//TODO: Corrigir
// (async () => {
//     currentProfile = Object.assign(currentProfile, await getProfile(localStorage.getItem('current_id')!))
// })()
