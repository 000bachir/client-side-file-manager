const pdflibjs = await import("pdfjs-dist")
export const IsPdfFileEncrypted = async(file : File) =>{
    if(import.meta.server){
        return false
    }
    let pdfFile =  await file.arrayBuffer()
    if(!pdfFile) return; 
    try{
        let loadingTask = pdflibjs.getDocument({data : pdfFile});
        return new Promise((resolve)=>{
            loadingTask.onPassword = (reason : any , upadatePassword : any) =>{
                resolve(reason === pdflibjs.PasswordResponses.NEED_PASSWORD)
            }
            loadingTask.promise.then(()=>{
                resolve(true)
                alert("file is not encrypted\n")
            }).catch(()=>{
                resolve(false)
                alert("file is encrypted\n")
            })
        })

    }catch (error){
        console.error(`the function crashed with prior reason : ${error}\n`);
    }
    
}