<script setup lang="ts">
import { degrees, error, PDFDocument, PDFFont, rgb, StandardFonts } from 'pdf-lib';
const fileInput = ref<HTMLInputElement | null>(null);
const filename = ref<string>("")
const downloadUrl = ref<string | null>(null)
const isLoading = ref<boolean>(false)
const prompt = ref<string>("")
async function isPdf(file: File) {
    const buffer = await file.slice(0, 16).arrayBuffer()
    const bytes = new Uint8Array(buffer)
    const signature = String.fromCharCode(...bytes)

    if (signature.startsWith('%PDF-')) {
        return true
    }
    return false
}
async function addWaterMarkText(file: File, waterMarkText?: string | any) {
    const bytes = await file.arrayBuffer()
    if (!bytes) return;
    const pdfDoc = await PDFDocument.load(bytes)
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const pages = pdfDoc.getPages()

    for (let page of pages) {
        let { width, height } = page.getSize()
        page.drawText(waterMarkText || "This text has been added programmatically", {
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
        if (!prompt.value.trim()) {
            alert("Please enter the text first to operate")
            return
        }
        let modifiedBytes = await addWaterMarkText(file, prompt.value)
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
};



</script>
<template>

    <main class="h-auto w-full relative overflow-hidden">
        <section class="h-dvh w-full relative grid grid-cols-2 ">
            <article class="col-span-1 h-full w-full relative overflow-hidden grid grid-rows-2"
                id="file_side_operations">
                <div class="h-full w-full relative flex items-center justify-center row-span-1  ">
                    <!--text form input element-->
                    <form action="" method="post" enctype="multipart/form-data"
                        class="h-full w-[95%] mx-auto relative overflow-hidden flex  justify-center flex-col gap-6">
                        <label for="enter text" class="font-semibold text-xl text-left">Enter water mark text</label>
                        <input type="text" name="" id="" v-model="prompt"
                            class="font-semibold text-xl p-6 w-full relative overflow-hidden  border border-gray-500 hover:border-gray-200 rounded-2xl shadow-box focus:bg-amber-50 focus:text-black transition-all"
                            placeholder="Please enter wanted text">
                    </form>
                </div>

                <div
                    class=" row-span-1 h-full w-full relative overflow-hidden flex items-center justify-center">

                    <!--file form input element-->
                    <form action="" class=" h-full w-full flex  justify-start flex-col gap-6" method="post"
                        enctype="multipart/form-data">
                        <div class="relative w-[95%] mx-auto flex items-center justify-center flex-col gap-6 ">
                            <label for="input-group-1" class="text-heading font-semibold text-xl text-left">
                                Select file</label>
                            <input type="file" id="input-group-1" @change="onFileSelect" ref="fileInput"
                                accept="application/pdf"
                                class="w-full mx-auto p-6  border border-white text-heading text-xl rounded-2xl shadow-2xl focus:ring-brand focus:border-brand  placeholder:text-body hover:bg-green-600">
                        </div>
                        <div class=" py-4 w-full flex items-center justify-center">

                            <UButton :href="downloadUrl || undefined" tag="a" :loading="isLoading"
                                :disabled="!downloadUrl || isLoading" :download="filename" variant="outline" color="success"
                                size="xl" icon="i-lucide-rocket" class="text-xl font-semibold">
                                Download PDF
                            </UButton>
                        </div>
                    </form>
                </div>

            </article>
            <div class="col-span-1 h-full w-full relative overflow-hidden flex items-center justify-center flex-col gap-6"
                id="prompt_side_operations">

            </div>
        </section>
    </main>
</template>


<style></style>