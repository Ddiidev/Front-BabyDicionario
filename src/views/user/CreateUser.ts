import { reactive, ref } from 'vue';

export interface ICreateUser {
    primeiro_nome: string
    pai: boolean
    mae: boolean
    idade: number
    email: string
    senha: string
    senhaConfirm: string
    codigoConfirmacao: string
}

export const final_step = 4;
export let current_step = ref(1);
export let form_data = reactive<ICreateUser>({
    primeiro_nome: '',
    pai: true,
    mae: false,
    email: '',
    senha: '',
    senhaConfirm: '',
    idade: 0,
    codigoConfirmacao: ''
});

export function checkedPai() {
    form_data.pai = true;
    form_data.mae = false;
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

export function codeVerificationMatch(): boolean {
    return false;
}

export function prevStep() {
    current_step.value--;
    console.log(form_data)
}

export function nextStep() {
    if (current_step.value == 1) {
        if (form_data.primeiro_nome.trim() === "") {
            return;
        }
    } else if (current_step.value == 2) {
        if (form_data.email.trim() === "" || !form_data.email.includes('@') || !passwordMatch()){
            return;
        }
    }

    current_step.value++;
}