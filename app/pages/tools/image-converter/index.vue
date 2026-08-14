<!--TODO:  RE STYLING THE PART WHERE THERE ALL THE BUTTONS THAT LEADS TO DIFFERENT FUNCTIONALITY-->

<!--
jpeg → png ----> done
png → jpeg ----> done
png → webp ----> done
jpeg → webp ----> done
webp → png
webp → jpeg
webp → avif
jpeg → avif
png → avif

-->



<script setup lang="ts">

import { ref, onMounted } from 'vue';
import JpegIcon from "@/assets/icons/ImageIcons/JpegIcon.vue"

const cards = ref<HTMLElement | null>(null);

onMounted(() => {
    if (!cards.value) {
        console.error("could not find the parent with the hashtag #cards")
        return
    };

    cards.value.addEventListener("mousemove", (event: MouseEvent) => {
        let cardElements = cards.value?.querySelectorAll<HTMLElement>(".card")
        if (!cardElements) {
            return;
        }
        for (const card of cardElements) {
            const rect = card.getBoundingClientRect()
            let x: number = event.clientX - rect.left;
            let y: number = event.clientY - rect.top;

            console.log(x);
            console.log(y)

            card.style.setProperty("--mouse-x", `${x}px`);
            card.style.setProperty("--mouse-y", `${y}px`)
        }
    })


})

interface ImageOperations {
    id: string | any
    label: string
}



/*
jpeg → png ----> done
png → jpeg ----> done
png → webp ----> done
jpeg → webp ----> done
webp → png
webp → jpeg
webp → avif
jpeg → avif
png → avif

*/
type ImageOperationId =
    | 'jpeg-png'
    | 'png-jpeg'
    | 'png-webp'
    | 'jpeg-webp'
    | 'webp-png'
    | 'webp-jpeg'
    | 'webp-avif'
    | 'jpeg-avif'
    | 'png-avif';

interface ImageOperation {
    id: ImageOperationId;
    label: string;
}

const imageOperations: ImageOperation[] = [
    { id: 'jpeg-png', label: 'JPEG to PNG' },
    { id: 'png-jpeg', label: 'PNG to JPEG' },
    { id: 'png-webp', label: 'PNG to WebP' },
    { id: 'jpeg-webp', label: 'JPEG to WebP' },
    { id: 'webp-png', label: 'WebP to PNG' },
    { id: 'webp-jpeg', label: 'WebP to JPEG' },
    { id: 'webp-avif', label: 'WebP to AVIF' },
    { id: 'jpeg-avif', label: 'JPEG to AVIF' },
    { id: 'png-avif', label: 'PNG to AVIF' },
];




</script>

<template>
    <main class="h-auto w-[95%] mx-auto relative overflow-hidden">
        <!-- parent tag holding everything -->
        <section class="h-auto w-full relative flex flex-wrap justify-center gap-2.5  py-4 px-12">
            <NuxtLink v-for="operations in imageOperations" :key="operations.id"
                :to="`image-converter/${operations.id}`">
                <div
                    class="container h-80 w-96  border border-gray-500 rounded-2xl  grid grid-rows-2 overflow-hidden    ">
                    <div id="logo"
                        class="row-span-1 w-full relative overflow-hidden flex items-center justify-center px-2">
                        <JpegIcon height="5rem" width="5rem" color="#000" />
                    </div>
                    <div class="row-span-1 w-full relative overflow-hidden flex items-center justify-center ">
                        <h1 class="text-3xl font-bold text-red-50">
                            {{ operations.label }}
                        </h1>

                    </div>
                </div>
            </NuxtLink>
        </section>
    </main>
</template>


<style></style>
