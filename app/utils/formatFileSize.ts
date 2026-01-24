export function formatFileSize(bytes : number) : string | number{
    if(bytes === 0){
        return "0 B"
    }

    let kilo : number = 1024;
    let sizes : string[] = ["B", "KB", "MB", "GB", "TB"] ; 
    let index : number = Math.floor(Math.log(bytes)) / Math.log(kilo)
    return parseFloat((bytes / Math.pow(kilo , index)).toFixed(1)) + " " + sizes[index]
}