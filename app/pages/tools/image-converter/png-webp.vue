<!--! png to webp -->
<script setup lang="ts">
const inputElement = ref<HTMLInputElement | null>(null);
const canvas = ref<HTMLCanvasElement | null>(null);

const filename = ref<string>("image-converted.webp")
const downloadUrl = ref<string | null>(null)

//utils 
import { validateMessage } from '~/utils/validateMessage';

function loadImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        let image = new Image();
        let objectUrl = URL.createObjectURL(file)

        image.onload = () => {
            URL.revokeObjectURL(objectUrl)
            resolve(image)
        }

        image.onerror = () => {
            URL.revokeObjectURL(objectUrl)
            reject(image)
        }
        image.src = objectUrl

    })
}

function convertCanvasToWebp(canvas: HTMLCanvasElement): Promise<Blob> {
    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (!blob) {
                reject(new Error("error webp conversion failed\n"))
                return
            }
            resolve(blob)
        }, 'image/webp', 0.8)
    })
}


async function onFileUpload() {
    const fileInput = inputElement.value?.files;
    if (!fileInput) return;
    let file = fileInput[0];
    if (!file) return;

    if (file.type !== "image/png") {
        validateMessage("please select a valid png file")
        return
    }

    try {
        const image = await loadImage(file)
        if (!image) return;

        const Canvas = canvas.value
        if (!Canvas) return
        const canvasContext = Canvas.getContext("2d")


        Canvas.width = image.naturalWidth;

        Canvas.height = image.naturalHeight;

        canvasContext?.fillRect(0, 0, Canvas.width, Canvas.height)
        canvasContext?.drawImage(image, 0, 0)
        const webpBlob = await convertCanvasToWebp(Canvas)

        if (downloadUrl.value) {
            URL.revokeObjectURL(downloadUrl.value)
        }
        downloadUrl.value = URL.createObjectURL(webpBlob)
        filename.value = file.name.replace(/\.png$/i, ".webp")


    } catch (error) {
        console.error("error the file upload did not proceede correctly\n")
        validateMessage("conversion failed")
    }

}

</script>

<template>
    <main class="h-auto w-full relative">
        <section class="h-dvh w-full relative overflow-hidden grid grid-cols-2">
            <div class="col-span-1 w-full h-full overflow-hidden" id="input_field">
                <form action="" method="post"
                    class="h-full w-[95%] mx-auto relative flex flex-col items-center justify-center">
                    <input ref="inputElement" type="file" accept="image/*"
                        class="border border-amber-50 p-8 rounded-3xl shadow-2xl" @change="onFileUpload">
                    <canvas class="hidden" ref="canvas"></canvas>
                    <UButton v-if="downloadUrl" :to="downloadUrl" :download="filename" variant="outline" color="success"
                        size="xl" icon="i-lucide-rocket" class="flex items-center justify-center">
                        Download WEBP
                    </UButton>
                </form>
            </div>
            <div class="" id=""></div>
        </section>
    </main>
</template>