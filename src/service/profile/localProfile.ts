import { CurrentUserLogged } from "@/constants/userLogged";
import type { IFamilyProfiles } from "@/models/familyProfiles";
import type { IProfile } from "@/models/profile";
import type { Word } from "@/models/words";
import { calculateAge } from "@/utils/date";
import { getPathImageDefault } from "@/utils/imageProfile";
import { removeSpecialCharacters } from "@/utils/treatText";
import { unixDateToString } from "@/views/utils";

export function newLocalProfile(profile: IProfile): IProfile {
    const profiles: IProfile[] = JSON.parse(localStorage.getItem('profiles') || '[]');

    profile.uuid = crypto.randomUUID();
    profile.short_uuid = profile.uuid.slice(0, 8);
    if (profile.name_shared_link === undefined || profile.name_shared_link === '') {
        profile.name_shared_link = removeSpecialCharacters(profile.first_name);
    }

    profiles.push(profile);

    localStorage.setItem('profiles', JSON.stringify(profiles));

    return profile;
}

export function saveLocalProfile(profile: IProfile): IProfile {
    const profiles: IProfile[] = JSON.parse(localStorage.getItem('profiles') || '[]');

    const profileIndex = profiles.findIndex(p => p.uuid === profile.uuid);
    if (profileIndex !== -1) {
        profiles[profileIndex] = profile;
    } else {
        profiles.push(profile);
    }

    localStorage.setItem('profiles', JSON.stringify(profiles));

    return profile;
}

export async function newLocalPhotoProfile(photo: File, profile: IProfile) {
    const cacheKey = `${CurrentUserLogged.userLogged.uuid!}-${profile.uuid!}`;

    return new Promise((resolve) => {
        try {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageFile = e.target?.result?.toString() ?? "";
                const cacheValue = JSON.stringify({
                    image: imageFile,
                    timestamp: '♾️',
                });
                localStorage.setItem(cacheKey, cacheValue);
                resolve(imageFile);
            };
            reader.onerror = () =>
                resolve(getPathImageDefault(profile.uuid!, profile.sex!));

            reader.readAsDataURL(photo);
        } catch (err) {
            resolve(getPathImageDefault(profile.uuid!, profile.sex!));
        }
    });
}

export function deleteLocalPhotoProfile(profileUUID: string) {
    const cacheKey = `${CurrentUserLogged.userLogged.uuid!}-${profileUUID}`;

    localStorage.removeItem(cacheKey);
}

export function getLocalProfile(shortProfileUUID: string): IProfile | undefined {
    const cachedData: IProfile[] = JSON.parse(localStorage.getItem('profiles') || '[]');

    const profile = cachedData.find(p => p.short_uuid === shortProfileUUID);

    if (profile) {
        return profile;
    }
}

export function getLocalFamilyProfile(): IFamilyProfiles {
    const cachedData: IProfile[] = JSON.parse(localStorage.getItem('profiles') || '[]');

    return {
        father: {} as IProfile,
        mother: {} as IProfile,
        babys: cachedData.map((p: IProfile) => ({
            ...p,
            age: calculateAge(new Date(unixDateToString(p.birth_date)))
        })),
    } as IFamilyProfiles;
}

export function deleteLocalProfile(profileUUID: string) {
    const cachedData: IProfile[] = JSON.parse(localStorage.getItem('profiles') || '[]');

    const profileIndex = cachedData.findIndex(p => p.uuid === profileUUID);
    if (profileIndex !== -1) {
        cachedData.splice(profileIndex, 1);
    }

    localStorage.setItem('profiles', JSON.stringify(cachedData));
}

export function getLocalCountWords(profileUUID: string): number {
    const cachedData: Word[] = JSON.parse(localStorage.getItem('words') || '[]');

    const words = cachedData.filter(p => p.profile_uuid === profileUUID);

    return words.length ?? 0;
}

export function deleteLocalWordsFromProfile(profileUUID: string) {
    let words: Word[] = JSON.parse(localStorage.getItem('words') || '[]');

    words = words.filter(p => p.profile_uuid !== profileUUID);

    localStorage.setItem('words', JSON.stringify(words));
}
