import {
    StatusContractApi,
    type IContractApi,
} from '@/contracts/api/contractApi';
import confs from '@/constants/conf';
import * as auth from '@/auth/auth';
import axios from 'axios';
import { Word } from '@/models/words';
import { stringDateToUnix } from '@/views/utils';

export async function getWords(shortUUID: string, nameShared: string): Promise<Word[] | undefined> {
    const url = `${confs.server}/words/${shortUUID}/${nameShared}`;

    try {
        const response = await axios.get<IContractApi<Word[]>>(url, {
            headers: auth.headerAuthorization()
        });

        if (response.data.status == StatusContractApi.error) {
            return undefined;
        }

        return response.data.content?.map((w: any) => new Word(w)) || [];
    } catch (error) {
        console.error('Error getting words:', error);
        return undefined;
    }
}

export async function saveWord(shortUUID: string, nameShared: string, ...words: Word[]): Promise<Word[]> {
    const url = `${confs.server}/words/${shortUUID}/${nameShared}`;

    try {
        const wordsTreat = words.map((w: Word) => ({
            ...w,
            dateSpeaker: stringDateToUnix(w.dateSpeaker.toString())
        }));

        const response = await axios.post<IContractApi<Word[]>>(url, wordsTreat, {
            headers: auth.headerAuthorization()
        });

        if (response.data.status == StatusContractApi.error) {
            throw response.data;
        }

        return response.data.content?.map((w: any) => new Word(w)) || [];
    } catch (error) {
        console.error('Error saving word:', error);
        throw error;
    }
}

export async function countWords(profileUUID: string): Promise<number> {
    const url = `${confs.server}/words/${profileUUID}/count`;

    try {
        const response = await axios.get<IContractApi<number>>(url, {
            headers: auth.headerAuthorization()
        });

        if (response.data.status == StatusContractApi.error) {
            return 0;
        }

        return response.data.content!;
    } catch (error) {
        console.error('Error counting words:', error);
        return 0;
    }
}

export async function deleteWord(uuid: string) {
    const url = `${confs.server}/words/${uuid}`;

    try {
        const response = await axios.delete<IContractApi<void>>(url, {
            headers: auth.headerAuthorization()
        });

        if (response.data.status == StatusContractApi.error) {
            throw response.data;
        }
    } catch (error) {
        console.error('Error deleting word:', error);
    }
}
