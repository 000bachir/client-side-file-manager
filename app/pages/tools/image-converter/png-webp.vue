<!--! png to webp -->
<script setup lang="ts">
const inputElement = ref<HTMLInputElement | null>(null);
const canvas = ref<HTMLCanvasElement | null>(null);

const filename = ref<string>("image-converted.webp")
const downloadUrl = ref<string | null>(null)

//utils 
import { validateMessage } from '~/utils/validateMessage';
import { LoadImage } from './ImageUtils/loadImage';
import type { Result } from './ImageUtils/Results';
import DropZone from '../components/DropZone.vue';
import { FormatSize } from './ImageUtils/FormatSize';

const results = ref<Result[]>([]);
let nextId: number = 0;


async function convertCanvasToWebp(file: File): Promise<Blob> {

    // 1. Load the uploaded image
    const image = await LoadImage(file);

    // 2. Check whether the image has valid dimensions
    if (!image.naturalHeight || !image.naturalWidth) {
        throw new Error("Image has no dimensions");
    }

    // 3. Create a new canvas element
    const canvas = document.createElement("canvas");

    // 4. Set the canvas dimensions to match the original image
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;

    // 5. Get the canvas 2D rendering context
    const context = canvas.getContext("2d");

    // 6. Make sure the 2D context exists
    if (!context) {
        throw new Error("Canvas does not possess a 2D context");
    }

    // 7. Draw the loaded image onto the canvas
    context.drawImage(image, 0, 0);

    // 8. Convert the canvas content into a WebP Blob
    return new Promise((resolve, reject) => {

        canvas.toBlob((blob) => {

            // 9. Check whether the conversion was successful
            if (!blob) {
                reject(new Error("WebP conversion failed"));
                return;
            }

            // 10. Return the converted WebP Blob
            resolve(blob);

        }, "image/webp", 0.8); // 80% quality

    });
}


async function onAdd(files: File[]) {
    for (const file of files) {
        const item = reactive<Result>({
            id: nextId++,
            name: file.name.replace(/\.[^.]+$/, '') + '.webp',
            status: 'converting',
            originalSize: file.size
        })
        results.value.push(item)

        try {
            const blob = await convertCanvasToWebp(file);
            item.url = URL.createObjectURL(blob);
            item.newSize = blob.size;
            item.status = "done"
        } catch (error) {
            console.error(error)
            item.status = "error"
        }
    }
}
function downloadAll() {
    results.value.filter(result => result.status === "done" && result.url).forEach((result, index) => {
        setTimeout(() => {
            const a = document.createElement("a")
            a.href = result.url!,
                a.download = result.name,
                a.click()
        }, index * 200)
    })
}
function onClear() {
    //@ts-ignore
    results.value.forEach(r => URL.revokeObjectURL(r.url));
    results.value = [];
}
onBeforeMount(onClear);
const doneCount = computed(() => results.value.filter(r => r.status === 'done').length)

</script>

<template>
    <main class="h-auto w-full relative overflow-hidden flex flex-col items-center justify-center gap-2">
        <div id="drop-zone-container"
            class="h-auto w-[95%] mx-auto relative overflow-hidden p-8  flex items-center justify-center">
            <DropZone @add="onAdd" @clear="onClear" />
        </div>
        <div id="slider-range-container"
            class="h-auto w-[95%] mx-auto relative overflow-hidden p-8 flex items-center justify-center flex-col">

            <ul v-if="results.length" class="results  w-full h-auto relative overflow-hidden py-8 px-9">
                <li v-for="r in results" :key="r.id"
                    class="result-row h-full w-full relative overflow-hidden py-4 px-5 flex flex-col items-center justify-center gap-3">
                    <span class="result-name font-semibold text-sm">{{ r.name }}</span><br>
                    <span v-if="r.status === 'converting'" class="spinner" aria-label="Converting" />
                    <template v-else-if="r.status === 'done'">
                        <span class="result-size text-lg font-semibold text-center ">From :{{ FormatSize(r.originalSize)
                        }} → To: {{
                                FormatSize(r.newSize!) }}</span><br>
                        <a class="btn" id="btn-1" :href="r.url" :download="r.name">Download</a>
                    </template>

                    <span v-else class="result-error ">Failed to convert</span>
                </li>
            </ul>

            <button label="Download all" v-if="doneCount > 1" class="btn download-all" @click="downloadAll">
                ({{ doneCount }})
            </button>

        </div>

    </main>
</template>
<style>
.drop-zone {
    height: 600px;
    aspect-ratio: 1;

    display: flex;
    align-items: center;
    justify-content: center;
}
</style>