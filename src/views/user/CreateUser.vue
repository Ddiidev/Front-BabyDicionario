<script setup lang="ts">
import {
	setSelfComponent,
	current_step,
	nextStep,
	prevStep,
	checkedPai,
	checkedMae,
	passwordMatch,
	codeVerificationMatch,
	formData,
	toastData,
	dataValida,
	modal,
	setModal,
	countProfiles,
	syncNo,
	syncYes,
	getInfoDataNoTSynchronized,
	STEPS
} from './CreateUser';
import ToolButton from '@/components/ToolButton.vue';
import * as ResponsiveUI from './ResponsiveUI';
import NavBar from '@/components/NavBar.vue';
import Toast from '@/components/ToastMessage.vue';
</script>

<template>
	<NavBar hideCreateAcount></NavBar>
	<main style="padding-left: 3%; padding-right: 3%" class="main container-fluid">
		<!-- eslint-disable-next-line vue/valid-v-for -->
		<Toast v-for="toast in toastData.toasts.value" :title="toast.title" :message="toast.message" :show="toast.show"
			@closeButton="toastData.removeMessage(toast)"></Toast>

		<dialog v-if="modal.show" open>
			<article class="default-border">
				<header>
					<ToolButton @click="setModal(false)" style="display: block; margin-left: auto" aria-label="Close"
						rel="prev">✕</ToolButton>
					<p>
						<strong>📩 Aparentemente esse email já foi
							registrado.</strong>
					</p>
				</header>
				<p>
					{{ modal.message }}
				</p>
			</article>
		</dialog>

		<div class="grid">
			<article id="side" style="justify-self: center; text-align: center">
				<header>
					<img class="rounded-image" src="@/assets/logo.png" style="width: 100px; height: 100px" />
					<hgroup style="margin-top: 10px">
						<h2>Olá, vamos começar...</h2>
					</hgroup>
					<h3>{{ formData.primeiro_nome }}</h3>
				</header>

				<label>
					<fieldset v-if="current_step === STEPS.HOME">
						<label>
							Como gostaria de ser chamado?
							<input ref="inPrimeiroNome" style="margin-top: 3%" name="first_name"
								placeholder="Primeiro nome" autocomplete="given-name"
								v-model="formData.primeiro_nome" />
							<small>Dica: aqui é o nome do papai ou da mamãe. Logo
								poderá adicionar o perfil do seu baby</small>
						</label>

						<label>
							<div v-if="formData.primeiro_nome !== ''">
								{{ formData.primeiro_nome }}, informe sua
								data de nascimento:
							</div>
							<input type="date" name="date" aria-label="Date" v-model="formData.data_nascimento"
								aria-describedby="valid-data-nascimento" :aria-invalid="!dataValida()" />

							<small id="valid-data-nascimento">
								{{
									!dataValida()
										? 'Por favor insira uma data de nascimento válida'
										: ''
								}}
							</small>
						</label>

						<fieldset>
							<input type="radio" id="radioPai" name="second-language" v-bind:checked="formData.pai"
								:onClick="checkedPai" />
							<label htmlFor="radioPai">Pai</label>

							<input type="radio" id="radioMae" name="second-language" v-bind:checked="formData.mae"
								:onClick="checkedMae" />
							<label htmlFor="radioMae">Mãe</label>
						</fieldset>
					</fieldset>

					<fieldset v-if="current_step === STEPS.DATA_NO_SYNC">
						<h4>
							Antes de continuarmos... <br />
							percebi que há dados não sincronizados
						</h4>
						<hgroup>
							<h4>
								Deseja sincronizar esses dados abaixo?
							</h4>
							<i>A sincronização acontecerá automágicamente 🪄, logo após o cadastro confirmado no
								app.</i>
						</hgroup>

						<br />
						<hr />

						<div class="table-container">
							<table>
								<thead>
									<th>Perfil</th>
									<th>Palavras</th>
								</thead>
								<tbody>
									<tr v-for="d in getInfoDataNoTSynchronized()" v-bind:key="d.name">
										<td>{{ d.name }}</td>
										<td>{{ d.countWords }}</td>
									</tr>
								</tbody>
							</table>
						</div>
					</fieldset>

					<fieldset v-if="current_step === STEPS.EMAIL_AND_PASSWORD">
						<label>
							Informe um e-mail
							<input ref="inEmail" v-model="formData.email" name="email" placeholder="E-mail de login"
								type="email" autocomplete="email" />
							<input v-model="formData.senha" name="pass" placeholder="Digite sua senha de acesso"
								type="password" aria-label="Password" :aria-invalid="!passwordMatch()"
								aria-describedby="valid-pass" />

							<input v-model="formData.senhaConfirm" name="pass_confirm" placeholder="Confirme sua senha"
								type="password" aria-describedby="valid-pass" :aria-invalid="!passwordMatch()"
								aria-label="Password" />
							<small id="valid-pass">
								{{
									!passwordMatch()
										? 'Senhas não coincidem'
										: 'Perfeito!'
								}}</small>
						</label>
					</fieldset>

					<fieldset v-if="current_step === STEPS.SEND_EMAIL_CONFIRMATION">
						<label>
							<h4>
								Estamos quase lá, só preciso que você confirme
								seu e-mail
							</h4>

							<small>Será enviado um código de confirmação para seu
								e-mail</small>
							<h5>{{ formData.email }}</h5>
						</label>
					</fieldset>

					<fieldset v-if="current_step === STEPS.CONFIRMATION_CODE">
						<label>
							<h4>Foi enviado um código para seu e-mail</h4>

							<input v-model="formData.codigoConfirmacao" placeholder="Digite o código enviado"
								aria-describedby="valid-code" :aria-invalid="!formData.codigoValido"
								aria-label="Password" />
							<small id="valid-code">
								{{
									formData.codigoValido
										? 'Perfeito!!'
										: 'Código inválido'
								}}
							</small>
						</label>
					</fieldset>
				</label>

				<ToolButton :onclick="prevStep" v-if="current_step > STEPS.HOME">&lt;&lt; Voltar</ToolButton>

				<ToolButton :onclick="codeVerificationMatch" v-if="current_step == STEPS.CONFIRMATION_CODE">Verificar código</ToolButton>

				<ToolButton delete data-tooltip="Descartará os dados locais acima, e poderá criar novos do zero"
					v-if="current_step == STEPS.DATA_NO_SYNC" :onclick="syncNo">
					<img style="width: 26px; padding-bottom: 5px;"
						src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAACtElEQVR4nO2ZPWgUQRTHf0nulBBBQ2KhsTGWVn5E0we0CCm00DRiQBAFKwMGPdRGSUo1SgQF0wSUGBC0sBELCxELUVOFBPHbqBEEMcYmMvACj+E+Zm/HnV3YH0xzt2/nP8fMe/95Bzk5OT5oBLqBM8AUMA38AP4Cv4GPwGvgNnAS2E5K2AQMAx+A5YjjQEjhbcAYsFSH8JVxLpT4fuB7GUGfgJvAIdkiZpFFoBnYCGwDjgI3gGtAa9LCC/Kr28IfA71AEymmGbhvCZ8B9pABCmXEjwMtZIQxS/zZBObska15yseBTVq84bmas486abOyjdk2SXFFzWtqzNq4W2cm4T3fKml5Zf7ReiqsLlJ7SZ59an5jR9qjBA9beT4Uz5SOkmtQk+VtTJEKRb91Fhpcgrote2DqQCiKwFelZ6tLUEkFGG8TmjtKzwmXgCkVYIxZaI4pPZMuAdMqIA0Xj91KjznUNVlQAaaYVWILMAgMxRyDQGeVeTYrPW9cFqDz/6oqz83GuMzYY7bKPC3quV9ZXMBq9dwflwVo/1Ot+nVKxhqJOUo1ttB6pedb1EO8k/B0KT2vXALuqoDDhGcgaho9rQJuEZ5xpcdkrUh593NgK1EA5qNuaWPm3qfEzPUpHW+lA+jERRUY+14agydKx4WoN6KHwCOggzD0KvGL0hzLDGuAObWAy2SMCSV+PkQbMg7nLZux39eLd0mRO+56tfMg/pLPlz9VL35Qw2rXs+cnLPH3fDeMr1sTvJPWR4OHbDNXRrxpKHu/YJdrr7+QfWq+j1JhTZHSeV5nnP/aqj9Y4Q+On3JGjgA7xAYX5U7RLjZgQLyNtgfLMr74PLC1MOKuyp94cS8zi/KrryMAHdLF097JdRhvY+zBBlJAo7jYIWnLvJTmwJKMBflsUp7pimLMcnJyqMg/zeZnF4HC9AcAAAAASUVORK5CYII=">
					Não
				</ToolButton>
				<ToolButton save data-tooltip="Sincronizar dados" v-if="current_step == STEPS.DATA_NO_SYNC" :onclick="syncYes">
					<img style="width: 26px; padding-bottom: 5px;"
						src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAACNElEQVR4nO2Z30tUQRTHP95aDVqi/gIFNZcIorL+kh6E/BfUFyXyXQqCNfv5pG+RGihBkL/Ff6KQ/oCe09y01iYGjnAYdt1ddmbu3bgfmIf7Y84533vPnLkzF3JycnIUg8A0sAHsA0fAGtCj7rlMBrkL7AKmTrPXLe/keAu4TwYoAK+B0zqB2/Of5Q10Ab/Vtb/ArNhIhWvAthPwL2AReAAMAZecPo8dEUZsXIgdfKFGytjAe5vo2w+sOn1vEplXynkVmGixv02nceA78Cn2G7gn+XsmYIwOY0sFv0SHUVLBnwB9nuwmwEugAszJcRAeKQHvPdlMgHlnUM+HEqHTZyRQ8CakiG/KwUCbtmwlenvO7G3bgm8Rh8p4MXDwJoQIbdh3zpsGx0lWBDyvE5xRrZbI2awIqNR5ssax7Yqwn+aZEPAUOJYnmjSwnch99v4nbfg814kvTEDbUZyYXMD/9AZmZNJ60cJAq8oAzYSAHymUOuNTQDmFycb4FJDGdG98j6+YH1xXlC2bvvgU8aZB8D4+tErK3lc8E2PR8VDZXCcAoZd9y8ruJIFIZMHte+E9IBsEvlZ60VkJnT4hmXI2gu/EdN4N7AEHsrVoK1Yr2FyvKgF28ozKsDOoPzaZv/1O2hj5IXKRyFiHO04gf2S7cRS4Ln9jilLnban8UGN7fQO4Gjt4LeKZs9nbbLM5X07jydfillPLG7VN4DYZ5IZUlk35yfdT1hVfpEROdmKdz8nJIRz/APLLWmtt+SynAAAAAElFTkSuQmCC">
					Sim
				</ToolButton>
				<ToolButton v-else-if="current_step != STEPS.CONFIRMATION_CODE" :onclick="nextStep">Avançar >></ToolButton>
			</article>
			<div id="body">
				<article v-if="ResponsiveUI.defaultMessageContainer" class="article_message-container">
					<div class="message-container">
						<h5 v-for="(item, index) in messages" v-bind:key="item"
							:style="`animation-delay: ${index * 2}s`" class="floating-message">
							{{ item }}
						</h5>
					</div>

					<blockquote style="text-align: start">
						O dicionário do bebê é um projeto que guardei em meu
						coração <br />
						desde que meu filho disse papá pela primeira vez.
						#coração_quentinho ❤️‍🔥
						<footer>
							<cite>— de: André para todos os pais</cite>
						</footer>
					</blockquote>
				</article>
			</div>
		</div>
	</main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
// import { passwordResetCleanFields } from '../login/login';

export default defineComponent({
	mounted() {
		setSelfComponent(this);
		ResponsiveUI.calculateView(this);
		window.addEventListener('resize', this.EventHandleResize);
	},
	profileEditImpl() {
		window.removeEventListener('resize', this.EventHandleResize);
	},
	methods: {
		EventHandleResize() {
			ResponsiveUI.calculateView(this);
		},
	},
});

const messages = [
	'Ter um filho é ter uma casa cheia de amor.',
	'Meu bebê, meu grande amor.',
	'Um bebê é uma das coisas mais valiosas da vida.',
	'Meu coração bate por você, meu lindo tesouro.',
	'Vamos iniciar o open bar de mamadeiras, fraldas e lencinhos umedecidos. #abençoados',
];
</script>

<style scoped>
.table-container {
	max-height: 250px;
	overflow-y: auto;
}

.centralized-content {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}

.article_message-container {
	border-radius: 50px;
	box-shadow: 0px 0px 100px 0px #f55a2f4d;
	text-align: center;
}

.message-container {
	position: relative;
	width: 100%;
	height: 500px;
	margin-left: auto;
	margin-right: auto;
	overflow: hidden;
}

.floating-message {
	position: absolute;
	left: 0;
	top: -50px;
	animation: floatText 9s infinite alternate;
}

@keyframes floatText {
	0% {
		transform: translate(0, 0);
	}

	25% {
		transform: translate(50px, -80px);
	}

	50% {
		transform: translate(100px, 200px);
	}

	75% {
		transform: translate(150px, -50px);
	}

	100% {
		transform: translate(300px, 350px);
	}
}
</style>
