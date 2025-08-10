<template>
  <main class="flex-1 p-6 overflow-y-auto">
    <h1 class="text-2xl font-bold text-white mb-4">Available Projects</h1>
    
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <GlassCard
        v-for="(project, index) in projects"
        :key="index"
        :title="project.title"
        :description="project.description"
      />
    </div>
  </main>
</template>

<script setup lang="ts">
import GlassCard from './GlassCard.vue';

const projects = [
  { title: "Website Redesign", description: "Looking for a frontend dev with Vue skills." },
  { title: "Blockchain Audit", description: "Smart contract review needed for DeFi app." },
  { title: "Mobile App UI", description: "Design sleek UI for a travel booking app." },
];
</script>
