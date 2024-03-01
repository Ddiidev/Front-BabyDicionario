<script setup lang="ts">
import {
    setSelfComponent, current_step, nextStep, prevStep,
    checkedPai, checkedMae, passwordMatch, codeVerificationMatch,
    form_data, toastData, dataValida, modal, setModal
} from './CreateUser';
import ToolButton from '@/components/ToolButton.vue';
import * as ResponsiveUI from './ResponsiveUI';
import NavBar from '@/components/NavBar.vue';
import Toast from '@/components/Toast.vue';
</script>

<template>
    <NavBar hideCreateAcount></NavBar>
    <main style="padding-left: 3%; padding-right: 3%;" class="main container-fluid">
        <Toast v-for="(toast) in toastData.toasts.value" :title="toast.title" :message="toast.message" :show="toast.show"
            @closeButton="toastData.removeMessage(toast)"></Toast>

        <dialog v-if="modal.show" open>
            <article class="default-modal">
                <header>
                    <ToolButton @click='setModal(false)' style="display: block; margin-left: auto;" aria-label="Close" rel="prev">✕</ToolButton>
                    <p>
                        <strong>📩 Aparentemente esse email já foi cadastrado.</strong>
                    </p>
                </header>
                <p>
                    {{ modal.message }}
                </p>
            </article>
        </dialog>

        <div class="grid">
            <article id="side" style="justify-self: center; text-align: center;">
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
                            <input ref="inPrimeiroNome" style="margin-top: 3%;" name="first_name"
                                placeholder="Primeiro nome" autocomplete="given-name" v-model="form_data.primeiro_nome" />
                            <small>Dica: aqui é o nome do papai ou da mamãe. Logo poderá adicionar o perfil do seu
                                baby</small>
                        </label>

                        <label>
                            <div v-if="form_data.primeiro_nome !== ''">
                                {{ form_data.primeiro_nome }}, informe sua idade:
                            </div>
                            <input type="date" name="date" aria-label="Date" v-model="form_data.data_nascimento"
                                aria-describedby="valid-data-nascimento" :aria-invalid="!dataValida()" />

                            <small id="valid-data-nascimento"> {{ !dataValida() ? "Por favor insira uma data de nascimento válida" : "" }} </small>
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
                            <input ref="inEmail" v-model="form_data.email" name="email" placeholder="E-mail de login"
                                type="email" autocomplete="email" />
                            <input v-model="form_data.senha" name="pass" placeholder="Digite sua senha de acesso"
                                type="password" aria-label="Password" :aria-invalid="!passwordMatch()"
                                aria-describedby="valid-pass" />

                            <input v-model="form_data.senhaConfirm" name="pass_confirm" placeholder="Confirme sua senha"
                                type="password" aria-describedby="valid-pass" :aria-invalid="!passwordMatch()"
                                aria-label="Password" />
                            <small id="valid-pass"> {{ !passwordMatch() ? "Senhas não coincidem" : "Perfeito!" }}
                            </small>
                        </label>
                    </fieldset>

                    <fieldset v-if="current_step === 3">
                        <label>
                            <h4>Estamos quase lá, só preciso que você confirme seu e-mail</h4>

                            <small>Será enviado um código de confirmação para seu e-mail</small>
                            <h5>{{ form_data.email }}</h5>
                        </label>
                    </fieldset>

                    <fieldset v-if="current_step === 4">
                        <label>
                            <h4>Foi enviado um código para seu e-mail</h4>

                            <input v-model="form_data.codigoConfirmacao" placeholder="Digite o código enviado"
                                aria-describedby="valid-code" :aria-invalid="!form_data.codigoValido"
                                aria-label="Password" />
                            <small id="valid-code"> {{ form_data.codigoValido ? "Perfeito!!" : "Código inválido" }}
                            </small>
                        </label>
                    </fieldset>

                    <ToolButton :onclick="prevStep" v-if="current_step > 1"> &lt;&lt; Voltar</ToolButton>
                    <ToolButton :onclick="codeVerificationMatch" v-if="current_step == 4">Verificar código</ToolButton>
                    <ToolButton v-if="current_step != 4" :onclick="nextStep">Avançar >></ToolButton>
                </label>
            </article>
            <div id="body">
                <article v-if="ResponsiveUI.defaultMessageContainer" class="article_message-container">
                    <div class="message-container">
                        <h5 v-for="(item, index) in messages" :style="`animation-delay: ${index * 2}s`"
                            class="floating-message">{{ item }}</h5>
                    </div>

                    <blockquote style="text-align: start;">
                        O dicionário do bebê é um projeto que guardei em meu coração <br />
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
import { defineComponent } from "vue";

export default defineComponent({
    mounted() {
        setSelfComponent(this);
        ResponsiveUI.calculateView(this);
        window.addEventListener("resize", this.EventHandleResize);
    },
    unmounted() {
        window.removeEventListener("resize", this.EventHandleResize);
    },
    methods: {
        EventHandleResize(e: Event) {
            ResponsiveUI.calculateView(this);
        },
    },
});

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