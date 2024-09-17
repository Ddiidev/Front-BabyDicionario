export function DateNow(): string {
	const timeElapsed = Date.now();
	const today = new Date(timeElapsed);
	return today.toISOString();
}
