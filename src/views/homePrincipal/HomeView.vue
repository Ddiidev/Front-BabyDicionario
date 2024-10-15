<script setup lang="ts">
import VerticalLine from '@/components/VerticalLine.vue';
import Settings from '@/components/icons/Settings.vue';
import NavBar from '@/components/NavBar.vue';
import * as HomeImpl from './HomeView';
</script>

<template>
	<NavBar></NavBar>
	<main class="main container-fluid">
		<div class="parent-panels">
			<div class="left-panel-children">
				<div class="container" style="
						height: max-content;
						width: max-content;
						padding-top: 50px;
					">
					<!-- Mother -->
					<article class="card-profile" v-if="HomeImpl.containMother()">
						<header>
							<div style="display: flex; justify-content: end">
								<Settings @click="HomeImpl.openSettingsMother()" class="btn"></Settings>
							</div>
							<div style="display: flex; justify-content: center">
								<div class="grid">
									<img class="circular-image default-border" :src="HomeImpl.data.profile.mother!
										.currentImage
										" style="width: 8em; height: 8em" />
								</div>
							</div>
						</header>

						<body>
							<div style="text-align: center">
								<h3 class="card-profile-title">
									{{
										HomeImpl.data.profile.mother?.first_name
									}}
								</h3>
								<p>Mãe</p>
							</div>
						</body>
					</article>
					<article v-else class="card-profile">
						<header>
							<div style="display: flex; justify-content: end">
								<Settings @click="HomeImpl.openSettingsMother(true)" class="btn"></Settings>
							</div>
							<div style="display: flex; justify-content: center">
								<div class="grid">
									<img class="circular-image default-border" opacity :src="HomeImpl.data.profile.mother!
										.currentImage
										" style="width: 8em; height: 8em" />
								</div>
							</div>
						</header>

						<body>
							<div style="text-align: center">
								<h3 @click="HomeImpl.openSettingsMother(true)" class="btn-text card-profile-title">
									Adicionar Mãe
								</h3>
							</div>
						</body>
					</article>
					<!-- /Mother -->

					<!-- Father -->
					<article class="card-profile" v-if="HomeImpl.containFater()">
						<header>
							<div style="display: flex; justify-content: end">
								<Settings @click="HomeImpl.openSettingsFather()" class="btn"></Settings>
							</div>

							<div style="display: flex; justify-content: center">
								<div class="grid">
									<img class="circular-image default-border" :src="HomeImpl.data.profile.father!
										.currentImage
										" style="width: 8em; height: 8em" />
								</div>
							</div>
						</header>

						<body>
							<div style="text-align: center">
								<h3 class="card-profile-title">
									{{
										HomeImpl.data.profile.father?.first_name
									}}
								</h3>
								<p>Pai</p>
							</div>
						</body>
					</article>
					<article v-else class="card-profile">
						<header>
							<div style="display: flex; justify-content: end">
								<Settings @click="HomeImpl.openSettingsFather(true)" class="btn"></Settings>
							</div>
							<div style="display: flex; justify-content: center">
								<div class="grid">
									<img class="circular-image default-border" opacity :src="HomeImpl.data.profile.father!
										.currentImage
										" style="width: 8em; height: 8em" />
								</div>
							</div>
						</header>

						<body>
							<div style="text-align: center">
								<h3 @click="HomeImpl.openSettingsFather(true)" class="btn-text card-profile-title">
									Adicionar Pai
								</h3>
							</div>
						</body>
					</article>
					<!-- /Father -->
				</div>
			</div>
			<div class="left-panel-children" style="border-left: 2px solid var(--pico-primary)"></div>

			<div class="right-panel-children" style="width: max-content">
				<article class="container-fluid">
					<h2 style="text-align: center">Filhos</h2>
				</article>
				<div class="container grid" style="display: grid; place-items: center">
					<article v-for="profile in HomeImpl.data.profile.babys" class="card-profile"
						style="margin-bottom: 35px" :key="profile.uuid">
						<header>
							<div style="display: flex; justify-content: space-between; align-items: center;">
								<h6 data-tooltip="Número de palavras registradas" style="margin: 3px;">
									{{ profile.wordsCount ?? 0 }}
									<img style="width: 25px; height: 22px; margin-top: -5px"
										src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAB/0lEQVR4nO1ZS07DMBA1lBvAGlj0GlCgBwBmZFE76UXYtKtuMgYkvmfooVDbDSwpqoQQSCCHfoygEbHdpBF50kjd9HmePZ94zFiJEiVKLDVIiA0ScKskDkjCu5L4MbY3Ethx58eO5prwjtcY6DUjCVtO5ErCPkl8NJz+bgJGrgKUgNF8fnymAOv2O5/k/IJOQP0weLhsHq1bEMdh83WsAvr6NFqt1ipbMLqcV84C3FECe0ZYXacm0nE4IYgC3GMZgwKsG6HUS09gJKzeFZYxupxXzMROTWDGoY0DKuRVJeA+tpBXrTikgw+uAkjg6SyH8DQHAfA6rgKvVosLbBsx3LbikA4+xOVNwIttqfQhgBx9cIIPAbmiMAJozjEnCcg1NP6aaEkCXAuEV8wrdckC3Eq016bkU4Dy0PxSNyWfAshD8/sVVrvp+T//WwAVPoTC9ElsJTpcUBInwcaZzMtoEmya0lI1MrL4LFiqT4l5+GBsRTUw1KZ/s6IhktCcDgUkNDN3gIp+oVFFv1Kq4l/qsdhjFcp5sNWq1dacBltf89BpFdllGSMKcM91tHg3i2Ho61llFifR5bwSO28Md5XEm9RE5yeH2yRgaMZhHuN1EjC8aPJNK/KocXyg5/O5PXBIeLJ+4JhAPy4oAVdxGGX1xCSwp98ErHe+RIkSJVhW+ASdBlAft0XIiAAAAABJRU5ErkJggg==">
								</h6>

								<Settings @click="
									HomeImpl.openSettingsProfile(profile)
									" class="btn">
								</Settings>
							</div>
							<div style="display: flex; justify-content: center">
								<div class="grid">
									<img class="circular-image default-border" :src="profile.currentImage"
										style="width: 8em; height: 8em" />
								</div>
							</div>
						</header>

						<body>
							<div style="text-align: center">
								<h3 class="card-profile-title">
									{{ profile.first_name }}
								</h3>
								<p v-if="profile.age >= 1">{{ profile.age }} ano(s)</p>
								<p v-else>RN {{ Math.abs(profile.age * 100) }} mês(es)</p>
							</div>
						</body>

						<ToolButton style="width: 100%;" @click="HomeImpl.viewWords(profile)">
							Ver palavras
						</ToolButton>
					</article>

					<!-- Card fixo para adicionar novo bebê -->
					<article class="card-profile" style="margin-bottom: 35px">
						<header>
							<div style="display: flex; justify-content: end">
								<Plus @click="HomeImpl.addNewBaby()" class="btn"></Plus>
							</div>
							<div style="display: flex; justify-content: center">
								<div class="grid">
									<img class="circular-image default-border" opacity
										src="@/assets/imagens-temp/add-photo.jpeg" style="width: 8em; height: 8em" />
								</div>
							</div>
						</header>

						<body>
							<div style="text-align: center">
								<!-- Espaço para manter o mesmo tamanho que os cards dinâmicos a esqueda -->
								<div style="padding-top: 25%" />

								<h3 @click="HomeImpl.addNewBaby()" class="btn-text card-profile-title">
									Adicionar bebê
								</h3>

								<!-- Espaço para manter o mesmo tamanho que os cards dinâmicos a esqueda -->
								<div style="padding-top: 25%" />
							</div>
						</body>
					</article>
				</div>
			</div>
		</div>

		<dialog :open="HomeImpl.data.viewerModalNewUser">
			<article>
				<h2>Para adicionar responsáveis é necessário se cadastrar</h2>
				<p>
					Caso queira, pode adicionar apenas os bebês por enquanto...
					depois caso sinta-se confortável pode se cadastrar na plataforma 😁
				</p>
				<footer>
					<div style="display: flex; align-items: center; justify-content: end;">
						<ToolButton @click="HomeImpl.data.viewerModalNewUser = false">Cancelar</ToolButton>
						<ToolButton @click="HomeImpl.addNewBaby()">Novo bebê</ToolButton>

						<VerticalLine />
						<ToolButton save @click="HomeImpl.modalRegisterNewUser()">Cadastrar-se</ToolButton>
					</div>
				</footer>
			</article>
		</dialog>
	</main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { dataCurrentUserLogged } from '@/service/user/user';
import Plus from '@/components/icons/plus.vue';
import ToolButton from '@/components/ToolButton.vue';

export default defineComponent({
	mounted() {
		dataCurrentUserLogged();
		try {
			this.$nextTick(() => {
				HomeImpl.mounted(this);
			});
		} catch (error) {
			console.error(error);
		}
	},
	profileEditImpl() {
		// window.removeEventListener("resize", this.EventHandleResize);
	},
	methods: {
		// EventHandleResize(e: Event) {},
	},
});
</script>

<style scoped>
.circular-image {
	align-self: center;
	object-fit: cover;
	border-radius: 40%;
}

.circular-image[opacity] {
	opacity: 0.7;
}

main .container-fluid {
	padding-top: 3px;
	padding-bottom: 3px;
}

.parent-panels {
	grid-template-columns: repeat(4, 1fr);
	grid-template-rows: repeat(3, 0.36fr);
	overflow-x: hidden;
	display: grid;
	gap: 30px;
}

.left-panel-children .container {
	place-items: center;
	overflow-x: hidden;
	margin-right: 5px;
	margin-top: -20px;
	height: 85%;
	display: grid;
	width: 25vw;
}

.left-panel-children {
	grid-row: span 3 / span 2;
}

.right-panel-children {
	grid-row: span 2 / span 2;
	grid-column-start: 3;
	padding-top: 25px;
	/* padding-right: 20%; */
}

.card-profile {
	height: fit-content;
	width: 14em;
}

.parent-panels {
	gap: var(20px);
}

/* Media query para telas largas (800px e maior) */
@media (min-width: 800px) {
	.left-panel-children .container {
		padding-left: 10px;
		padding-right: 15px;
	}

	.card-profile {
		width: 12em;
	}
}

@media (max-width: 900px) and (min-width: 500px) {
	.parent-panels {
		gap: var(20px);
	}
}

@media (max-width: 800px) {
	.left-panel-children .container {
		width: 35vw;
		padding-left: 5px;
		padding-right: 5px;
	}

	.card-profile {
		width: 12em;
	}
}

@media (max-width: 700px) {
	.left-panel-children .container {
		width: 40vw;
		padding-left: 5px;
		padding-right: 5px;
	}

	.card-profile {
		width: 12em;
	}
}

@media (max-width: 600px) {
	.card-profile {
		width: 11em;
	}
}

@media (max-width: 500px) {
	.card-profile {
		width: 11em;
		font-size: smaller;
	}
}

@media (max-width: 400px) {
	.card-profile {
		width: 10em;
		padding-bottom: 0;
		font-size: smaller;
	}

	.card-profile-title {
		font-size: large;
	}
}
</style>