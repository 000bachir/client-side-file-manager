<script setup lang="ts">



</script>

<template>

    <section class="h-dvh w-full relative overflow-hidden flex items-center justify-center">
        <div id="button-container"
            class="h[90%] w-[90%] mx-auto relative flex items-center justify-center gap-4 flex-wrap">
            <NuxtLink to="/file-manager/pdf-merger">
                <UButton color="success" size="xl">
                    go
                </UButton>
            </NuxtLink>

            <!-- child operation renders here -->
            <NuxtPage />
        </div>
    </section>


</template>