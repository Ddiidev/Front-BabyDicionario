import type { IConfirmationEmailByCode } from '@/contracts/confirmationEmail/confirmationEmailByCode'
import type { IContractApi, IContractApiNoContent } from '@/contracts/api/contractApi'
import type { IContractEmail } from '@/contracts/confirmationEmail/ConfirmationEmail'
import { Responsible } from "@/contracts/contracts_shared/responsavel"
import type { ITokenContract } from '@/contracts/token/tokenJwt'
import { StatusContractApi } from '@/contracts/api/contractApi'
import { HandleDataToast } from '@/components/HandleToast';
import confs from '@/constants/conf';
import { reactive, ref } from 'vue';
import router from '@/router';
import axios from 'axios';

let selfComponent: any;
export function setSelfComponent(self: any) {
    selfComponent = self;
}

export interface ICreateUser {
    primeiro_nome: string
    pai: boolean
    mae: boolean
    data_nascimento: number
    email: string
    senha: string
    senhaConfirm: string
    codigoConfirmacao: string
    codigoValido: boolean
}

interface IStateModal {
    message: string,
    show: boolean
}

export let modal = { show: false } as IStateModal;
export let toastData = new HandleDataToast();
export const final_step = 4;
export let current_step = ref(1);
export let form_data = reactive<ICreateUser>({
    primeiro_nome: '',
    pai: true,
    mae: false,
    email: '',
    senha: '',
    senhaConfirm: '',
    data_nascimento: Date.now(),
    codigoConfirmacao: '',
    codigoValido: false
});

export function checkedPai() {
    form_data.pai = true;
    form_data.mae = false;
}

export function setModal(value: boolean) {
    modal.show = value;
    selfComponent.$forceUpdate();
}

export function checkedMae() {
    form_data.pai = false;
    form_data.mae = true;
}

export function passwordMatch(): boolean {
    if (form_data.senha === "" || form_data.senhaConfirm == "")
        return false;

    return form_data.senha == form_data.senhaConfirm;
}

async function sendEmail() {
    try {
        //TODO: Melhorar
        const responsavel: Responsible = form_data.pai ? Responsible.pai : Responsible.mae;

        const contract: IContractEmail = {
            email: form_data.email,
            birth_date: new Date(form_data.data_nascimento),
            first_name: form_data.primeiro_nome,
            responsible: responsavel,
            password: form_data.senha
        };

        const result = await axios.post<IContractApiNoContent>(`${confs.server}/user/create/send-code`, contract);

        if (result.data.status == StatusContractApi.error) {
            toastData.addMessage({
                title: "Email de confirmação",
                message: result.data.message
            })
        } else {
            toastData.addMessage({
                title: "Email de confirmação",
                message: "O email de confirmação foi enviado com sucesso!"
            })
        }
    } catch (err: any) {
        if (err.response.status == 409) {
            modal.show = true;
            modal.message = err.response.data.message;
            prevStep();
        }
    }
}

export async function codeVerificationMatch(): Promise<void> {
    form_data.codigoValido = false

    try {
        const contract: IConfirmationEmailByCode = {
            email: form_data.email,
            code: form_data.codigoConfirmacao
        };

        const result: IContractApi<ITokenContract> = (await axios.post(`${confs.server}/confirmation`, contract)).data;

        if (result.status == StatusContractApi.info) {
            localStorage.setItem('access_secure', JSON.stringify(result.content))

            form_data.codigoValido = true

            toastData.addMessage({
                title: 'Código de verificação',
                message: `Usuário confirmado!\n ${form_data.primeiro_nome} já pode criar suas palavrinhas`
            }, 5000)

            setTimeout(() => {
                router.push({ path: `/profile/${form_data.primeiro_nome}` })
            }, 3000);
        } else {
            toastData.addMessage({
                title: 'Código de verificação',
                message: `O código de verificação é inválido`
            })
        }
    } catch { }
}

export function prevStep() {
    current_step.value--;
}

export function nextStep() {
    if (current_step.value == 1) {
        if (form_data.primeiro_nome.trim() === "" || !dataValida()) {
            return;
        }
        setTimeout(focusEmail, 100);
    } else if (current_step.value == 2) {
        if (form_data.email.trim() === "" || !form_data.email.includes('@') || !passwordMatch()) {
            return;
        }
    } else if (current_step.value == 3) {
        sendEmail()
    }

    sessionStorage.setItem('user_name', form_data.primeiro_nome);
    sessionStorage.setItem('responsavel', form_data.pai ? Responsible.pai.toString() : Responsible.mae.toString());
    sessionStorage.setItem('email', form_data.email);

    current_step.value++;
}

function focusEmail(count: number = 0) {
    if (count > 500)
        return;
    else if (selfComponent.$refs.inEmail === undefined)
        setTimeout(() => focusEmail(count + 1), 300);
    else
        selfComponent.$refs.inEmail.focus();
}

export function dataValida(): boolean {
    const matches = /(\d{4})-(\d{2})-(\d{2})/.exec(form_data.data_nascimento.toString());
    if (matches === null) {
        return false;
    }
    const dia = parseInt(matches[3], 10);
    const mes = parseInt(matches[2], 10) - 1;
    const ano = parseInt(matches[1], 10);
    const data = new Date(ano, mes, dia);

    if (ano < 1800) {
        return false;
    }

    if (calcularIdade(data.toDateString()) < 15 /* Triste, mas fazer o que!? */){
        return false;
    }

    return !isNaN(data.getTime());
}


function calcularIdade(dataNascimento: string) {
    const dataNascimentoObj = new Date(dataNascimento);
    const dataAtual = new Date();

    const anoNascimento = dataNascimentoObj.getFullYear();
    const mesNascimento = dataNascimentoObj.getMonth();
    const diaNascimento = dataNascimentoObj.getDate();

    const anoAtual = dataAtual.getFullYear();
    const mesAtual = dataAtual.getMonth();
    const diaAtual = dataAtual.getDate();

    let idade = anoAtual - anoNascimento;

    // Verifica se o aniversário já ocorreu neste ano
    if (mesAtual < mesNascimento || (mesAtual === mesNascimento && diaAtual < diaNascimento)) {
        idade--;
    }

    return idade;
}