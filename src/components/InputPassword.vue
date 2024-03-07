// Deixar pra componentzar depois, por hora vai ser replicado mesmo

<script setup lang="ts">
import EyeClose from '@/components/icons/EyeClose.vue';
import EyeOpen from '@/components/icons/EyeOpen.vue';
import { defineComponent, ref, type Ref } from 'vue';
</script>

<template>
    <fieldset role="group">
        <input :type="inputPasswordData.visiblePass ? 'text' : 'password'"
            :placeholder="inputPasswordData.placeholder" autocomplete="Password"
            v-model="inputPasswordData.contentPassword" :aria-invalid="validatedPassword"
            aria-describedby="valid-pass" />
        <button @click="switchView" class="outline">
            <EyeClose v-if="!inputPasswordData.visiblePass"></EyeClose>
            <EyeOpen v-if="inputPasswordData.visiblePass"></EyeOpen>
        </button>
    </fieldset>

    <small v-if="inputPasswordData.passwordValidated != undefined" id="valid-pass">
        {{ inputPasswordData.passwordMessage }}
    </small>
</template>

<script lang="ts">
interface IInputPassword {
    placeholder?: string,
    contentPassword?: string,
    passwordMessage?: string,
    passwordValidated?: () => boolean | 'grammar' | 'spelling',
    visiblePass?: Ref<boolean>
}

export default defineComponent({
    props: {
        placeholder: String,
        contentPassword: String,
        passwordMessage: String,
        passwordValidated: () => Boolean,
        visiblePass: Boolean
    },
    data() {
        let validatedPassword = ref(false);
        let inputPasswordData: IInputPassword = {
            placeholder: this.placeholder,
            passwordMessage: this.passwordMessage,
            passwordValidated: this.passwordValidated,
            contentPassword: this.contentPassword,
            visiblePass: ref(false)
        }

        return {
            inputPasswordData,
            validatedPassword
        }
    },
    methods: {
        switchView() {
            this.inputPasswordData!.visiblePass = !this.inputPasswordData.visiblePass;
        }
    }
})
</script>