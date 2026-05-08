import { getDocument } from "pdfjs-dist";
import * as pdflibjs from "pdfjs-dist"
import { PDFDocument } from "pdf-lib";
export const IsValidPdfFile = async (file: File) => {
    const buffer = await file.arrayBuffer()
    const bytes = new Uint8Array(buffer);
    const signature = String.fromCharCode(...bytes)
    if (signature.endsWith("%PDF-") && file.type === "application/pdf" ) {
        return [
            "the file is a valid pdf file",
            true
        ]
    }else if(!signature.endsWith("%PDF-")) {
        alert("file signature does correspend to a pdf file ");
        return false
    }else if(file.type !== "application/pdf"){
        alert("invalid pdf file\n")
        return false
    };
    try{
        const pdfDoc = await PDFDocument.load(buffer)
        let countPage = pdfDoc.getPageCount()
        if(countPage > 150){
            alert("pdf file is too large to process the file will be rejected\n")
            return false
        }
    }catch(error){
        throw new Error(`the function could not treat this file successfully check erorr ${error} and the error message `)
    }
};
