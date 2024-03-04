import type { IContractEmail } from '@/contracts/confirmationEmail/ConfirmationEmail';
import type { ITokenContract } from '@/contracts/tokenJwt/tokenJwt';
import { type IContractApi, type IContractApiNoContent, StatusContractApi } from '@/contracts/api/contractApi';
import { HandleDataToast } from '@/components/HandleToast';
import { getResolution } from '@/views/utils';
import axios, { AxiosError } from 'axios';
import { Emitter } from '@/utils/emitter';
import confs from '@/constants/conf';
import { ref, type Ref } from "vue";
import router from "@/router";
import { headerAuthorization } from '@/auth/auth';

export let toastData = new HandleDataToast();
export let visibleLogin = false;
let tagRef: HTMLElement;
export let self: any;
export function setThis(me: any) {
    self = me;
}

export interface ILogin {
    email: Ref<string | undefined>,
    password: Ref<string>,
    invalidEmail: Ref<boolean | undefined>,
    invalidPassword: Ref<boolean | undefined>,
    messageError: string
}

export let loginData: ILogin = {
    email: ref(undefined),
    password: ref(''),
    invalidEmail: ref(undefined),
    invalidPassword: ref(undefined),
    messageError: ''
};

export function mounted() {
    Emitter.listen('login', (e: HTMLElement) => {
        tagRef = e;
        tagRef.removeEventListener('click', self.setVisible);
        tagRef.addEventListener('click', self.setVisible);
    });

    Emitter.listen('switchVisibleLogin', (e: null) => {
        visibleLogin = !visibleLogin;
        setVisible();
    });
}

export function watch() {
    return {
        email() {
            invalidEmail();
        },

        password() {
            invalidPassword();
        }
    }
}


function invalidPassword(): boolean {
    //TODO: validar password
    if (loginData.password.value === undefined || loginData.password.value === '') {
        loginData.invalidPassword.value = true;
        return loginData.invalidPassword.value;
    }

    loginData.invalidPassword.value = false;
    return loginData.invalidPassword.value;
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
        loginData.messageError = ''
        const contract = {
            email: loginData.email.value,
            password: loginData.password.value
        } as IContractEmail;

        const resultLogin = await axios.post<IContractApi<ITokenContract>>(`${confs.server}/user/login`, contract);
        
        localStorage.setItem('access_secure', JSON.stringify(resultLogin.data.content))
        if (resultLogin.data.status == StatusContractApi.info) {
            const resultDetails = await axios.get<IContractApi<IContractUser>>(`${confs.server}/user/details`, {
                headers: headerAuthorization()
            });

            if (resultDetails.data.status == StatusContractApi.info) {
                localStorage.setItem('name', '')
                localStorage.setItem('current_id', '')
                sessionStorage.setItem('email', resultDetails.data.content?.email.toString() ?? '');
                sessionStorage.setItem('responsavel', resultDetails.data.content?.responsible.toString() ?? '');
                sessionStorage.setItem('user_name', resultDetails.data.content?.first_name.toString() ?? '');

                loginData = {
                    email: ref(undefined),
                    password: ref(''),
                    invalidEmail: ref(undefined),
                    invalidPassword: ref(undefined),
                    messageError: ''
                };

                closePanel();
            }
        }

    } catch (err: any) {
        if (err instanceof AxiosError) {
            const error: IContractApiNoContent = (err as AxiosError).response?.data as any;
            loginData.messageError = error.message
        }
    }
}

export function setVisible() {
    try {
        if (visibleLogin) {
            setTimeout(() => {
                try {
                    (self.$refs.emailLogin as any).focus();
                } catch { }
            }, 300)
        }

        function EventHandleResize() {
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
                    divFloat.style.top = (tagRefPos.bottom + 10) + 'px';
                    divFloat.style.left = tagRefPos.left + 'px';
                }
                self.$forceUpdate();
            }
        }

        window.removeEventListener('resize', EventHandleResize);
        window.addEventListener("resize", EventHandleResize);
        EventHandleResize();
    } catch { }
}

export function closePanel() {
    visibleLogin = !visibleLogin;
    self.$forceUpdate();
}