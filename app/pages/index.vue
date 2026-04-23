<script setup lang="ts">
import Folders from '~/components/icons/Folders.vue';
import Anonymous from '~/components/icons/Anonymous.vue';
import Server from '~/components/icons/Server.vue';
</script>

<template>
  <main class="h-auto w-full relative overflow-hidden">
    <section class="h-dvh w-full relative overflow-hidden flex items-center justify-center">
      <article
        class="h-[90%] w-[95%] mx-auto rounded-2xl shadow-2xl border dark:border-gray-400 border-gray-900 flex items-center justify-center gap-6 flex-col">
        <div class="w-full flex items-center justify-center" id="icon container">
          <Anonymous width="200" height="200" />
        </div>
        <div class="w-full relative overflow-hidden flex items-center justify-center " id="big title">
          <h1 class="font-semibold text-7xl">
            When Speed Meets Anonymity
          </h1>
        </div>
        <div class="w-full relative flex items-center justify-center" id="small paragraph">
          <p class="text-xl font-semibold dark:text-gray-300 text-gray-600 text-center">
            Drop any files here to start processing instantly. <br>
            All computation happens on your device
          </p>
        </div>
        <div class="w-full flex items-center justify-center" id="buttons">
          <UButton icon="i-lucide-rocket" color="warning" variant="solid" label="PROCEED"
            class="w-52 h-16 flex items-center justify-center font-semibold text-2xl" to="/tools" />
        </div>
        <div class="w-full flex items-center justify-center" id="buttons">
          <p class="text-sm font-semibold dark:text-gray-300 text-gray-600 text-center">Privacy first , nothing leaves
            your machine or your browser</p>
        </div>
      </article>
    </section>
    <section class="h-auto w-full relative overflow-hidden">
      <div class="w-[95%] mx-auto grid grid-cols-3 py-4">
        <div class="col-span-2 w-full relative overflow-hidden flex flex-col gap-6 ">
          <h1 class="text-4xl font-semibold ">
            Client side storage
          </h1>
          <p class="text-xl font-semibold">
            Meaning , no server is gonna do the work , your browser is your tool
          </p>
        </div>
        <div class="w-full flex items-center justify-center ">
          <Server width="120px" height="120px" />
        </div>
      </div>

    </section>
  </main>
</template>
