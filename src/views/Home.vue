<script setup lang="ts">
import LabelText from '@/components/LabelText.vue';
import Background from '@/components/Background.vue';
import ToolButton from '@/components/ToolButton.vue';
</script>

<template>
    <Background>
            <div class="centralized-content">
                <img alt="Vue logo" class="logo" src="@/assets/logo.png" width="150" height="150" />

                <LabelText fontSize=35>
                    Dicionário do bebê
                </LabelText>

                <LabelText fontSize=23 secondaryColor>
                    Uma forma simples de registrar novas palavrinhas do seu bebê
                </LabelText>


                <router-link to="/register">
                    <ToolButton class="tooltip" data-tooltip="Realize o cadastro e comece registrar novas palavrinhas">
                        Registrar nova palavra
                    </ToolButton>
                </router-link>

                <router-link to="/profile/b396a08/Dante">
                    <ToolButton class="tooltip" data-tooltip="Também é possível compartilhar o perfil do seu bebê">
                        Veja um exemplo
                    </ToolButton>
                </router-link>
            </div>
        </Background>
</template>