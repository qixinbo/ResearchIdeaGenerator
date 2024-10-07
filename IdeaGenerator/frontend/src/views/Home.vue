<template>
  <div class="min-h-screen bg-gray-100 flex items-start justify-center px-4 pt-16 relative overflow-hidden">
    <div class="absolute inset-0 bg-grid-pattern opacity-10"></div>
    <div class="max-w-3xl w-full mx-auto text-center relative z-10 transform -translate-y-8 bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-xl p-8 shadow-2xl">
      <h1 class="text-4xl sm:text-5xl font-extrabold mb-4 text-gray-800">欢迎来到"科研加速器"</h1>
      <p class="text-lg sm:text-xl mb-6 text-gray-600">Explore our knowledge base, chat with our AI, and manage your interactions.</p>
      <div class="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
        <router-link to="/chat" class="btn-primary">
          Start Chatting
        </router-link>
        <router-link to="/knowledge-base" class="btn-secondary">
          Explore Knowledge Base
        </router-link>
        <router-link to="/knowledge-base" class="btn-tertiary">
          Manage Knowledge Base
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.btn-primary,
.btn-secondary,
.btn-tertiary {
  @apply px-4 py-2 rounded-lg font-semibold text-white shadow-md transition duration-300 ease-in-out transform hover:scale-105;
}

.btn-primary {
  @apply bg-blue-600 hover:bg-blue-700;
}

.btn-secondary {
  @apply bg-purple-600 hover:bg-purple-700;
}

.btn-tertiary {
  @apply bg-pink-500 hover:bg-pink-600;
}

.bg-grid-pattern {
  background-image: linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px);
  background-size: 20px 20px;
}
</style>