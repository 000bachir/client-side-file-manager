<!--
    !JPEG to/from PNG, WebP ===> MOSTLY DONE NEED TO ADD THE PROGRESS BAR 
    !PNG to/from WebP, GIF ===> NOT DONE YET
    !GIF to/from WebP, PNG ===> NOT DONE YET
-->

<script setup lang="ts">

interface ImageOperations {
    id: string | any
    label: string
}
// const imageOperations: ImageOperations[] = [
//     { id: "jpeg-png", label: "JPEG → PNG" },
//     { id: "png-jpeg", label: "PNG → JPEG" },
//     { id: "png-webp", label: "PNG → WebP" },
//     { id: "jpeg-webp", label: "JPEG → WebP" }
// ];

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

    <section class="h-dvh w-full relative overflow-hidden flex items-center justify-center">
        <div id="button-container"
            class="h[90%] w-[90%] mx-auto relative flex items-center justify-center gap-4 flex-wrap">
            <NuxtLink v-for="operation in imageOperations" :key="operation.id"
                :to="`image-converter/${operation.id}`">
                <UButton color="success" size="xl">
                    {{ formatLabel(operation.id) }}
                </UButton>
            </NuxtLink>

            <!-- child operation renders here -->
            <NuxtPage />
        </div>
    </section>


</template>