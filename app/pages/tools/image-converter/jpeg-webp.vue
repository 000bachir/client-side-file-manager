<script setup lang="ts">
const inputElement = ref<HTMLInputElement | null>(null);
const canvas = ref<HTMLCanvasElement | null>(null);

const filename = ref<string>("image-converted.webp")
const downloadUrl = ref<string | null>(null)

// utils 
import { loadImage } from '~/utils/loadImage';
import { validateMessage } from '~/utils/validateMessage';

function convertJpegToWebp(canvas: HTMLCanvasElement): Promise<Blob> {
    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (!blob) {
                reject(new Error("conversion to webp failed\n"))
                return
            }
            resolve(blob)
        }, "image/webp", 0.8)
    })
}

async function onFileUpload() {
    let inputFiles = inputElement.value?.files;
    if (!inputFiles) return;

    let file = inputFiles[0]
    if (!file) return;

    if (file.type !== "image/jpeg") {
        validateMessage("please select a valid jpeg file")
        return
    }

    try {
        let image = await loadImage(file)
        let Canvas = canvas.value
        if (!Canvas) return

        Canvas.width = image.naturalWidth;
        Canvas.height = image.naturalHeight;

        let CanvasContext = canvas.value?.getContext("2d")
        if (!CanvasContext) return

        CanvasContext.fillRect(0, 0, Canvas.width, Canvas.height)
        CanvasContext.drawImage(image, 0, 0)

        const webpBlob = await convertJpegToWebp(Canvas)
        if (downloadUrl.value) {
            URL.revokeObjectURL(downloadUrl.value)
        }
        downloadUrl.value = URL.createObjectURL(webpBlob)
        filename.value = file.name.replace(/\.jpeg$/i, ".webp")
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