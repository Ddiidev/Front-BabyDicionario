import { getResolution } from '@/views/utils';

export let defaultMessageContainer = true;

export function calculateView(parent: any): void {
	defaultMessageContainer = !(getResolution().width < 700);
	parent.$forceUpdate();
}
