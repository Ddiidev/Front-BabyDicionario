<script setup lang="ts">
import Background from '@/components/Background.vue';
import NavBar from '@/components/NavBar.vue';
import ToolButton from '@/components/ToolButton.vue';
</script>

<template>
    <NavBar></NavBar>
    <Background style="height: 900px;">
        <main class="centralized-content">
            <img alt="logo" class="logo" src="@/assets/logo.png" width="150" height="150" />

            <hgroup style="margin-top: 20px; text-align: center;">
                <h2>Dicionário do bebê</h2>
                <p>
                    Uma forma simples de registrar novas palavrinhas do seu bebê
                </p>
            </hgroup>

            <div style="margin-top: 20px; justify-content: space-between; display: flex;" class="grid">
                <router-link to="/register">
                    <ToolButton style="width: 300px;" class="tooltip"
                        data-tooltip="Realize o cadastro e comece registrar novas palavrinhas">
                        Registrar nova palavra
                    </ToolButton>
                </router-link>

                <router-link to="/profile/b396a08/Dante">
                    <ToolButton style="width: 300px;" class="tooltip"
                        data-tooltip="Também é possível compartilhar o perfil do seu bebê">
                        Veja um exemplo
                    </ToolButton>
                </router-link>
            </div>
        </main>
    </Background>
</template>

<style scoped>
.centralized-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
}
</style>