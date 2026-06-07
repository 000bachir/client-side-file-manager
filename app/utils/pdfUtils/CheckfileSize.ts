import { PDFDocument } from "pdf-lib";

type PdfValidationResult = {
    valid: boolean;
    code?: string | number;
    message : string
}

const MaxPageCount : number = 150

export const CheckPdfFileSize = async(file : File) : Promise<PdfValidationResult> => {

    const buffer = await file.arrayBuffer()
    try {
        const pdfDoc = await PDFDocument.load(buffer)
        let pageCount : number = pdfDoc.getPageCount()
        if(pageCount > MaxPageCount){
            return{
                valid : false , 
                code : "TOO LARGE",
                message : "pdf file too large unable to proceede"
            }
        }else{
            return{
                valid : true , 
                code : "AMOUNT ACCEPTED",
                message : "file is OK"
            }
        }
    }catch(error){
        throw new Error(`Could not check the pdf file size : ${error}`)
    }

}