import { formatFileSize } from "#imports";

interface Memory {
    readonly deviceMemory? : number
}


function GetDeviceMemory() : number | undefined {
    if('deviceMemory' in navigator){
        return(
            navigator as Navigator & {
                deviceMemory : number
            }
        ).deviceMemory
    }
}

export function canHandlePdf(file : File , pageCount : number){
   const MAX_SIZE = 70;
   const MAX_PAGE : number = 150 ;
   let fileSize = file.size / (1024 * 1024)
   if(fileSize){
    formatFileSize(fileSize)
   }
   const memory = GetDeviceMemory() ?? 4;

}