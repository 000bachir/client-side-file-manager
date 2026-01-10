<script setup lang="ts">
  import Folders from '~/components/icons/Folders.vue';
</script>

<template>
  <main class="h-auto w-full relative overflow-hidden">
    <section class="h-dvh w-full relative grid grid-cols-2">
      <article class="h-full w-[95%] mx-auto col-span-1  flex flex-col">
        <div class="h-full w-full relative overflow-hidden flex items-center justify-center">
          <h1 class="font-semibold text-4xl underline">
            File converter in the browser
          </h1>
        </div>
        <div class="h-full w-full relative overflow-hidden flex items-center justify-center">
          <p class="px-6 text-center text-balance text-2xl">
            this a simple tool that will help with certain task like: Image conversion , text based conversion and some
            simple pdf formats
            the upside of this app is that it is only client side no server nor data will be collected
          </p>
        </div>
        <div class="h-full w-full relative overflow-hidden flex items-center justify-center">
          <p class="px-6 text-center text-balance text-red-500 text-xl">
            for complexe operation that will require a server action will not be supported by this tool
            for privacy concern everything will be done in the browser so the limit will be around
            <strong>200MB</strong> to <strong>300MB</strong>
          </p>
        </div>
      </article>
      <article class="h-full w-[95%] mx-auto col-span-1 flex items-center justify-center">
        <Folders height="360px" width="360px" />
      </article>
    </section>

    <section class="h-16 w-full relative flex items-center justify-center">
        <UButton icon="i-lucide-rocket" color="warning" variant="solid" label="PROCEED" size="xl" to="/tools" />
    </section>

  </main>
</template>
