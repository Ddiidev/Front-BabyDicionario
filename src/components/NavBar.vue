<script setup lang="ts">
import UserLogged from '@/views/userLogged/UserLogged.vue';
import ToolButton from '@/components/ToolButton.vue';
import Login from '@/views/login/Login.vue';
import Toast from './Toast.vue';

Emitter.listen('msg-login', (e: { msg: string, title: string, time?: number }) => {
	toastData.addMessage({
		message: e.msg,
		title: e.title,
		show: true
	}, e.time);
})
</script>

<template>
	<header style="position: fixed; height: 100px; border-bottom: 2px solid #b19d95;"
		class="pico-background-pumpkin-100 pico-color-pumpkin-100 nav">
		<div class="container">
			<nav style="margin-top: -10px; margin-right: 15px;">
				<ul>
					<router-link to="/">
						<li>
							<img alt="logo" style="margin-left: 50%;" src="@/assets/logo.png" width="48" height="48" />
						</li>
						<li style="margin-left: 30px;">
							<h4>DBaby</h4>
						</li>
					</router-link>
				</ul>
				<ul v-if="!userLogged">
					<details v-if="!menuDefault" class="dropdown">
						<summary ref="menuSummary"
							style="--pico-icon-chevron: ''; margin-top: 25%; padding-left: 35%; font-weight: 900;">
							...
						</summary>
						<ul dir="rtl">
							<li>
								<ToolButton @click="switchVisibleLogin" ref="btEntrar">
									<img src="@/assets/login.svg"
										style="margin-bottom: 5%; margin-right: 2px; width: 24px;" alt="Logo" />
									Entrar
								</ToolButton>
							</li>
							<li>
								<router-link to="/createUser">
									<ToolButton>Criar conta</ToolButton>
								</router-link>
							</li>
						</ul>
					</details>

					<nav v-else>
						<li>
							<ToolButton @click="switchVisibleLogin" ref="btEntrar">
								<img src="@/assets/login.svg" style="margin-bottom: 5%; margin-right: 2px; width: 24px;"
									alt="Logo" />
								Entrar
							</ToolButton>
						</li>
						<li>
							<router-link to="/createUser">
								<ToolButton @click="createUserVisibleLoginFalse">Criar conta</ToolButton>
							</router-link>
						</li>
					</nav>
				</ul>
				<ul v-else>
					<nav>
						<li>
							<div @click="switchVisibleBtUserLogged" ref="btUserLogged" style="position: relative;">
								<img class="circular-image default-border" src="@/assets/imagens-temp/dante.jpg"
									style="margin-bottom: 5%; margin-right: 2px;" />
								<div class="online"></div>
							</div>
						</li>
					</nav>
				</ul>
			</nav>
		</div>

	</header>

	<Login v-if="!userLogged" style="z-index: 99999;" tagRef="btEntrar"></Login>
	<UserLogged v-else style="z-index: 99999;" tagRef="btUserLogged"></UserLogged>
	<Toast style="z-index: 5000; position: fixed;" v-for="(toast) in toastData.toasts.value"
		@closeButton="toastData.removeMessage(toast)" :title="toast.title" :message="toast.message" :show="toast.show">
	</Toast>
</template>

<script lang="ts">
import { getResolution } from '@/views/utils';
import { Emitter } from '@/utils/emitter';
import { defineComponent, type ComponentPublicInstance, ref } from 'vue';
import { HandleDataToast } from './HandleToast';
import * as auth from '@/auth/auth';

function getComponent(obj: any, nameObj: any) {
	let result;
	try {
		result = (obj[nameObj] as ComponentPublicInstance).$el;
	} catch { }
	try {
		if (result == undefined)
			result = (obj[nameObj] as ComponentPublicInstance);
	} catch { }
	return result;
}

export let toastData = new HandleDataToast();
export default defineComponent({
	components: {
		ToolButton, Login, UserLogged
	},
	async mounted() {
		await this.$nextTick()

		this.verifyUserLogged();
		window.addEventListener("resize", this.EventHandleResize);
		this.menuDefault = getResolution().width > 530;
		this.$forceUpdate();

		setTimeout(() => {
			try {
				const btUserLogged = getComponent(this.$refs, 'btUserLogged')
				const btEntrar = getComponent(this.$refs, 'btEntrar')
				if (btUserLogged !== null)
					Emitter.emitt('userLogged', btUserLogged);
				if (btEntrar !== null)
					Emitter.emitt('login', btEntrar);
			} catch { }
		}, 300);
	},
	data() {
		return {
			menuDefault: true,
			userLogged: ref(false)
		}
	},
	unmounted() {
		window.removeEventListener("resize", this.EventHandleResize);
	},
	methods: {
		EventHandleResize(e: Event) {
			const btUserLogged = getComponent(this.$refs, 'btUserLogged')
			const btEntrar = getComponent(this.$refs, 'btEntrar')
			if (btUserLogged !== null)
				Emitter.emitt('userLogged', btUserLogged);
			if (btEntrar !== null)
				Emitter.emitt('login', btEntrar);
			this.menuDefault = getResolution().width > 530;
			this.$forceUpdate();
		},
		createUserVisibleLoginFalse() {
			Emitter.emitt('switchVisibleLogin', false);
		},
		switchVisibleLogin() {
			Emitter.emitt('switchVisibleLogin', null);
		},
		switchVisibleBtUserLogged() {
			Emitter.emitt('switchVisibleUserLogged', null);
		},
		verifyUserLogged() {
			this.userLogged = auth.userLogged();
		}
	},
});
</script>

<style scoped>
.nav {
	position: fixed;
	top: 0;
	padding: 14px 16px;
	width: 100%;
}

.online {
	position: absolute;
	bottom: 1px;
	left: 5px;
	width: 7px;
	height: 7px;
	background-color: green;
	border-radius: 50%;
	box-shadow: 0px 0px 4px 3px rgba(0, 128, 0, 0.5);
}

.circular-image {
	margin: 0px;
	width: 50px;
	padding: 0px;
	height: 50px;
	position: relative;
	border-radius: 40%;
	cursor: pointer;
	transition: background-color 0.1s ease;
}

.circular-image:hover {
	/* border: 3px solid #feb1a6; */
	box-shadow: 0 0 30px #feb1a6;
}
</style>