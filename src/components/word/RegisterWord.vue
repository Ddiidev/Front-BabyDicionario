<template>
	<div class="word-form">
		<div style="float: right; align-self: flex-end; margin-bottom: 20px;">
			<ToolButton save style="width: auto;" @click="handleSave">
				<img style="width: 26px; padding-bottom: 5px;"
					src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAB8UlEQVR4nO2Zvy8EQRTHP3EKCq6gUqBQUSkVEheJwtHyFygVotTfX+Do/ANKnX9AOIlOJ/EjQSISNG45RiZ5knHZ2bid2T0r80leXm7n3sz7zs6+2ZuDQCAQ+OsMAzvADdAClEd7BNaBnqySrwD3npOOs32gL4uZzyN5JXYkY3pj1+j8Su5GSdrMgdNgE3EOjPkScG10XElIIA1m/AbwYXy+BaY95P/jgS0lJJCG9vgVoGlcewEWHPNPTNK3AM0M8GBcfwfWKJAAzSRwabR9AlukJCnJyGgrd9hv2YhtxrSPAGdt46/6FtDwVDqPLWMPAodtJdargCVPAhYTxu83vveWRsB3adM+jipw0racfmORzHxS8l6etQMJ1L5bKBcBuvZPxewBeaIcq13XUa4CBiiwgD0J1L6QAloSqH0hBaiE4GXZzDotobay2rCU1UwEVD1tYnFWzUPAaYYCjvMQYC4b/c7iSjnh5e5CrmvvTUAWm4uy9DkBbIovpAAngoAOUP/1DtSAV/GFFBAZm10hBags94FUs2IhsvTpJMB2sOW0Li3UYvrsNcZvuR4tzpI/c8b4+qzI+XB3PqeflyVJ3jzgqqfpaFzOKFWX7QkYTTsbetbvupj8s+TgxBCwLcvI919MKsZasnzqLjMfCAQC5MIX2u0mrXnWclEAAAAASUVORK5CYII=">
			</ToolButton>
			<ToolButton @click="handleClose">fechar <small>✕</small>
			</ToolButton>
		</div>

		<hr style="margin-bottom: 25px; margin-top: -10px; width: 100%;" />
		<h3>Minha nova palavrinhas</h3>
		<form class="container" @submit.prevent="">
			<div class="grid">
				<label for="word">
					Palavra
					<input type="text" id="word" v-model="formData.word.word" :aria-invalid="formData.validWord"
						aria-describedby="valid-word" placeholder="Palavra" @input="clearValidation('word')" />
					<small id="valid-word">{{ formData.validWordMsg }}</small>
				</label>
				<label for="translation">
					Tradução
					<input type="text" id="translation" v-model="formData.word.translation"
						:aria-invalid="formData.validTranslation" aria-describedby="valid-translation"
						placeholder="Tradução" @input="clearValidation('translation')" />
					<small id="valid-translation">{{ formData.validTranslationMsg }}</small>
				</label>
			</div>

			<div class="grid">
				<label for="pronunciation">
					Pronúncia
					<input type="text" id="pronunciation" v-model="formData.word.pronunciation"
						:aria-invalid="formData.validPronunciation" aria-describedby="valid-pronunciation"
						placeholder="Pronúncia" @input="clearValidation('pronunciation')" />
					<small id="valid-pronunciation">{{ formData.validPronunciationMsg }}</small>
				</label>

				<label for="data-speaker">
					Data da fala
					<input type="date" v-model="formData.word.dateSpeaker" :aria-invalid="formData.validSpeaker"
						aria-describedby="valid-speaker" placeholder="Speaker" @input="clearValidation('speaker')" />
					<small id="valid-speaker">{{ formData.validSpeakerMsg }}</small>
				</label>
			</div>

			<div :data-tooltip="!props.userLogged ? 'Só é possível adicionar áudio se estiver logado' : undefined"
				class="grid button-container">
				<div class="audio-controls">
					<ToolButton data-tooltip="Ouça a pronúncia" @click="togglePlay"
						:disabled="!formData.audioSrc || !props.userLogged" class="toolbutton-audio-controls">
						<img v-if="!formData.isPlaying" width="26" height="26" src="@/assets/play.png" alt="play" />
						<img v-else width="26" height="26" src="@/assets/pause.png" alt="circled-pause" />
						<small v-if="!formData.isPlaying">
							Reproduzir
							<span class="duration-time">{{ formData.audioDuration }}</span>
						</small>
						<small v-else>
							Parar
							<span class="duration-time">{{ formData.audioDuration }}</span>
						</small>
					</ToolButton>

					<audio ref="audio" :src="formData.audioSrc" @ended="formData.isPlaying = false"></audio>
				</div>

				<div class="audio-controls">
					<ToolButton @click="addAudio" class="toolbutton-audio-controls" :disabled="!props.userLogged">
						<img width="26" height="26" src="https://img.icons8.com/pulsar-color/26/add-song.png"
							alt="add-song" style="padding-top: 5px;" />
						Adicionar áudio
					</ToolButton>
					<input type="file" ref="fileInput" accept="audio/*" @change="handleFileChange"
						style="display: none;" />

					<ToolButton v-if="!formData.isRecording" @click="startRecording" class="toolbutton-audio-controls"
						:disabled="!props.userLogged">
						<img width="26" height="26" src="https://img.icons8.com/pulsar-color/26/radio-studio.png"
							alt="radio-studio" />
						Gravar áudio
						<span v-if="formData.isRecording" class="blinking-dot"></span>
					</ToolButton>
					<ToolButton v-else @click="stopRecording" class="toolbutton-audio-controls"
						:disabled="!props.userLogged">
						<img
							src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAACXBIWXMAAAsTAAALEwEAmpwYAAADA0lEQVR4nM2W20tUYRDAt0yoqAx195s5u2U3s7AwWS/rZWe0OwYhoQ9FVJoplWAkERmkFj3VH9BS7UkIzuaL0D8gRU9RSFrRHrKeooiEiBK66InZdXHZdt0j7kMDw57vmzPzO/N9M8M6HP+bAFA5ABmA/C6iQAZivTejEBdyGyD9UcA/FdATUUD+BUi/lUatGYFoGpVKQAB+oRSvi+0r5V8PyKNic7rrSxYMUsgDko3TWb8xthcYHM/RQ28au3uMC2IDJH3BIEB6qYCfx9b3DHOvHgp/0kOmJVpadnS6sOjg50yA3gPSsDwPDI6v1Y3w1xhEtKMzYB05fsMKPjBbMwbSjXBfPEQPmdbt+6+swMCYpRvhsUyCgomg3fvPW96KY5ZumN8WCOJRAH4oz8GQqSeCqv3t1tbiQ1YwZH6fZ2hvtkIOSIPKyulk8Hh8uXZAAFQuvhIjLUZ6BZAtAOqVNSLn5+ZWrLIJ6hXf+H5LC1LIfZE10IgCGrIJuiy+Hs9Od1qQpvnXREF0VdaA9FYBP04F8tW0WcXbmyIgpapcANzksCMFBbx0JqNbkYyQHwHSR4ejOSseFDTCk0HD7Gps7q2trGyp5T1ndrhctRtiGjvuOUWyAKRIX7iQumburDsYCt+ZBZldAHwdkKcj9n91WiFdm/uekG/Ky4h1NZKhQnomjhW+lqc9/UOWaEfn3RJAnpLJHp9JTGWqix3RuzwlSC5TAf+Qie108gopbymI+C8uqzpVLr+aVl+UIswiAGpIf3zAp6NBaVjTduXJngQt85241H42MM57urelAS12IR9OC4rC6ErkrIG+uJB6okF5iRSGexN7oqDazcl8891UKPb8fD/ahTUo5Nfxlyyak8OrFfpPCjSZn3yU7Z6aleYsRPJLEyukCQU84fH4lilVd0DuIoOgWZmZFCNSTVJVUl3Jqg6R2sWel1e90nZw6XaFdHFGP4gi1u2TPpFgKfpoSiH3zyMHb7YCnkwMJHuIfA6RtyTLyNZkSBSZf/IfLpmKzU6Qv3hav72byOPAAAAAAElFTkSuQmCC">
						<div>
							Parar
							<span class="duration-time">{{ formData.recordingTime }}</span>
						</div>
					</ToolButton>
					<ToolButton v-if="!isDeviceMobile" v-show="props.userLogged" class="toolbutton-audio-controls"
						style="width: 60px;" data-tooltip="Escolha o microfone" @click="switchVisibleConfDevice">
						<!-- Settings -->
						<img width="26" height="26" src="https://img.icons8.com/pulsar-color/26/settings.png"
							alt="settings" />
					</ToolButton>
				</div>
			</div>

			<div
				style="display: flex; flex-direction: column; align-items: center; text-align: center; margin-top: 10px;">
				<div v-if="formData.visibleConfDevice" class="device-selector">
					<label for="audioDevice" style="display: block; width: 100%;">
						<h6>Escolha o Dispositivo de Áudio:</h6>
						<select id="audioDevice" v-model="formData.selectedDeviceId"
							style="width: 100%; max-width: none; margin-top: 10px;">
							<option v-for="device in formData.audioDevices" :key="device.deviceId"
								:value="device.deviceId">
								{{ device.label || `Dispositivo ${device.deviceId}` }}
							</option>
						</select>
					</label>
				</div>
			</div>
		</form>

		<!-- Modal para Solicitar Permissão de Microfone -->
		<dialog :open="formData.showPermissionModal" style="
			gap: 10px;
			transition: right 0.8s ease-in-out;
			backdrop-filter: blur(3px);
			border: 1px solid #feb1a6;
			box-shadow: 0 0 5px #feb1a6;">
			<article>

				<header>
					<h2 style="text-align: center;">Permissão Necessária</h2>
				</header>

				<p>Este site precisa acessar seu microfone para permitir gravar a pronuncia do seu bebê.</p>
				<small>Caso não conceda a permissão, você poderá gravar a pronuncia do seu bebê posteriormente.</small>

				<footer>
					<ToolButton @click="requestMicrophonePermission">Conceder Permissão</ToolButton>
					<ToolButton @click="closePermissionModal">Cancelar</ToolButton>
				</footer>
			</article>
		</dialog>
	</div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, watch } from 'vue';
import ToolButton from '@/components/ToolButton.vue';
import { isMobile } from '@/utils/deviceUtils'; // Importando a função
import { Word } from '@/models/words';
import { saveWord } from '@/service/word/word';
import { useRoute } from 'vue-router';
import { stringDateNow, unixDateToString } from '@/views/utils';
import { getLocalProfile } from '@/service/profile/localProfile';

const emit = defineEmits(['close', 'save']);
const props = defineProps<{
	userLogged: boolean;
	word?: Word;
}>();

const formData = reactive({
	word: props.word ? Object.assign({}, props.word) : new Word({
		dateSpeaker: stringDateNow() as any,
	}),
	isPlaying: false,
	isRecording: false,
	recordedChunks: [] as Blob[],
	recordingTime: '00:00',
	audioDuration: '00:00',
	audioSrc: '', // Adicione esta propriedade para armazenar a fonte de áudio
	audioDevices: [] as MediaDeviceInfo[],
	selectedDeviceId: '',
	visibleConfDevice: false,
	showPermissionModal: false,
	hasMicrophonePermission: false,

	validWord: undefined as boolean | undefined,
	validTranslation: undefined as boolean | undefined,
	validPronunciation: undefined as boolean | undefined,
	validWordMsg: '',
	validTranslationMsg: '',
	validPronunciationMsg: '',
	validSpeaker: undefined as boolean | undefined,
	validSpeakerMsg: '',

	shortUUID: '',
	nameShared: '',
});

// Adicionando uma propriedade para verificar se é mobile
const isDeviceMobile = isMobile();

// Chave para o localStorage
const LOCAL_STORAGE_KEY_DEVICE = 'view:words:device-record';

let mediaRecorder: MediaRecorder | null = null;

// Referência ao elemento de áudio
const audio = ref<HTMLAudioElement | null>(null);

let audioInterval: ReturnType<typeof setInterval> | null = null;
let recordingInterval: ReturnType<typeof setInterval> | null = null;

if (props.word && props.word.audioPath) {
	formData.audioSrc = props.word.audioPath;
}

// Função para adicionar áudio pré-definido
function addAudio() {
	const fileInput = document.querySelector<HTMLInputElement>('input[type="file"]');
	fileInput?.click();
}

// Função para lidar com a mudança de arquivo
function handleFileChange(event: Event) {
	const target = event.target as HTMLInputElement;
	if (target.files && target.files.length > 0) {
		const file = target.files[0];
		const url = URL.createObjectURL(file);
		formData.audioSrc = url;

		audio.value?.addEventListener('loadedmetadata', () => {
			if (audio.value?.duration != Infinity) {
				const duration = audio.value?.duration || 0;
				const mins = String(Math.floor(duration / 60)).padStart(2, '0');
				const secs = String(Math.floor(duration % 60)).padStart(2, '0');
				formData.audioDuration = `${mins}:${secs}`;
			}
		});

		audio.value?.load();
		target.value = '';
	}
}

function togglePlay() {
	if (formData.isPlaying) {
		audio.value?.pause();
		audio.value!.currentTime = 0;
		formData.audioDuration = '00:00';

		// Limpa o intervalo quando a reprodução é parada
		if (audioInterval) {
			clearInterval(audioInterval);
			audioInterval = null; // Reseta a referência
		}
	} else {
		audio.value?.play();

		// Zera o contador ao iniciar a reprodução
		formData.audioDuration = '00:00';

		audioInterval = window.setInterval(() => {
			const currentTime = audio.value?.currentTime || 0;

			if (currentTime > 0) {
				const mins = String(Math.floor(currentTime / 60)).padStart(2, '0');
				const secs = String(Math.floor(currentTime % 60)).padStart(2, '0');
				formData.audioDuration = `${mins}:${secs}`;

				if ((audio.value?.currentTime ?? 0) >= (audio.value?.duration ?? 1)) {
					formData.isPlaying = false;

					if (audioInterval) {
						clearInterval(audioInterval);
						audioInterval = null;
					}
				}
			}
		}, 1000);
	}
	formData.isPlaying = !formData.isPlaying;
}


async function startRecording() {
	if (!formData.hasMicrophonePermission) {
		await checkAndRequestPermission();
		if (!formData.hasMicrophonePermission) {
			return;
		}
	}

	if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
		const constraints = {
			audio: formData.selectedDeviceId ? { deviceId: { exact: formData.selectedDeviceId } } : true,
		};

		navigator.mediaDevices.getUserMedia(constraints)
			.then(stream => {
				mediaRecorder = new MediaRecorder(stream);
				mediaRecorder.start();
				formData.isRecording = true;
				formData.recordedChunks = [];
				formData.recordingTime = '00:00';
				startTimer();

				mediaRecorder.ondataavailable = event => {
					if (event.data.size > 0) {
						formData.recordedChunks.push(event.data);
					}
				};

				mediaRecorder.onstop = () => {
					const blob = new Blob(formData.recordedChunks, { type: 'audio/mp3' });
					formData.audioSrc = URL.createObjectURL(blob);
					formData.isRecording = false;

				};
			})
			.catch(err => {
				console.error('Erro ao acessar o microfone:', err);
			});
	} else {
		console.error('getUserMedia não é suportado neste navegador.');
	}
}

// Função para parar a gravação
function stopRecording() {
	if (mediaRecorder && formData.isRecording) {
		mediaRecorder.stop();
		mediaRecorder.stream.getTracks().forEach(track => track.stop());
		formData.isRecording = false;

		// Limpa o intervalo do timer
		if (recordingInterval) {
			clearInterval(recordingInterval);
			recordingInterval = null; // Reseta a referência
		}

		const blob = new Blob(formData.recordedChunks, { type: 'audio/mp3' });
		formData.audioSrc = URL.createObjectURL(blob);

		// Armazena a duração total da gravação
		formData.audioDuration = formData.recordingTime;

		// Recarrega o elemento de áudio com a nova fonte
		audio.value?.load();

		// Reinicia o estado de reprodução
		formData.isPlaying = false;
	}
}

function switchVisibleConfDevice() {
	formData.visibleConfDevice = !formData.visibleConfDevice;
}

function startTimer() {
	let seconds = 0;
	recordingInterval = window.setInterval(() => {
		seconds += 1;
		const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
		const secs = String(seconds % 60).padStart(2, '0');
		formData.recordingTime = `${mins}:${secs}`;
	}, 1000);
}

async function getAudioDevices() {
	try {
		const devices = await navigator.mediaDevices.enumerateDevices();
		formData.audioDevices = devices.filter(device => device.kind === 'audioinput');

		// Verifica se há um dispositivo salvo no localStorage
		const savedDeviceId = localStorage.getItem(LOCAL_STORAGE_KEY_DEVICE);
		if (savedDeviceId && formData.audioDevices.some(device => device.deviceId === savedDeviceId)) {
			formData.selectedDeviceId = savedDeviceId;
		} else if (formData.audioDevices.length > 0 && !formData.selectedDeviceId) {
			formData.selectedDeviceId = formData.audioDevices[0].deviceId;
		}
	} catch (err) {
		console.error('Erro ao listar dispositivos de áudio:', err);
	}
}

// Função para verificar e solicitar permissão de microfone
async function checkAndRequestPermission() {
	try {
		const status = await navigator.permissions.query({ name: 'microphone' as PermissionName });
		formData.hasMicrophonePermission = (status.state === 'granted');

		if (status.state === 'prompt') {
			formData.showPermissionModal = true;
		} else if (status.state === 'denied') {
			console.warn('Permissão para o microfone negada.');
			// Opcional: Mostrar uma mensagem de erro ao usuário
		}

		status.onchange = () => {
			formData.hasMicrophonePermission = (status.state === 'granted');
			if (status.state === 'granted') {
				formData.showPermissionModal = false;
				getAudioDevices();
			}
		};
	} catch (err) {
		console.error('Erro ao verificar permissões de microfone:', err);
		formData.showPermissionModal = true;
	}
}

// Função para solicitar permissão de microfone
async function requestMicrophonePermission() {
	try {
		await navigator.mediaDevices.getUserMedia({ audio: true });
		formData.hasMicrophonePermission = true;
		formData.showPermissionModal = false;
		getAudioDevices();
	} catch (err) {
		console.error('Permissão de microfone não concedida:', err);
		formData.hasMicrophonePermission = false;
	}
}

function closePermissionModal() {
	formData.showPermissionModal = false;
}

function handleClose() {
	emit('close');
}


async function handleSave() {
	if (validateForm()) {
		const isNewWord = !props.word;
		
		formData.word.audioPath = formData.audioSrc;
		if (!props.userLogged) {
			formData.word.uuid = `no-sync:${crypto.randomUUID()}`;
			const localProfile = getLocalProfile(formData.shortUUID);
			formData.word.profile_uuid = localProfile?.uuid ?? '';
		}
		let words = JSON.parse(localStorage.getItem('words') || '[]').map((w: Word) => new Word(w));
		if (isNewWord) {
			words.push(formData.word);
		} else {
			words[words.findIndex((word: Word) => word.uuid === formData.word.uuid)] = formData.word;
		}
		
		if (!props.userLogged){
			localStorage.setItem('words', JSON.stringify(words));
			emit('save', new Word(formData.word));
			return;
		}

		try {
			const wordsSaved = await saveWord(formData.shortUUID, formData.nameShared, formData.word);
			if (wordsSaved !== undefined) {
				emit('save', wordsSaved[0]);
			}
		} catch (error) {
			console.error('Erro ao salvar a palavra:', error);
		}

	}
}


function validateForm(): boolean {
	let isValid = true;

	// Validação do campo "Palavra"
	if (!formData.word.word.trim()) {
		formData.validWord = true;
		formData.validWordMsg = 'O campo "Palavra" é obrigatório.';
		isValid = false;
	} else {
		formData.validWord = false;
		formData.validWordMsg = '';
	}

	// Validação do campo "Tradução"
	if (!formData.word.translation.trim()) {
		formData.validTranslation = true;
		formData.validTranslationMsg = 'O campo "Tradução" é obrigatório.';
		isValid = false;
	} else {
		formData.validTranslation = false;
		formData.validTranslationMsg = '';
	}

	// Validação do campo "Pronúncia"
	if (!formData.word.pronunciation.trim()) {
		formData.validPronunciation = true;
		formData.validPronunciationMsg = 'O campo "Pronúncia" é obrigatório.';
		isValid = false;
	} else {
		formData.validPronunciation = false;
		formData.validPronunciationMsg = '';
	}

	return isValid;
}

// Watcher para salvar o dispositivo selecionado no localStorage
watch(() => formData.selectedDeviceId, (newDeviceId) => {
	if (newDeviceId) {
		localStorage.setItem(LOCAL_STORAGE_KEY_DEVICE, newDeviceId);
	}
});

onMounted(() => {
	formData.shortUUID = useRoute().params.shortUUID.toString();
	formData.nameShared = useRoute().params.nameShared.toString();

	const hasWordFromProps = props.word !== undefined;
	if (hasWordFromProps && !isNaN(Number(formData.word.dateSpeaker as any))) {
		formData.word.dateSpeaker = unixDateToString(formData.word.dateSpeaker as any) as any;
	}
	getAudioDevices();
});

function clearValidation(field: string) {
	if (field === 'word') {
		formData.validWord = undefined;
		formData.validWordMsg = '';
	} else if (field === 'translation') {
		formData.validTranslation = undefined;
		formData.validTranslationMsg = '';
	} else if (field === 'pronunciation') {
		formData.validPronunciation = undefined;
		formData.validPronunciationMsg = '';
	}
}
</script>

<style scoped>
.word-form {
	background-color: #fde2d6;
	border: 1px solid #feb1a6;
	border-radius: 8px;
	padding: 20px;
	box-shadow: 0 0 5px #feb1a6;
	display: flex;
	width: 60%;
	max-width: 650px;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
	height: 100%;
	transition: width 0.3s ease;
}

@media (max-width: 800px) {
	.word-form {
		width: 80%;
	}
}

@media (max-width: 600px) {
	.word-form {
		width: 100%;
	}
}

h3 {
	text-align: center;
	margin-bottom: 20px;
}

.form-row {
	display: flex;
	justify-content: space-between;
	margin-bottom: 15px;
}

.form-group {
	flex: 1;
	margin-right: 10px;
}

.form-group:last-child {
	margin-right: 0;
}

label {
	display: block;
	margin-bottom: 5px;
}

.audio-controls {
	display: flex;
	align-items: center;
}

.custom-audio-controls {
	display: flex;
	align-items: center;
	/* margin-left: 10px; */
}

.toolbutton-audio-controls {
	margin-top: 18px;
	margin-left: 0px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	/* Adiciona centralização vertical */
	width: 200px;
	/* Ajuste conforme necessário */
	height: 110px;
}

.add-button {
	background-color: #feb1a6;
	border: none;
	color: white;
	padding: 10px 15px;
	border-radius: 4px;
	cursor: pointer;
	width: 100%;
}

.add-button:hover {
	background-color: #b18077;
}

.button-container {
	display: flex;
	justify-content: center;
	/* Centraliza horizontalmente */
	align-items: center;
	/* Centraliza verticalmente */
	width: 100%;
	flex-direction: row;
	/* Alinha os itens em linha */
	gap: 10px;
	/* Adiciona espaço entre os botões */
}

/* Estilos para o contador e indicação de gravação */
.blinking-dot {
	display: inline-block;
	width: 10px;
	height: 10px;
	background-color: red;
	border-radius: 50%;
	margin-left: 8px;
	animation: blink 1s infinite;
}

@keyframes blink {

	0% {
		opacity: 1;
	}

	50% {
		opacity: 0;
	}

	100% {
		opacity: 1;
	}
}

.duration-time {
	font-family: monospace;
	margin-left: 10px;
	font-weight: bold;
}

.device-selector {
	margin-bottom: 20px;
	width: 100%;
	max-width: 500px;
	box-sizing: border-box;
}

.device-selector label {

	display: block;
	margin-bottom: 5px;
}

.device-selector select {
	width: 100%;
	padding: 10px;
	border: 1px solid #b19d95;
	border-radius: 4px;
}

@media (max-width: 500px) {
	.container {
		font-size: small;
		padding: 0px;
		margin-left: -10px;
		margin-right: -10px;
	}
}
</style>