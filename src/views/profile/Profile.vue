<script setup lang="ts">
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';
import { reactive } from 'vue';
// import confs from '@/constants/conf';
import NavBar from '@/components/NavBar.vue';

import type { Profile } from '@/models/profile';
import { getProfile } from './profile';

localStorage.setItem('current_id', useRoute().params.id.toString())
</script>

<template>
    <NavBar></NavBar>
    <main class="main container-fluid">
        <div style="display: flex; justify-content: start;" class="grid">
            <article id="side" style="width: 35%; text-align: center;">
                <header>
                    <img style="margin-top: 0px;" class="circular-image" src="@/assets/imagens-temp/dante.jpg" />
                    <hgroup>
                        <h2>Dante</h2>
                        <p>{{ currentProfile.idade }} ano(s)</p>
                    </hgroup>
                </header>

                <div id="body-side">
                    <table class="striped">
                        <tbody>
                            <tr>
                                <th>Vulgo</th>
                                <td style="text-align: end;">{{ currentProfile.apelido }}</td>
                            </tr>
                            <tr>
                                <th>Irmãos</th>
                                <td style="text-align: end;">{{ quantidadeIrmaos() }}</td>
                            </tr>
                            <tr>
                                <th>Altura</th>
                                <td style="text-align: end;">{{ currentProfile.altura }}</td>
                            </tr>
                            <tr>
                                <th>Idade</th>
                                <td style="text-align: end;">{{ idadeBebe() }}</td>
                            </tr>
                            <tr>
                                <th>Nascimento</th>
                                <td style="text-align: end;">{{ currentProfile.data_nascimento }}</td>
                            </tr>
                        </tbody>
                    </table>
                    <article>
                        {{ resenha() }}
                    </article>
                </div>

                <footer>

                    <div class="grid">
                        <div id="col1-pais">
                            <img class="circular-image" src="@/assets/imagens-temp/milca.jpg"
                                style="width: 100px; height: 100px;" />
                            <hgroup>
                                <h2>Milca</h2>
                                <p>Mãe</p>
                            </hgroup>
                        </div>
                        <div id="col2-pais">
                            <img class="circular-image" src="@/assets/imagens-temp/andré.jpg"
                                style="width: 100px; height: 100px;" />
                            <hgroup>
                                <h2>André</h2>
                                <p>Pai</p>
                            </hgroup>
                        </div>
                    </div>

                </footer>
            </article>

            <div style="width: 65%;" id="datails-baby">
                <article role="button" class="outline">
                    <div style="align-items: center;" class="grid">
                        <div style="margin-left: 25%;">
                            <div class="circle">
                                <div>
                                    <h3> 32 </h3>
                                    <p>palavras</p>
                                </div>
                            </div>
                        </div>

                        <div style="margin-left: -50px; margin-right: 100px;">
                            <blockquote>
                                Quer saber quando seu bebê falou a primeira palavrinha?
                                <hr />
                                E a idade do seu bebezinho quando falou pela primeira vez?
                                <footer>
                                    Essa área é pra isso mesmo 😉
                                </footer>

                            </blockquote>
                        </div>
                    </div>
                </article>

                <div data-tooltip="WIP ( Em construção )" class="tooltip">
                    <article disabled role="button" class="outline">
                        <div style="align-items: center;" class="grid">
                            <div style="margin-left: 25%;">
                                <div class="circle">
                                    <div>
                                        <h3> 2 </h3>
                                        <p>Nv. Árvore <br /> genealógico</p>
                                    </div>
                                </div>
                            </div>

                            <div style="margin-left: -50px; margin-right: 100px;">
                                <blockquote>
                                    Aqui você consegue vê os irmãozinhos do(a) {{ currentProfile.apelido }}
                                    <footer>
                                        Essa é a área dos parentes 
                                    </footer>
                                </blockquote>
                            </div>
                        </div>
                    </article>
                </div>
            </div>
        </div>
    </main>
</template>

<script lang="ts">
let currentProfile = reactive<Profile>({
    apelido: "",
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

function resenha(): string {
    if (currentProfile.idade < 1)
        return `${currentProfile.primeiro_nome} o RN mais lindo!`;
    else if (currentProfile.idade < 3)
        return `${currentProfile.primeiro_nome} está na fase da adolecência do bebê.\nBoa sorte!`;
    else
        return `${currentProfile.primeiro_nome} irá fazer perguntas que o papai e a mamãe não consegue imaginar!`;
}

function idadeBebe(): string {
    if (currentProfile.idade < 1)
        return `${currentProfile.idade} (RN)`
    else if (currentProfile.idade < 2)
        return `${currentProfile.idade} ano`
    else
        return `${currentProfile.idade} anos`
}

function quantidadeIrmaos(): string {
    if (currentProfile.irmaos_id.length == 0)
        return "Nenhum";
    else
        return currentProfile.irmaos_id.length.toString();
}

currentProfile = Object.assign(currentProfile, await getProfile(localStorage.getItem('current_id')!))
</script>

<style>
.circle {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 180px;
    height: 180px;
    max-width: 180px;
    min-height: 180px;
    border-radius: 50%;
    border: 10px solid #f55a2f4d;
    text-align: center;
    font-family: Dosis;
    white-space: normal;
    /* Evita quebras indesejadas de linha */
    overflow: hidden;
    /* Oculta qualquer conteúdo que exceda os limites */
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