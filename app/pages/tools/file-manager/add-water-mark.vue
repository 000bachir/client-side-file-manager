<!--
this script wil allow user to add water mark on top 
TODO: let the user upload a pdf file === done 
TODO : wrap in a blob to allow the download === done 
TODO : the button stays in the ui just not clickable until the process is done 
TODO : find a way to let the user type in the text that he wants 

-->



<script setup lang="ts">
import { degrees, error, PDFDocument, PDFFont, rgb, StandardFonts } from 'pdf-lib';





const fileInput = ref<HTMLInputElement | null>(null);
const filename = ref<string>("")
const downloadUrl = ref<string | null>(null)
const isLoading = ref<boolean>(false)
const prompt = ref<string>("Enter text here :")
async function isPdf(file: File) {
    const buffer = await file.slice(0, 16).arrayBuffer()
    const bytes = new Uint8Array(buffer)
    const signature = String.fromCharCode(...bytes)

    if (signature.startsWith('%PDF-')) {
        return true
    }
    return false
}

async function addWaterMark(file: File) {
    const bytes = await file.arrayBuffer()
    if (!bytes) return;
    const pdfDoc = await PDFDocument.load(bytes)
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const pages = pdfDoc.getPages()

    for (let page of pages) {

        let { width, height } = page.getSize()

        page.drawText("this text has been added ", {
            x: width / 2,
            y: height / 2,
            opacity: 0.3,
            font: font,
            color: rgb(0, 0.1, 0.1),
            rotate: degrees(-45)

        })
    }


    return await pdfDoc.save()
}


async function onFileSelect() {
    const filesUploaded = fileInput.value?.files
    if (!filesUploaded) return
    let file = filesUploaded[0]
    if (!file) return
    try {
        const valid = await isPdf(file)
        isLoading.value = true
        if (!valid) {
            alert("wrong file")
            return
        } else {
            alert("valid pdf")
        }
        let modifiedBytes = await addWaterMark(file)
        if (!modifiedBytes) return;

        const buffer = modifiedBytes.buffer.slice(
            modifiedBytes.byteOffset,
            modifiedBytes.byteOffset + modifiedBytes.byteLength
        )
        const blob = new Blob([buffer as any], { type: "application/pdf" })
        downloadUrl.value = URL.createObjectURL(blob)
        filename.value = "modified.pdf"
    } catch (error) {
        throw new Error(`could not resolve the water mark adding check error ${error}`)
    } finally {
        isLoading.value = false
    }

}

function submit() {
    console.log("user prompt is : " ,prompt.value)
}


</script>
<template>

    <main class="h-auto w-full relative overflow-hidden">
        <section class="h-dvh w-full relative grid grid-cols-2 ">
            <div class="col-span-1 h-full w-full relative overflow-hidden" id="file_side_operations">

                <form action="" class=" h-full w-full flex items-center justify-center flex-col gap-6" method="post"
                    enctype="multipart/form-data">
                    <label for="input-group-1" class="block mb-2.5 text-sm font-medium text-heading">
                        Select file</label>
                    <div class="relative w-full  flex items-center justify-center">
                        <input type="file" id="input-group-1" @change="onFileSelect" ref="fileInput"
                            accept="application/pdf"
                            class="w-[90%] px-2 py-2.5  border border-white text-heading text-md rounded-2xl shadow-2xl focus:ring-brand focus:border-brand  placeholder:text-body">
                    </div>
                    <UButton :href="downloadUrl || undefined" tag="a" :loading="isLoading"
                        :disabled="!downloadUrl || isLoading" :download="filename" variant="outline" color="success"
                        size="xl" icon="i-lucide-rocket" class="flex items-center justify-center">
                        Download PDF
                    </UButton>
                </form>
            </div>
            <div class="col-span-1 h-full w-full relative overflow-hidden flex items-center justify-center flex-col gap-6" id="prompt_side_operations">
                <UForm @submit="submit">
                    <UFormField label="Your text">
                        <UInput v-model="prompt" />
                        <UButton type="submit">Send</UButton>
                    </UFormField>
                </UForm>

            </div>


        </section>
    </main>
</template>