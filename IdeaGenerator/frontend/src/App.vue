<script setup lang="ts">
import { RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <Navbar />
    <main class="flex-grow container mx-auto px-4 py-8">
      <RouterView />
    </main>
    <footer class="bg-gray-800 text-white py-4">
      <div class="container mx-auto text-center">
        &copy; 2024 OpenAI-inspired Website. All rights reserved.
      </div>
    </footer>
  </div>
</template>