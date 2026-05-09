<script setup lang="ts">
import { GetExtension } from '~/utils/ImageUtils/GetExtension';
import { IsValidPdfFile } from '~/utils/pdfUtils/IspdfFile.client';
import { CanHandlePdf } from '~/utils/hardwareUtils/HardwareCapacity';

import {
    getDocument, GlobalWorkerOptions
} from "pdfjs-dist/legacy/build/pdf.mjs"
import * as pdfLibJs from "pdfjs-dist/legacy/build/pdf.mjs"


const fileInput = ref<HTMLInputElement | null>(null);
const filename = ref<string>("");
const downloadUrl = ref<string | null>(null)
const isLoading = ref<boolean>(false)


async function analyzePdfTextContent(file: File) {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await pdfLibJs.getDocument({
        data: arrayBuffer
    }).promise

    const pageToSample = Math.min(15, pdfDoc.numPages)
    const results = [];
    for (let i = 1; i <= pageToSample; i++) {

        const page = await pdfDoc.getPage(i)

        const textContent = await page.getTextContent();

        let text = textContent.items.map(item => item.str || "").join("").trim();
        
        let HasImage : boolean = false
        try {
            const ops = await page.getOperatorList()
            HasImage = ops.fnArray.some(fn =>
                fn === pdfLibJs.OPS.paintImageXObject || 
                fn === pdfLibJs.OPS.paintInlineImageXObject
            )
        }catch(error){
            console.error(`Operator parsing failed on page ${i}\n`)
        }

        results.push({
            page: i,
            charCount: text.length,
            HasImage,
            likelyScanned: HasImage && text.length < 10
        })
    }
    const scannedPages = results.filter(r => r.likelyScanned).length
    console.log(`there are : ${scannedPages}`)
    const ScannedRatio = scannedPages / results.length
    console.log(`the ratio of scanned pages is ${ScannedRatio}`)


    return {
        needsOcr : ScannedRatio > 0.5,
        isMixed : ScannedRatio > 0 && ScannedRatio < 0.5,
        isAlreadyOcrd : results.some(r => r.HasImage && r.charCount > 10),
        ScannedRatio,
        details : results
    }

}




async function onFileSelect() {
    const filesUploaded = fileInput.value?.files; 
    if(!filesUploaded){
        validateMessage("No files have been uploaded\n")
        return;
    }

    let file = filesUploaded[0]
    if(!file)return;

    const validFile = await IsValidPdfFile(file)
    if(!validFile.valid){
        alert(validFile.message)
    }else{
        alert(validFile.message)
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