<!--!PNG TO JPEG-->

<script setup lang="ts">

import { error, pricingPlan } from '#build/ui';
import { checkingForMissingElement } from '~/utils/CheckElement';
import { formatFileSize } from '~/utils/formatFileSize';

const fileInput = ref<HTMLInputElement | null>(null); // the file input
const convertBtn = ref<HTMLButtonElement | null>(null); // the convert btn to start
const canvas = ref<HTMLCanvasElement | null>(null);
const downloadLink = ref<HTMLAnchorElement | null>(null) // download link
const Message = ref<HTMLHeadingElement | null>(null);


/**
 * ? event listeners
 */

fileInput.value?.addEventListener("change", onFileUpload)



function allowedFileExtensionAndMime(file: File) {
    try {
        let allowedExtensions = /^.*\.png$/i;// extension allowed
        if (!allowedExtensions.test(file.name)) {
            console.error("error the file type uploaded is not supported\n")
            return
        }
        let allowedFileMimeType = ['image/jpeg', 'image/jpg', 'image/png']; // mime type allowed
        if (!allowedFileMimeType.includes(file.type)) {
            console.error("error the file mime type is not accepted nor supported\n")
            return
        }

        if (file.size < 100) {
            console.error("file too small for being a png file\n")
            return false;
        };

        return file.size <= 20 * 1024 * 1024;
    } catch (error) {
        throw new Error(`error the function that check the allowed file type and mime just crashed see error : ${error}`)
    }
}
function checkImageSize(file: File): boolean {
    const maxImageAllowed: number = 50 * 1024 * 1024
    if (file.size > maxImageAllowed) {
        alert("the file uploaded exceed the amount authorized\n")
        return false
    } else {
        console.log("file is in range\n")
        return true
    }
}


function showMessageError(message: string, type: any) {
    if (!Message.value) return;
    Message.value.textContent = "";
    Message.value.style = type === 'error' ? 'text-red-500' : 'text-green-500'
}

function convertCanvasToJpeg() {
    const jpegDataUrl = canvas.value?.toDataURL("image/jpeg", 0.9);
    if (!downloadLink.value) return;
    if (downloadLink.value instanceof HTMLAnchorElement) {
        downloadLink.value.href = jpegDataUrl;
    }
    downloadLink.value.download = "converted-image.jpeg";
    downloadLink.value.style = "block"
}


function loadImage(file: File) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        const Url = URL.createObjectURL(file); // temporary url

        image.onload = () => {
            URL.revokeObjectURL(Url)
            resolve(image)
        }

        image.onerror = () => {
            URL.revokeObjectURL(Url)
            reject(
                new Error("error")
            )
        }
        image.src = Url;

    })
}

function onFileUpload() {
    convertBtn.value?.addEventListener("click", async () => {
        let files = fileInput.value?.files
        if (!files) return;
        let file = files[0]
        if (!file) return;

        try {
            const image = await loadImage(file) as HTMLImageElement;
            if (!canvas.value) return;
            canvas.value.width = image.naturalWidth;
            canvas.value.height = image.naturalHeight;

            const context = canvas.value.getContext("2d");
            if (!context) return;
            context.fillStyle = "white";
            context.fillRect(0, 0, canvas.value.width, canvas.value.height);
            context.drawImage(image, 0, 0)
        } catch (error) {
            console.error(`error ${error}`)
        }
    })
}

</script>
<template>
    <main class="h-auto w-full relative overflow-hidden">
        <section class="h-dvh w-full flex items-center justify-center flex-col">
            <input @change="onFileUpload" type="file" accept="image/png" ref="fileInput"
                class="w-[90%] px-2 py-2.5  border border-white text-heading text-md rounded-2xl shadow-2xl focus:ring-brand focus:border-brand  placeholder:text-body">
            // <button id="convertBtn" ref="convertBtn" class="bg-red-600 p-8 cursor-pointer" disabled>Convert to JPEG
                // </button>
            <canvas class="hidden" ref="canvas"></canvas>
            <a id="downloadLink" ref="downloadLink" class="hidden">Download JPEG</a>
            <p id="meassage" ref="Message"></p>
        </section>
    </main>
</template>