import type { ITokenContract } from '@/contracts/tokenJwt/tokenJwt';
import type { IContractApi } from '@/contracts/api/contractApi'
import confs from '@/constants/conf';
import axios from 'axios';

export async function refreshToken(): Promise<void> {
    let token: ITokenContract = JSON.parse(localStorage.getItem('access_secure') ?? '')

    const res = await axios.get<IContractApi<ITokenContract>>(`${confs.server}/auth/refresh-token`, {
        headers: {
            'refresh-token': token.refresh_token,
            Authorization: `Bearer ${token.access_token}`
        }
    })

    token = res.data.content ?? {} as ITokenContract;

    localStorage.setItem('access_secure', JSON.stringify(token));
}