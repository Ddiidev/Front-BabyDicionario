<script setup lang="ts">
import NavBar from '@/components/NavBar.vue';
import ToolButton from '@/components/ToolButton.vue';
import { current_step, nextStep, prevStep, checkedPai, checkedMae, passwordMatch, codeVerificationMatch, form_data } from './CreateUser';
//
</script>

<template>
    <NavBar hideCreateAcount></NavBar>
    <main style="padding-left: 3%; padding-right: 3%;" class="main container">
        <div style="display: flex; justify-content: start;" class="grid">
            <article id="side" style="width: 35%; text-align: center;">
                <header>
                    <img class="rounded-image" src="@/assets/logo.png" style="width: 100px; height: 100px;" />
                    <hgroup style="margin-top: 10px">
                        <h2>Olá, vamos começar...</h2>
                    </hgroup>
                    <h3>{{ form_data.primeiro_nome }}</h3>
                </header>

                <label>

                    <fieldset v-if="current_step === 1">
                        <label>
                            Como gostaria de ser chamado?
                            <input style="margin-top: 3%;" name="first_name" placeholder="Primeiro nome"
                                autocomplete="given-name" v-model="form_data.primeiro_nome" />
                            <small>Dica: aqui é o nome do papai ou da mamã. Logo poderá adicionar o perfil do seu
                                baby</small>
                        </label>

                        <fieldset>
                            <input type="radio" id="radioPai" name="second-language" v-bind:checked="form_data.pai"
                                :onClick="checkedPai" />
                            <label htmlFor="radioPai">Pai</label>

                            <input type="radio" id="radioMae" name="second-language" v-bind:checked="form_data.mae"
                                :onClick="checkedMae" />
                            <label htmlFor="radioMae">Mãe</label>
                        </fieldset>
                    </fieldset>

                    <fieldset v-if="current_step === 2">
                        <label>
                            Informe um e-mail
                            <input v-model="form_data.email" name="email" placeholder="E-mail de login" type="email"
                                autocomplete="email" />
                            <input v-model="form_data.senha" name="pass" placeholder="Digite sua senha de acesso"
                                type="password" aria-label="Password" :aria-invalid="!passwordMatch()"
                                aria-describedby="valid-pass" />

                            <input v-model="form_data.senhaConfirm" name="pass_confirm" placeholder="Confirme sua senha"
                                type="password" aria-describedby="valid-pass" :aria-invalid="!passwordMatch()"
                                aria-label="Password" />
                            <small id="valid-pass"> {{ !passwordMatch() ? "Senhas não coincidem" : "Perfeito!" }} </small>
                        </label>
                    </fieldset>

                    <fieldset v-if="current_step === 3">
                        <label>
                            <h4>Estamos quase lá, só preciso que você confirme</h4>

                            <small>Será enviado um código de confirmação para seu e-mail</small>
                            <h5>{{ form_data.email }}</h5>
                        </label>
                    </fieldset>

                    <fieldset v-if="current_step === 4">
                        <label>
                            <h4>Foi enviado um código para seu e-mail</h4>

                            <input v-model="form_data.codigoConfirmacao" placeholder="Confirme o código enviado"
                                aria-describedby="valid-code" :aria-invalid="!codeVerificationMatch()"
                                aria-label="Password" />
                            <small id="valid-code"> {{ !codeVerificationMatch() ? "Código inválido" : "Perfeito!!" }}
                            </small>
                        </label>
                    </fieldset>

                    <ToolButton :onclick="prevStep" v-if="current_step > 1"> &lt;&lt; Voltar</ToolButton>
                    <ToolButton v-if="current_step == 4">Verificar código</ToolButton>
                    <ToolButton v-if="current_step != 4" :onclick="nextStep">Avançar >></ToolButton>
                </label>
            </article>


            <div style="width: 65%;" id="body">
                <article class="article_message-container">
                    <div class="message-container">
                        <h5 v-for="(item, index) in messages" :style="`animation-delay: ${index * 2}s`"
                            class="floating-message">{{ item }}</h5>
                    </div>

                    <blockquote style="text-align: start;">
                        O dicionário do bebê é um projeto que guardei em meu coração <br/>
                        desde que meu filho disse papá pela primeira vez. #coração_quentinho ❤️‍🔥
                        <footer>
                            <cite>— de: André para todos os pais</cite>
                        </footer>
                    </blockquote>
                </article>
            </div>
        </div>
    </main>
</template>

<script lang="ts">
const messages = [
    "Ter um filho é ter uma casa cheia de amor.",
    "Meu bebê, meu grande amor.",
    "Um bebê é uma das coisas mais valiosas da vida.",
    "Meu coração bate por você, meu lindo tesouro.",
    "Vamos iniciar o open bar de mamadeiras, fraldas e lencinhos umedecidos. #abençoados"
];
</script>

<style scoped>
.centralized-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.article_message-container {
    border-radius: 50px;
    box-shadow: 0px 0px 100px 0px #f55a2f4d;
    text-align: center;
}

.message-container {
    position: relative;
    width: 100%;
    height: 500px;
    margin-left: auto;
    margin-right: auto;
    overflow: hidden;
}

.floating-message {
    position: absolute;
    left: 0;
    top: -50px;
    animation: floatText 9s infinite alternate;
}

@keyframes floatText {
    0% {
        transform: translate(0, 0);
    }

    25% {
        transform: translate(50px, -80px);
    }

    50% {
        transform: translate(100px, 200px);
    }

    75% {
        transform: translate(150px, -50px);
    }

    100% {
        transform: translate(300px, 350px);
    }
}
</style>