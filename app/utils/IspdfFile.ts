import { PDFDocument } from "pdf-lib";

export const IsPdf = async(file : File)=>{
    const buffer = await file.arrayBuffer()
    const bytes = new Uint8Array(buffer);
    const signature = String.fromCharCode(...bytes)
    if(signature.endsWith("%PDF-")){
        return true
    }
    return false
};