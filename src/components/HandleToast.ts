import { ref, type Ref } from "vue";

export interface IToast {
    title: string,
    message: string,
    show?: boolean
}

export class HandleDataToast {
    toasts: Ref<IToast[]>;
    currIsVisible: boolean;

    constructor() {
        this.toasts = ref<IToast[]>([]);
        this.currIsVisible = false;
    }

    addMessage(toastMessage: IToast, expotirationTimeMs: number = 3000) {
        const fnRemove = () => {
            this.removeMessage(toastMessage)
            this.currIsVisible = false;
        };

        if (this.toasts.value.length == 0) {
            toastMessage.show = false;
            this.toasts.value.push(toastMessage);
            this.currIsVisible = true;
            setTimeout(() => {
                this.toasts.value[0].show = true;
            }, 200);
            setTimeout(fnRemove, expotirationTimeMs);
        } else {
            const fnPush = () => {
                if (!this.currIsVisible) {
                    toastMessage.show = false;
                    this.toasts.value.push(toastMessage);
                    this.currIsVisible = true;
                    setTimeout(() => {
                        this.toasts.value[0].show = true;
                    }, 200);

                    setTimeout(fnRemove, expotirationTimeMs);
                } else {
                    setTimeout(fnPush, 200);
                }
            };
            setTimeout(fnPush, 200);
        }
    }

    removeMessage(currToast: IToast) {
        try {
            if (this.toasts.value.includes(currToast)) {
                const index = this.toasts.value.indexOf(currToast);
                this.toasts.value.splice(index, 1);
            }
        } catch { }
    }

}