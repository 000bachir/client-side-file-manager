<!--TODO:  RE STYLING THE PART WHERE THERE ALL THE BUTTONS THAT LEADS TO DIFFERENT FUNCTIONALITY-->

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

<script setup lang="ts">

import { ref, onMounted } from 'vue';
import JpegIcon from "@/assets/icons/ImageIcons/JpegIcon.vue"
import PngIcon from "@/assets/icons/ImageIcons/PngIcon.vue"
import WebpIcon from '~/assets/icons/ImageIcons/WebpIcon.vue';


interface PngimageOperations {
    id: string | any
    label: string
}

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
    description: string
}

const PngimageOperations: ImageOperation[] = [
    {
        id: 'png-jpeg',
        label: 'PNG to JPEG',
        description: 'Convert PNG images to JPEG for smaller file sizes and easier sharing.'
    },
    {
        id: 'png-webp',
        label: 'PNG to WebP',
        description: 'Convert PNG images to WebP for smaller files with excellent image quality.'
    },
    {
        id: 'png-avif',
        label: 'PNG to AVIF',
        description: 'Convert PNG images to AVIF for modern, highly compressed image files.'
    },

    // { id: 'jpeg-png', label: 'JPEG to PNG' },
    // { id: 'jpeg-webp', label: 'JPEG to WebP' },
    // { id: 'jpeg-avif', label: 'JPEG to AVIF' },


];

const JpegImageOperations: ImageOperation[] = [
    {
        id: 'jpeg-png',
        label: 'JPEG to PNG',
        description: 'Convert JPEG images to PNG for lossless quality and better support for transparency.'
    },

    {
        id: 'jpeg-webp',
        label: 'JPEG to WebP',
        description: 'Create smaller image files while maintaining excellent visual quality for the web.'
    },

    {
        id: 'jpeg-avif',
        label: 'JPEG to AVIF',
        description: 'Create highly compressed images with excellent quality for modern websites.'
    },

]

const WebpImageOperations: ImageOperation[] = [
    {
        id: 'webp-png',
        label: 'WebP to PNG',
        description: 'Convert WebP images to PNG for lossless quality and broader compatibility.'
    },

    {
        id: 'webp-jpeg',
        label: 'WebP to JPEG',
        description: 'Convert WebP images to JPEG for easy sharing and wider compatibility.'
    },

    {
        id: 'webp-avif',
        label: 'WebP to AVIF',
        description: 'Convert WebP images to AVIF for smaller files and excellent image quality.'
    },


]


</script>

<template>
    <main class="h-auto w-[95%] mx-auto relative overflow-hidden">
        <section class="h-auto w-full relative overflow-hidden">
            <article class="h-auto w-[95%] mx-auto relative py-12 flex items-center justify-center flex-col gap-6 ">
                <h1 class="font-bold text-5xl ">
                    Private image tools, right in your browser.
                </h1>
                <p class="font-semibold text-2xl  text-balance text-center">
                    <span
                        class="font-bold underline underline-offset-1 text-orange-400 dark:text-green-400 italic">Convert
                        your images
                        privately,
                        right in your browser.</span>
                    Choose the tool that fits your needs and convert between JPEG, PNG, WebP, and AVIF formats —
                    quickly, securely, and entirely client-side.
                </p>
            </article>
        </section>
        <!-- parent tag holding everything -->
        <section class=" h-auto w-full relative flex flex-wrap justify-center gap-2.5  py-4 px-12  ">
            <article class="h-auto w-full relative flex flex-wrap justify-center  ">
                <h1 class="text-4xl  italic  font-semibold">
                    PNG Conversion Tools
                </h1>
            </article>
            <article class="h-auto w-full relative flex flex-wrap justify-center gap-5 py-6">
                <NuxtLink v-for="operations in PngimageOperations" :key="operations.id"
                    :to="`image-converter/${operations.id}`">
                    <div
                        class="container h-80 w-96  border border-gray-600 rounded-2xl  grid grid-rows-2 overflow-hidden    ">
                        <div id="logo"
                            class="row-span-1 w-full relative overflow-hidden flex items-center justify-center gap-2.5">
                            <PngIcon height="5rem" width="5rem" fill="#6366F1" />
                            <h1 class="text-xl font-bold ">
                                {{ operations.label }}
                            </h1>
                        </div>
                        <div class="row-span-1 f w-full relative overflow-hidden flex items-center ">
                            <p class="font-semibold text-lg text-balance text-center">
                                {{ operations.description }}
                            </p>
                        </div>
                    </div>
                </NuxtLink>
            </article>
        </section>

        <!--jpeg section-->
        <section class="h-auto w-full relative flex flex-wrap justify-center gap-2.5  py-4 px-12  ">
            <article class="h-auto w-full relative flex flex-wrap justify-center  ">
                <h1 class="text-4xl italic  font-semibold">
                    JPEG Conversion Tools
                </h1>
            </article>
            <article class="h-auto w-full relative flex flex-wrap justify-center gap-5 py-6">
                <NuxtLink v-for="operations in JpegImageOperations" :key="operations.id"
                    :to="`image-converter/${operations.id}`">
                    <div class="container border border-gray-600 rounded-2xl  grid grid-rows-2 overflow-hidden    ">
                        <div id="logo"
                            class="row-span-1 w-full relative overflow-hidden flex items-center justify-center gap-2.5">
                            <JpegIcon height="5rem" width="5rem" fill="#8B5CF6" />
                            <h1 class="text-xl font-bold ">
                                {{ operations.label }}
                            </h1>
                        </div>
                        <div class="row-span-1 f w-full relative overflow-hidden flex items-center ">
                            <p class="font-semibold text-lg text-balance text-center">
                                {{ operations.description }}
                            </p>
                        </div>
                    </div>
                </NuxtLink>
            </article>
        </section>
        <!--webp section-->
        <section class="h-auto w-full relative flex flex-wrap justify-center gap-2.5  py-4 px-12  ">
            <article class="h-auto w-full relative flex flex-wrap justify-center ">
                <h1 class="text-4xl text-start italic  font-semibold">
                    WEBP Conversion Tools
                </h1>
            </article>
            <article class="h-auto w-full relative flex flex-wrap justify-center gap-5 py-6">
                <NuxtLink v-for="operations in WebpImageOperations" :key="operations.id"
                    :to="`image-converter/${operations.id}`">
                    <div class="container  border border-gray-600 rounded-2xl  grid grid-rows-2 overflow-hidden    ">
                        <div id="logo"
                            class="row-span-1 w-full relative overflow-hidden flex items-center justify-center gap-2.5">
                            <WebpIcon height="5rem" width="5rem" fill="#475569" />
                            <h1 class="text-xl font-bold ">
                                {{ operations.label }}
                            </h1>
                        </div>
                        <div class="row-span-1 f w-full relative overflow-hidden flex items-center ">
                            <p class="font-semibold text-lg text-balance text-center">
                                {{ operations.description }}
                            </p>
                        </div>
                    </div>
                </NuxtLink>
            </article>
        </section>
    </main>
</template>


<style>
:root {
    --pattern-color: rgba(255, 255, 255, 0.2);

}

.container {
    position: relative;
    height: 20rem;
    width: 24rem;
    box-shadow: rgba(0, 0, 0, 0.06) 0px 2px 4px 0px inset;
}

.dark {
    --pattern-color: rgba(255, 255, 255, 0.2);

}

.container::before {
    position: absolute;
    content: "";
    top: 0;
    left: 0;
    overflow: hidden;
    background-image: radial-gradient(--var(--pattern-color) 8%,
            transparent 8%);
    background-position: 0% 0%;
    background-size: 5vmin 5vmin;
    height: 100%;
    width: 100%;
}
</style>
