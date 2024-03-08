<script setup lang="ts">
import { useRoute } from 'vue-router';
import NavBar from '@/components/NavBar.vue';
import { getProfile, idadeBebe, quantidadeIrmaos, resenha, currentProfile } from './profile';

localStorage.setItem('current_id', useRoute().params.id.toString())
localStorage.setItem('name', useRoute().params.name.toString())
</script>

<template>
    <NavBar></NavBar>
    <main class="main container-fluid">
        <div style="display: flex; justify-content: start;" class="grid">
            <article id="side" style="text-align: center;">
                <header>
                    <img style="margin-top: 0px;" class="circular-image" src="@/assets/imagens-temp/dante.jpg" />
                    <hgroup>
                        <h2>{{ currentProfile.primeiro_nome }}</h2>
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
                                <h2>{{ currentProfile.mae?.primeiro_nome }}</h2>
                                <p>Mãe</p>
                            </hgroup>
                        </div>
                        <div id="col2-pais">
                            <img class="circular-image" src="@/assets/imagens-temp/andré.jpg"
                                style="width: 100px; height: 100px;" />
                            <hgroup>
                                <h2>{{ currentProfile.pai?.primeiro_nome }}</h2>
                                <p>Pai</p>
                            </hgroup>
                        </div>
                    </div>

                </footer>
            </article>

            <div style="width: 65%;" id="datails-baby">
                <article role="button" class="outline">
                    <div style="align-items: center;" class="grid">
                        <div>
                            <h3> 32 </h3>
                            <p>palavras</p>
                        </div>

                        <blockquote>
                            Quer saber quando seu bebê falou a primeira palavrinha?
                            <hr />
                            E a idade do seu bebezinho quando falou pela primeira vez?
                            <footer>
                                Essa área é pra isso mesmo 😉
                            </footer>

                        </blockquote>
                    </div>
                </article>

                <div data-tooltip="WIP ( Em construção )" class="tooltip">
                    <article disabled role="button" class="outline">
                        <div style="align-items: center;" class="grid">
                            <div>
                                <h3> 2 </h3>
                                <p>Nv. Árvore <br /> genealógico</p>
                            </div>

                            <blockquote>
                                Aqui você consegue vê os irmãozinhos do(a) {{ currentProfile.apelido }}
                                <footer>
                                    Essa é a área dos parentes
                                </footer>
                            </blockquote>
                        </div>
                    </article>
                </div>
            </div>
        </div>
    </main>
</template>

<style scoped>
.circular-image {
    margin-top: 5%;
    width: 150px;
    height: 150px;
    align-self: center;
    object-fit: cover;
    border-radius: 40%;
}
</style>