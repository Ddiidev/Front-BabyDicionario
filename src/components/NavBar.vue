<script setup lang="ts">
import ToolButton from '@/components/ToolButton.vue';
</script>

<template>
    <header style="height: 100px; border-bottom: 2px solid #b19d95;"
        class="pico-background-pumpkin-100 pico-color-pumpkin-100 nav">
        <div class="container">
            <nav>
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
                    <li>
                        <router-link to="#login">
                            <ToolButton>
                                <img src="@/assets/login.svg" style="margin-bottom: 5%; margin-right: 2px; width: 24px;" alt="Logo"/>
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
            </nav>
        </div>
    </header>
</template>

<style scoped>
.nav {
    overflow: hidden;
    position: fixed;
    top: 0;
    width: 100%;
}

.nav a {
    float: left;
    display: block;
    text-align: center;
    padding: 14px 16px;
    text-decoration: none;
}
</style>