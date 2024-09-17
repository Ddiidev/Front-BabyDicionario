import * as auth from '@/auth/auth';
import confs from '@/constants/conf';
import {
	StatusContractApi,
	type IContractApi,
	type IContractApiNoContent,
} from '@/contracts/api/contractApi';
import type { IFamilyProfiles } from '@/models/familyProfiles';
import type { IProfile } from '@/models/profile';
import axios from 'axios';

/**
 * Recupera o perfil da família do servidor.
 *
 * @throws {Error} - Se o servidor retornar um código de status 401, indicando uma solicitação não autorizada.
 */
export async function loadFamilyProfile(): Promise<IFamilyProfiles> {
	let dataProfile: IFamilyProfiles = {} as IFamilyProfiles;
	try {
		const userDetails = await axios.get<IContractApi<IFamilyProfiles>>(
			`${confs.server}/profile/all-family`,
			{
				headers: auth.headerAuthorization(),
			},
		);

		if (
			userDetails.data.status == StatusContractApi.info &&
			userDetails.data.content !== undefined
		)
			dataProfile = Object.assign(dataProfile, userDetails.data.content!);
	} catch (err: any) {
		throw err;
	}

	return dataProfile;
}

/**
 * Salva o perfil fornecido fazendo uma requisição PUT para o servidor.
 *
 * @param {IProfile} profile - O objeto de perfil a ser salvo.
 * @return {Promise<void>} - Uma promessa que é resolvida quando o perfil é salvo com sucesso.
 * @throws {Error} - Se o servidor retornar um código de status 401, indicando uma solicitação não autorizada.
 */
export async function saveProfile(profile: IProfile) {
	try {
		await axios.put<IContractApiNoContent>(
			`${confs.server}/profile/`,
			profile,
			{
				headers: auth.headerAuthorization(),
			},
		);
	} catch (err: any) {
		throw err;
	}
}

/**
 * Cria um novo perfil fornecido fazendo uma requisição POST para o servidor.
 *
 * @throws {Error} - Se o servidor retornar um código de status 401, indicando uma solicitação não autorizada.
 */
export async function newProfile(profile: IProfile): Promise<IProfile> {
	let result = {} as IProfile;
	try {
		const response = await axios.post<IContractApi<IProfile>>(
			`${confs.server}/profile/`,
			profile,
			{
				headers: auth.headerAuthorization(),
			},
		);

		if (
			response.data.status != StatusContractApi.info ||
			response.data.content === undefined
		) {
			throw response.data.message;
		}

		result = Object.assign(result, response.data.content!);
	} catch (err: any) {
		throw err;
	}

	return result;
}
