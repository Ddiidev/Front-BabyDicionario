
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