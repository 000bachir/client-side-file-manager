<script setup lang="ts">
import Navbar from './components/file/Navbar.vue'
import { DnDProvider } from '@vue-dnd-kit/core'
</script>

<template>
  <DnDProvider>
    <NuxtLayout>
      <UApp>
        <header class="h-24 w-full overflow-hidden border-b border-amber-50 shadow-2xl">
          <Navbar />
        </header>
        <NuxtPage />
      </UApp>
    </NuxtLayout>
  </DnDProvider>
</template>
