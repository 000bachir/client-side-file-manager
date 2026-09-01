<script setup lang="ts">
import { makeDroppable } from '@vue-dnd-kit/core';
import { DnDProvider } from '@vue-dnd-kit/core';
import DropZone from '../components/DropZone.vue';
const zoneRef = useTemplateRef<HTMLElement>('zoneRef')


makeDroppable(zoneRef , {
    events : {
        onDrop : (e : any) => console.log(e)
    }
})

</script>


<template>
    <main class="h-dvh w-full relative overflow-hidden flex items-center justify-center ">
        <DropZone />
    </main>
</template>


<style>

    .drop-zone{
        height: 600px;
        aspect-ratio: 1;
        background: red;
        display: flex;
        align-items: center;
        justify-content: center;
    }

</style>