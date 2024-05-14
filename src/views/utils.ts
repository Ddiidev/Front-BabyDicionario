
export interface ICurrentResolution {
    height: number
    width: number
    documentHeight: number
    documentWidth: number
}

export function getResolution(): ICurrentResolution {
    const height = window.innerHeight;
    const width = window.innerWidth;
    const documentHeight = document.documentElement.clientHeight;
    const documentWidth = document.documentElement.clientWidth;

    return {
        documentHeight,
        documentWidth,
        height,
        width
    }
}

/**
 * Formata o valor de entrada para um formato específico.
 * Pode melhorar.
 *
 * @param input - O valor de entrada a ser formatado
 */
export function formatarValorInput(input: string) {
    // input = input.replace('.', ',');
    if (input === "0," || input === "0.")
        return input;

    const valorFormatado = input.replace(/[^0-9,]/g, '');
    const [parteInteira, parteDecimal] = valorFormatado.split(',');
    let parteInteiraFormatada = parteInteira.replace(/\B(?=(\d{2})+(?!\d))/g, '.');

    if (parteInteiraFormatada.split(".").length > 2) {
        let indexRemoved = 0;
        parteInteiraFormatada = parteInteiraFormatada.split("").filter((c) => {
            if (c === "." && indexRemoved === 0) {
                indexRemoved++;
                return false;
            }
            return true;
        }).join("");
    }

    try {
        if (parteInteiraFormatada[0] == "0" && parteInteiraFormatada.length > 1 && parseInt(parteInteiraFormatada[1]) >= 0)
            parteInteiraFormatada = parteInteiraFormatada.substring(1);
    } catch { }

    const result = parteInteiraFormatada + (parteDecimal ? '.' + parteDecimal : '');

    return ['NaN', '', '0'].includes(result) ? '0.00' : result;
}

/**
  * Converte a data/hora Unix em uma string de data formatada.
  *
  * @param {number} date
*/
export function dateUnixToString(date: number): string {
    const [day, month, year] = new Date(parseInt(date.toString() + '000')).toLocaleDateString().split('/');
    return `${year}-${month}-${day}`
}

/**
 * Converte uma data em string para um timestamp Unix.
 *
 * @param {string} date - A data em string a ser convertida.
 * @return {number} O timestamp Unix correspondente à data de entrada.
 */
export function stringDateToUnix(date: string) {
    const num_date = Date.parse(new Date(`${date} 00:00`).toISOString());
    return parseInt(num_date.toString().substring(0, 9));
}