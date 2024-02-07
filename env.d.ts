/// <reference types="vite/client" />
declare global {
    namespace NodeJS {
        interface ProcessEnv {
            SERVER: string;
        }
    }
}