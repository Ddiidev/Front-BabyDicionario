import { StatusContractApi, type IContractApi } from '@/contracts/api/contractApi'
import { UserLogged } from '@/models/userLogged';
import confs from '@/constants/conf';
import * as auth from '@/auth/auth';
import axios from 'axios';
import { CurrentUserLogged } from '@/constants/userLogged';

export async function dataCurrentUserLogged(): Promise<UserLogged> {
    let dataUserLogged = new UserLogged();
    try {
        dataUserLogged.token = JSON.parse(localStorage.getItem('access_secure') ?? '');
        const objSub = parseJwt<{ sub: string }>(dataUserLogged.token.access_token);
        dataUserLogged.uuid = objSub.sub;

        try {
            const userDetails = await axios.get<IContractApi<UserLogged>>(`${confs.server}/user/details`, {
                headers: auth.headerAuthorization()
            });

            if (userDetails.data.status == StatusContractApi.info && userDetails.data.content !== undefined)
                dataUserLogged = Object.assign(dataUserLogged, userDetails.data.content!);
        } catch (err) {
            await auth.refreshToken();
        }

    } catch {
    }

    CurrentUserLogged.userLogged = dataUserLogged;
    return dataUserLogged;
}
function parseJwt<T>(token: string): T {
    try {
        const base64Url = token.split('.')[1];
        if (typeof base64Url !== 'string') {
            return {} as T;
        }

        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map((c) => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload) as T;
    } catch (error) {
        return {} as T;
    }
}
