<script setup lang="ts">
import NavBar from '@/components/NavBar.vue';
import * as WordsImpl from './WordsView';
import OnlyViewWord from '@/components/word/OnlyViewWord.vue';
import ToolButton from '@/components/ToolButton.vue';
import RegisterWord from '@/components/word/RegisterWord.vue';
import ToolButtonBack from '@/components/ToolButtonBack.vue';
import { useRoute } from 'vue-router';

WordsImpl.mounted(useRoute());
</script>

<template>
	<NavBar></NavBar>
	<main class="main container-fluid">
		<div class="container">
			<header class="header">
				<div class="custom-card" smoth-bottom>
					<div class="responsive-container">
						<ToolButtonBack class="tool-button-back" @click="WordsImpl.backPage"></ToolButtonBack>
						<div class="image-container">
							<img v-if="!WordsImpl.data.isLoadingPhoto" aria-busy="true"
								class="circular-image default-border" :src="WordsImpl.data.profile.currentImage"
								alt="Imagem do perfil" />
							<div class="loading-overlay default-border" v-if="WordsImpl.data.isLoadingPhoto">
								<div class="loader"></div>
							</div>
						</div>
						<h2>Minhas palavrinhas</h2>
						<ToolButton class="tool-button-add" style="width: fit-content; height: 55px;"
							@click="WordsImpl.newWord">
							<span>
								<img style="width: 25px; height: 25px; margin-top: -3px;"
									src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEBElEQVR4nO1ZS4xUVRC9oKijkSgB4yfqhoVLFxiXJG7EgDN5VX21q17LqIt2pxsnRGLmkSCM8G41tlGSWUjUGFTQ+NkYwkoDK3WhxJ0wxA+CuhWFGMfcnhmm+jfv0583iz7J3b2qW1W3/s+YEUYYYeiYre64Odq69XpTNA5ae6cj3OsYLzqC7+NKcEcSTa2MTziCq8LwmzC+8tpT9j4zbByanLhNGA87xn+EcX75ACfRCsNRTeMY/hWCtxzRxqEIL2EQOMILzYLjvBD8kOYF4jI+7BjnWukd4Z9CpWcGJvi8MWuEcE+b4AzfCJV2ZvHpY9Ze58Jg3BGcaOeHs32Pj/q2bTc6hvdbLHZBCLBX3o7gUWH8sZk3nDjw7PitfRE+iqK1juDTFr/9sB6G6/vmltaOOYK3m+/AL/ryEo7xYIt16l4pMwAIw8uO8T9lqDd7YhiHQanFP2fMgOEYoqyZrSO8iziCX1SW+XhQlu+QLN5VrnRxhvl2kxXC+Pqy8Phz1qCSit0sBOcap2I3Z6GNK5VbhPC8eonDmSusMFxZYhAzQvbsgrtVxtqdlT5mfEzF3dUD5fG7MwWTIv4q6+UNHrpmEO7JyeNL5cLTqYi8nwvjT0uEvncpTAEuWeVGv6aKwUNsH9QBNFutritKgdlqdZ2XYYmPly2RyBG8oFLYeyYn+qFAh+bveZMEx/iRKiRVU7QCVHpO8TmeSOAIv1X+v6VoBeIweEgZ9Ovki1UAuycn7k3I81PCuKvLOame/mTX7wimVqoTMcP9yhDnExVwDJevEVg71v07PNuhFc51HOPZlcZPVU/+SlRAF7DI2huKVkCsHVMudDlRgcZkdE3j7mPeogtNO4ZXOx7CU8pyp7p9JwTTK7mQr8C6FiQqIIRnVlMQ18q4RfE5kzWNPl20Ao6hqurS0eSLGV5SChxZBQocUf3QlEmzNVAXX8o71vWtlaDlmPQ1IXMz57cHRSngwmBcZao5P+ykIyTcrzNIcd0onFZy7E9PuNPeo7duNYLHhz3QOMYdyvf/roXBXZkYCMEbisG5rGuUXkbKehiu127sZckkfEMAazcIwx/KDT5I7YO9D/XH9UziZcnFzE9jzWUf9pkBQxhn9J1+tdMbQ+1Ki0oM4iXmjVnTukQTRumZsa8DjvHzAa8WNwjjJ03CE37ml8D9umCsXQmcy1sjNBzBA00Bu/DKx1bqhHO/RLs7NS47XWOcyD38M4oyit+LSt8s33VfSnipvaeH3x3DO/4nhS/5dWs3pbFiXA4e8X2+zzZxOdhuhgG/q/Srx/ZfTB1OijoQTU7elPcFe8LCsAH72n24beJ60axmRFG0dnF7sMsHoDB8t9BFwpU8lXiEEUYwqfE//L1IUPrK7NgAAAAASUVORK5CYII=">
								Novo
							</span>
						</ToolButton>
					</div>
				</div>
			</header>

			<body>
				<div class="container register-words">
					<RegisterWord class="register-words" v-if="WordsImpl.data.isNewWord"
						:userLogged="WordsImpl.data.userLogged.uuid != undefined"
						@close="WordsImpl.closeNewRegisterWord" @save="WordsImpl.saveNewRegisterWord"
						:class="{ 'zoom-in': !WordsImpl.data.isLoading, 'zoom-out': WordsImpl.data.isLoading }">
					</RegisterWord>

					<OnlyViewWord class="only-view-word" v-for="word in WordsImpl.data.words" :key="word.uuid"
						:word="word" :id="word.uuid" @delete="WordsImpl.handleDeleteWord" @sync="WordsImpl.handleSyncWord" />
				</div>
				<article class="custom-card" smoth-top style="
						overflow-y: auto;
						margin-top: -2%;
						padding-bottom: 40px;
						padding-top: 40px;
						overflow: visible;
					">

					<h4 data-tooltip="Número de palavras registradas"
						style="margin-left: 15px; align-self: flex-start; width: max-content;">
						{{ WordsImpl.data.words.length }}
						<img style="width: 25px; height: 22px; margin-top: -5px"
							src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAB/0lEQVR4nO1ZS07DMBA1lBvAGlj0GlCgBwBmZFE76UXYtKtuMgYkvmfooVDbDSwpqoQQSCCHfoygEbHdpBF50kjd9HmePZ94zFiJEiVKLDVIiA0ScKskDkjCu5L4MbY3Ethx58eO5prwjtcY6DUjCVtO5ErCPkl8NJz+bgJGrgKUgNF8fnymAOv2O5/k/IJOQP0weLhsHq1bEMdh83WsAvr6NFqt1ipbMLqcV84C3FECe0ZYXacm0nE4IYgC3GMZgwKsG6HUS09gJKzeFZYxupxXzMROTWDGoY0DKuRVJeA+tpBXrTikgw+uAkjg6SyH8DQHAfA6rgKvVosLbBsx3LbikA4+xOVNwIttqfQhgBx9cIIPAbmiMAJozjEnCcg1NP6aaEkCXAuEV8wrdckC3Eq016bkU4Dy0PxSNyWfAshD8/sVVrvp+T//WwAVPoTC9ElsJTpcUBInwcaZzMtoEmya0lI1MrL4LFiqT4l5+GBsRTUw1KZ/s6IhktCcDgUkNDN3gIp+oVFFv1Kq4l/qsdhjFcp5sNWq1dacBltf89BpFdllGSMKcM91tHg3i2Ho61llFifR5bwSO28Md5XEm9RE5yeH2yRgaMZhHuN1EjC8aPJNK/KocXyg5/O5PXBIeLJ+4JhAPy4oAVdxGGX1xCSwp98ErHe+RIkSJVhW+ASdBlAft0XIiAAAAABJRU5ErkJggg==">
					</h4>
				</article>
			</body>
		</div>
	</main>
</template>

<style scoped>
.custom-card {
	background-color: #fde2d6;
	border-radius: var(--pico-border-radius);
	padding: 16px;
	margin: 10px 0;
	border: none;
	box-shadow: 1 5px 8px rgba(12, 12, 12, 0.1);
}

.custom-card[smoth-bottom] {
	background: linear-gradient(to bottom, #fdf6ee, rgba(255, 255, 255, 0));
	box-shadow: 0px -8px 8px rgba(12, 12, 12, 0.1);
}

.custom-card[smoth-top] {
	background: linear-gradient(to top, #fdf6ee, rgba(255, 255, 255, 0));
	box-shadow: 0px 8px 8px rgba(12, 12, 12, 0.1);
}

.profile-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
}

.circular-image {
	align-self: center;
	object-fit: cover;
	border-radius: 40%;
	width: 100%;
	height: 100%;
}

.image-container {
	position: relative;
	width: 8em;
	height: 8em;
}

.loading-overlay {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: url('@/assets/imagens-temp/add-photo.jpeg') no-repeat center center / 8em 8em;
	filter: blur(2px);
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 40%;
}

.container.register-words {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 20px;
}

.tool-button-back {
	margin-top: -8%;
	margin-right: 20px;
}

.tool-button-add {
	margin-top: -8%;
	margin-right: -5px;
}

@media (max-width: 800px) {
	.container.only-view-word {
		padding: 50px;
	}

	.container.register-words {
		padding: 0;
	}
}

.loader {
	border: 4px solid rgba(255, 255, 255, 0.3);
	border-top: 4px solid #3498db;
	border-radius: 50%;
	width: 30px;
	height: 30px;
	animation: spin 1s linear infinite;
}

@keyframes spin {
	0% {
		transform: rotate(0deg);
	}

	100% {
		transform: rotate(360deg);
	}
}

@media (max-width: 1200px) {
	.circular-image {
		width: 7em;
		height: 7em;
	}

	h2 {
		font-size: 1.8em;
	}
}

@media (max-width: 992px) {
	.circular-image {
		width: 6em;
		height: 6em;
	}

	h2 {
		font-size: 1.6em;
	}
}

@media (max-width: 768px) {
	.circular-image {
		width: 5em;
		height: 5em;
		position: absolute;
		margin-bottom: -20px;
	}

	h2 {
		font-size: 1.4em;
		text-align: center;
		margin-left: 25%;
	}
}

@media (max-width: 576px) {
	.circular-image {
		width: 4em;
		height: 4em;
	}

	h2 {
		font-size: 1.2em;
		margin-left: 35%;
	}
}

.responsive-container {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	flex-wrap: wrap;
	width: 100%;
}

.responsive-container h2 {
	margin-left: -15%
}

.image-container {
	margin-right: 20px;
}

h2 {
	flex: 1;
	text-align: center;
	margin: 0;
}

@media (max-width: 600px) {
	.responsive-container {
		flex-direction: column;
		align-items: center;
	}

	.image-container {
		margin-right: 0;
		margin-bottom: 10px;
	}
}

@media (max-width: 800px) {
	.responsive-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
	}

	.tool-button-back {
		margin-top: 0;
		align-self: flex-start;
	}

	.tool-button-add {
		margin-top: 15px;
		/* align-self: center; */
		margin-left: -10%;
	}

	.image-container {
		margin-right: 0;
		margin-top: -30px;
	}

	.responsive-container h2 {
		margin-left: -7%
	}
}

@media (max-width: 700px) {
	.responsive-container {
		flex-direction: column;
		align-items: center;
	}

	.image-container {
		margin-left: 15%;
		margin-bottom: -20px;
	}
}

@media (max-width: 400px) {
	.responsive-container {
		flex-direction: column;
		align-items: center;
	}

	.image-container {
		margin-left: 30%;
	}
}
</style>