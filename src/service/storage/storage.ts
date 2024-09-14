
import confs from "@/constants/conf";
import axios from "axios";

// Envio via base64 temporário devido a problemas no servidor.
export async function uploadImageProfile(file: File, uuid_user: string, uuid_profile: string) {
	const formData = new FormData();

	formData.append('file', file);

	const base64String = (await getBase64(file)).split(',')[1];
	
	await axios.post(`${confs.api_storage}/upload/${uuid_user}/${uuid_profile}`, base64String)
		.then(response => {
			console.log('Imagem enviada com sucesso!');
		})
		.catch(error => {
			console.error('Erro ao enviar imagem:', error);
		});

}

export function getPathImage(uuid_user: string, uuid_profile: string): string {
	return `${confs.api_storage}/server-image/${uuid_user}/${uuid_profile}`
}

async function getBase64(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result as string);
		reader.onerror = reject;
	})
}