<script setup lang="ts">
import ToolButton from '@/components/ToolButton.vue';
import Login from '@/views/login/Login.vue';
import Toast from './Toast.vue';
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
				<ul>
					<details v-if="!menuDefault" class="dropdown">
						<summary ref="menuSummary"
							style="--pico-icon-chevron: ''; margin-top: 25%; padding-left: 35%; font-weight: 900;">
							...
						</summary>
						<ul dir="rtl">
							<li>
								<ToolButton @click="switchVisible" ref="btEntrar">
									<img src="@/assets/login.svg" style="margin-bottom: 5%; margin-right: 2px; width: 24px;"
										alt="Logo" />
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

					<nav v-if="menuDefault">
						<li>
							<ToolButton @click="switchVisible" ref="btEntrar">
								<img src="@/assets/login.svg" style="margin-bottom: 5%; margin-right: 2px; width: 24px;"
									alt="Logo" />
								Entrar
							</ToolButton>
						</li>
						<li>
							<router-link to="/createUser">
								<ToolButton @click="switchVisible">Criar conta</ToolButton>
							</router-link>
						</li>
					</nav>
				</ul>
			</nav>
		</div>

	</header>

	<Login style="z-index: 99999;" tagRef="btEntrar"></Login>
	<Toast style="z-index: 5000; position: fixed;" v-for="(toast) in toastData.toasts.value"
		@closeButton="toastData.removeMessage(toast)" :title="toast.title" :message="toast.message" :show="toast.show">
	</Toast>
</template>

<script lang="ts">
import { getResolution } from '@/views/utils';
import { Emitter } from '@/utils/emitter';
import { defineComponent, type ComponentPublicInstance } from 'vue';
import { HandleDataToast } from './HandleToast';

function getComponent(obj: any, nameObj: any) {
	let result;
	result = (obj[nameObj] as ComponentPublicInstance).$el;
	if (result == undefined)
		result = (obj[nameObj] as ComponentPublicInstance);
	return result;
}

export let toastData = new HandleDataToast();
export default defineComponent({
	components: {
		ToolButton, Login
	},
	async mounted() {
		await this.$nextTick()

		window.addEventListener("resize", this.EventHandleResize);
		this.menuDefault = getResolution().width > 530;
		this.$forceUpdate();

		Emitter.listen('msg-err-login', (e: string) => {
			toastData.addMessage({
				message: e,
				title: 'Atenção',
				show: true
			});
		})

		setTimeout(() => {
			try {
				Emitter.emitt('login', getComponent(this.$refs, 'btEntrar'));
			} catch { }
		}, 300);
	},
	data() {
		return {
			menuDefault: true
		}
	},
	unmounted() {
		window.removeEventListener("resize", this.EventHandleResize);
	},
	methods: {
		EventHandleResize(e: Event) {
			try {
				Emitter.emitt('login', getComponent(this.$refs, 'btEntrar'));
			} catch { }
			this.menuDefault = getResolution().width > 530;
			this.$forceUpdate();
		},
		switchVisible() {
			Emitter.emitt('switchVisible', null);
		},
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
</style>