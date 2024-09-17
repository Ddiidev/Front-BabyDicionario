import type { ITokenContractRecover } from '@/contracts/token/tokenRecoverResponse';
import {
	StatusContractApi,
	type IContractApi,
} from '@/contracts/api/contractApi';
import type { IRecoveryPassword } from '@/contracts/recovery/recovery_password';
import { DateNow } from '@/utils/date';
import confs from '@/constants/conf';
import * as auth from '@/auth/auth';
import axios from 'axios';

export async function verifyCode(
	email: string,
	new_password: string,
	code: string,
): Promise<boolean> {
	try {
		try {
			const userDetails = await axios.post<
				IContractApi<IRecoveryPassword>
			>(
				`${confs.server}/confirmation/recover-password`,
				{
					email,
					new_password,
					code_confirmation: code,
					current_date: DateNow(),
				},
				{
					headers: auth.headerAuthorizationRecovery(),
				},
			);

			if (
				userDetails.status == 200 &&
				userDetails.data.status == StatusContractApi.info
			)
				return true;
		} catch (err: any) {
			if (err.response.status == 400) {
				err.response.data.message;
			}
		}
	} catch {}
	return false;
}

export async function startPasswordReset(
	email: string,
): Promise<{ msg: string; isSucess: boolean }> {
	let messageResponse = '';
	let isSucess = false;

	try {
		const userDetails = await axios.post<
			IContractApi<ITokenContractRecover>
		>(`${confs.server}/user/recover-password`, {
			email,
		});

		if (
			userDetails.data.status == StatusContractApi.info &&
			userDetails.data.content !== undefined
		) {
			localStorage.setItem(
				'access_recovery',
				userDetails.data.content.access_token,
			);
			isSucess = true;
		}
	} catch (err: any) {
		messageResponse = err.response.data.message;
		isSucess = false;
	}

	return {
		msg: messageResponse,
		isSucess,
	};
}
