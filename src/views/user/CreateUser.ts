import type { IConfirmationEmailByCode } from '@/contracts/confirmationEmail/confirmationEmailByCode';
import type {
	IContractApi,
	IContractApiNoContent,
} from '@/contracts/api/contractApi';
import type { IContractEmail } from '@/contracts/confirmationEmail/ConfirmationEmail';
import { getNameResponsible, Responsible } from '@/contracts/contracts_shared/responsavel';
import type { ITokenContract } from '@/contracts/token/tokenJwt';
import { StatusContractApi } from '@/contracts/api/contractApi';
import { HandleDataToast } from '@/components/HandleToast';
import confs from '@/constants/conf';
import { reactive, ref } from 'vue';
import router from '@/router';
import axios from 'axios';
import type { IProfile } from '@/models/profile';
import { Word } from '@/models/words';
import * as profileServ from '@/service/profile/profile';
import * as storageServ from '@/service/storage/storage';
import * as wordServ from '@/service/word/word';
import * as localProfile from '@/service/profile/localProfile';
import { getCacheImage } from '@/utils/imageProfile';
import { dataCurrentUserLogged } from '@/service/user/user';

let selfComponent: any;
export function setSelfComponent(self: any) {
	current_step.value = STEPS.HOME
	selfComponent = self;
}

export interface ICreateUser {
	primeiro_nome: string;
	pai: boolean;
	mae: boolean;
	data_nascimento: number;
	email: string;
	senha: string;
	senhaConfirm: string;
	codigoConfirmacao: string;
	codigoValido: boolean;
	sync: boolean;
}

interface IStateModal {
	message: string;
	show: boolean;
}

export const STEPS = {
	HOME: 1,
	DATA_NO_SYNC: 1.5,
	EMAIL_AND_PASSWORD: 2,
	SEND_EMAIL_CONFIRMATION: 3,
	CONFIRMATION_CODE: 4,
}

export const modal = { show: false } as IStateModal;
export const toastData = new HandleDataToast();
export const final_step = STEPS.CONFIRMATION_CODE;
export const current_step = ref(1);
export const formData = reactive<ICreateUser>({
	primeiro_nome: '',
	pai: true,
	mae: false,
	email: '',
	senha: '',
	senhaConfirm: '',
	data_nascimento: Date.now(),
	codigoConfirmacao: '',
	codigoValido: false,
	sync: false
});

export function checkedPai() {
	formData.pai = true;
	formData.mae = false;
}

export function setModal(value: boolean) {
	modal.show = value;
	selfComponent.$forceUpdate();
}

export function checkedMae() {
	formData.pai = false;
	formData.mae = true;
}

export function passwordMatch(): boolean {
	if (formData.senha === '' || formData.senhaConfirm == '') return false;

	return formData.senha == formData.senhaConfirm;
}

async function sendEmail() {
	try {
		//TODO: Melhorar
		const responsavel: Responsible = formData.pai
			? Responsible.father
			: Responsible.mother;

		const contract: IContractEmail = {
			email: formData.email,
			birth_date: new Date(formData.data_nascimento),
			first_name: formData.primeiro_nome,
			responsible: responsavel,
			password: formData.senha,
		};

		const result = await axios.post<IContractApiNoContent>(
			`${confs.server}/user/create/send-code-confirmation`,
			contract,
		);

		if (result.data.status == StatusContractApi.error) {
			toastData.addMessage({
				title: 'Email de confirmação',
				message: result.data.message,
			});
		} else {
			toastData.addMessage({
				title: 'Email de confirmação',
				message: 'O email de confirmação foi enviado com sucesso!',
			});
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
	formData.codigoValido = false;

	try {
		const contract: IConfirmationEmailByCode = {
			email: formData.email,
			code: formData.codigoConfirmacao,
		};

		const result: IContractApi<ITokenContract> = (
			await axios.post(`${confs.server}/confirmation`, contract)
		).data;

		if (result.status == StatusContractApi.info) {
			localStorage.setItem(
				'access_secure',
				JSON.stringify(result.content),
			);

			formData.codigoValido = true;

			await creteProfilesNoSynchronized();

			toastData.addMessage(
				{
					title: 'Código de verificação',
					message: `Usuário confirmado!\n ${formData.primeiro_nome} já pode criar suas palavrinhas`,
				},
				5000,
			);

			setTimeout(() => {
				router.push({ path: `/` });
			}, 3000);
		} else {
			toastData.addMessage({
				title: 'Código de verificação',
				message: `O código de verificação é inválido`,
			});
		}
	} catch (err) {
		console.log(err)
	}
}

export function prevStep() {
	if ([STEPS.EMAIL_AND_PASSWORD, STEPS.DATA_NO_SYNC].includes(current_step.value) && containProfilesLocal())
		current_step.value -= 0.5;
	else
		current_step.value--;
}

export function nextStep() {
	if (current_step.value == STEPS.HOME) {
		if (formData.primeiro_nome.trim() === '' || !dataValida()) {
			return;
		}
		setTimeout(focusEmail, 100);
	} else if (current_step.value == STEPS.EMAIL_AND_PASSWORD) {
		if (
			formData.email.trim() === '' ||
			!formData.email.includes('@') ||
			!passwordMatch()
		) {
			return;
		}
	} else if (current_step.value == STEPS.SEND_EMAIL_CONFIRMATION) {
		sendEmail();
	}

	sessionStorage.setItem('user_name', formData.primeiro_nome);
	sessionStorage.setItem(
		'responsavel',
		formData.pai ? Responsible.father.toString() : Responsible.mother.toString(),
	);
	sessionStorage.setItem('email', formData.email);

	if ([STEPS.HOME, STEPS.DATA_NO_SYNC].includes(current_step.value) && containProfilesLocal())
		current_step.value += 0.5;
	else
		current_step.value++;
}

function focusEmail(count: number = 0) {
	if (count > 500) return;
	else if (selfComponent.$refs.inEmail === undefined)
		setTimeout(() => focusEmail(count + 1), 300);
	else selfComponent.$refs.inEmail.focus();
}

export function dataValida(): boolean {
	const matches = /(\d{4})-(\d{2})-(\d{2})/.exec(
		formData.data_nascimento.toString(),
	);
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

	if (
		calcularIdade(data.toDateString()) < 15 /* Triste, mas fazer o que!? */
	) {
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
	if (
		mesAtual < mesNascimento ||
		(mesAtual === mesNascimento && diaAtual < diaNascimento)
	) {
		idade--;
	}

	return idade;
}

function containProfilesLocal(): boolean {
	const profiles = JSON.parse(localStorage.getItem('profiles') || '[]') as IProfile[]

	return profiles.length > 0;
}

export function getInfoDataNoTSynchronized() {
	const profiles = JSON.parse(localStorage.getItem('profiles') || '[]') as IProfile[]
	const words = (JSON.parse(localStorage.getItem('words') || '[]') as any[]).map(w => new Word(w));

	return profiles.map(p => {
		return {
			name: p.first_name,
			countWords: words.filter(w => w.profile_uuid == p.uuid).length,
		}
	})
}

export function countProfiles(): Number {
	const profiles = JSON.parse(localStorage.getItem('profiles') || '[]') as IProfile[]

	return profiles.length;
}

export function syncNo(): void {
	formData.sync = false;
	nextStep();
}

export function syncYes(): void {
	formData.sync = true;
	nextStep();
}

async function creteProfilesNoSynchronized() {
	const families = localProfile.getLocalFamilyProfile()

	for (let i = 0; i < families.babys.length; i++) {
		const baby = families.babys[i];

		try {
			const babyCreated = await profileServ.newProfile({
				...baby,
				uuid: 'newBaby'
			});
			const currentUser = await dataCurrentUserLogged();
			const userIdLocal = undefined;
			const cacheImage = getCacheImage(`${userIdLocal}-${baby.uuid}`)

			if (cacheImage) {
				await storageServ.uploadImageFormatBase64Profile(
					cacheImage?.image ?? "",
					currentUser.uuid!,
					babyCreated.uuid!
				);
			}

			const wordsCurrentBaby = localProfile.getLocalWordsFromProfile(baby.uuid)
			if (wordsCurrentBaby.length > 0) {
				wordServ.saveWord(
					babyCreated.short_uuid,
					babyCreated.name_shared_link,
					...wordsCurrentBaby.map(w => {
						w.profile_uuid = babyCreated.uuid!;
						return w;
					})
				);
			}

			localProfile.deleteLocalProfile(baby.uuid!);
			localProfile.deleteLocalPhotoProfile(baby.uuid!);
			localProfile.deleteLocalWordsFromProfile(baby.uuid!);
		} catch (err) {
			console.log(err);
		}
	}
}
