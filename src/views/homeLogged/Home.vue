<script setup lang="ts">
import ToolButton from '@/components/ToolButton.vue';
import NavBar from '@/components/NavBar.vue';
import { userLogged } from '@/auth/auth';
import router from '@/router';
import Settings from '@/components/icons/Settings.vue';
import EyeView from '@/components/icons/EyeView.vue';
import { useRoute } from 'vue-router';


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
            <article style="width: 15em;">
                <header>
                    <div style="display: flex; justify-content: end;">
                        <Settings class="btn"></Settings>
                    </div>
                    <div style="display: flex; justify-content: center;">
                        <div class="grid">
                            <img class="circular-image" src="@/assets/imagens-temp/milca.jpg"
                                style="width: 8em; height: 8em;" />
                        </div>
                    </div>
                </header>

                <body>
                    <div style="text-align: center;">
                        <h3>Milca</h3>
                        <p>Mãe</p>
                    </div>
                </body>
            </article>

            <article style="width: 15em;">
                <header>
                    <div style="display: flex; justify-content: end;">
                        <Settings class="btn"></Settings>
                    </div>
                    <div style="display: flex; justify-content: center;">
                        <div class="grid">
                            <img class="circular-image" src="@/assets/imagens-temp/andré.jpg"
                                style="width: 8em; height: 8em;" />
                        </div>
                    </div>
                </header>

                <body>
                    <div style="text-align: center;">
                        <h3>André</h3>
                        <p>Pai</p>
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
                            <img class="circular-image" src="@/assets/baby-voice-up.ico"
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
</style>