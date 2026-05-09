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

export function CanHandlePdf(file : File , pageCount : number){
   const MAX_SIZE_MB = 70;
   const MAX_PAGE : number = 150 ;
   let fileSizeMb = file.size / (1024 * 1024)
   if(fileSizeMb){
    formatFileSize(fileSizeMb)
   }
   const memory = GetDeviceMemory() ?? 4;

   const memoryFactory = Math.min(memory / 4 , 1)
   const adjustMaxPages = Math.floor(MAX_PAGE * memoryFactory)
   const adjustMaxMB = Math.floor(MAX_SIZE_MB * memoryFactory)
   if(fileSizeMb > adjustMaxMB){
    return {
        ok : false , 
        reason : `Too many pages (${pageCount}) Max is ${adjustMaxPages}`
    };
   };

   if(pageCount > adjustMaxPages){
    return {
        ok : false , 
        reason : `Too many pages (${pageCount}). Max: ${adjustMaxPages}`
    }
   }

   return {
    ok : true
   }

}