export function loadImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        let image = new Image();
        let objectUrl = URL.createObjectURL(file)

        image.onload = () => {
            URL.revokeObjectURL(objectUrl)
            resolve(image)
        }

        image.onerror = () => {
            URL.revokeObjectURL(objectUrl)
            reject(new Error("Failed to load image. The file might be corrupt."));
        }
        image.src = objectUrl

    })
}