<script setup lang="ts">
import NavBar from '@/components/NavBar.vue';
import { userLogged } from '@/auth/auth';
import router from '@/router';

if (!userLogged()) {
	router.push({
		path: '/',
	});
}
</script>

<template>
	<NavBar></NavBar>
</template>
