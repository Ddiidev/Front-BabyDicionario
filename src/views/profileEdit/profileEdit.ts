import { getPathImageDefault, imageProfile } from '@/utils/imageProfile';
import { Responsible } from '@/contracts/contracts_shared/responsavel';
import { newProfile, saveProfile } from '@/service/profile/profile';
import { newEmptyProfile, type IProfile } from '@/models/profile';
import { uploadImageProfile } from '@/service/storage/storage';
import { dataCurrentUserLogged } from '@/service/user/user';
import { CurrentUserLogged } from '@/constants/userLogged';
import { getProfile } from '../profile/profileView';
import { Emitter } from '@/utils/emitter';
import { reactive, ref } from 'vue';
import router from '@/router';
import {
	formatarValorInput,
	stringDateToUnix,
	unixDateToString,
} from '../utils';
import { deleteLocalPhotoProfile, deleteLocalProfile, deleteLocalWordsFromProfile, getLocalProfile, newLocalPhotoProfile, newLocalProfile, saveLocalProfile } from '@/service/profile/localProfile';
import * as servProfile from '@/service/profile/profile';

export let self: any;
export function setThis(me: any) {
	self = me;
}

export enum Sex {
	male = 0,
	female = 1,
}

enum NewUser {
	pai = 0,
	mae = 1,
	baby = 2,
}

export interface IProfileEdit extends IProfile {
	name_shared?: string;
	_birth_date: string;
	_sex: Sex;
	_weight: string;
	_height: string;
}

export interface IProfileStateEdit {
	invalidFirstName: boolean;
	invalidNameSharedLink: boolean;
	invalidDataNascimento: boolean;
	newUser?: NewUser;
	isEmptyNameSharedLink: boolean;
	viewerModalDelete: boolean;
	imageFile?: File;
	currentImageProfile?: string;
	visibleDeleteProfileButton: boolean;
}

export let data = reactive<IProfileEdit>(newEmptyProfileEdit());

export let dataState = reactive<IProfileStateEdit>({
	currentImageProfile: getPathImageDefault('', Sex.male),
	invalidFirstName: false,
	invalidNameSharedLink: false,
	invalidDataNascimento: false,
	isEmptyNameSharedLink: true,
	viewerModalDelete: false,
	visibleDeleteProfileButton: false
});

export function visibleDeleteProfileButton(): void {
	dataState.visibleDeleteProfileButton = true;
	if (dataState.newUser != undefined)
		dataState.visibleDeleteProfileButton = false;

	if (data.responsible != undefined && [Responsible.father, Responsible.mother].includes(data.responsible))
		dataState.visibleDeleteProfileButton = false;
}

async function loadProfile() {
	const suuid = data.uuid!;
	let profile: IProfile | undefined;
	if (!CurrentUserLogged.userLogged.isLogged()) {
		profile = getLocalProfile(suuid);
	} else {
		profile = await getProfile(suuid, data.name_shared);
	}

	if (profile) {
		Object.assign(data, profile);

		data._sex = profile.sex as Sex;
		data.short_uuid = suuid;
		data._height = data.height.toFixed(2);
		data._weight = data.weight.toFixed(2);
		data._birth_date = unixDateToString(data.birth_date);

		if (data.first_name !== undefined || data.first_name !== '')
			dataState.isEmptyNameSharedLink = false;

		validData();
	}
}

export function watch() {
	return {
		_weight() {
			setWeight();
			data.weight = parseFloat(data._weight);
		},
		_height() {
			setHeight();
			data.height = parseFloat(data._height);
		},
		_birth_date() {
			setBirthDate();
		},
		_sex() {
			data.sex = data._sex;
		},
		first_name() {
			if (data.name_shared_link.trim() === '')
				dataState.isEmptyNameSharedLink = true;

			if (dataState.isEmptyNameSharedLink)
				data.name_shared_link = (data.first_name as any).replaceAll(
					' ',
					'',
				);
		},
	};
}

function setBirthDate() {
	try {
		data.birth_date = stringDateToUnix(data._birth_date);
		dataState.invalidDataNascimento = false;
	} catch {
		dataState.invalidDataNascimento = true;
	}
}

function setWeight() {
	data._weight = formatarValorInput(data._weight.toString());
}

function setHeight() {
	data._height = formatarValorInput(data._height.toString());
}

export async function mounted(self: any) {
	setThis(self);

	try {
		await dataCurrentUserLogged();
	} catch (error) {
		console.log(error);
	}

	if (data.uuid == 'newFather')
		dataState.newUser = NewUser.pai;
	else if (data.uuid == 'newMother')
		dataState.newUser = NewUser.mae;
	else if (data.uuid == 'newBaby')
		dataState.newUser = NewUser.baby;
	else
		await loadProfile();

	if (dataState.newUser !== undefined && dataState.newUser !== NewUser.baby)
		data.responsible = dataState.newUser as number as Responsible;

	try {
		dataState.currentImageProfile = await imageProfile(
			CurrentUserLogged.userLogged.uuid!,
			data.uuid!,
			data.sex,
			async (image: Promise<string>) => {
				dataState.currentImageProfile = await image;
			}
		);
	} catch (err) {
		console.log(err);
	}

	/**
	 * Gambiarra das brabas
	 * Pois por algum motivo quando carrega a página pela primeira vez pelo sistema de rotas
	 * os eventos de watch, não funcionam como deveriam e acabam quebrando tudo
	 * então foi feito essa gambiarra para que sempre que essa condição seja verdadeira
	 * a página recarregue.
	 * TODO: Remover essa gambiarra após consertar a causa do erro
	 */
	if (Object.keys(data).length === 2 && 'name_shared' in data && 'uuid' in data) {
		window.location.reload();
	}

	visibleDeleteProfileButton();
}

export async function save() {
	if (!validData())
		return;

	try {
		if (!CurrentUserLogged.userLogged.isLogged()) {
			let profileCreated: IProfile = data;
			if (dataState.newUser !== undefined) {
				profileCreated = newLocalProfile(data);
			} else {
				profileCreated = saveLocalProfile(data);
			}

			const newUuid = profileCreated.short_uuid;
			const newNameShared = profileCreated.name_shared_link;

			if (dataState.imageFile !== undefined)
				await newLocalPhotoProfile(dataState.imageFile!, profileCreated);

			router.push(`/userProfileEdit/${newUuid}/${newNameShared}`);

			setTimeout(() => {
				// eslint-disable-next-line no-self-assign
				window.location.href = window.location.href;
				window.location.reload();
			}, 4000);

			// Essa menssagem é direcionada como novo bebê, pois se não estiver logado só será possível adicionar bebês.
			Emitter.emitt('msg-login', {
				title: '✅ Salvo',
				msg: 'Um novo bebê está na área!',
			});

		} else if (dataState.newUser !== undefined) {
			const profileCreated = await newProfile(data);
			const newUuid = profileCreated.short_uuid;
			const newNameShared = profileCreated.name_shared_link;
			Object.assign(data, profileCreated);

			if (dataState.imageFile !== undefined)
				await uploadImageProfile(
					dataState.imageFile!,
					CurrentUserLogged.userLogged.uuid!,
					profileCreated.uuid!,
				);

			Emitter.emitt('msg-login', {
				title: '✅ Salvo!',
				msg: 'Novo perfil criado com sucesso!',
			});

			router.push(`/userProfileEdit/${newUuid}/${newNameShared}`);

			setTimeout(() => {
				// eslint-disable-next-line no-self-assign
				window.location.href = window.location.href;
				window.location.reload();
			}, 4000);
		} else {
			if (dataState.imageFile !== undefined)
				await uploadImageProfile(
					dataState.imageFile!,
					CurrentUserLogged.userLogged.uuid!,
					data.uuid!,
				);

			await saveProfile(data);

			Emitter.emitt('msg-login', {
				title: '✅ Salvo!',
				msg: 'Alterações gravadas com sucesso!',
			});

			setTimeout(() => {
				window.location.href = window.location.href
					.replace(data.name_shared!, data.name_shared_link)
					.replace(data.uuid!, data.short_uuid!);

				window.location.reload();
			}, 4000);
		}
	} catch (error) {
		console.log(error);
	}
}

export function deleteProfile() {
	if (!CurrentUserLogged.userLogged.isLogged()) {
		deleteLocalProfile(data.uuid!);
		deleteLocalWordsFromProfile(data.uuid!);
		deleteLocalPhotoProfile(data.uuid!);
	} else {
		servProfile.deleteProfile(data.uuid!);
	}

	dataState.viewerModalDelete = false;
	router.go(-1);
}

function validData() {
	console.log(data);
	if (data.first_name.trim() === '') {
		dataState.invalidFirstName = true;
		return false;
	}

	if (
		data.name_shared_link.trim() === '' ||
		data.name_shared_link.length < 3
	) {
		dataState.invalidNameSharedLink = true;
		return false;
	}

	if (dataState.invalidDataNascimento) return false;

	return true;
}
export function onChangeNameShared() {
	dataState.isEmptyNameSharedLink = false;

	if (data.name_shared_link.trim() === '')
		data.name_shared_link = (data.first_name as any).replaceAll(' ', '');
}

export function unmounted() {
	dataState = reactive({} as IProfileStateEdit);
	data = reactive({} as IProfileEdit);
}

export function onFileSelected(event: any) {
	dataState.imageFile = event.target.files[0];
	const reader = new FileReader();
	reader.onload = (e) => {
		dataState.currentImageProfile = e.target?.result?.toString();
	};

	reader.readAsDataURL(event.target.files[0]);
}

function newEmptyProfileEdit(): IProfileEdit {
	return {
		...newEmptyProfile(),
		uuid: '',
		name_shared: '',
		_birth_date: '',
		_sex: Sex.male,
		_weight: '0.00',
		_height: '0.00',
	};
}
