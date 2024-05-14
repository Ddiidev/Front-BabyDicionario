import * as auth from "@/auth/auth";
import confs from "@/constants/conf";
import { StatusContractApi, type IContractApi, type IContractApiNoContent } from "@/contracts/api/contractApi";
import type { IProfile } from "@/models/profile";
import axios from "axios";

/**
 * Recupera o perfil da família do servidor.
 *
 * @return {Promise<IProfile>} O objeto de perfil da família.
 * @throws {Error} - Se o servidor retornar um código de status 401, indicando uma solicitação não autorizada.
 */
export async function loadFamilyProfile() {
    let dataProfile: IProfile = {} as IProfile;
    try {
        const userDetails = await axios.get<IContractApi<IProfile>>(`${confs.server}/profile/details`, {
            headers: auth.headerAuthorization()
        });

        if (userDetails.data.status == StatusContractApi.info && userDetails.data.content !== undefined)
            dataProfile = Object.assign(dataProfile, userDetails.data.content!);
    } catch (err: any) {
        if (err.response.status == 401) {
            await auth.refreshToken();

            return await loadFamilyProfile();
        }
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
        await axios.put<IContractApiNoContent>(`${confs.server}/profile/`,
            profile,
            {
                headers: auth.headerAuthorization(),
            }
        );
    } catch (err: any) {
        if (err.response.status = 401) {
            await auth.refreshToken();

            return await saveProfile(profile);
        }
    }

}