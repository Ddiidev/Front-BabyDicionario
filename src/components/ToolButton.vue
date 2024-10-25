<script setup lang="ts">
import { defineProps } from 'vue';

const props = withDefaults(
	defineProps<{
		round?: boolean;
		circle?: boolean;
		small?: boolean;
		save?: boolean;
		delete?: boolean; // Adiciona a propriedade delete
		warn?: boolean; // Adiciona a propriedade warn
	}>(),
	{
		round: true,
		circle: false,
		small: false,
		save: false,
		delete: false, // Valor padrão para delete
		warn: false, // Valor padrão para warn
	},
);

let radius = '13px',
	style = '';

if (props.circle) radius = '50%';

style = `border-radius: ${radius};`;

if (props.circle) {
	if (props.small) style += 'padding: 0px;';
	else style += 'padding: 25px;';
}
</script>

<template>
	<button class="tool-button" :style="style" :class="{ 'save-button': props.save, 'delete-button': props.delete, 'warn-button': props.warn }">
		<slot></slot>
	</button>
</template>

<style scoped>
button {
	position: relative;
	z-index: 1;
	cursor: pointer;
	font-family: Dosis;
	font-size: larger;
	font-weight: 700;
	margin: 5px;
	padding: 3px 10px;
	border: 2px solid #feb1a6;
	border-radius: 13px;
	border-bottom: 6px solid #feb1a6;
	background-color: #fde2d6;
	color: #8d5a53;
}

button.save-button {
	border: 2px solid #b6dabe;
	border-radius: 13px;
	border-bottom: 6px solid #b6dabe;
	background-color: #d4edda;
	color: #155724;
}

button.save-button:hover {
	background-color: #c5eece;
}

button.save-button:active {
	border: 2px solid #adc9b3;
	border-top: 3px solid #adc9b3;
	border-left: 3px solid #adc9b3;
	background-color: #b3dbbc;
}

button.delete-button {
	border: 2px solid #a75d5d;
	border-radius: 13px;
	border-bottom: 6px solid #a75d5d;
	background-color: #fa7676;
	color: #a83232;
}

button.delete-button:hover {
	background-color: #f86565;
}

button.delete-button:active {
	border: 2px solid #a86464; /* Vermelho pastel mais suave */
	border-radius: 13px;
	background-color: #f87d7d;
	color: #a73c3c; /* Cor do texto em tom pastel */
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

button.warn-button {
	border: 2px solid #e6e600; /* Amarelo mais escuro */
	border-radius: 13px;
	border-bottom: 6px solid #e6e600; /* Amarelo mais escuro */
	background-color: #fffacd; /* Amarelo pastel claro */
	color: #7f7f00; /* Cor do texto em tom pastel */
}

button.warn-button:hover {
	background-color: #ffeb8a; /* Amarelo pastel mais claro */
}

button.warn-button:active {
	border: 2px solid #c6c600; /* Amarelo ainda mais escuro */
	border-radius: 13px;
	background-color: #ffe600; /* Amarelo pastel mais intenso */
	color: #4d4d00; /* Cor do texto em tom pastel mais escuro */
}
</style>
