export function formatFileSize(bytes : number):string{
    if(bytes === 0){
        return "0B"
    }

    let kilo : number = 1024;
    let sizes : string[] = ["B", "KB", "MB", "GB", "TB"] ; 
    let index : number = Math.floor(Math.log2(bytes) / Math.log(kilo))
    return parseFloat((bytes / Math.pow(kilo , index)).toFixed(1)) + " " + sizes[index]
}


export function CheckFileSize(file : File){
    if(!file)return ;

    if(file.size){
        return console.log(`file size is : ${file.size}`)
    }
}