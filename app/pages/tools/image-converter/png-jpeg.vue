<!--!PNG TO JPEG-->

<script setup lang="ts">
import { GetExtension, IsImage } from "~/utils/GetExtension";
import { formatFileSize } from "~/utils/formatFileSize";



const inputElement = ref<HTMLInputElement | null>(null);
const canvas = ref<HTMLCanvasElement | null>(null);
const downloadLink = ref<HTMLAnchorElement | null>(null);
const canvasContext = canvas.value?.getContext("2d");

defineExpose({
    downloadLink
})
inputElement.value?.addEventListener("change", onFileUpload)

function validationMessage(message: string) {
    return alert(message)
};


function loadImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const image = new Image();
        const objectUrl: string = URL.createObjectURL(file);
        image.onload = () => {
            URL.revokeObjectURL(objectUrl);
            resolve(image)

        }

        image.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            reject(
                new Error("failed to load image , ensure it a png file\n")
            )
        }
        image.src = objectUrl;
    })
}

function convertCanvasToJpeg() {
    const jpegDataUrl = canvas.value?.toDataURL('image/jpeg', 0.9);
    if (downloadLink.value) {
        downloadLink.value.href = jpegDataUrl ?? ''
        downloadLink.value.download = 'image.jpg'
        downloadLink.value.click()
    }

}

async function onFileUpload() {
    const files = inputElement.value?.files
    if (!files) return;
    const file = files[0];
    if (!file) return;
    console.log(`file name : ${file.name} it's size ${formatFileSize(file.size)} and it's extension : ${GetExtension(file)}`);
    console.log(IsImage(file))
    if (!IsImage(file)) {
        validationMessage("ALERT , please choose a valid png file\n")
    }

    try {
        const image = await loadImage(file);
        if (!image) return;
        if (!canvas.value) return;
        let canvasWidth = canvas.value.width;
        let canvasHeight = canvas.value.height;
        canvasWidth = image.naturalWidth;
        canvasHeight = image.naturalHeight;
        if (!canvasContext) return;
        canvasContext.fillStyle = 'white';
        canvasContext.fillRect(0, 0, canvasWidth, canvasHeight);
        canvasContext.drawImage(image, 0, 0);

        convertCanvasToJpeg()
    }
    catch (error) {
        throw new Error(`error could not load image properly : ${error}`)
    }
}
</script>

<template>
    <main class="h-auto w-full relative overflow-hidden">
        <section class="h-dvh w-full relative overflow-hidden grid grid-cols-2">
            <div id="input_col" class="h-full w-full relative overflow-hidden ">
                <form action="" method="post" class="h-full w-[95%] mx-auto flex flex-col items-center justify-center">
                    <input ref="inputElement" type="file" accept="image/*"
                        class="border border-amber-50 p-8 rounded-3xl shadow-2xl" @change="onFileUpload">
                    <canvas class="hidden" ref="canvas"></canvas>
                    <a id="downloadLink" ref="downloadLink" style="display: none;">Download JPEG</a>

                </form>
            </div>
            <div id="text_col" class=""></div>
        </section>
    </main>
</template>

<style>
input[type="file"]::file-selector-button {
    content: none;
}
</style>