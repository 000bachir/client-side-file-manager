<script setup lang="ts">
import { ref } from 'vue';
const fileInput = ref<HTMLInputElement | null>(null);
const filename = ref<HTMLAnchorElement | null | string>(null);
const downloadUrl = ref<string | null>(null); // New ref for the actual URL string
const limitPixeslAllowed: number = 16_000_000;

fileInput.value?.addEventListener("change", onFileSelect)

function allowedFileExtensionAndMime(file: File) {
    try {
        let allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i; // extension allowed
        if (!allowedExtensions.test(file.name)) {
            console.error("error the file type uploaded is not supported\n")
            return
        }
        let allowedFileMimeType = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']; // mime type allowed
        if (!allowedFileMimeType.includes(file.type)) {
            console.error("error the file mime type is not accepted nor supported\n")
            return
        }
        return file
    } catch (error) {
        throw new Error(`error the function that check the allowed file type and mime just crashed see error : ${error}`)
    }
}

function checkImageFileSize(file: File): boolean {
    if (file.size > limitPixeslAllowed) {
        alert("the file uploaded exceed the amout accepted\n")
        return false
    } else {
        console.log("file in range of acceptance\n")
        return true
    }
}


async function JPGtoPNG(file: File): Promise<Blob> {
    let bitmapImage = await createImageBitmap(file)
    let canvas = document.createElement("canvas")
    canvas.width = bitmapImage.width
    canvas.height = bitmapImage.height

    let conxtext = canvas.getContext("2d")
    conxtext?.drawImage(bitmapImage, 0, 0);
    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (!blob) {
                reject(new Error("blob is missing"))
                return
            }

            resolve(blob)
        }, 'image/png')
    })

}

async function onFileSelect() {
    const files = fileInput.value?.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file) {

        // validate
        if (!allowedFileExtensionAndMime(file)) return;
        if (!checkImageFileSize(file)) return;

        // convert 
        let outputBlob: Blob;

        if (file.type === "image/jpeg" || file.type === "image/jpg") {
            outputBlob = await JPGtoPNG(file);
        } else {
            outputBlob = file; // already PNG/WebP/etc
            alert('file already in png format\n')
            return
        }
        filename.value = file.name.replace(/\.(jpe?g)$/i, '.png')
        downloadUrl.value = URL.createObjectURL(outputBlob)
    }
}

</script>

<template>
    <main class="h-auto w-full relative overflow-hidden">
        <section class="h-dvh  w-full relative grid grid-cols-2">
            <div id="text-explanation-side" class="col-span-1 h-full w-full relative overflow-hidden  grid grid-rows-3">
                <div id="title" class="row-span-1 flex items-center justify-center gap-4 ">
                    <h1 class="text-3xl font-semibold underline">
                        README
                    </h1>
                    <UIcon name="catppuccin:readme" class="size-10 " />
                </div>

                <div id="descreption" class="row-span-1 h-full w-full flex items-center ">
                    <p class="font-semibold text-xl text-center text-balance">
                        Converting JPEG (lossy) images to PNG (lossless) results in significantly larger files. This is
                        expected behavior due to PNG preserving full pixel data without quality loss. This project
                        demonstrates image format conversion mechanics rather than production-level optimization.
                    </p>
                </div>

                <div id="warning" class="row-span-1 h-full w-full flex items-center justify-center">
                    <p
                        class="font-semibold text-xl text-center text-balance text-red-500 flex items-center justify-center gap-1">
                        <UIcon name="emojione-v1:warning" class="size-5" />PNG files may be significantly larger than
                        JPEG for photos
                    </p>
                </div>

            </div>


            <div id="logic-side">
                <form action="" class=" h-full w-full flex items-center justify-center flex-col gap-6" method="post"
                    enctype="multipart/form-data">
                    <label for="input-group-1" class="block mb-2.5 text-sm font-medium text-heading">upload
                        image</label>
                    <div class="relative w-full  flex items-center justify-center">
                        <input type="file" id="input-group-1" @change="onFileSelect" ref="fileInput" accept="image/*"
                            class="w-[90%] px-2 py-2.5  border border-white text-heading text-md rounded-2xl shadow-2xl focus:ring-brand focus:border-brand  placeholder:text-body">
                    </div>
                    <UButton variant="outline" color="success" size="xl" label="download button" icon="i-lucide-rocket"
                        v-if="downloadUrl" class="flex items-center justify-center">
                        <a :href="downloadUrl" :download="filename" class="text-center">Download PNG</a>
                    </UButton>

                </form>
            </div>
        </section>
    </main>
</template>
