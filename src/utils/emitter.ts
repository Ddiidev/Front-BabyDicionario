import mitt from 'mitt'

type EventCallback<T> = (param: T) => void;

export class Emitter {
    private static emitter = mitt()

    static emitt<T>(eventName: string, object: T) {
        this.emitter.emit(eventName, object);
    }

    static get<T>(eventName: string): T {
        let result = {} as T;
        this.emitter.on(eventName, (e) => {
            result = e as T;
        })
        this.emitter.off(eventName)

        return result;
    }

    static listen_uniq<T>(eventName: string, event: EventCallback<T>): void {
        this.emitter.on(eventName, (e) => {
            event(e as T);
            this.emitter.off(eventName)
        })
    }

    static listen<T>(eventName: string, event: EventCallback<T>): void {
        this.emitter.on(eventName, (e) => {
            event(e as T);
        })
    }
}