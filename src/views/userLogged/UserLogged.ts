import type { IContractEmail as userLoggedImpl } from '@/contracts/confirmationEmail/ConfirmationEmail';
import type { ITokenContract } from '@/contracts/tokenJwt/tokenJwt';
import { type IContractApi, type IContractApiNoContent, StatusContractApi } from '@/contracts/api/contractApi';
import { HandleDataToast } from '@/components/HandleToast';
import { getResolution } from '@/views/utils';
import axios, { AxiosError } from 'axios';
import { Emitter } from '@/utils/emitter';
import confs from '@/constants/conf';
import { ref, type Ref } from "vue";
import router from "@/router";
import { UserLogged } from '@/models/userLogged';
import * as user from '@/service/user/user';

export let toastData = new HandleDataToast();
export let visibleUserLogged = false;
let tagRef: HTMLElement;
export let self: any;
export function setThis(me: any) {
    self = me;
}

export interface IUserLoggedData {
    email: Ref<string | undefined>,
    password: Ref<string>,
    invalidEmail: Ref<boolean | undefined>,
    invalidPassword: Ref<boolean | undefined>,
    messageError: string,
    userLogged?: UserLogged,
}

export let userLoggedData: IUserLoggedData = {
    invalidPassword: ref(undefined),
    invalidEmail: ref(undefined),
    email: ref(undefined),
    password: ref(''),
    messageError: ''
};

export async function mounted() {
    Emitter.listen('userLogged', (e: HTMLElement) => {
        tagRef = e;
        tagRef.removeEventListener('click', self.setVisible);
        tagRef.addEventListener('click', self.setVisible);
    });

    Emitter.listen('switchVisibleUserLogged', (e: null) => {
        visibleUserLogged = !visibleUserLogged;
        setVisible();
    });

    userLoggedData.userLogged = await user.dataCurrentUserLogged();
}

export function setVisible() {
    try {
        function EventHandleResize() {
            if (self.tagRef == undefined || !visibleUserLogged) {
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
                    divFloat.style.left = (tagRefPos.left - divFloat.clientWidth + 35) + 'px'
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
    visibleUserLogged = !visibleUserLogged;
    self.$forceUpdate();
}