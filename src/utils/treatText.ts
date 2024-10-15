// Função para remover acentos, caracteres especiais e espaços
export function removeSpecialCharacters(str: string): string {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove acentos
        .replace(/[^a-zA-Z0-9]/g, ''); // Remove caracteres especiais e espaços
}