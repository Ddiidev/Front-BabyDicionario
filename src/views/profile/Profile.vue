<script setup lang="ts">
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';
import { reactive } from 'vue';
import LabelText from '@/components/LabelText.vue';
import Background from '@/components/Background.vue';
import Separator from '@/components/Separator.vue';
import Card from '@/components/Card.vue';
// import confs from '@/constants/conf';

import type { Profile } from '@/models/profile';
import { getProfile } from './profile';

localStorage.setItem('current_id', useRoute().params.id.toString())
</script>

<template>
    <Background>

        <!-- <div class="container-row"> -->
            <Card style="height: 97%; margin: 10px;">
                <div class="container" style="width: 350px;">
                    <div class="column">
                        <img src="@/assets/imagens-temp/dante.jpg" class="circular-image" alt="Descrição da imagem">
                    </div>

                    <div class="column">
                        <LabelText font-size="38"> {{ currentProfile.primeiro_nome }}</LabelText>
                    </div>

                    <Separator />

                    <div class="container-row">
                        <LabelText class="column-left" style="margin-left: 25px;" secondary-color>Idade</LabelText>
                        <LabelText class="column-right" style="margin-right: 25px;"> {{ currentProfile.idade }} </LabelText>
                    </div>

                    <div class="container-row">
                        <LabelText class="column-left" style="margin-left: 25px;" secondary-color>Peso</LabelText>
                        <LabelText class="column-right" style="margin-right: 25px;"> {{ currentProfile.peso }} </LabelText>
                    </div>

                    <div class="container-row">
                        <LabelText class="column-left" style="margin-left: 25px;" secondary-color>Altura</LabelText>
                        <LabelText class="column-right" style="margin-right: 25px;"> {{ currentProfile.altura }}
                        </LabelText>
                    </div>

                    <div id="pais-footer" class="container-row">
                        <div class="column-left column-right">
                            <div style="margin: 15px;" class="container">
                                <img style="width: 100px; height: 100px;" src="@/assets/imagens-temp/andré.jpg"
                                    class="circular-image" alt="Descrição da imagem">
                                <LabelText class="column" secondary-color>Pai</LabelText>
                                <LabelText class="column">André</LabelText>
                            </div>
                        </div>
                        <div class="column-left column-right">
                            <div style="margin: 15px;" class="container">
                                <img style="width: 100px; height: 100px;" src="@/assets/imagens-temp/milca.jpg"
                                    class="circular-image" alt="Descrição da imagem">
                                <LabelText class="column" secondary-color>Mãe</LabelText>
                                <LabelText class="column">Milca</LabelText>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        <!-- </div> -->
    </Background>
</template>

<script lang="ts">
let currentProfile = reactive<Profile>({
    primeiro_nome: "Dante",
    idade: 2.3,
    ultimo_nome: '',
    data_nascimento: '',
    peso: 0,
    sexo: '',
    altura: 0,
    cor: '',
    tipo_sanguineo: '',
    pai_id: 0,
    mae_id: 0,
    irmaos_id: []
});

currentProfile = Object.assign(currentProfile, await getProfile(localStorage.getItem('current_id')!))
</script>

<style>
.container {
    display: flex;
    flex-direction: column;
}

/* #pais-footer {
    position: absolute;
    justify-content: space-between;
    bottom: 0;
} */

.column {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: auto;
    margin-right: auto;
}

.container-row {
    display: flex;
    flex-direction: row;
}

.column-left {
    display: flex;
    justify-content: left;
    align-items: start;
    margin-right: auto;
}

.column-right {
    display: flex;
    justify-content: right;
    align-items: end;
    margin-left: auto;
}

.circular-image {
    margin-top: 5%;
    width: 150px;
    height: 150px;
    align-self: center;
    object-fit: cover;
    border-radius: 40%;
}
</style>