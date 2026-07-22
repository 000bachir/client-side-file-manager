// need to fix the ui as well 

<script setup lang="ts">
import { IsValidPdfFile } from '~/utils/pdfUtils/IspdfFile.client';
import * as pdfLibJs from "pdfjs-dist/legacy/build/pdf.mjs"
import { CheckBrowserCapacity, CheckDevice } from '~/utils/pdfUtils/CheckBrowser';
import { CheckPdfFileSize } from '~/utils/pdfUtils/CheckfileSize';
import { IsPdfFileEncrypted } from '~/utils/pdfUtils/CheckEncryption.client';
import { runOcrOnPdf, type OcrPageProgress } from '~/utils/pdfUtils/RunOcrOnPdf';
const fileInput = ref<HTMLInputElement | null>(null);
const filename = ref<string>("");
const downloadUrl = ref<string | null>(null)
const isLoading = ref<boolean>(false)

// User-facing status, surfaced in the template below the upload form.
const statusMessage = ref<string>("");
const ocrProgress = ref<OcrPageProgress | null>(null);

function setStatus(message: string) {
    statusMessage.value = message;
    console.log(message);
}

async function analyzePdfTextContent(file: File) {

    // Load the PDF into pdf.js from raw bytes
    const arrayBuffer = await file.arrayBuffer();
    pdfLibJs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/legacy/build/pdf.worker.mjs" , import.meta.url).toString()
    const pdfDoc = await pdfLibJs.getDocument({ data: arrayBuffer }).promise

    // Cap sampling at 15 pages — no need to scan a 500-page doc fully,
    // the first 15 pages give a reliable enough signal
    const pageToSample = Math.min(15, pdfDoc.numPages)
    const results = [];

    for (let i = 1; i <= pageToSample; i++) {
        const page = await pdfDoc.getPage(i)

        // --- TEXT EXTRACTION ---
        // pdf.js returns text as a list of "items" (text spans/runs).
        // We join them all into one string and trim whitespace.
        // If this string is empty or very short → no real text on this page.
        const textContent = await page.getTextContent();
        //@ts-ignore
        let text = textContent.items.map(item => item.str || "").join("").trim();

        // --- IMAGE DETECTION ---
        // pdf.js can give us the raw drawing "operator list" — a low-level list of
        // every render command on the page (draw line, fill rect, paint image, etc.).
        // We scan that list for image-painting operators specifically:
        //   - paintImageXObject     → a normal referenced image (most common)
        //   - paintInlineImageXObject → an image embedded inline in the content stream
        let HasImage: boolean = false
        try {
            const ops = await page.getOperatorList()
            HasImage = ops.fnArray.some(fn =>
                fn === pdfLibJs.OPS.paintImageXObject ||
                fn === pdfLibJs.OPS.paintInlineImageXObject
            )
        } catch (error) {
            // Some pages have malformed or unparseable operator streams — skip gracefully
            console.error(`Operator parsing failed on page ${i}\n`)
        }

        results.push({
            page: i,
            charCount: text.length,
            HasImage,
            // Key heuristic: image present + fewer than 10 characters of real text
            // = this page is almost certainly a scan with no embedded text
            likelyScanned: HasImage && text.length < 10
        })
    }

    // --- FINAL VERDICT ---

    // Count how many sampled pages were flagged as scanned
    const scannedPages = results.filter(r => r.likelyScanned).length
    console.log(`there are : ${scannedPages}`)

    // Ratio: 0.0 = fully digital, 1.0 = fully scanned
    const ScannedRatio = scannedPages / results.length
    console.log(`the ratio of scanned pages is ${ScannedRatio}`)

    return {
        // More than half the pages are scanned → OCR is needed
        needsOcr: ScannedRatio > 0.5,

        // Some pages are scanned, some are digital → mixed document
        // (e.g. a report with scanned appendices)
        isMixed: ScannedRatio > 0 && ScannedRatio < 0.5,

        // At least one page has BOTH an image AND real text → OCR was already applied
        // previously and the text layer was embedded on top of the scan
        isAlreadyOcrd: results.some(r => r.HasImage && r.charCount > 10),

        ScannedRatio,

        // Full per-page breakdown, useful for debugging or showing a detailed report
        details: results
    }
}

function resetState() {
    statusMessage.value = "";
    ocrProgress.value = null;
    if (downloadUrl.value) {
        URL.revokeObjectURL(downloadUrl.value);
    }
    downloadUrl.value = null;
}

async function onFileSelect() {
    resetState();

    const filesUploaded = fileInput.value?.files;
    if (!filesUploaded) {
        setStatus("No files have been uploaded");
        return;
    }
    const file = filesUploaded[0];
    if (!file) return;

    isLoading.value = true;

    try {
        // --- VALIDATION CHAIN: each check stops the whole flow on failure ---

        const validity = await IsValidPdfFile(file);
        if (!validity || !validity.valid) {
            setStatus(validity?.message ?? "This file isn't a valid PDF.");
            return;
        }

        const fileSize = await CheckPdfFileSize(file);
        if (!fileSize || !fileSize.valid) {
            setStatus(fileSize?.message ?? "This file is too large to process.");
            return;
        }

        const isEncrypted = await IsPdfFileEncrypted(file);
        if (isEncrypted) {
            setStatus("This PDF is encrypted/password-protected and can't be processed.");
            return;
        }

        // Mobile devices are explicitly unsupported for this operation — block here.
        const isMobileDevice = await CheckDevice();
        if (isMobileDevice) {
            setStatus("This operation isn't supported on mobile. Please switch to a laptop or desktop.");
            return;
        }

        // CheckBrowserCapacity throws on failure rather than returning false,
        // so a thrown error here is caught by the outer try/catch below.
        await CheckBrowserCapacity();

        // --- OCR NEED DETECTION ---

        setStatus("Analyzing PDF content…");
        const analysis = await analyzePdfTextContent(file);

        if (!analysis.needsOcr && !analysis.isMixed) {
            // Fully digital document — already searchable, nothing to do.
            setStatus("This PDF is already searchable. No OCR needed.");
            const url = URL.createObjectURL(file);
            downloadUrl.value = url;
            filename.value = file.name;
            return;
        }

        if (analysis.isAlreadyOcrd) {
            setStatus("This PDF already appears to have an OCR text layer applied.");
            const url = URL.createObjectURL(file);
            downloadUrl.value = url;
            filename.value = file.name;
            return;
        }

        // --- RUN OCR (needsOcr or isMixed: at least some pages are scanned) ---

        setStatus("This PDF needs OCR to become searchable. Processing…");

        const ocrBlob = await runOcrOnPdf(file, (progress) => {
            ocrProgress.value = progress;
            setStatus(
                `OCR: page ${progress.page}/${progress.totalPages} (${progress.status})`
            );
        });

        const url = URL.createObjectURL(ocrBlob);
        downloadUrl.value = url;
        filename.value = file.name.replace(/\.pdf$/i, "") + "-searchable.pdf";
        setStatus("Done — your searchable PDF is ready to download.");

    } catch (error) {
        console.error(error);
        setStatus(error instanceof Error ? error.message : "Something went wrong while processing this PDF.");
    } finally {
        isLoading.value = false;
        ocrProgress.value = null;
    }
}
</script>

<template>
    <main class="h-auto w-full relative overflow-hidden">

        <main class="h-auto w-full relative overflow-hidden">
            <section class="h-dvh w-full relative grid grid-cols-2">
                <article
                    class="col-span-1 h-full w-full relative overflow-hidden flex flex-col items-center justify-center "
                    id="file_side_operations">
                    <div class="h-full w-full relative overflow-hidden flex items-center justify-center  ">
                        <!--file form input element-->
                        <form action="" class=" h-full w-full flex justify-center flex-col gap-6" method="post"
                            enctype="multipart/form-data">
                            <div class="relative w-[95%] mx-auto flex items-center justify-center flex-col gap-6 ">
                                <label for="input-group-1">
                                    <h1 class="text-heading font-semibold text-xl text-left">Select file</h1>
                                </label>
                                <input type="file" id="input-group-1" @change="onFileSelect" ref="fileInput"
                                    accept="application/pdf"
                                    class="w-full mx-auto p-6  border border-white text-heading text-xl rounded-2xl shadow-2xl focus:ring-brand focus:border-brand  placeholder:text-body hover:bg-green-600">
                            </div>

                            <div v-if="statusMessage" class="w-[95%] mx-auto text-center text-body">
                                <p>{{ statusMessage }}</p>
                                <p v-if="ocrProgress" class="text-sm opacity-75">
                                    Page {{ ocrProgress.page }} / {{ ocrProgress.totalPages }}
                                </p>
                            </div>

                            <div class=" py-4 w-full flex items-center justify-center">
                                <UButton :href="downloadUrl || undefined" tag="a" :loading="isLoading"
                                    :disabled="!downloadUrl || isLoading" :download="filename" variant="outline"
                                    color="success" size="xl" icon="i-lucide-rocket" class="text-xl font-semibold">
                                    Download PDF
                                </UButton>
                            </div>
                        </form>
                    </div>

                </article>
                <div class="col-span-1 h-full w-full relative overflow-hidden flex items-center justify-center flex-col gap-6 bg-amber-300"
                    id="prompt_side_operations">
                </div>
            </section>
        </main>
    </main>
</template>