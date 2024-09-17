<script setup lang="ts">
import NavBar from '@/components/NavBar.vue';
import * as WordsImpl from './Words';

WordsImpl.mounted();
</script>

<template>
    <NavBar></NavBar>
    <main class="main container-fluid">
        <div class="container">
            <header class="header">
                <article smoth-bottom class="custom-card">
                    <div class="grid">
                        <img class="circular-image" :src="WordsImpl.data.profile.currentImage" alt="Imagem do perfil" />
                        <h2 style="margin-top: 10%;">Minhas palavrinhas</h2>
                    </div>
                </article>
            </header>

            <body>
                <article class="custom-card" smoth-top
                    style="overflow-y: auto; max-height: max-content; margin-top: 5%;">
                    <p>Aqui você pode listar suas palavrinhas.</p>
                </article>
            </body>
        </div>
    </main>
</template>

<style scoped>
.custom-card {
    border-radius: var(--pico-border-radius);
    padding: 16px;
    margin: 10px 0;
    border: none;
    box-shadow: 1 5px 8px rgba(12, 12, 12, 0.1);
}

.custom-card[smoth-bottom] {
    background: linear-gradient(to bottom, #fdf6ee, rgba(255, 255, 255, 0));
    box-shadow: 0px -8px 8px rgba(12, 12, 12, 0.1);
}

.custom-card[smoth-top] {
    background: linear-gradient(to top, #fdf6ee, rgba(255, 255, 255, 0));
    box-shadow: 0px 8px 8px rgba(12, 12, 12, 0.1);
}

.profile-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}

.circular-image {
    align-self: center;
    object-fit: cover;
    border-radius: 40%;
    width: 8em;
    /* Tamanho padrão */
    height: 8em;
    /* Tamanho padrão */
    margin-right: 20px;
}

/* Media Query para diminuir o tamanho da imagem e fonte gradativamente */
@media (max-width: 1200px) {
    .circular-image {
        width: 7em;
        height: 7em;
    }

    h2 {
        font-size: 1.8em;
    }
}

@media (max-width: 992px) {
    .circular-image {
        width: 6em;
        height: 6em;
    }

    h2 {
        font-size: 1.6em;
    }
}

@media (max-width: 768px) {
    .circular-image {
        width: 5em;
        height: 5em;
        position: absolute;
        margin-bottom: -20px;
    }
    
    h2 {
        font-size: 1.4em;
        text-align: center;
        margin-left: 25%;
    }
}

@media (max-width: 576px) {
    .circular-image {
        width: 4em;
        height: 4em;
    }

    h2 {
        font-size: 1.2em;
        margin-left: 35%;
    }
}
</style>
