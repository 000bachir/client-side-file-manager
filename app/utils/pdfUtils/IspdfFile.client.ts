import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import { PDFDocument } from "pdf-lib";


type PdfValidationResult = {
    valid: boolean;
    code?: string | number;
    message: string
}


export async function IsValidPdfFile(file: File): Promise<PdfValidationResult> {

    if (import.meta.server) {
        return {
            valid: false,
            code: "SERVER_RUNTIME",
            message: "Cannot validate PDF on server"
        };
    }

    const buffer = await file.arrayBuffer()
    const bytes = new Uint8Array(buffer);
    const signature = String.fromCharCode(...bytes.slice(0, 5))
    if (signature.startsWith("%PDF-") && file.type === "application/pdf") {
        return {
            valid: true,
            code: "VALID SIGNATURE",
            message: "Valid pdf file"
        }
    } else if (signature !== "%PDF-") {
        return {
            valid: false,
            code: "INVALID SIGNATURE FILE",
            message: "invalid file signature , does not match pdf format"
        }
    } else if (file.type !== "application/pdf") {
        return {
            valid: false,
            code: "INVALID MIME TYPE",
            message: "invalid file type , does not match .pdf format"
        }
    };
    try {
        const pdfDoc = await PDFDocument.load(buffer)
        let countPage = pdfDoc.getPageCount()
        if (countPage > 150) {
            return {
                valid: false,
                code: "TOO_LARGE",
                message: "PDF exceeds 150 pages"
            }
        }
        return {
            valid: true,
            code: "GOOD TO GO",
            message: "File can be accepted"
        }
    } catch (error) {
        throw new Error(`the function could not treat this file successfully check erorr ${error} and the error message `)
    }
};
