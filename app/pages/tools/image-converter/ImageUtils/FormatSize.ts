export function FormatSize(bytes : number){
    if(bytes < 1024 * 1024){
        return `${Math.round(bytes / 1024)} KB`
    }else {
        return `${Math.round(bytes / 1024 * 1024).toFixed(1)} MB`
    }
}