<script setup lang="ts">
import ToolButton from '@/components/ToolButton.vue';
</script>

<template>
    <header style="height: 100px; border-bottom: 2px solid #b19d95;"
        class="pico-background-pumpkin-100 pico-color-pumpkin-100 nav">
        <div class="container">
            <nav style="margin-top: -10px; margin-right: 15px;">
                <ul>
                    <router-link to="/">
                        <li>
                            <img alt="logo" style="margin-left: 50%;" src="@/assets/logo.png" width="48" height="48" />
                        </li>
                        <li style="margin-left: 30px;">
                            <h4>DBaby</h4>
                        </li>
                    </router-link>
                </ul>
                <ul>
                    <details v-if="!menuDefault" class="dropdown">
                        <summary style="--pico-icon-chevron: ''; margin-top: 25%; padding-left: 35%; font-weight: 900;">
                            ...
                        </summary>
                        <ul dir="rtl">
                            <li>
                                <router-link to="#login">
                                    <ToolButton>
                                        <img src="@/assets/login.svg"
                                            style="margin-bottom: 5%; margin-right: 2px; width: 24px;" alt="Logo" />
                                        Entrar
                                    </ToolButton>
                                </router-link>
                            </li>
                            <li>
                                <router-link to="/createUser">
                                    <ToolButton>Criar conta</ToolButton>
                                </router-link>
                            </li>
                        </ul>
                    </details>

                    <nav v-if="menuDefault">
                        <li>
                            <router-link to="#login">
                                <ToolButton>
                                    <img src="@/assets/login.svg" style="margin-bottom: 5%; margin-right: 2px; width: 24px;"
                                        alt="Logo" />
                                    Entrar
                                </ToolButton>
                            </router-link>
                        </li>
                        <li>
                            <router-link to="/createUser">
                                <ToolButton>Criar conta</ToolButton>
                            </router-link>
                        </li>
                    </nav>
                </ul>
            </nav>
        </div>
    </header>
</template>

<script lang="ts">
import { getResolution } from '@/views/utils';
import { defineComponent } from 'vue';

export let menuDefault = true;
export default defineComponent({
    mounted() {
        window.addEventListener("resize", this.EventHandleResize);
        menuDefault = getResolution().width > 530;
        this.$forceUpdate();
    },
    unmounted() {
        window.removeEventListener("resize", this.EventHandleResize);
    },
    methods: {
        EventHandleResize(e: Event) {
            menuDefault = getResolution().width > 530;
            this.$forceUpdate();
        },
    },
});
</script>

<style scoped>
.nav {
    position: fixed;
    top: 0;
    padding: 14px 16px;
    width: 100%;
}
/* 
@media screen and (width: 590) {
    .nav a {
        padding: unset;
    }
} */
</style>