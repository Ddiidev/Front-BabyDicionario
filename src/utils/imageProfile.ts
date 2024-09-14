import { getPathImage } from "@/service/storage/storage";
import { Sex } from "@/views/profileEdit/profileEdit";
import axios from "axios";

export async function imageProfile(user_uuid: string, profile_uuid: string, sexProfile: Sex): Promise<string | undefined> {
    return new Promise(async (resolve) => {
        const img = getPathImage(user_uuid, profile_uuid);

        try {
            const imgBin = await axios.get(img, { responseType: 'blob' });
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageFile = e.target?.result?.toString();
                resolve(imageFile);
            };
            reader.onerror = () => resolve(getPathImageDefault(profile_uuid, sexProfile));

            reader.readAsDataURL(imgBin.data);
        } catch (err) {
            resolve(getPathImageDefault(profile_uuid, sexProfile));
        }
    });
}

function getPathImageDefault(profile_uuid: string, sexProfile: Sex) {
    let url = '';
    if (profile_uuid == "newMother") {
        url = 'src/assets/imagens-temp/female-user.jpeg';
    } else if (profile_uuid == "newFather") {
        url = 'src/assets/imagens-temp/male-user.jpeg';
    } else if (sexProfile == Sex.masculino) {
        url = 'src/assets/imagens-temp/male-user.jpeg';
    } else if (sexProfile == Sex.feminino) {
        url = 'src/assets/imagens-temp/female-user.jpeg';
    } else {
        url = 'src/assets/imagens-temp/add-photo.jpeg';
    }

    return `http://${window.location.host}/${url}`
}