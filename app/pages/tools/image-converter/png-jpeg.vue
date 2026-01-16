<!--!PNG TO JPEG-->

<script setup lang="ts">

import { checkingForMissingElement } from '~/utils/CheckElement';

const fileInput = ref<HTMLInputElement | null>(null);
const convertBtn = ref<HTMLButtonElement | null>(null);
const canvas = ref<HTMLCanvasElement | null>(null);
const downloadLink = ref<HTMLAnchorElement | null>(null)
const Message = ref<HTMLHeadingElement | null>(null);
let elements = {
    fileInput, convertBtn, canvas, downloadLink
};


fileInput.value?.addEventListener("change", onFileUpload)


checkingForMissingElement(elements)


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


function checkImageSize(){
    const maxImageAllowed : number = 50 * 1024 *1024
    
}


function showMessageError(message: string, type: any) {
    if (!Message.value) return;
    Message.value.textContent = "";
    Message.value.style = type === 'error' ? 'text-red-500' : 'text-green-500'
}

function loadPngFile(event: Event) {
        let inputFile = event.target as HTMLInputElement
        if (!inputFile.files) return;
        if (!Message.value) return;
        let file = inputFile.files[0];
        Message.value.textContent = "";
    
        if (!file) {
            showMessageError("No file selected please choose a file ", "error")
            return
        };
    
        const reader = new FileReader();
        reader.onload = (event: Event) => {
            let image = new Image();
            image.src = (event.target as FileReader)!.result as string;
            console.log(image)
        }
        reader.onerror = () => {
            showMessageError("Error reading the file. Please try again.", "error");
            return
        }
        reader.readAsDataURL(file);
}

async function onFileUpload() {

    const files = fileInput.value?.files; 
    if(!files || files.length === 0) return;
    let file = files[0];
    if(!file) return;

    if(!allowedFileExtensionAndMime(file)) return;



}

</script>
<template>
    <main class="h-auto w-full relative overflow-hidden">
        <section class="h-dvh w-full flex items-center justify-center flex-col">
            <input @change="onFileUpload" type="file" accept="image/png" ref="fileInput"
                class="w-[90%] px-2 py-2.5  border border-white text-heading text-md rounded-2xl shadow-2xl focus:ring-brand focus:border-brand  placeholder:text-body">
            <UButton id="convertBtn" ref="convertBtn" color="warning" variant="soft" size="xl" disabled>Convert to JPEG
            </UButton>
            <canvas class="hidden" ref="canvas"></canvas>
            <p id="meassage" ref="Message"></p>
        </section>
    </main>
</template>