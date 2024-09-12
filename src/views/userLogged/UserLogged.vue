<script setup lang="ts">
import ToolButton from '@/components/ToolButton.vue';
import * as userLoggedImpl from './UserLogged'

const props = withDefaults(defineProps<{ tagRef: string }>(), {
    tagRef: undefined
});
</script>

<template>
    <div ref="divFloat" class="div-flutuante" v-show="userLoggedImpl.visibleUserLogged">
        <article>
            <header>
                <div style="display: flex; justify-content: center;">
                    <div style="display: relative;">
                        <img class="circular-image default-border" src="@/assets/imagens-temp/dante.jpg" />
                        <div class="online"></div>
                    </div>
                    <div style="position: absolute; margin-left: 73%;">
                        <small class="right-header-painel">
                            <ToolButton @click="closePanel" aria-label="Close" rel="prev">✕</ToolButton>
                        </small>
                    </div>
                </div>
                <p class="h6"> {{ userLoggedImpl.userLoggedData.userLogged?.first_name }} </p>
            </header>

            <table>
                <tbody>
                    <tr>
                        <th scope="row">Nome</th>
                        <td>{{ userLoggedImpl.userLoggedData.userLogged?.getNameComplete() }}</td>
                    </tr>
                    <tr>
                        <th scope="row">Responsável</th>
                        <td>{{ userLoggedImpl.userLoggedData.userLogged?.getTextResponsible() }}</td>
                    </tr>
                    <!-- TODO: No email precisa de um blur -->
                    <!-- <tr>
                        <th scope="row">Email</th>
                        <td> {{ userLoggedImpl.userLoggedData.userLogged?.email }} </td>
                    </tr> -->
                </tbody>
            </table>

            <hr />

            <div class="grid">
                <ToolButton @click="singOut">
                    <svg xmlns="http://www.w3.org/2000/svg" style="width: 24px; height: 24px; margin-bottom: 3px;"
                        viewBox="0 0 32 32">
                        <g id="_110_log-out-03" data-name="110 log-out-03">
                            <path d="M8.88,22.71l-5.29-5.3a2,2,0,0,1,0-2.82l5.29-5.3,1.41,1.42L5,16l5.29,5.29Z" />
                            <rect x="4.59" y="15" width="14" height="2" />
                            <path d="M16,29V27A11,11,0,0,0,16,5V3a13,13,0,0,1,0,26Z" />
                        </g>
                    </svg>
                    Sair
                </ToolButton>
                <div data-tooltip="WIP (Em construção)">
                    <ToolButton disabled style="width: 100%;">
                        <svg xmlns="http://www.w3.org/2000/svg" style="width: 24px; height: 24px; margin-bottom: 3px;"
                        viewBox="0 0 32 32">
                        <g id="_139_settings-01" data-name="139 settings-01">
                            <path
                            d="M17.13,29H14.87a2,2,0,0,1-2-1.72l-.4-2.8-2.27,1.7A2,2,0,0,1,7.61,26L6,24.39a2,2,0,0,1-.19-2.61l1.7-2.27-2.8-.4a2,2,0,0,1-1.72-2V14.87a2,2,0,0,1,1.72-2l2.8-.4-1.7-2.26A2,2,0,0,1,6,7.61L7.61,6a2,2,0,0,1,2.61-.19l2.27,1.7.4-2.8a2,2,0,0,1,2-1.72h2.26a2,2,0,0,1,2,1.72l.4,2.8,2.27-1.7A2,2,0,0,1,24.39,6L26,7.61a2,2,0,0,1,.19,2.61l-1.7,2.27,2.8.4a2,2,0,0,1,1.72,2v2.26a2,2,0,0,1-1.72,2l-2.8.4,1.7,2.27A2,2,0,0,1,26,24.39L24.39,26a2,2,0,0,1-2.61.19l-2.27-1.7-.4,2.8A2,2,0,0,1,17.13,29Zm-4.6-6.8a.91.91,0,0,1,.43.1,6.59,6.59,0,0,0,.73.3,1,1,0,0,1,.67.8l.51,3.6h2.26l.52-3.6a1,1,0,0,1,.66-.8c.25-.09.49-.19.73-.3a1,1,0,0,1,1,.1L23,24.58l1.6-1.6L22.4,20.07a1,1,0,0,1-.1-1c.11-.24.21-.48.3-.74a1,1,0,0,1,.81-.65L27,17.13V14.87l-3.6-.52a1,1,0,0,1-.8-.66c-.09-.25-.19-.49-.3-.73a1,1,0,0,1,.1-1L24.58,9,23,7.42,20.07,9.6a1,1,0,0,1-1,.1c-.24-.11-.48-.21-.73-.3a1,1,0,0,1-.66-.8L17.13,5H14.87l-.52,3.6a1,1,0,0,1-.66.8c-.25.09-.49.19-.73.3a1,1,0,0,1-1-.1L9,7.42,7.42,9,9.6,11.93a1,1,0,0,1,.1,1,5.74,5.74,0,0,0-.3.72,1,1,0,0,1-.81.66L5,14.87v2.27l3.6.51a1,1,0,0,1,.8.66c.09.25.19.49.3.73a1,1,0,0,1-.1,1L7.42,23,9,24.58l2.91-2.18A1,1,0,0,1,12.53,22.2ZM27,14.87h0Z" />
                            <path d="M16,20a4,4,0,1,1,4-4A4,4,0,0,1,16,20Zm0-6a2,2,0,1,0,2,2A2,2,0,0,0,16,14Z" />
                        </g>
                    </svg>
                    Opções
                </ToolButton>
            </div>
            </div>
        </article>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
    data() {
        return {
            email: userLoggedImpl.userLoggedData.email,
            password: ref(userLoggedImpl.userLoggedData.password),
            invalidEmail: userLoggedImpl.userLoggedData.invalidEmail,
            invalidPassword: userLoggedImpl.userLoggedData.invalidPassword,
            visiblePass: false
        };
    },
    async mounted() {
        try {
            await this.$nextTick()
            
            userLoggedImpl.setThis(this);
            await userLoggedImpl.mounted();
        } catch { }
    },
    methods: {
        setVisible: userLoggedImpl.setVisible,
        closePanel: userLoggedImpl.closePanel,
        handleSubmit(event: any) {
            event.preventDefault();
        },

        singOut() {
            userLoggedImpl.singOut();
        }
    },
});
</script>

<style scoped>
.div-flutuante {
    padding: 10px;
    position: absolute;
    /* width: 40vh; */
    min-width: 38vh;
    border-radius: 15px;
    backdrop-filter: blur(45px);
    border: 1px solid #feb1a6;
    box-shadow: 0 0 5px #feb1a6;
}



.btClose {
    margin-right: 30px;
}

.h6 {
    margin-top: 3%;
    color: inherit;
    font-weight: 600;
    font-size: 1.17em;
    text-align: center;
}

.online {
    left: 5px;
    width: 7px;
    bottom: 8px;
    height: 7px;
    position: relative;
    border-radius: 50%;
    background-color: green;
    box-shadow: 0px 0px 4px 3px rgba(0, 128, 0, 0.5);
}

.circular-image {
    margin: 0px;
    width: 90px;
    padding: 0px;
    height: 90px;
    position: relative;
    border-radius: 40%;
}
</style>