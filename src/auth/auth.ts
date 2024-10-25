import axios, { AxiosHeaders, type RawAxiosRequestHeaders } from 'axios';
import type { ITokenContract } from '@/contracts/token/tokenJwt';
import {
	StatusContractApi,
	type IContractApi,
} from '@/contracts/api/contractApi';
import confs from '@/constants/conf';

export async function refreshToken(): Promise<void> {
	let token: ITokenContract = JSON.parse(
		localStorage.getItem('access_secure') ?? '',
	);

	const res = await axios.get<IContractApi<ITokenContract>>(
		`${confs.server}/auth/refresh-token`,
		{
			headers: headerAuthorizationAndRefreshToken(),
		},
	);

	token = res.data.content ?? ({} as ITokenContract);

	if (res.data.status == StatusContractApi.error) {
		localStorage.removeItem('access_secure');
		throw new Error('Falha ao gerar um novo token'); // TODO corrigir, para notificar em tela.
	}

	localStorage.setItem('access_secure', JSON.stringify(token));
}

export function headerAuthorization(): RawAxiosRequestHeaders | AxiosHeaders {
	const token: ITokenContract = JSON.parse(
		localStorage.getItem('access_secure') ?? '',
	);

	return {
		Authorization: `Bearer ${token.access_token}`,
	};
}

export function headerAuthorizationAndRefreshToken():
	| RawAxiosRequestHeaders
	| AxiosHeaders {
	const token: ITokenContract = JSON.parse(
		localStorage.getItem('access_secure') ?? '',
	);

	return {
		'refresh-token': token.refresh_token,
		Authorization: `Bearer ${token.access_token}`,
	};
}

export function headerAuthorizationRecovery():
	| RawAxiosRequestHeaders
	| AxiosHeaders {
	const token: string = localStorage.getItem('access_recovery') ?? '';

	return {
		Authorization: `Bearer ${token}`,
	};
}

export function userLogged(): boolean {
	try {
		const token: ITokenContract = JSON.parse(
			localStorage.getItem('access_secure') ?? '',
		);
		return true;
	} catch {
		return false;
	}
}
