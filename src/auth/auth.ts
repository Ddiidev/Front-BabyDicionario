import { type UserLogged, getResponsibleValue } from '@/models/userLogged';
import axios, { AxiosHeaders, type RawAxiosRequestHeaders } from 'axios';
import { Responsible } from '@/contracts/contracts_shared/responsavel';
import type { ITokenContract } from '@/contracts/token/tokenJwt';
import type { IContractApi } from '@/contracts/api/contractApi'
import confs from '@/constants/conf';

export async function refreshToken(): Promise<void> {
    let token: ITokenContract = JSON.parse(localStorage.getItem('access_secure') ?? '')

    const res = await axios.get<IContractApi<ITokenContract>>(`${confs.server}/auth/refresh-token`, {
        headers: headerAuthorization()
    })

    token = res.data.content ?? {} as ITokenContract;

    localStorage.setItem('access_secure', JSON.stringify(token));
}

export function headerAuthorization(): RawAxiosRequestHeaders | AxiosHeaders {
    let token: ITokenContract = JSON.parse(localStorage.getItem('access_secure') ?? '')

    return {
        'refresh-token': token.refresh_token,
        Authorization: `Bearer ${token.access_token}`
    }
}

export function headerAuthorizationRecovery(): RawAxiosRequestHeaders | AxiosHeaders {
    let token: string = localStorage.getItem('access_recovery') ?? '';

    return {
        Authorization: `Bearer ${token}`
    }
}

export function userLogged(): boolean {
    try {
        let token: ITokenContract = JSON.parse(localStorage.getItem('access_secure') ?? '')
        return true;
    } catch {
        return false;
    }
}