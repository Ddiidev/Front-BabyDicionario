import { reactive } from "vue";
import { getProfile } from "../profile/profile";
import { newEmptyProfile, type IProfile } from "@/models/profile";
import { formatarValorInput, stringDateToUnix } from "../utils";
import { saveProfile } from "@/service/profile/profile";
import { Emitter } from "@/utils/emitter";

export let self: any;
export function setThis(me: any) {
    self = me;
}
export function mounted(self: any) {
    setThis(self);

    loadProfile();
}

export enum Sex {
    masculino = 0,
    feminino = 1
}

export interface IProfileEdit extends IProfile {
    uuid?: string
    name_shared?: string
    _birth_date: string
    _sex: Sex
    _weight: string
    _height: string
}

export let data = reactive<IProfileEdit>({
    ...newEmptyProfile(),
    uuid: "",
    name_shared: "",
    _birth_date: "",
    _sex: Sex.masculino,
    _weight: "0.00",
    _height: "0.00",
});

export let dataState = reactive({
    invalidFirstName: false,
    invalidNameSharedLink: false,
    invalidDataNascimento: false
})

async function loadProfile() {
    const suuid = data.uuid!;
    const profile = await getProfile(suuid, data.name_shared)
    data = Object.assign(data, profile);
    data._sex = profile.sex as Sex
    data.short_uuid = suuid;
    data._height = data.height.toString()
    data._weight = data.weight.toString()

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
        }
    }
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

export async function save() {
    if (!validData())
        return;

    try {
        await saveProfile(data);

        Emitter.emitt("msg-login", {
            title: "✅ Salvo!",
            msg: "Alterações gravadas com sucesso!",
        })

        window.location.href = window.location.href.replace(data.name_shared!, data.name_shared_link);
        window.location.reload();
    } catch { }

}

function validData() {
    if (data.first_name.trim() === "") {
        dataState.invalidFirstName = true;
        return false;
    }

    if (data.name_shared_link.trim() === "" || data.name_shared_link.length < 3) {
        dataState.invalidNameSharedLink = true;
        return false;
    }

    if (dataState.invalidDataNascimento)
        return false;

    return true;
}
