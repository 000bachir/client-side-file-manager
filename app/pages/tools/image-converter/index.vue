<!--TODO:  RE STYLING THE PART WHERE THERE ALL THE BUTTONS THAT LEADS TO DIFFERENT FUNCTIONALITY-->



<script setup lang="ts">

import { ref , onMounted } from 'vue';


const cards = ref(null)
const card = ref(null)

onMounted(()=>{
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
    <!--<section class="h-dvh w-full relative overflow-hidden flex items-center justify-center">
        <div id="button-container"
            class="h[90%] w-[90%] mx-auto relative flex items-center justify-center gap-4 flex-wrap">
            <NuxtLink v-for="operation in imageOperations" :key="operation.id"
                :to="`image-converter/${operation.id}`">
                <UButton color="success" size="xl">
                    {{ formatLabel(operation.id) }}
                </UButton>
            </NuxtLink>

            <!-- child operation renders here 
            <NuxtPage />
        </div>
    </section> -->

    <section class="h-auto w-full relative overflow-hidden flex items-center justify-center m-0 p-0">
        <div ref="cards" id="cards" class="flex flex-wrap gap-2 max-w-[916px] w-[calc(100% - 20px)]">
            <div ref="card" class="card cursor-pointer flex h-[260px] flex-col relative w-[300px]">

                <div class="card-content">
                    <div class="card-image">
                        <i class="fa-duotone fa-apartment"></i>
                    </div>
                    <div class="card-info-wrapper">
                        <div class="card-info">
                            <i class="fa-duotone fa-apartment"></i>
                            <div class="card-info-title">
                                <h3>Apartments</h3>
                                <h4>Places to be apart. Wait, what?</h4>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </section>

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
