<script setup lang="ts">
    import Navbar from './components/file/Navbar.vue';
</script>

<template>
  <NuxtLayout>
    <header class="h-24 w-full overflow-hidden border-b border-amber-50 shadow-2xl ">
      <Navbar />
    </header>
    <NuxtPage />
    
  </NuxtLayout>
</template>
