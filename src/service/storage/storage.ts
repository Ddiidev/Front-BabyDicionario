import confs from '@/constants/conf';
import axios from 'axios';

// Envio via base64 temporário devido a problemas no servidor.
// Recebe uma File, e converte para base64;
export async function uploadImageProfile(
	file: File,
	uuid_user: string,
	uuid_profile: string,
) {
	const base64String = await getBase64(file);

	await uploadImageFormatBase64Profile(base64String, uuid_user, uuid_profile);
}

// Envio via base64 temporário devido a problemas no servidor.
export async function uploadImageFormatBase64Profile(
	imageBase64String: string,
	uuid_user: string,
	uuid_profile: string
) {
	try {
		imageBase64String = imageBase64String.split(',')[1]

		await axios
			.post(
				`${confs.api_storage}/upload/${uuid_user}/${uuid_profile}`,
				imageBase64String,
			)
			.then(() => {
				console.log('Imagem enviada com sucesso!');
			})
			.catch((error) => {
				console.error('Erro ao enviar imagem:', error);
			});
	} catch (err) {
		console.log(err)
	}
}

export function getPathImage(uuid_user: string, uuid_profile: string): string {
	return `${confs.api_storage}/server-image/${uuid_user}/${uuid_profile}`;
}

async function getBase64(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result as string);
		reader.onerror = reject;
	});
}
