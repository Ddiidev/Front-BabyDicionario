export function DateNow(): string {
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);
    return today.toISOString();
}

export function calculateAge(birthDate: Date): number {
    const currDate = new Date();
    let age = currDate.getFullYear() - birthDate.getFullYear();
    let months = currDate.getMonth() - birthDate.getMonth();

    if (months < 0 || (months === 0 && currDate.getDate() < birthDate.getDate())) {
        age--;
        months = 12 - Math.abs(months);
    }

    const result = age + months * 0.01;

    return formatResult(result);
}

function formatResult(result: number): number {
    if (result <= 0) {
        return 0;
    } else if (result <= 0.12) {
        return Number('-' + result.toFixed(2));
    } else if (result <= 1.00) {
        const resultN = Math.abs(Math.ceil(result * 100) / 100) * 0.12;
        if (resultN == 0.12) {
            return 1;
        }
        return Number('-' + resultN.toFixed(2));
    }
    return Number(result.toFixed(2)); // Para valores acima de 1
}