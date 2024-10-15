<template>
    <RegisterWord @close="handleCloseEditing" @save="handleSaveEditing" v-if="data.isEditing" :word="data.word"
        :userLogged="true" :class="{ 'slide-in': !data.isLoading, 'slide-out': data.isLoading }">
    </RegisterWord>
    <div v-if="!data.isEditing" class="word-view slide-in">
        <div style="float: right; align-self: flex-end; margin-bottom: 20px;">

            <!-- Sincronizar palavra -->
            <ToolButton data-tooltip="Palavra não sincronizada. Click para sincronizar!" @click="handleSync" v-if="data.word.isWordNoSync() && userLogged()" warn style="width: auto;">
                <img style="width: 26px; padding-bottom: 5px;"
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAACNElEQVR4nO2Z30tUQRTHP95aDVqi/gIFNZcIorL+kh6E/BfUFyXyXQqCNfv5pG+RGihBkL/Ff6KQ/oCe09y01iYGjnAYdt1ddmbu3bgfmIf7Y84533vPnLkzF3JycnIUg8A0sAHsA0fAGtCj7rlMBrkL7AKmTrPXLe/keAu4TwYoAK+B0zqB2/Of5Q10Ab/Vtb/ArNhIhWvAthPwL2AReAAMAZecPo8dEUZsXIgdfKFGytjAe5vo2w+sOn1vEplXynkVmGixv02nceA78Cn2G7gn+XsmYIwOY0sFv0SHUVLBnwB9nuwmwEugAszJcRAeKQHvPdlMgHlnUM+HEqHTZyRQ8CakiG/KwUCbtmwlenvO7G3bgm8Rh8p4MXDwJoQIbdh3zpsGx0lWBDyvE5xRrZbI2awIqNR5ssax7Yqwn+aZEPAUOJYnmjSwnch99v4nbfg814kvTEDbUZyYXMD/9AZmZNJ60cJAq8oAzYSAHymUOuNTQDmFycb4FJDGdG98j6+YH1xXlC2bvvgU8aZB8D4+tErK3lc8E2PR8VDZXCcAoZd9y8ruJIFIZMHte+E9IBsEvlZ60VkJnT4hmXI2gu/EdN4N7AEHsrVoK1Yr2FyvKgF28ozKsDOoPzaZv/1O2hj5IXKRyFiHO04gf2S7cRS4Ln9jilLnban8UGN7fQO4Gjt4LeKZs9nbbLM5X07jydfillPLG7VN4DYZ5IZUlk35yfdT1hVfpEROdmKdz8nJIRz/APLLWmtt+SynAAAAAElFTkSuQmCC">
            </ToolButton>
            <ToolButton save style="width: auto;" @click="handleEdit" v-if="!(data.word.isWordNoSync() && userLogged())">
                <img style="width: 26px; padding-bottom: 5px;"
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAACHElEQVR4nO2ZPUgcQRSAPw/8ATkJRDQI1lokMV0srRUhIhHURggYQqIhBGIVECub2IqgRi5oE7CwsdRCK0EQo2CjNkISUliIheG88GAOHsPerueF3XewH7zmZm753tybvz1ISUlJqZBHwCzwA7h2sQ98Bh5inCHgCiiUiN9AL0Z5C9yGyBfjBujDGO88+SMnWQ9k3S9zqtp/Ag8wwhdPfhdoCujXCpyrfu8xIl/w5LMh/V+pvpsYKxuJHJAJ+U6n6nuCMfliLIUk8VT1O8aIvJTNopfEcokkPqo+6xbkd1zN1wDzEUm0Ab9U+1jc8uMRq01YEi3Aofr8DGiwJB+WxJonLxtZj4WyKUXGTeSgCf7XbWqJjnyYvE5i1ZPPA6NUgTwBNS8xTZXK5+OWHy6z5jV1nnzsNY9bNe4jL3QkLS88Bw6A72XKC7KMLrjj9ABVQtYlK0lL8rHzApgD2u8pv+ttWrEyoSbsRoXy8pwREpKX+FqhvDwvNl7f8WwTRCOw7clPEiP9FWxSiY+88Kea5R9755NvEXdYU/LCVJl3WBM1r9Eid7nDmpJvcreh4glxJSIJU/LCoJLZi7jDmpPHe/UxE3L9y1mZsBoZ7Qsl1a3aMt4RumBNXuhSUrIP1LokZlw55S3LC2+U2KW3mQWFvLd8iSGmIoRlddoCPgFPMEhrwKhfuIk9WMZBLlGagQ/uj4VnbmKnpKSk8F/5B4rrSX4MxdZvAAAAAElFTkSuQmCC">
            </ToolButton>
            <ToolButton delete style="width: auto;" @click="handleDelete">
                <img style="width: 26px; padding-bottom: 5px;"
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAACtElEQVR4nO2ZPWgUQRTHf0nulBBBQ2KhsTGWVn5E0we0CCm00DRiQBAFKwMGPdRGSUo1SgQF0wSUGBC0sBELCxELUVOFBPHbqBEEMcYmMvACj+E+Zm/HnV3YH0xzt2/nP8fMe/95Bzk5OT5oBLqBM8AUMA38AP4Cv4GPwGvgNnAS2E5K2AQMAx+A5YjjQEjhbcAYsFSH8JVxLpT4fuB7GUGfgJvAIdkiZpFFoBnYCGwDjgI3gGtAa9LCC/Kr28IfA71AEymmGbhvCZ8B9pABCmXEjwMtZIQxS/zZBObska15yseBTVq84bmas486abOyjdk2SXFFzWtqzNq4W2cm4T3fKml5Zf7ReiqsLlJ7SZ59an5jR9qjBA9beT4Uz5SOkmtQk+VtTJEKRb91Fhpcgrote2DqQCiKwFelZ6tLUEkFGG8TmjtKzwmXgCkVYIxZaI4pPZMuAdMqIA0Xj91KjznUNVlQAaaYVWILMAgMxRyDQGeVeTYrPW9cFqDz/6oqz83GuMzYY7bKPC3quV9ZXMBq9dwflwVo/1Ot+nVKxhqJOUo1ttB6pedb1EO8k/B0KT2vXALuqoDDhGcgaho9rQJuEZ5xpcdkrUh593NgK1EA5qNuaWPm3qfEzPUpHW+lA+jERRUY+14agydKx4WoN6KHwCOggzD0KvGL0hzLDGuAObWAy2SMCSV+PkQbMg7nLZux39eLd0mRO+56tfMg/pLPlz9VL35Qw2rXs+cnLPH3fDeMr1sTvJPWR4OHbDNXRrxpKHu/YJdrr7+QfWq+j1JhTZHSeV5nnP/aqj9Y4Q+On3JGjgA7xAYX5U7RLjZgQLyNtgfLMr74PLC1MOKuyp94cS8zi/KrryMAHdLF097JdRhvY+zBBlJAo7jYIWnLvJTmwJKMBflsUp7pimLMcnJyqMg/zeZnF4HC9AcAAAAASUVORK5CYII=">
            </ToolButton>
        </div>

        <hr style="margin-bottom: 25px; margin-top: -10px; width: 100%;" />

        <form class="container">
            <div class="grid">
                <label for="word">
                    Palavra
                    <input type="text" id="word" v-model="data.word.word" disabled placeholder="Palavra" />
                </label>
                <label for="translation">
                    Tradução
                    <input type="text" id="translation" v-model="data.word.translation" disabled
                        placeholder="Tradução" />
                </label>
            </div>

            <div class="grid">
                <label for="pronunciation">
                    Pronúncia
                    <input type="text" id="pronunciation" v-model="data.word.pronunciation" disabled
                        placeholder="Pronúncia" />
                </label>
            </div>


            <div style="display: flex; flex-direction: row; justify-content: space-between;">
                <div :data-tooltip="!data.word.audioPath ? 'Sem audio' : ''">
                    <ToolButton :disabled="!data.word.audioPath" data-tooltip="Ouça a pronúncia" @click="togglePlay">
                        <img v-if="!data.isPlaying" width="26" height="26" src="@/assets/play.png" alt="play" />
                        <img v-else width="26" height="26" src="@/assets/pause.png" alt="circled-pause" />
                        <small v-if="!data.isPlaying">
                            Reproduzir
                            <span class="duration-time">{{ data.audioDuration }}</span>
                        </small>
                        <small v-else>
                            Parar
                            <span class="duration-time">{{ data.audioDuration }}</span>
                        </small>
                    </ToolButton>

                    <audio ref="audio" :src="word.audioPath" @ended="data.isPlaying = false"></audio>
                </div>

                <span style="float: right; align-self: flex-end;">
                    {{ new Date( unixDateToString(data.word.dateSpeaker as any) ).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                        timeZone: 'UTC'
                    }) }}
                </span>
            </div>
        </form>
    </div>

    <!-- Modal de confirmação -->
    <dialog :open="showDeleteConfirmation">
        <article>
            <hgroup>
                <h2>Você tem certeza que deseja remover a palavra: {{ data.word.word }} ?</h2>
                <br />
                <p>Esta ação não pode ser desfeita!</p>
            </hgroup>

            <footer>
                <ToolButton @click="cancelDelete">Não</ToolButton>
                <ToolButton @click="confirmDelete">Sim</ToolButton>
            </footer>
        </article>
    </dialog>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, reactive, ref } from 'vue';
import ToolButton from '@/components/ToolButton.vue';
import { Word } from '@/models/words';
import RegisterWord from './RegisterWord.vue';
import * as servWords from '@/service/word/word';
import { useRoute } from 'vue-router';
import { unixDateToString } from '@/views/utils';
import { userLogged } from '@/auth/auth';

const shortUUID = useRoute().params.shortUUID.toString();
const nameShared = useRoute().params.nameShared.toString();

const emit = defineEmits(['edit', 'delete', 'sync']);

const props = defineProps<{
    word: Word;
}>();

let audio = ref<HTMLAudioElement | null>(null);
let audioInterval: number | null = null;
const showDeleteConfirmation = ref(false);

const data = reactive({
    word: props.word,
    isEditing: false,
    isLoading: false,
    isPlaying: false,
    audioDuration: '00:00',
})


function handleEdit() {
    data.isLoading = false;
    setTimeout(() => {
        data.isEditing = true;
    }, 100);
    emit('edit', props.word);
}

async function handleSync() {
    const words = await servWords.saveWord(shortUUID, nameShared, data.word);
    
    const localWords = JSON.parse(localStorage.getItem('words') || '[]');
    const index = localWords.findIndex((w: Word) => w.uuid === data.word.uuid);
    localWords.splice(index, 1);
    localStorage.setItem('words', JSON.stringify(localWords));

    if (words !== undefined) {
        data.word = words[0];
        emit('sync', words[0], props.word.uuid);
    }
}

function handleDelete() {
    showDeleteConfirmation.value = true;
}

function confirmDelete() {
    const words = JSON.parse(localStorage.getItem('words') || '[]');
    const index = words.findIndex((w: Word) => w.uuid === props.word.uuid);
    words.splice(index, 1);
    localStorage.setItem('words', JSON.stringify(words));

    if (data.word.isWordNoSync()) {
        servWords.deleteWord(props.word.uuid);
    }

    emit('delete', props.word);
    showDeleteConfirmation.value = false;
}

function cancelDelete() {
    showDeleteConfirmation.value = false;
}

function handleCloseEditing() {
    data.isLoading = true;
    setTimeout(() => {
        data.isEditing = false;
    }, 100);
}

function handleSaveEditing(word: Word) {
    handleCloseEditing();

    const words = JSON.parse(localStorage.getItem('words') || '[]');
    const index = words.findIndex((w: Word) => w.uuid === word.uuid);
    words[index] = word;
    localStorage.setItem('words', JSON.stringify(words));
}

function togglePlay() {
    if (data.isPlaying) {
        audio.value?.pause();
        audio.value!.currentTime = 0;
        data.audioDuration = '00:00';

        // Limpa o intervalo quando a reprodução é parada
        if (audioInterval) {
            clearInterval(audioInterval);
            audioInterval = null; // Reseta a referência
        }
    } else {
        audio.value?.play();

        // Zera o contador ao iniciar a reprodução
        data.audioDuration = '00:00';

        audioInterval = window.setInterval(() => {
            const currentTime = audio.value?.currentTime || 0;

            if (currentTime > 0) {
                const mins = String(Math.floor(currentTime / 60)).padStart(2, '0');
                const secs = String(Math.floor(currentTime % 60)).padStart(2, '0');
                data.audioDuration = `${mins}:${secs}`;

                if ((audio.value?.currentTime ?? 0) >= (audio.value?.duration ?? 1)) {
                    data.isPlaying = false;

                    if (audioInterval) {
                        clearInterval(audioInterval);
                        audioInterval = null;
                    }
                }
            }
        }, 1000);
    }
    data.isPlaying = !data.isPlaying;
}
</script>

<style scoped>
.word-view {
    background-color: #fde2d6;
    border: 1px solid #feb1a6;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 0 5px #feb1a6;
    display: flex;
    width: 60%;
    max-width: 650px;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    transition: width 0.3s ease;
}

@media (max-width: 800px) {
    .word-view {
        width: 80%;
    }
}

@media (max-width: 600px) {
    .word-view {
        width: 100%;
    }
}

.form-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
}

.form-group {
    flex: 1;
    margin-right: 10px;
}

.form-group:last-child {
    margin-right: 0;
}

label {
    display: block;
    margin-bottom: 5px;
}

button-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    flex-direction: row;
    gap: 10px;
}

@keyframes slideIn {
    from {
        transform: translateX(-100%);
        /* Começa fora da tela à esquerda */
        opacity: 0;
        /* Começa invisível */
    }

    to {
        transform: translateX(0);
        /* Termina na posição original */
        opacity: 1;
        /* Termina visível */
    }
}

@keyframes slideOut {
    from {
        transform: translateX(0);
        /* Começa na posição original */
        opacity: 1;
        /* Começa visível */
    }

    to {
        transform: translateX(100%);
        /* Sai para a direita */
        opacity: 0;
        /* Termina invisível */
    }
}

.slide-in {
    animation: slideIn 0.5s forwards;
    /* Duração da animação */
}

.slide-out {
    animation: slideOut 0.5s forwards;
    /* Duração da animação */
}

.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-content {
    background: white;
    padding: 20px;
    border-radius: 5px;
    text-align: center;
}
</style>