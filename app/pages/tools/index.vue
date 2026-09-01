<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
import Drawer from '~/components/ui/Drawer.vue';

</script>


<template>
    <DnDProvider>
        <Drawer />
        <NuxtPage /> <!-- child routes load here -->
    </DnDProvider>

</template>