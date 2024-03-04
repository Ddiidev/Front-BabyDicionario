<script setup lang="ts">
import ToolButton from '@/components/ToolButton.vue';
import EyeClose from '@/components/icons/EyeClose.vue';
import EyeOpen from '@/components/icons/EyeOpen.vue';
// import InputPassword from '@/components/InputPassword.vue';
import * as LoginImpl from './Login'

const props = withDefaults(defineProps<{tagRef: string}>(), {
    tagRef: undefined
});
</script>

<template>
    <div ref="divFloat" class="div-flutuante" v-show="LoginImpl.visibleLogin">
        <article>
            <header>
                <div style="text-align: center;" class="grid">
                    <p class="h6-login">Fazer login</p>
                    <small>
                        <ToolButton class="btClose" @click="closePanel" aria-label="Close" rel="prev">✕</ToolButton>
                    </small>
                </div>
            </header>

            <form name="body" @submit="handleSubmit">
                <fieldset>
                    <label>
                        Email
                        <input ref="emailLogin" v-model="email" :aria-invalid="invalidEmail" type="email" name="email"
                            placeholder="Email" autocomplete="email" />
                    </label>
                    <label>
                        Senha
                        <fieldset role="group">
                            <input :type="visiblePass ? 'text' : 'password'" name="password" placeholder="Sua senha" autocomplete="Password"
                                v-model="password" :aria-invalid="invalidPassword" />
                            <button @click="visiblePass=!visiblePass" class="outline">
                                <EyeClose v-if="!visiblePass"></EyeClose>
                                <EyeOpen v-if="visiblePass"></EyeOpen>
                            </button>
                        </fieldset>
                        <!-- <InputPassword :passwordValidated="LoginImpl.invalidPassword"></InputPassword> -->
                        <small class="pico-color-red-600"> {{ LoginImpl.loginData.messageError }}</small>
                        <a class="secondary" href="#esqueceu-a-senha"><small>Esqueceu a senha?</small></a>
                    </label>
                </fieldset>

                <hr />
            </form>

            <ToolButton style="width: 100%;" @click="LoginImpl.login">Entrar</ToolButton>
        </article>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
// import InputPassword from '@/components/InputPassword.vue';

export default defineComponent({
    data() {
        return {
            email: LoginImpl.loginData.email,
            password: ref(LoginImpl.loginData.password),
            invalidEmail: LoginImpl.loginData.invalidEmail,
            invalidPassword: LoginImpl.loginData.invalidPassword,
            visiblePass: false
        };
    },
    mounted() {
        try {
            this.$nextTick(() => {
                LoginImpl.setThis(this);
                LoginImpl.mounted();
            });
        } catch { }
    },
    watch: LoginImpl.watch(),
    methods: {
        setVisible: LoginImpl.setVisible,
        closePanel: LoginImpl.closePanel,
        handleSubmit(event: any) {
            event.preventDefault();
        },
    },
});
</script>

<style scoped>
.div-flutuante {
    position: absolute;
    padding: 10px;
    border-radius: 15px;
    backdrop-filter: blur(45px);
    border: 1px solid #feb1a6;
    box-shadow: 0 0 5px #feb1a6;
}

.btClose {
    margin-left: 83%;
}

.h6-login {
    text-align: center;
    margin-top: 2%;
    margin-left: 4%;
    width: 70%;
    position: fixed;
    display: block;
    font-size: 1.17em;
    font-weight: 600;
    color: inherit;
}
</style>