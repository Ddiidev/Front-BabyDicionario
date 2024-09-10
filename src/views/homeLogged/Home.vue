<script setup lang="ts">
import ToolButton from '@/components/ToolButton.vue';
import NavBar from '@/components/NavBar.vue';
import { userLogged } from '@/auth/auth';
import router from '@/router';
import Settings from '@/components/icons/Settings.vue';
import EyeView from '@/components/icons/EyeView.vue';
import * as HomeImpl from './Home';
import confs from '@/constants/conf';


// localStorage.setItem('current_id', useRoute().params.uuid.toString())
// localStorage.setItem('name', useRoute().params.name.toString())
if (!userLogged()) {
    router.push({
        path: '/'
    })
}
</script>

<template>
    <NavBar></NavBar>
    <main class="main container-fluid">

        <div class="center grid">
            <article v-if="HomeImpl.containMother()" style="width: 15em;">
                <header>
                    <div style="display: flex; justify-content: end;">
                        <Settings @click="HomeImpl.openSettingsMother()" class="btn"></Settings>
                    </div>
                    <div style="display: flex; justify-content: center;">
                        <div class="grid">
                            <img class="circular-image default-border" :src="`${confs.storage}/server-image/${CurrentUserLogged.userLogged.uuid}/${HomeImpl.data.profile.mother?.uuid}`"
                                style="width: 8em; height: 8em;" />
                        </div>
                    </div>
                </header>

                <body>
                    <div style="text-align: center;">
                        <h3>{{ HomeImpl.data.profile.mother?.first_name }}</h3>
                        <p>Mãe</p>
                    </div>
                </body>
            </article>
            <article v-else style="width: 15em;">
                <header>
                    <div style="display: flex; justify-content: end;">
                        <Settings @click="HomeImpl.openSettingsMother(true)" class="btn"></Settings>
                    </div>
                    <div style="display: flex; justify-content: center;">
                        <div class="grid">
                            <img class="circular-image default-border" opacity src="@/assets/imagens-temp/female-user.jpeg"
                                style="width: 8em; height: 8em;" />
                        </div>
                    </div>
                </header>

                <body>
                    <div style="text-align: center;">
                        <h3 @click="HomeImpl.openSettingsMother(true)" class="btn-text">Adicionar Mãe</h3>
                    </div>
                </body>
            </article>

            <article v-if="HomeImpl.containFater()" style="width: 15em;">
                <header>
                    <div style="display: flex; justify-content: end;">
                        <Settings @click="HomeImpl.openSettingsFather()" class="btn"></Settings>
                    </div>
                    <div style="display: flex; justify-content: center;">
                        <div class="grid">
                            <img class="circular-image default-border" :src="`${confs.storage}/server-image/${CurrentUserLogged.userLogged.uuid}/${HomeImpl.data.profile.father?.uuid}`"
                                style="width: 8em; height: 8em;" />
                        </div>
                    </div>
                </header>

                <body>
                    <div style="text-align: center;">
                        <h3>{{ HomeImpl.data.profile.father?.first_name }}</h3>
                        <p>Pai</p>
                    </div>
                </body>
            </article>
            <article v-else style="width: 15em;">
                <header>
                    <div style="display: flex; justify-content: end;">
                        <Settings @click="HomeImpl.openSettingsFather(true)" class="btn"></Settings>
                    </div>
                    <div style="display: flex; justify-content: center;">
                        <div class="grid">
                            <img class="circular-image default-border" opacity src="@/assets/imagens-temp/male-user.jpeg"
                                style="width: 8em; height: 8em;" />
                        </div>
                    </div>
                </header>

                <body>
                    <div style="text-align: center;">
                        <h3 @click="HomeImpl.openSettingsFather()" class="btn-text">Adicionar Pai</h3>
                    </div>
                </body>
            </article>
        </div>

        <div class="center">
            <article style="width: 15em;">
                <header>
                    <div style="display: flex; justify-content: end;">
                        <EyeView class="btn"></EyeView>
                    </div>
                    <div style="display: flex; justify-content: center;">
                        <div class="grid">
                            <img class="circular-image " src="@/assets/baby-voice-up.ico"
                            style="width: 8em; height: 8em;" />
                        </div>
                    </div>
                </header>
                
                <body>
                    <div style="text-align: center;">
                        <h3>{{ 1 }} Filho(s)</h3>
                        <div style="display: flex; justify-content: left;">
                            <p class="text-card">{{ 32 }} Palavra(s)</p>
                        </div>
                    </div>
                </body>
            </article>
        </div>
    </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { CurrentUserLogged } from '@/constants/userLogged';
import { dataCurrentUserLogged } from '@/service/user/user';

export default defineComponent({
    mounted() {
        dataCurrentUserLogged();
        try {
            this.$nextTick(() => {
                HomeImpl.mounted(this);
            });
        } catch { }
    },
    profileEditImpl() {
        // window.removeEventListener("resize", this.EventHandleResize);
    },
    methods: {
        // EventHandleResize(e: Event) {},
    },
});
</script>

<style scoped>
.center {
    display: flex;
    justify-content: center;
    overflow: hidden;
}

.parent {
    display: grid;
    grid-template-columns: 0.3fr;
    grid-template-rows: 0.3fr 1fr;
    grid-column-gap: 0px;
    grid-row-gap: 0px;
    justify-content: center;
}

.text-card {
    border-style: dashed;
    border-radius: 25%;
    text-align: center;
    padding: 3px 10px 3px 10px;
}

.circular-image {
    align-self: center;
    object-fit: cover;
    border-radius: 40%;
}

.circular-image[opacity] {
    opacity: 0.7;
}
</style>