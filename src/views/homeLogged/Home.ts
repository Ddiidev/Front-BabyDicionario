import { CurrentUserLogged } from '@/constants/userLogged';
import type { IFamilyProfiles } from '@/models/familyProfiles';
import { isProfile, type IProfile } from '@/models/profile';
import router from '@/router';
import * as servProfile from '@/service/profile/profile';
import { imageProfile } from '@/utils/imageProfile';
import { sleep } from '@/utils/time';
import { reactive } from 'vue';

export let self: any;
export function setThis(me: any) {
	self = me;
}
export async function mounted(self: any) {
	setThis(self);

	data.profile = await servProfile.loadFamilyProfile();
	data.profile.father!.currentImage = await imageProfile(
		CurrentUserLogged.userLogged.uuid!,
		data.profile.father?.uuid!,
		data.profile.father?.sex!,
	);
	data.profile.mother!.currentImage = await imageProfile(
		CurrentUserLogged.userLogged.uuid!,
		data.profile.mother?.uuid!,
		data.profile.mother?.sex!,
	);
	data.profile.babys.forEach(async (profile) => {
		profile.currentImage = await getImageCurrentProfile(profile);
	});
}

interface IHomeLogged {
	profile: IFamilyProfiles;
}

export function containMother(): boolean {
	if (isProfile(data.profile.mother)) return true;

	return false;
}

export function containFater(): boolean {
	if (isProfile(data.profile.father)) return true;

	return false;
}

export const data = reactive<IHomeLogged>({
	profile: {
		father: {} as IProfile,
		mother: {} as IProfile,
		babys: [] as IProfile[],
	} as IFamilyProfiles,
});

export function openSettingsMother(newUser: boolean = false) {
	if (newUser)
		router.push(
			`/userProfileEdit/newMother/${data.profile.mother?.name_shared_link}`,
		);
	else
		router.push(
			`/userProfileEdit/${data.profile.mother?.short_uuid}/${data.profile.mother?.name_shared_link}`,
		);
}

export function openSettingsFather(newUser: boolean = false) {
	if (newUser)
		router.push(
			`/userProfileEdit/newFather/${data.profile.father?.name_shared_link}`,
		);
	else
		router.push(
			`/userProfileEdit/${data.profile.father?.short_uuid}/${data.profile.father?.name_shared_link}`,
		);
}

export function addNewBaby() {
	router.push(`/userProfileEdit/newBaby/undefined`);
}

export async function getImageCurrentProfile(
	profile: IProfile,
): Promise<string | undefined> {
	return await imageProfile(
		CurrentUserLogged.userLogged.uuid!,
		profile.uuid!,
		profile.sex!,
	);
}

export function openSettingsProfile(profile: IProfile) {
	router.push(
		`/userProfileEdit/${profile.short_uuid}/${profile.name_shared_link}`,
	);
}
