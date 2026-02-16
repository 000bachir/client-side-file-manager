<script setup lang="ts">
const open = ref(false)
</script>

<template>
    <UDrawer direction="left" dismissible should-scale-background v-model:open="open" class="">
        <div
            class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center gap-4 flex-col">
            <h1 class="text-3xl font-semibold">
                Open the drawer and select the operation that you want
            </h1>
            <UButton label="Open" color="neutral" variant="subtle" size="xl" trailing-icon="i-lucide-chevron-right" />
        </div>
        <template #content>
            <Placeholder class="min-w-96 min-h-96 size-full m-4 ">
                <UAside class="flex flex-col w-full">
                    <ULink class="font-semibold text-xl" to="/tools/image-converter">image-converter</ULink>
                    <ULink class="font-semibold text-xl" to="/tools/file-manager">file manager</ULink>
                    <ULink class="font-semibold text-xl" to="/tools/convert">File Convert</ULink>
                </UAside>
            </Placeholder>

        </template>
    </UDrawer>
</template>
