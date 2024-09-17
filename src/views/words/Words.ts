import { CurrentUserLogged } from '@/constants/userLogged';
import { reactive } from 'vue';
import { imageProfile } from '@/utils/imageProfile';

export let self: any;
export function setThis(me: any) {
    self = me;
}

export const data = reactive({
    profile: {
        currentImage: '',
    },
});

export async function mounted() {
    setThis(self);
    // Simulação de dados, substitua pela lógica real para obter os dados do perfil
    data.profile.currentImage = await imageProfile(
        CurrentUserLogged.userLogged.uuid!,
        'profile_uuid', // Substitua pelo UUID real
        0
    ) ?? '';
}
