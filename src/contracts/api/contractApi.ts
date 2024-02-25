export interface IContractApiNoContent {
    message: string,
    status?:  StatusContractApi
}

export interface IContractApi<T> {
    message: string,
    status?:  StatusContractApi
    content?: T
}

export enum StatusContractApi {
	info = "info",
	error = "error"
}