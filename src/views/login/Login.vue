<script setup lang="ts">
// import InputPassword from '@/components/InputPassword.vue';
import EyeClose from '@/components/icons/EyeClose.vue';
import ToolButton from '@/components/ToolButton.vue';
import EyeOpen from '@/components/icons/EyeOpen.vue';
import * as LoginImpl from './login';

const props = withDefaults(defineProps<{ tagRef: string }>(), {
	tagRef: undefined,
});
</script>

<template>
	<div ref="divFloat" class="div-flutuante" v-show="LoginImpl.visibleLogin">
		<article>
			<header>
				<div style="text-align: center" class="grid">
					<p class="h6-login">Fazer login</p>
					<small>
						<ToolButton
							class="btClose"
							@click="closePanel"
							aria-label="Close"
							rel="prev"
							>✕</ToolButton
						>
					</small>
				</div>
			</header>

			<form v-if="!passwordReset" name="body" @submit="handleSubmit">
				<fieldset>
					<label>
						Email
						<input
							ref="emailLogin"
							v-model="email"
							:aria-invalid="invalidEmail"
							type="email"
							name="email"
							placeholder="Email"
							autocomplete="email"
						/>
					</label>
					<label>
						Senha
						<fieldset role="group">
							<input
								:type="visiblePass ? 'text' : 'password'"
								name="password"
								placeholder="Sua senha"
								autocomplete="Password"
								v-model="password"
								:aria-invalid="invalidPassword"
							/>
							<button
								@click="visiblePass = !visiblePass"
								class="outline"
							>
								<EyeOpen v-if="visiblePass"></EyeOpen>
								<EyeClose v-else></EyeClose>
							</button>
						</fieldset>
						<small class="pico-color-red-600">
							{{ LoginImpl.loginData.messageError }}</small
						>
						<a
							class="secondary"
							@click="LoginImpl.beginPasswordReset"
							><small>Esqueceu a senha?</small></a
						>
					</label>
				</fieldset>

				<hr />

				<ToolButton style="width: 100%" @click="LoginImpl.login"
					>Entrar</ToolButton
				>
			</form>
			<form v-else name="passwordReset" @submit="handleSubmit">
				<fieldset v-if="flowPasswordReset == 1">
					<label>
						Email
						<input
							ref="emailLogin"
							v-model="email"
							:aria-invalid="invalidEmail"
							type="email"
							name="email"
							placeholder="Email"
							autocomplete="email"
							aria-describedby="valid-email"
						/>

						<small id="valid-email">{{ validEmailMessage }}</small>
					</label>

					<ToolButton
						style="width: 100%"
						@click="LoginImpl.passwordResetNextStep"
						>Começar</ToolButton
					>
				</fieldset>

				<fieldset v-if="flowPasswordReset == 2">
					<label>
						Nova senha
						<fieldset role="group">
							<input
								:type="
									visibleNewPassRecovery ? 'text' : 'password'
								"
								name="password"
								placeholder="Uma nova senha"
								autocomplete="Password"
								v-model="newPasswordRecovery"
								:aria-invalid="invalidNewPasswordRecovery"
							/>
							<button
								@click="
									visibleNewPassRecovery =
										!visibleNewPassRecovery
								"
								class="outline"
							>
								<EyeOpen
									v-if="visibleNewPassRecovery"
								></EyeOpen>
								<EyeClose v-else></EyeClose>
							</button>
						</fieldset>
					</label>
					<hr />
					<label>
						Código de verificação
						<input
							v-model="codeConfirmation"
							placeholder="Digite o código enviado"
							aria-describedby="valid-code"
							:aria-invalid="
								validCodeConfirmation != undefined
									? !validCodeConfirmation
									: validCodeConfirmation
							"
							aria-label="Password"
						/>
					</label>

					<ToolButton
						style="width: 100%"
						@click="LoginImpl.passwordResetVerifyCode"
						>Verificar</ToolButton
					>
				</fieldset>

				<hr />
				<a
					class="secondary"
					style="display: block; text-align: center"
					@click="LoginImpl.passwordResetClose"
					>Cancelar</a
				>
			</form>
		</article>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
// import InputPassword from '@/components/InputPassword.vue';

export default defineComponent({
	data() {
		return {
			email: LoginImpl.loginData.email,
			password: ref(LoginImpl.loginData.password),
			invalidEmail: LoginImpl.loginData.invalidEmail,
			invalidPassword: LoginImpl.loginData.invalidPassword,
			visiblePass: false,

			visibleNewPassRecovery: false,
			validEmailMessage: ref(LoginImpl.loginData.validEmailMessage),
			newPasswordRecovery: ref(LoginImpl.loginData.newPasswordRecovery),
			invalidNewPasswordRecovery:
				LoginImpl.loginData.invalidNewPasswordRecovery,
			codeConfirmation: LoginImpl.loginData.codeConfirmation,
			validCodeConfirmation: LoginImpl.loginData.validCodeConfirmation,
			passwordReset: LoginImpl.loginData.passwordReset,
			flowPasswordReset: LoginImpl.loginData.flowPasswordReset,
		};
	},
	mounted() {
		try {
			this.$nextTick(() => {
				LoginImpl.mounted(this);
			});
		} catch {}
	},
	beforeUnmount() {
		LoginImpl.unmounted();
	},
	watch: LoginImpl.watch(),
	methods: {
		setVisible: LoginImpl.setVisible,
		closePanel: LoginImpl.closePanel,
		handleSubmit(event: any) {
			event.preventDefault();
		},
	},
});
</script>

<style scoped>
.div-flutuante {
	position: absolute;
	padding: 10px;
	border-radius: 15px;
	backdrop-filter: blur(45px);
	border: 1px solid #feb1a6;
	box-shadow: 0 0 5px #feb1a6;
}

.btClose {
	margin-left: 83%;
}

.h6-login {
	text-align: center;
	margin-top: 2%;
	margin-left: 4%;
	width: 70%;
	position: fixed;
	display: block;
	font-size: 1.17em;
	font-weight: 600;
	color: inherit;
}
</style>
