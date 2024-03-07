<script setup lang="ts">
 const emit = defineEmits(['closeButton']);

function closeButton() {
  emit('closeButton');
}

interface IToastProps {
    title: string
    message: string
    show: boolean
}
const props = withDefaults(defineProps<IToastProps>(), {
    title: 'teste',
    message: 'concluído',
    show: false
});
</script>

<template>
    <article :class="'toast '+ ( props.show ? 'show' : '' )">
        <header class="min-container">
            <nav>
                <ul>
                    <li><strong>{{ props.title }}</strong></li>
                </ul>
                <ul>
                    <li>
                        <button @click="closeButton" class="outline primary min-button">
                            close <small>✕</small>
                        </button>
                    </li>
                </ul>
            </nav>
        </header>
        <p class="text">{{ props.message }}</p>
    </article>
</template>
  
<style scoped>
.text {
    white-space: pre-line;
}

.toast {
    position: fixed;
    bottom: 5%;
    right: -100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 25%;
    z-index: 1003;
    transition: right 0.8s ease-in-out;
    backdrop-filter: blur(3px);
    border: 1px solid #feb1a6;
    box-shadow: 0 0 5px #feb1a6;
}

.toast.show {
  right: 15px;
}

@media (max-width:  600px) {
    .toast {
        width:  60%;
        bottom:  15%;
        right:  15%;
    }
}

@media (max-width:  850px) {
    .toast {
        width:  45%;
        bottom:  5%;
        right:  5%;
    }
}


.min-container {
    padding-top: 0px;
    padding-bottom: 0px;
    padding-left: 15px;
}

.min-button {
    padding-top: 0px;
    padding-bottom: 0px;
    padding-right: 10px;
}
</style>
  