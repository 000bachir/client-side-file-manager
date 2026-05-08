export function GetExtension(file: File) {
    let parts = file.name.split(".");
    return parts[parts.length - 1];
}

export function IsImage(file: File) : boolean {
    let extension = GetExtension(file)
    switch (extension?.toLowerCase()) {
        case 'jpg':
        case 'gif':
        case 'bmp':
        case 'png':
        return true
    }
    return false
}