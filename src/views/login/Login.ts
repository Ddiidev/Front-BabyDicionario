import {
	type IContractApi,
	type IContractApiNoContent,
	StatusContractApi,
} from '@/contracts/api/contractApi';
import type { IContractEmail } from '@/contracts/confirmationEmail/ConfirmationEmail';
import { startPasswordReset, verifyCode } from '@/service/login/login';
import type { ITokenContract } from '@/contracts/token/tokenJwt';
import { HandleDataToast } from '@/components/HandleToast';
import { headerAuthorization } from '@/auth/auth';
import { getResolution } from '@/views/utils';
import axios, { AxiosError } from 'axios';
import { Emitter } from '@/utils/emitter';
import confs from '@/constants/conf';
import { ref, type Ref } from 'vue';

export let visibleLogin = false;
let tagRef: HTMLElement;
export let self: any;
export function setThis(me: any) {
	self = me;
}

export interface ILogin {
	email: Ref<string | undefined>;
	password: Ref<string>;
	invalidEmail: Ref<boolean | undefined>;
	invalidPassword: Ref<boolean | undefined>;
	messageError: string;

	newPasswordRecovery: Ref<string>;
	validEmailMessage: Ref<string>;
	invalidNewPasswordRecovery: Ref<boolean | undefined>;
	passwordReset: Ref<boolean | undefined>;
	codeConfirmation: Ref<string | undefined>;
	validCodeConfirmation: Ref<boolean | undefined>;
	flowPasswordReset: Ref<number>;
}

export const loginData: ILogin = {
	email: ref(undefined),
	password: ref(''),
	invalidEmail: ref(undefined),
	invalidPassword: ref(undefined),
	messageError: '',

	newPasswordRecovery: ref(''),
	validEmailMessage: ref(''),
	invalidNewPasswordRecovery: ref(undefined),
	codeConfirmation: ref(undefined),
	validCodeConfirmation: ref(false),
	passwordReset: ref(false),
	flowPasswordReset: ref(1),
};

export function mounted(self: any) {
	setThis(self);

	Emitter.listen('login', (e: HTMLElement) => {
		tagRef = e;
		tagRef.removeEventListener('click', self.setVisible);
		tagRef.addEventListener('click', self.setVisible);
	});

	Emitter.listen('switchVisibleLogin', (e: boolean | null) => {
		if (e !== null) visibleLogin = e;
		else visibleLogin = !visibleLogin;
		setVisible();
	});
}

export function unmounted() {
	visibleLogin = false;

	setVisible();

	Emitter.unlisten('login');

	Emitter.unlisten('switchVisibleLogin');
}

export function watch() {
	return {
		email() {
			invalidEmail();
		},

		password() {
			invalidPassword();
		},

		newPasswordRecovery() {
			invalidNewPasswordRecovery();
		},
	};
}

function invalidNewPasswordRecovery(): boolean {
	//TODO: validar password
	if (
		loginData.newPasswordRecovery.value === undefined ||
		loginData.newPasswordRecovery.value === ''
	) {
		loginData.invalidNewPasswordRecovery.value = true;
		return loginData.invalidNewPasswordRecovery.value;
	}

	loginData.invalidNewPasswordRecovery.value = false;
	return loginData.invalidNewPasswordRecovery.value;
}

function invalidEmail(): boolean {
	//TODO: validar corretamente email email
	if (loginData.email?.value === undefined || loginData.email.value === '') {
		loginData.invalidEmail.value = undefined;
		return true;
	}

	if (!loginData.email?.value?.includes('@')) {
		loginData.invalidEmail.value = true;
		return loginData.invalidEmail.value;
	}

	loginData.invalidEmail.value = false;
	return loginData.invalidEmail.value;
}

export async function login() {
	try {
		loginData.messageError = '';
		const contract = {
			email: loginData.email.value,
			password: loginData.password.value,
		} as IContractEmail;

		const resultLogin = await axios.post<IContractApi<ITokenContract>>(
			`${confs.server}/user/login`,
			contract,
		);

		localStorage.setItem(
			'access_secure',
			JSON.stringify(resultLogin.data.content),
		);
		if (resultLogin.data.status == StatusContractApi.info) {
			const resultDetails = await axios.get<IContractApi<IContractUser>>(
				`${confs.server}/user/details`,
				{
					headers: headerAuthorization(),
				},
			);

			if (resultDetails.data.status == StatusContractApi.info) {
				localStorage.setItem('name', '');
				localStorage.setItem('current_id', '');
				sessionStorage.setItem(
					'email',
					resultDetails.data.content?.email.toString() ?? '',
				);
				sessionStorage.setItem(
					'responsavel',
					resultDetails.data.content?.responsible.toString() ?? '',
				);
				sessionStorage.setItem(
					'user_name',
					resultDetails.data.content?.first_name.toString() ?? '',
				);

				loginData.email.value = undefined;
				loginData.password.value = '';
				loginData.invalidEmail.value = undefined;
				loginData.invalidPassword.value = undefined;
				loginData.messageError = '';

				closePanel();
				window.location.reload();
			}
		}
	} catch (err: any) {
		if (err instanceof AxiosError) {
			const error: IContractApiNoContent = (err as AxiosError).response
				?.data as any;
			loginData.messageError = error.message;
		}
	}

	self.$forceUpdate();
}

function invalidPassword(): boolean {
	//TODO: validar password
	if (
		loginData.password.value === undefined ||
		loginData.password.value === ''
	) {
		loginData.invalidPassword.value = true;
		return loginData.invalidPassword.value;
	}

	loginData.invalidPassword.value = false;
	return loginData.invalidPassword.value;
}

/**
 * Separa isso em um outro arquivo
 */
export async function passwordReset() {}

export function beginPasswordReset() {
	loginData.flowPasswordReset.value = 1;
	loginData.passwordReset.value = true;
	self.$forceUpdate();
}

export async function passwordResetNextStep() {
	if (loginData.flowPasswordReset.value + 1 == 2) {
		loginData.validEmailMessage.value = '';

		loginData.invalidEmail.value = false;
		const user = await startPasswordReset(loginData.email.value ?? '');

		if (!user.isSucess) {
			loginData.invalidEmail.value = true;
			loginData.validEmailMessage.value = user.msg;
			return;
		}
	}

	loginData.flowPasswordReset.value++;
}

export function passwordResetClose() {
	passwordResetCleanFields();
	loginData.passwordReset.value = false;
}

export async function passwordResetVerifyCode() {
	if (
		await verifyCode(
			loginData.email.value ?? '',
			loginData.newPasswordRecovery.value ?? '',
			loginData.codeConfirmation.value ?? '',
		)
	) {
		loginData.validCodeConfirmation.value = true;

		Emitter.emitt('msg-login', {
			msg: 'A sua senha foi redefinida.\nPode proseguir com o login.',
			title: '🔐 Redefinição de senha',
			time: 5000,
		});

		setTimeout(() => {
			passwordResetClose();
		}, 300);
	} else {
		loginData.validCodeConfirmation.value = false;
	}
}

export function passwordResetCleanFields() {
	loginData.codeConfirmation.value = undefined;
	loginData.validCodeConfirmation.value = false;
	loginData.flowPasswordReset.value = 1;
}

export function setVisible() {
	try {
		if (visibleLogin) {
			setTimeout(() => {
				try {
					(self.$refs.emailLogin as any).focus();
				} catch {}
			}, 300);
		}

		const EventHandleResize = () => {
			if (self.tagRef == undefined || !visibleLogin) {
				self.$forceUpdate();
				return;
			}

			const divFloat = self.$refs.divFloat as HTMLElement;
			const tagRefPos = tagRef.getBoundingClientRect();
			if (divFloat !== undefined && tagRef !== undefined) {
				const res = getResolution();

				divFloat.style.display = 'block';
				if (res.width < 530) {
					divFloat.style.left = '0px';
					divFloat.style.top = '100px';
				} else {
					divFloat.style.top = tagRefPos.bottom + 10 + 'px';
					divFloat.style.left = tagRefPos.left + 'px';
				}
				self.$forceUpdate();
			}
		}

		window.removeEventListener('resize', EventHandleResize);
		window.addEventListener('resize', EventHandleResize);
		EventHandleResize();
	} catch {}
}

export function closePanel() {
	visibleLogin = !visibleLogin;
	loginData.passwordReset.value = false;
	self.$forceUpdate();
}
