import { HandleDataToast } from '@/components/HandleToast';
import { getResolution } from '@/views/utils';
import axios, { AxiosError } from 'axios';
import { Emitter } from '@/utils/emitter';
import { ref, type Ref } from "vue";
import { UserLogged } from '@/models/userLogged';
import * as user from '@/service/user/user';
import router from '@/router';
import { imageProfile } from '@/utils/imageProfile';
import { CurrentUserLogged } from '@/constants/userLogged';
import { Sex } from '../profileEdit/profileEdit';
import { Responsible } from '@/contracts/contracts_shared/responsavel';
import { getSexDefaultFromResponsible } from '@/utils/sexAndResponsible';

export const toastData = new HandleDataToast();
export let visibleUserLogged = false;
let tagRef: HTMLElement;
export let self: any;
export function setThis(me: any) {
    self = me;
}

interface IUserLoggedData {
    email: Ref<string | undefined>,
    password: Ref<string>,
    invalidEmail: Ref<boolean | undefined>,
    invalidPassword: Ref<boolean | undefined>,
    messageError: string,
    userLogged?: UserLogged,
    currentImage?: string
}

export const userLoggedData: IUserLoggedData = {
    invalidPassword: ref(undefined),
    invalidEmail: ref(undefined),
    email: ref(undefined),
    password: ref(''),
    messageError: '',
    currentImage: ''
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
    userLoggedData.currentImage = await imageProfile(CurrentUserLogged.userLogged.uuid!, 'default-user', getSexDefaultFromResponsible(CurrentUserLogged.userLogged.responsible!));
}

export function singOut() {
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
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