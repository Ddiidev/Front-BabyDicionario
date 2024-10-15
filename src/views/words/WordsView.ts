import { CurrentUserLogged } from '@/constants/userLogged';
import { reactive } from 'vue';
import { getPathImageDefault, imageProfile } from '@/utils/imageProfile';
import { Word } from '@/models/words';
import { dataCurrentUserLogged } from '@/service/user/user';
import router from '@/router';
import { getProfile } from '../profile/profileView';
import { type RouteLocationNormalizedLoaded } from 'vue-router';
import type { IProfileContent } from '@/models/profile';
import { getWords } from '@/service/word/word';
import { getLocalProfile } from '@/service/profile/localProfile';

export let self: any;
export function setThis(me: any) {
	self = me;
}

export const data = reactive({
	profile: {
		currentImage: getPathImageDefault('', 0),
	} as IProfileContent,
	isLoading: false,
	isLoadingPhoto: false,
	words: [] as Word[],
	userLogged: CurrentUserLogged.userLogged,
	isNewWord: false,
	isClosing: false,
	isRegisterWordVisible: false,

	shortUUID: '',
	nameShared: '',
});

export async function mounted(useRoute: RouteLocationNormalizedLoaded) {
	try{
		setThis(self);
		data.shortUUID = useRoute.params.shortUUID.toString();
		data.nameShared = useRoute.params.nameShared.toString();
		
		CurrentUserLogged.userLogged = await dataCurrentUserLogged();
		const words = JSON.parse(localStorage.getItem('words') || '[]').map((w: any) => new Word(w));

		if (CurrentUserLogged.userLogged.uuid) {
			words.push(...(await getWords(data.shortUUID, data.nameShared) || []))
			
			data.userLogged = CurrentUserLogged.userLogged;
			data.profile = Object.assign(await getProfile(data.shortUUID, data.nameShared), data.profile)
			data.profile.currentImage = await imageProfile(CurrentUserLogged.userLogged.uuid!, data.profile.uuid!, data.profile.sex)
		} else {
			data.profile = getLocalProfile(data.shortUUID)! as IProfileContent;
			data.profile.currentImage = await imageProfile(CurrentUserLogged.userLogged.uuid!, data.profile.uuid!, data.profile.sex)
		}

		data.words = words.filter((w: Word) => w.profile_uuid === data.profile.uuid);
	} catch (error) {
		console.error(error);
	}
}

export function newWord() {
	if (data.isNewWord) {
		setTimeout(() => {
			data.isLoading = true;

			setTimeout(() => {
				data.isLoading = false;
			}, 100);
		}, 100);
	} else {
		data.isLoading = false;
	}

	setTimeout(() => {
		data.isNewWord = true;
	}, 100);
}

export function closeNewRegisterWord() {
	data.isLoading = true;
	setTimeout(() => {
		data.isNewWord = false;
	}, 100);
}

export function backPage() {
	router.back();
}

export function saveNewRegisterWord(word: Word) {
	closeNewRegisterWord()

	data.words.push(word);
}

export async function handleEditWord(word: Word) {
}

export async function handleDeleteWord(word: Word) {
	const index = data.words.findIndex((w: Word) => w.uuid === word.uuid);
	data.words.splice(index, 1);
}

export async function handleSyncWord(words: Word, oldWordUUID: string) {
	closeNewRegisterWord();

	data.words = data.words.sort((a: Word, b: Word) => new Date(a.dateSpeaker).getTime() - new Date(b.dateSpeaker).getTime());
}

