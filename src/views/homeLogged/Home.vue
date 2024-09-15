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

        <div class="parent-panels">
            <div class="left-panel-children">
                <div class="container" style="padding-left: 0px;">

                    <div class="container overflow-auto" style="height: 82vh; padding-top: 25px;">
                        <article class="card-profile" style="margin-bottom: 35px;">
                            <header>
                                <div style="display: flex; justify-content: end;">
                                    <Settings @click="HomeImpl.openSettingsMother()" class="btn">
                                    </Settings>
                                </div>
                                <div style="display: flex; justify-content: center;">
                                    <div class="grid">
                                        <img class="circular-image default-border"
                                            :src="HomeImpl.data.curretImageProfileMother"
                                            style="width: 8em; height: 8em;" />
                                    </div>
                                </div>
                            </header>

                            <body>
                                <div style="text-align: center;">
                                    <h3 class="card-profile-title">{{ HomeImpl.data.profile.mother?.first_name }}</h3>
                                    <p>Mãe</p>
                                </div>
                            </body>
                        </article>
                    </div>
                </div>
            </div>
            <div class="left-panel-children" style="border-left: 2px solid var(--pico-primary);"></div>


            <div class="right-panel-children">
                <div class="container grid">
                    <!-- Mother -->
                    <article class="card-profile" v-if="HomeImpl.containMother()">
                        <header>
                            <div style="display: flex; justify-content: end;">
                                <Settings @click="HomeImpl.openSettingsMother()" class="btn"></Settings>
                            </div>
                            <div style="display: flex; justify-content: center;">
                                <div class="grid">
                                    <img class="circular-image default-border"
                                        :src="HomeImpl.data.curretImageProfileMother"
                                        style="width: 8em; height: 8em;" />
                                </div>
                            </div>
                        </header>

                        <body>
                            <div style="text-align: center;">
                                <h3 class="card-profile-title">{{ HomeImpl.data.profile.mother?.first_name }}</h3>
                                <p>Mãe</p>
                            </div>
                        </body>
                    </article>
                    <article v-else class="card-profile">
                        <header>
                            <div style="display: flex; justify-content: end;">
                                <Settings @click="HomeImpl.openSettingsMother(true)" class="btn"></Settings>
                            </div>
                            <div style="display: flex; justify-content: center;">
                                <div class="grid">
                                    <img class="circular-image default-border" opacity
                                        :src="HomeImpl.data.curretImageProfileMother"
                                        style="width: 8em; height: 8em;" />
                                </div>
                            </div>
                        </header>

                        <body>
                            <div style="text-align: center;">
                                <h3 @click="HomeImpl.openSettingsMother(true)" class="btn-text card-profile-title">
                                    Adicionar Mãe</h3>
                            </div>
                        </body>
                    </article>
                    <!-- /Mother -->

                    <!-- Father -->
                    <article class="card-profile" v-if="HomeImpl.containFater()">
                        <header>
                            <div style="display: flex; justify-content: end;">
                                <Settings @click="HomeImpl.openSettingsFather()" class="btn"></Settings>
                            </div>

                            <div style="display: flex; justify-content: center;">
                                <div class="grid">
                                    <img class="circular-image default-border"
                                        :src="HomeImpl.data.curretImageProfileFather"
                                        style="width: 8em; height: 8em;" />
                                </div>
                            </div>
                        </header>

                        <body>
                            <div style="text-align: center;">
                                <h3 class="card-profile-title">{{ HomeImpl.data.profile.father?.first_name }}</h3>
                                <p>Pai</p>
                            </div>
                        </body>
                    </article>
                    <article v-else class="card-profile">
                        <header>
                            <div style="display: flex; justify-content: end;">
                                <Settings @click="HomeImpl.openSettingsFather(true)" class="btn"></Settings>
                            </div>
                            <div style="display: flex; justify-content: center;">
                                <div class="grid">
                                    <img class="circular-image default-border" opacity
                                        :src="HomeImpl.data.curretImageProfileFather"
                                        style="width: 8em; height: 8em;" />
                                </div>
                            </div>
                        </header>

                        <body>
                            <div style="text-align: center;">
                                <h3 @click="HomeImpl.openSettingsFather(true)" class="btn-text card-profile-title">
                                    Adicionar Pai</h3>
                            </div>
                        </body>
                    </article>
                    <!-- /Father -->
                </div>
            </div>
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
/* .center {
    display: flex;
    justify-content: center;
    overflow: hidden;
} */

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

.parent-panels {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(3, 0.36fr);
    gap: 30px;
    overflow-x: hidden;
}

.left-panel-children .container {
    display: grid;
    place-items: center;
    margin-right: 5px;
    width: 25vw;
    overflow-x: hidden;
    margin-top: -5px;
}

.left-panel-children {
    grid-row: span 3 / span 2;
}

.right-panel-children {
    grid-row: span 2 / span 2;
    grid-column-start: 3;
    padding-top: 25px;
}

.card-profile {
    width: 14em;
    height: fit-content;
}

.parent-panels {
    gap: var(20px);
}

/* Media query para telas largas (800px e maior) */
@media (min-width: 800px) {

    .left-panel-children .container {
        padding-left: 10px;
        padding-right: 15px;
    }

    .card-profile {
        width: 12em;
    }
}

@media (max-width: 900px) and (min-width: 500px) {
    .parent-panels {
        gap: var(20px);
    }
}

@media (max-width: 800px) {
    .left-panel-children .container {
        width: 35vw;
        padding-left: 5px;
        padding-right: 5px;
    }

    .card-profile {
        width: 12em;
    }
}


@media (max-width: 700px) {
    .left-panel-children .container {
        width: 40vw;
        padding-left: 5px;
        padding-right: 5px;
    }

    .card-profile {
        width: 12em;
    }
}

@media (max-width: 600px) {
    .card-profile {
        width: 11em;
    }
}

@media (max-width: 500px) {
    .card-profile {
        width: 11em;
        font-size: smaller;
    }
}

@media (max-width: 400px) {
    .card-profile {
        width: 10em;
        padding-bottom: 0;
        font-size: smaller;
    }

    .card-profile-title {
        font-size: large;
    }
}
</style>