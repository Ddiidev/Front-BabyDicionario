import { isProfile, type IProfile } from "@/models/profile";
import router from "@/router";
import * as servProfile from "@/service/profile/profile";
import { reactive } from "vue";

export let self: any;
export function setThis(me: any) {
    self = me;
}
export async function mounted(self: any) {
    setThis(self);

    data.profile = await servProfile.loadFamilyProfile();
}

interface IHomeLogged {
    profile: IProfile;
}

export function containMother(): boolean {
    if (isProfile(data.profile.mother))
        return true;

    return false;
}

export function containFater(): boolean {
    if (isProfile(data.profile.father))
        return true;
    
    return false;
}

export let data = reactive<IHomeLogged>({
    profile: {} as IProfile,
})

export function openSettingsMother() {
    router.push(`/userProfileEdit/${data.profile.mother?.short_uuid}/${data.profile.mother?.name_shared_link}`)
}
export function openSettingsFather() {
    router.push(`/userProfileEdit/${data.profile.father?.short_uuid}/${data.profile.father?.name_shared_link}`)
}