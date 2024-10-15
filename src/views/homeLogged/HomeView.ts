import { CurrentUserLogged } from '@/constants/userLogged';
import type { IFamilyProfiles } from '@/models/familyProfiles';
import { isProfile, type IProfile } from '@/models/profile';
import * as servProfile from '@/service/profile/profile';
import * as servWords from '@/service/word/word';
import { getPathImageDefault, imageProfile } from '@/utils/imageProfile';
import { reactive } from 'vue';
import router from '@/router';
import { Sex } from '../profileEdit/profileEdit';

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
		data.profile.father?.uuid !== '' ? data.profile.father?.sex! : Sex.male,
		async (image: Promise<string>) => {
			data.profile.father!.currentImage = await image;
		}
	);
	
	data.profile.mother!.currentImage = await imageProfile(
		CurrentUserLogged.userLogged.uuid!,
		data.profile.mother?.uuid!,
		data.profile.mother?.uuid !== '' ? data.profile.mother?.sex! : Sex.female,
		async (image: Promise<string>) => {
			data.profile.mother!.currentImage = await image;
		}
	);
	data.profile.babys.forEach(async (profile) => {
		profile.currentImage = await getImageCurrentProfile(profile);
		profile.wordsCount = await servWords.countWords(profile.uuid!);
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
		father: {
			currentImage: getPathImageDefault('', Sex.male),
		} as IProfile,
		mother: {
			currentImage: getPathImageDefault('', Sex.female),
		} as IProfile,
		babys: [] as IProfile[],
	} as IFamilyProfiles,
});

export function openSettingsMother(newUser: boolean = false) {
	if (newUser)
		router.push(
			`/userProfileEdit/newMother/undefined`,
		);
	else
		router.push(
			`/userProfileEdit/${data.profile.mother?.short_uuid}/${data.profile.mother?.name_shared_link}`,
		);
}

export function openSettingsFather(newUser: boolean = false) {
	if (newUser)
		router.push(
			`/userProfileEdit/newFather/undefined`,
		);
	else
		router.push(
			`/userProfileEdit/${data.profile.father?.short_uuid}/${data.profile.father?.name_shared_link}`,
		);
}

export function viewWords(profile: IProfile) {
	router.push(`/words/${profile.short_uuid}/${profile.name_shared_link}`);
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
		async (image: Promise<string>) => {
			profile.currentImage = await image;
		}
	);
}

export function openSettingsProfile(profile: IProfile) {
	router.push(
		`/userProfileEdit/${profile.short_uuid}/${profile.name_shared_link}`,
	);
}
