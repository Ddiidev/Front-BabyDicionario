import type { Profile } from '@/models/profile';
import confs from '@/constants/conf';
import axios from 'axios';
import { reactive } from 'vue';

export async function getProfile(id: string): Promise<Profile> {
    const t = await axios.get(`${confs.server}/profiles?id=${id}`);

    return t.data
}

export let currentProfile = reactive<Profile>({
    apelido: "",
    primeiro_nome: "Dante",
    idade: 2.3,
    ultimo_nome: '',
    data_nascimento: '',
    peso: 0,
    sexo: '',
    altura: 0,
    cor: '',
    tipo_sanguineo: '',
    pai: {} as Profile,
    mae: {} as Profile,
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

currentProfile = Object.assign(currentProfile, await getProfile(localStorage.getItem('current_id')!))