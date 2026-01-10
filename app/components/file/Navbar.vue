<script setup lang="ts">
    import ColorModeButton from '../ui/ColorModeButton.vue';
    import LogoWeb from '../icons/LogoWeb.vue';
</script>


<template>
    <nav class="h-full w-[95%] relative overflow-hidden mx-auto grid grid-cols-3">
        <div class=" h-full w-full col-span-2 flex items-center">
            <NuxtLink to="/" class="flex items-center justify-center gap-2 ">
                <LogoWeb height="32" width="32" />
                <h1 class="text-2xl font-semibold">Refine</h1>
            </NuxtLink>
        </div>
        <div class="h-full w-full col-span-1 flex items-center justify-end ">
            <ColorModeButton />
        </div>
    </nav>
</template>