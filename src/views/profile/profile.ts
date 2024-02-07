import type { Profile } from "@/models/profile";
import axios from "axios";
import confs from '@/constants/conf';

export async function getProfile(id: string): Promise<Profile> {
    const t = await axios.get(`${confs.server}/profiles?id=${id}`);

    return t.data[0]
}