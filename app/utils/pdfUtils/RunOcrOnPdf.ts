import * as pdfLibJs from "pdfjs-dist/legacy/build/pdf.mjs";
import { PDFDocument, rgb } from "pdf-lib";
import { createWorker, type Worker } from "tesseract.js";

export interface OcrPageProgress {
    page: number;
    totalPages: number;
    status: "rendering" | "recognizing" | "embedding" | "done";
}

export type OcrProgressCallback = (progress: OcrPageProgress) => void;

/**
 * Rasterizes a single pdf.js page to a canvas at the given scale.
 * Higher scale = better OCR accuracy but slower recognition + bigger output file.
 */
async function renderPageToCanvas(
    page: pdfLibJs.PDFPageProxy,
    scale: number
): Promise<HTMLCanvasElement> {
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const canvasContext = canvas.getContext("2d");
    if (!canvasContext) {
        throw new Error("Could not acquire 2D canvas context for PDF page rendering");
    }

    // @ts-ignore - pdf.js RenderParameters typing expects its own CanvasRenderingContext2D shape
    await page.render({ canvasContext, viewport }).promise;
    return canvas;
}

/**
 * Runs OCR on a rasterized PDF and rebuilds it as a searchable PDF:
 * each page becomes a background image with an invisible (near-zero-opacity)
 * text layer drawn on top, positioned to match Tesseract's recognized word boxes.
 *
 * NOTE: pdf-lib does not expose the PDF text-rendering-mode operator (Tr 3),
 * which is the "true" way to make text invisible-but-selectable. We approximate
 * this with `opacity: 0`, which renders invisible in standard PDF viewers while
 * remaining part of the text layer for search/copy. This is a known limitation
 * versus dedicated OCR tools like ocrmypdf.
 */
export async function runOcrOnPdf(
    file: File,
    onProgress?: OcrProgressCallback,
    scale: number = 2
): Promise<Blob> {
    const arrayBuffer = await file.arrayBuffer();
    const sourceDoc = await pdfLibJs.getDocument({ data: arrayBuffer }).promise;
    const totalPages = sourceDoc.numPages;

    const outputDoc = await PDFDocument.create();

    const worker: Worker = await createWorker("eng");

    try {
        for (let i = 1; i <= totalPages; i++) {
            onProgress?.({ page: i, totalPages, status: "rendering" });

            const sourcePage = await sourceDoc.getPage(i);
            const canvas = await renderPageToCanvas(sourcePage, scale);
            const imageDataUrl = canvas.toDataURL("image/png");

            onProgress?.({ page: i, totalPages, status: "recognizing" });

            const { data } = await worker.recognize(imageDataUrl , {} , {blocks : true});

            onProgress?.({ page: i, totalPages, status: "embedding" });

            const pngImage = await outputDoc.embedPng(imageDataUrl);
            const pageWidthPt = canvas.width / scale;
            const pageHeightPt = canvas.height / scale;

            const newPage = outputDoc.addPage([pageWidthPt, pageHeightPt]);
            newPage.drawImage(pngImage, {
                x: 0,
                y: 0,
                width: pageWidthPt,
                height: pageHeightPt,
            });

            // Tesseract nests recognition results as blocks -> paragraphs -> lines -> words.
            // Flatten that out to get every word's bounding box in one pass.
            const words = (data.blocks ?? []).flatMap((block) =>
                block.paragraphs.flatMap((paragraph) =>
                    paragraph.lines.flatMap((line) => line.words)
                )
            );

            // Word boxes are in the rasterized canvas's pixel space (scaled by `scale`).
            // Convert back to PDF points and draw each word as near-invisible text so
            // it lines up with the image beneath it and remains selectable/searchable.
            for (const word of words) {
                if (!word.text.trim()) continue;

                const { x0, y0, y1 } = word.bbox;
                const wordHeightPt = (y1 - y0) / scale;
                const xPt = x0 / scale;
                // PDF coordinate origin is bottom-left; canvas/Tesseract origin is top-left.
                const yPt = pageHeightPt - y1 / scale;

                try {
                    newPage.drawText(word.text, {
                        x: xPt,
                        y: yPt,
                        size: Math.max(wordHeightPt, 1),
                        color: rgb(0, 0, 0),
                        opacity: 0.001,
                    });
                } catch (err) {
                    // pdf-lib's default Helvetica font only encodes WinAnsi characters.
                    // Recognized text with unsupported characters (some accented/
                    // special characters, non-Latin scripts) would throw here and
                    // abort the whole page. Skip that single word rather than losing
                    // the OCR pass for the entire document.
                    console.warn(`Skipped embedding word "${word.text}" on page ${i}: unsupported character(s)`);
                }
            }

            onProgress?.({ page: i, totalPages, status: "done" });
        }
    } finally {
        await worker.terminate();
    }

    const outputBytes = await outputDoc.save();
    return new Blob([new Uint8Array(outputBytes)], { type: "application/pdf" });
}