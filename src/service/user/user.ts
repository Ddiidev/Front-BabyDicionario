import { StatusContractApi, type IContractApi } from '@/contracts/api/contractApi'
import { UserLogged } from '@/models/userLogged';
import confs from '@/constants/conf';
import * as auth from '@/auth/auth';
import axios from 'axios';

export async function dataCurrentUserLogged(): Promise<UserLogged> {
    let dataUserLogged = new UserLogged();
    try {
        dataUserLogged.token = JSON.parse(localStorage.getItem('access_secure') ?? '');
        try{
            const userDetails = await axios.get<IContractApi<UserLogged>>(`${confs.server}/user/details`, {
                headers: auth.headerAuthorization()
            });

            if (userDetails.data.status == StatusContractApi.info && userDetails.data.content !== undefined)
                dataUserLogged = Object.assign(dataUserLogged, userDetails.data.content!);
        } catch (err: any) {
            await auth.refreshToken();
        }

    } catch {
    }
    return dataUserLogged;
}