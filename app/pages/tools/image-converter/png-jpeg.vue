<script setup lang="ts">

import { checkingForMissingElement } from '~/utils/CheckElement';

const fileInput = ref<HTMLInputElement | null>(null);
const convertBtn = ref<HTMLButtonElement | null>(null);
const canvas = ref<HTMLCanvasElement | null>(null);
const downloadLink = ref<HTMLAnchorElement | null>(null)


let elements = {
    fileInput, convertBtn, canvas, downloadLink
}


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
        return file
    } catch (error) {
        throw new Error(`error the function that check the allowed file type and mime just crashed see error : ${error}`)
    }
}

function loadImage(file : File){
    try {
        return new Promise((resolve , reject)=>{
            const image =  new Image();
            const objectUrl = URL.createObjectURL(file)

            image.onload = () =>{
                URL.revokeObjectURL(objectUrl) // clean up the temporary url
                resolve(image)
            }

            image.onerror = () =>{
                URL.revokeObjectURL(objectUrl)
                reject(new Error(
                    "failed to load the image please ensure it is a png image"
                ))
            }
        })
    }catch (error){
        console.error(
            `error the loadImage function crashed please see error : ${error}\n`
        )
    }
}


function convertCanvasToJpeg(){
    let jpegToURL = canvas.value?.toDataURL('image/jpeg',0.9)

    // updating the link with the jpeg
    if(downloadLink.value){
        downloadLink.value.href = jpegToURL
    }

}


function onFileUpload(event?: any) {
    if (event.target.files.length > 0) {
        if (convertBtn.value) convertBtn.value.disabled = false;
    } else {
        if (convertBtn.value) convertBtn.value.disabled = true;
    }
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
            <a id="downloadLink" ref="downloadLink" style="display: none;">Download JPEG</a>

        </section>
    </main>
</template>