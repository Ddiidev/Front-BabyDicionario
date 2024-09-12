<script setup lang="ts">
import ToolButton from '@/components/ToolButton.vue';
import NavBar from '@/components/NavBar.vue';
import { userLogged } from '@/auth/auth';
import router from '@/router';
import confs from '@/constants/conf';
import { CurrentUserLogged } from '@/constants/userLogged';

if (!userLogged()) {
    router.push({
        path: '/'
    })
}
</script>

<template>
    <NavBar></NavBar>
    <main class="main container">
        <article>
            <div class="container header">
                <ToolButtonBack @click="router.push('/userHome')" />

                <header class="center">
                    <div class="title-image">
                        <p class="center-text">{{ profileEditImpl.data.first_name }}</p>
                        <label for="file-upload" class="edit_img" data-tooltip="Mudar a imagem" data-placement="bottom">
                            <img class="circular-image default-border" style="width: 5em; height: 5em;"
                                :src="profileEditImpl.dataState.currentImageProfile">
                            <i class="fas fa-edit"></i>
                        </label>
                        <input id="file-upload" @change="profileEditImpl.onFileSelected" type="file"
                            style="display: none;" />
                    </div>
                </header>
            </div>

            <div style="margin-top: 3%;">
                <fieldset class="grid">
                    <label>
                        Primeiro nome
                        <input v-model="profileEditImpl.data.first_name" name="first_name" placeholder="Primeiro nome"
                            autocomplete="given-name" :aria-invalid="profileEditImpl.dataState.invalidFirstName"
                            aria-describedby="valid-first-name" />
                        <small v-if="profileEditImpl.dataState.invalidFirstName" id="valid-first-name">Preencha o
                            primeiro nome</small>
                    </label>
                    <label>
                        Segundo nome
                        <input v-model="profileEditImpl.data.last_name" name="last_name" placeholder="Segundo nome"
                            autocomplete="additional-name" />
                    </label>
                </fieldset>
                <fieldset class="grid">
                    <label>
                        Apelido
                        <input v-model="profileEditImpl.data.surname" name="surname" placeholder="Apelido"
                            autocomplete="nickname" />
                    </label>
                    <div class="grid">
                        <label>
                            Cor
                            <input v-model="profileEditImpl.data.color" name="color" placeholder="Cor" />
                        </label>
                        <label>
                            Nascimento
                            <input type="date" id="birthdate" v-model="profileEditImpl.data._birth_date"
                                aria-label="Date" :aria-invalid="profileEditImpl.dataState.invalidDataNascimento"
                                aria-describedby="valid-birthdate" />
                            <small v-if="profileEditImpl.dataState.invalidDataNascimento" id="valid-birthdate">Data
                                inválida</small>
                        </label>
                    </div>
                </fieldset>

                <fieldset class="grid">
                    <label>
                        Peso
                        <div>
                            <div class="wrapper">
                                <input v-model="profileEditImpl.data._weight" name="weight" class="form-control" placeholder="0,42">
                                <span class="units">kg</span>
                            </div>
                        </div>
                    </label>
                    <label>
                        Altura
                        <div>
                            <div class="wrapper">
                                <input v-model="profileEditImpl.data._height" name="height" class="form-control" placeholder="0,49">
                                <span class="units">cm</span>
                            </div>
                        </div>
                    </label>
                </fieldset>

                <div class="grid">
                    <fieldset style="margin: 3% 0 0 20%;">
                        <legend>Sexo:</legend>
                        <input type="radio" id="Masculino"
                            @click="profileEditImpl.data._sex = profileEditImpl.Sex.masculino"
                            :checked="profileEditImpl.data._sex == profileEditImpl.Sex.masculino" />
                        <label htmlFor="Masculino">Masculino</label>

                        <input type="radio" id="Feminino"
                            @click="profileEditImpl.data._sex = profileEditImpl.Sex.feminino"
                            :checked="profileEditImpl.data._sex == profileEditImpl.Sex.feminino" />
                        <label htmlFor="Feminino">Feminino</label>
                    </fieldset>

                    <label>
                        Nome compartilável
                        <input v-model="profileEditImpl.data.name_shared_link" name="name_shared_link"
                            autosave="name_shared_link" :aria-invalid="profileEditImpl.dataState.invalidNameSharedLink"
                            aria-describedby="valid-name-shared-link" placeholder="Nome compartilhável"
                            @keypress="profileEditImpl.onChangeNameShared()" />
                        <small v-if="profileEditImpl.dataState.invalidNameSharedLink" id="valid-name-shared-link">Nome
                            inválido! Precisa ser maior que 3 caracteres.</small>
                    </label>
                </div>

                <ToolButton class="btSave" @click="profileEditImpl.save()">Salvar</ToolButton>
            </div>
        </article>
    </main>
</template>

<script lang="ts">
import ToolButtonBack from '@/components/ToolButtonBack.vue';
import * as profileEditImpl from './profileEdit';
import { useRoute } from 'vue-router';
import { defineComponent } from "vue";

export default defineComponent({
    data() {
        return profileEditImpl.data
    },
    mounted() {

        try {
            profileEditImpl.data.name_shared = useRoute().params.name_shared.toString();
            profileEditImpl.data.uuid = useRoute().params.short_uuid.toString();
        } catch {
            router.go(-1);
        }

        try {
            this.$nextTick(async () => {
                profileEditImpl.mounted(this);
            });
        } catch { }
    },
    beforeUnmount() {
        profileEditImpl.unmounted();
    },
    watch: profileEditImpl.watch()
});
</script>

<style scoped>
.title-image {
    display: flex;
    justify-content: center;
    position: relative;
}

.title-image .edit_img {
    position: absolute;
    right: 10px;
}

.edit_img {
    background-size: cover;
    position: relative;
    width: 100px;
    height: 100px;
}

.edit_img i {
    color: aliceblue;
    cursor: pointer;
    display: none;
}

.edit_img:hover i {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    z-index: 999;
}

.edit_img:hover img {
    filter: blur(2px);
    animation: fadeInAnimation ease 0.2s;
}

.edit_img:not(:hover) img {
    animation: fadeOutAnimation ease 0.3s;
}

@keyframes fadeInAnimation {
    0% {
        filter: blur(0px);
    }

    100% {
        filter: blur(2px);
    }
}

@keyframes fadeOutAnimation {
    0% {
        filter: blur(2px);
    }

    100% {
        filter: blur(0px);
    }
}

.circular-image {
    align-self: center;
    object-fit: cover;
    border-radius: 40%;
    transition: background-color 0.1s ease;
}

.circular-image:hover {
    box-shadow: 0 0 30px #feb1a6;
}

.center {
    display: block;
    justify-content: center;
    width: 100%;
}

.center-text {
    text-align: center;
    font-family: Dosis;
    font-weight: 700;
    font-size: xx-large;
    margin-top: 1%;
}

.header {
    display: flex;
}

.wrapper {
    position: relative;
    display: inline-block;
    top: 5px;
    width: 100%;
}

.units {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-30%);
}

.btSave {
    width: 70%;
    margin-left: 15%;
}
</style>