import { reactive, ref } from 'vue';
import { currentProfile, getProfile } from '../profile/profile';
import { newEmptyProfile, type IProfile } from '@/models/profile';
import {
	formatarValorInput,
	stringDateToUnix,
	unixDateToString,
} from '../utils';
import { newProfile, saveProfile } from '@/service/profile/profile';
import { Emitter } from '@/utils/emitter';
import { Responsible } from '@/contracts/contracts_shared/responsavel';
import router from '@/router';
import { getPathImage, uploadImageProfile } from '@/service/storage/storage';
import { dataCurrentUserLogged } from '@/service/user/user';
import { CurrentUserLogged } from '@/constants/userLogged';
import axios from 'axios';
import { imageProfile } from '@/utils/imageProfile';

export let self: any;
export function setThis(me: any) {
	self = me;
}

export enum Sex {
	masculino = 0,
	feminino = 1,
}

enum NewUser {
	pai = 0,
	mae = 1,
	baby = 2,
}

export interface IProfileEdit extends IProfile {
	uuid?: string;
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
	imageFile?: File;
	currentImageProfile?: string;
}

export let data = reactive<IProfileEdit>({
	...newEmptyProfile(),
	uuid: '',
	name_shared: '',
	_birth_date: '',
	_sex: Sex.masculino,
	_weight: '0.00',
	_height: '0.00',
});

export let dataState = reactive<IProfileStateEdit>({
	invalidFirstName: false,
	invalidNameSharedLink: false,
	invalidDataNascimento: false,
	isEmptyNameSharedLink: true,
});

async function loadProfile() {
	const suuid = data.uuid!;
	const profile = await getProfile(suuid, data.name_shared);
	data = Object.assign(data, profile);
	data._sex = profile.sex as Sex;
	data.short_uuid = suuid;
	data._height = data.height.toFixed(2);
	data._weight = data.weight.toFixed(2);
	data._birth_date = unixDateToString(data.birth_date);

	if (data.first_name !== undefined || data.first_name !== '')
		dataState.isEmptyNameSharedLink = false;

	validData();
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
	} catch {}

	if (data.uuid == 'newFather') dataState.newUser = NewUser.pai;
	else if (data.uuid == 'newMother') dataState.newUser = NewUser.mae;
	else if (data.uuid == 'newBaby') dataState.newUser = NewUser.baby;
	else await loadProfile();

	if (dataState.newUser !== undefined && dataState.newUser !== NewUser.baby)
		data.responsible = dataState.newUser as number as Responsible;

	try {
		dataState.currentImageProfile = await imageProfile(
			CurrentUserLogged.userLogged.uuid!,
			data.uuid!,
			data.sex,
		);
	} catch (err) {
		console.log(err);
	}
}

export async function save() {
	if (!validData()) return;

	try {
		// debugger;
		if (dataState.newUser !== undefined) {
			const profileCreated = await newProfile(data);
			const newUuid = profileCreated.short_uuid;
			const newNameShared = profileCreated.name_shared_link;
			data = Object.assign(data, profileCreated);

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
	} catch {}
}

function validData() {
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

// export async function imageProfile(): Promise<boolean> {
//     return new Promise(async (resolve) => {
//         const img = getPathImage(CurrentUserLogged.userLogged.uuid!, data.uuid!);

//         try {
//             const imgBin = await axios.get(img, { responseType: 'blob' });

//             const reader = new FileReader();
//             reader.onload = (e) => {
//                 dataState.currentImageProfile = e.target?.result?.toString();
//                 resolve(true);
//             };
//             reader.onerror = () => resolve(false);

//             reader.readAsDataURL(imgBin.data);
//         } catch (err) {
//             resolve(false);
//         }
//     });
// }

// export async function imageProfileDefault() {
//     if (await imageProfile())
//         return;

//     let url = '';
//     if (data.uuid == "newMother") {
//         url = '/src/assets/imagens-temp/female-user.jpeg';
//     } else if (data.uuid == "newFather") {
//         url = '/src/assets/imagens-temp/male-user.jpeg';
//     } else if (data.sex == Responsible.pai) {
//         url = '/src/assets/imagens-temp/male-user.jpeg';
//     } else if (data.sex == Responsible.mae) {
//         url = '/src/assets/imagens-temp/female-user.jpeg';
//     } else {
//         url = '/src/assets/imagens-temp/add-photo.jpeg';
//     }

//     dataState.currentImageProfile = `http://${window.location.host}/${url}`;
// }
