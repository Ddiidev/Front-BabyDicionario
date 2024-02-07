<script setup lang="ts">
const props = withDefaults(defineProps<{
    fontSize?: string
    secondaryColor?: boolean
}>(), {
    fontSize: '22',
    secondaryColor: false
})

const colors = {
    secondary: '#8d5a53'
}
</script>

<template>
    <div class="label" v-bind="{
        style: {
            fontSize: `${props.fontSize}px`,
            color: props.secondaryColor ? colors.secondary : '#000'
        }
    }">
        <slot></slot>
    </div>
</template>

<style>
.label {
    font-family: Dosis;
    font-size: larger;
    font-weight: 500;
    margin: 3px;
    padding: 1px;
}
</style>