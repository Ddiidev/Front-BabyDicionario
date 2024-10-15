<template>
	<button class="plus-button" @click="handleClick">
		<div class="icon-container">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="20"
				height="20"
				viewBox="0 0 12 12"
			>
				<path
					stroke="currentColor"
					stroke-linecap="round"
					stroke-width="2"
					d="M6 2v8m4-4H2"
				/>
			</svg>
		</div>
	</button>
</template>

<script setup lang="ts">
const emit = defineEmits(['click']);

function handleClick() {
	emit('click');
}
</script>

<style scoped>
.plus-button {
	background-color: var(--pico-primary);
	border: 2px dashed var(--pico-border-color);
	border-radius: var(--pico-border-radius);
	padding: 10px;
	width: 30%;
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
	transition: background-color 0.3s;
}

.plus-button:hover {
	background-color: var(--pico-primary-hover);
}

.icon-container {
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: var(--pico-primary-background);
	border-radius: 50%;
	width: 40px;
	height: 40px;
}
</style>
