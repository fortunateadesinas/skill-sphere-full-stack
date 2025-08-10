<template>
    <div class="p-8 rounded-2xl bg-white/10 backdrop-blur-lg shadow-lg border border-white/20 hover:scale-105 transition-all duration-500">
        <h2 class="text-2l font-semibold text-white mb-4">{{ title }}</h2>
        <p class="text-white/80">{{ description }}</p>
    </div>
</template>

<script setup>
    defineProps({
        title: String,
        description: String
    });
</script>