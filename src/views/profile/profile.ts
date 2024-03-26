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
    first_nam: "Dante",
    age: 2.3,
    last_name: '',
    birth_date: '05/08/2021',
    weight: 11.5,
    sex: '',
    height: 0,
    color: '',
    tipo_sanguineo: '',
    father: {
        first_nam: 'Nome do pai'
    } as IProfile,
    mother: {
        first_nam: 'Nome da mãe'
    } as IProfile,
    brothers: []
});

export function resenha(): string {
    if (currentProfile.age < 1)
        return `${currentProfile.first_nam} o RN mais lindo!`;
    else if (currentProfile.age < 3)
        return `${currentProfile.first_nam} está na fase da adolecência do bebê.\nBoa sorte!`;
    else
        return `${currentProfile.first_nam} irá fazer perguntas que o papai e a mamãe não consegue imaginar!`;
}

export function idadeBebe(): string {
    if (currentProfile.age < 1)
        return `${currentProfile.age} (RN)`
    else if (currentProfile.age < 2)
        return `${currentProfile.age} ano`
    else
        return `${currentProfile.age} anos`
}

export function quantidadeIrmaos(): string {
    if (currentProfile.brothers.length == 0)
        return "Nenhum";
    else
        return currentProfile.brothers.length.toString();
}

(async () => {
    currentProfile = Object.assign(currentProfile, await getProfile(localStorage.getItem('current_id')!))
})()