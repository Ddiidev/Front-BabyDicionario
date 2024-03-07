<script setup lang="ts">
import { defineComponent } from 'vue';

const props = withDefaults(defineProps<{
    round?: boolean
    circle?: boolean
    small?: boolean
}>(), {
    round: true,
    circle: false,
    small: false
});

let
    radius = '13px',
    style = '';

if (props.circle)
    radius = '50%';

style = `border-radius: ${radius};`;

if (props.circle) {
    if (props.small)
        style += 'padding: 0px;'
    else
        style += 'padding: 25px;'
}
</script>
<script lang="ts">
export default defineComponent({
  name: 'ToolButton',
  // Outras opções do componente aqui
});
</script>

<template>
    <button class="tool-button" :style="style">
        <slot></slot>
    </button>
</template>


<style scoped>
button {
    cursor: pointer;
    font-family: Dosis;
    font-size: larger;
    font-weight: 700;
    color: #8d5a53;
    margin: 5px;
    padding: 3px 10px 3px 10px;
    border-radius: 13px;
    border: 2px solid #feb1a6;
    border-bottom: 6px solid #feb1a6;
    border-right: 6px solid #feb1a6;
    background-color: #fde2d6;
}

button:active {
    border: 2px solid #feb1a6;
    border-top: 3px solid #ca867d;
    border-left: 3px solid #ca867d;
    background-color: #fde2d6;
}

button:hover {
    background-color: #fae8e1;
}
</style>