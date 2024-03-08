import type { IContractApi } from '@/contracts/api/contractApi'
import type { IProfile } from '@/models/profile';
import { refreshToken } from '@/auth/auth';
import getToken from '@/constants/token';
import confs from '@/constants/conf';
import { reactive } from 'vue';
import axios from 'axios';

export async function getProfile(id: string): Promise<IProfile> {
    let result = {} as IProfile;
    try{
        const tok = getToken();

        const current_id = localStorage.getItem('current_id');
        const name = localStorage.getItem('name');

        const res = await axios.get<IContractApi<IProfile>>(`${confs.server}/profile/${current_id}/${name}`, {
            headers: { Authorization: `Bearer ${tok.access_token}` }
        })

        result = res.data.content ?? {} as IProfile;
    } catch (err: any) {
        if (err.response.status == 401){
            try{
                await refreshToken();
                
                return await getProfile(id);
            } catch {
                // Rotear para tela de login
            }
        }
    }

    return result;
}

export let currentProfile = reactive<IProfile>({
    apelido: "Pitxhico",
    primeiro_nome: "Dante",
    idade: 2.3,
    ultimo_nome: '',
    data_nascimento: '05/08/2021',
    peso: 11.5,
    sexo: '',
    altura: 0,
    cor: '',
    tipo_sanguineo: '',
    pai: {
        primeiro_nome: 'Nome do pai'
    } as IProfile,
    mae: {
        primeiro_nome: 'Nome da mãe'
    } as IProfile,
    irmaos: []
});

export function resenha(): string {
    if (currentProfile.idade < 1)
        return `${currentProfile.primeiro_nome} o RN mais lindo!`;
    else if (currentProfile.idade < 3)
        return `${currentProfile.primeiro_nome} está na fase da adolecência do bebê.\nBoa sorte!`;
    else
        return `${currentProfile.primeiro_nome} irá fazer perguntas que o papai e a mamãe não consegue imaginar!`;
}

export function idadeBebe(): string {
    if (currentProfile.idade < 1)
        return `${currentProfile.idade} (RN)`
    else if (currentProfile.idade < 2)
        return `${currentProfile.idade} ano`
    else
        return `${currentProfile.idade} anos`
}

export function quantidadeIrmaos(): string {
    if (currentProfile.irmaos.length == 0)
        return "Nenhum";
    else
        return currentProfile.irmaos.length.toString();
}

(async () => {
    currentProfile = Object.assign(currentProfile, await getProfile(localStorage.getItem('current_id')!))
})()