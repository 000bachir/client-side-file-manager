const pdflibjs = await import("pdfjs-dist")
import workerUrl from "pdfjs-dist/build/pdf.worker.mjs?url"

pdflibjs.GlobalWorkerOptions.workerSrc = workerUrl;

export async function IsPdfFileEncrypted(file : File) : Promise<any>{
    if(import.meta.server){
        return false
    }
    let pdfFile =  await file.arrayBuffer()
    if(!pdfFile){
        return false
    }; 
    try{
        let loadingTask = pdflibjs.getDocument({data : pdfFile});
        return new Promise((resolve)=>{
            loadingTask.onPassword = (upadatePassword : any ,reason : any) =>{
                resolve(reason === pdflibjs.PasswordResponses.NEED_PASSWORD)
            }
            loadingTask.promise.then(()=>{
                resolve(false)
                alert("file is not encrypted\n")
            }).catch(()=>{
                resolve(true)
                alert("file is encrypted\n")
            })
        })

    }catch (error){
        console.error(`the function crashed with prior reason : ${error}\n`);
    }
    
}