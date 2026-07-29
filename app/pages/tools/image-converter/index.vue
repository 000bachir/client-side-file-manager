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


const selectedOperation = ref<string | null>(null);
interface ImageOperation {
    id: 'jpeg-png' | 'png-jpeg' | 'png-webp' | 'jpeg-webp'
}

const imageOperations: ImageOperation[] = [
    { id: 'jpeg-png' },
    { id: 'png-jpeg' },
    { id: 'png-webp' },
    { id: 'jpeg-webp' }
]

function formatLabel(id: string) {
    const [from, to] = id.split('-')
    if (from && to) {
        return `${from.toUpperCase()} → ${to.toUpperCase()}`
    }
}


</script>

<template>
    <!-- <section class="h-dvh w-full relative overflow-hidden flex items-center justify-center">
        <div id="button-container"
            class="h[90%] w-[90%] mx-auto relative flex items-center justify-center gap-4 flex-wrap">
            <NuxtLink v-for="operation in imageOperations" :key="operation.id"
                :to="`image-converter/${operation.id}`">
                <UButton color="success" size="xl">
                    {{ formatLabel(operation.id) }}
                </UButton>
            </NuxtLink>

             child operation renders here 
            <NuxtPage />
        </div>
    </section> -->


    <main class="h-auto w-[95%] mx-auto relative overflow-hidden">
        <!-- parent tag holding everything -->
        <section class="h-auto w-full relative flex flex-wrap justify-center gap-2.5 bg-red-50 py-4 px-12">
            <div class="container h-80 w-96  border border-gray-500 rounded-2xl bg-amber-200 grid grid-rows-3 ">
                <div id="logo" class="row-span-1 w-full relative overflow-hidden flex items-center justify-center px-2">
                    <JpegIcon height="5rem" width="5rem" color="#000"/>
                </div>
                <div class=""></div>

            </div>
            <div class="container h-80 w-96  border border-gray-500 rounded-2xl bg-amber-200 "></div>
            <div class="container h-80 w-96  border border-gray-500 rounded-2xl bg-amber-200 "></div>
            <div class="container h-80 w-96  border border-gray-500 rounded-2xl bg-amber-200 "></div>
            <div class="container h-80 w-96  border border-gray-500 rounded-2xl bg-amber-200 "></div>
            <div class="container h-80 w-96  border border-gray-500 rounded-2xl bg-amber-200 "></div>
            <div class="container h-80 w-96  border border-gray-500 rounded-2xl bg-amber-200 "></div>
            <div class="container h-80 w-96  border border-gray-500 rounded-2xl bg-amber-200 "></div>
            <div class="container h-80 w-96  border border-gray-500 rounded-2xl bg-amber-200 "></div>



        </section>
    </main>



</template>


<style>
#cards:hover>.card::after {
    opacity: 1;
}

.card {
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
}

.card:hover::before {
    opacity: 1;
}

.card::before,
.card::after {
    border-radius: inherit;
    content: "";
    height: 100%;
    top: 0;
    left: 0;
    position: absolute;
    transition: opacity 500ms;
    width: 100%;
}

.card::before {
    background: radial-gradient(800px circle at var(--mouse-x) var(--mouse-y),
            rgba(255, 255, 255, 0.06),
            transparent 40%);
    z-index: 3;
}

.card::after {
    background: radial-gradient(600px circle at var(--mouse-x) var(--mouse-y),
            rgba(255, 255, 255, 0.4),
            transparent 40%);
    z-index: 1;
}
</style>
