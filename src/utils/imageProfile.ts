import { getPathImage } from '@/service/storage/storage';
import { Sex } from '@/views/profileEdit/profileEdit';
import axios from 'axios';

const TIME_EXPIRATION_IMAGE_CACHE = 1;
const ONE_YEAR = 31536000000;

class CacheImage {
	image: string;
	timestamp: Date;
	isExpired: boolean;

	constructor(image: string, timestamp: Date, isExpired: boolean) {
		this.image = image;
		this.timestamp = timestamp;
		this.isExpired = isExpired;
	}
}

export async function imageProfile(
	user_uuid: string,
	profile_uuid: string,
	sexProfile: Sex,
	callbackResultFinal?: (image: Promise<string>) => Promise<void>,
): Promise<string | undefined> {
	const cacheKey = `${user_uuid}-${profile_uuid}`;
	const cachedData = getCacheImage(cacheKey);

	if (cachedData) {
		try {
			if (!cachedData.isExpired)
				callbackResultFinal?.(Promise.resolve(cachedData.image));

			return cachedData.image;
		} catch (err) {
			localStorage.removeItem(cacheKey);
		}
	} else {
		callbackResultFinal?.(Promise.resolve(getPathImageDefault(profile_uuid, sexProfile)));

		return await requestImage(user_uuid, profile_uuid, sexProfile, cacheKey);
	}
}

export function getCacheImage(cacheKey: string): CacheImage | undefined {
	const cachedData = localStorage.getItem(cacheKey);

	if (cachedData) {
		const data = JSON.parse(cachedData);
		const now = Date.now();
		const timestamp = new Date(data.timestamp == '♾️' ? now + ONE_YEAR : data.timestamp);
		const isExpired = now - timestamp.getTime() > TIME_EXPIRATION_IMAGE_CACHE;

		return new CacheImage(data.image, timestamp, isExpired);
	}

	return undefined;
}

async function requestImage(user_uuid: string, profile_uuid: string, sexProfile: Sex, cacheKey: string): Promise<string> {
	return new Promise((resolve) => {
		const img = getPathImage(user_uuid, profile_uuid);

		try {
			axios.get(img, { responseType: 'blob' }).then(imgBin => {
				const reader = new FileReader();
				reader.onload = (e) => {
					const imageFile = e.target?.result?.toString() ?? "";
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
			}).catch(() => {
				resolve(getPathImageDefault(profile_uuid, sexProfile));
			});
		} catch (err) {
			resolve(getPathImageDefault(profile_uuid, sexProfile));
		}
	});
}

export function getPathImageDefault(profile_uuid: string, sexProfile: Sex) {
	let url = '';
	if (profile_uuid == 'newBaby') {
		url = 'src/assets/imagens-temp/add-photo.jpeg';
	} else if (profile_uuid == 'newMother') {
		url = 'src/assets/imagens-temp/female-user.jpeg';
	} else if (profile_uuid == 'newFather') {
		url = 'src/assets/imagens-temp/male-user.jpeg';
	} else if (sexProfile == Sex.male) {
		url = 'src/assets/imagens-temp/male-user.jpeg';
	} else if (sexProfile == Sex.female) {
		url = 'src/assets/imagens-temp/female-user.jpeg';
	}

	return `http://${window.location.host}/${url}`;
}
