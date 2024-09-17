import { getPathImage } from '@/service/storage/storage';
import { Sex } from '@/views/profileEdit/profileEdit';
import axios from 'axios';

const TEMPO_EXPIRACAO_CACHE = 60000;

export async function imageProfile(
	user_uuid: string,
	profile_uuid: string,
	sexProfile: Sex,
): Promise<string | undefined> {
	const cacheKey = `${user_uuid}-${profile_uuid}`;
	const cachedData = localStorage.getItem(cacheKey);

	if (cachedData) {
		try {
			const { image, timestamp } = JSON.parse(cachedData);
			const now = Date.now();

			if (now - timestamp < TEMPO_EXPIRACAO_CACHE) {
				return image;
			}
		} catch (err) {
			localStorage.removeItem(cacheKey);
		}
	}

	return new Promise(async (resolve) => {
		const img = getPathImage(user_uuid, profile_uuid);

		try {
			const imgBin = await axios.get(img, { responseType: 'blob' });
			const reader = new FileReader();
			reader.onload = (e) => {
				const imageFile = e.target?.result?.toString();
				const cacheValue = JSON.stringify({
					image: imageFile,
					timestamp: Date.now(),
				});
				localStorage.setItem(cacheKey, cacheValue);
				resolve(imageFile);
			};
			reader.onerror = () =>
				resolve(getPathImageDefault(profile_uuid, sexProfile));

			reader.readAsDataURL(imgBin.data);
		} catch (err) {
			resolve(getPathImageDefault(profile_uuid, sexProfile));
		}
	});
}

function getPathImageDefault(profile_uuid: string, sexProfile: Sex) {
	let url = '';
	if (profile_uuid == 'newMother') {
		url = 'src/assets/imagens-temp/female-user.jpeg';
	} else if (profile_uuid == 'newFather') {
		url = 'src/assets/imagens-temp/male-user.jpeg';
	} else if (sexProfile == Sex.masculino) {
		url = 'src/assets/imagens-temp/male-user.jpeg';
	} else if (sexProfile == Sex.feminino) {
		url = 'src/assets/imagens-temp/female-user.jpeg';
	} else {
		url = 'src/assets/imagens-temp/add-photo.jpeg';
	}

	return `http://${window.location.host}/${url}`;
}
