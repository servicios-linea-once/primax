<template>
  <div class="inline-flex items-center gap-3 p-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur shadow-sm">
    <div class="flex items-center gap-1.5 px-2">
      <span class="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Theme:</span>
      <select
        data-test="theme-select"
        v-model="currentTheme"
        @change="onThemeChange"
        class="bg-transparent text-xs font-medium text-zinc-900 dark:text-zinc-100 focus:outline-none cursor-pointer"
      >
        <option value="aura">Aura (Emerald)</option>
        <option value="lara">Lara (Indigo)</option>
        <option value="nora">Nora (Amber)</option>
        <option value="obsidian">Obsidian (Gold)</option>
      </select>
    </div>

    <div class="h-4 w-px bg-zinc-200 dark:bg-zinc-800" />

    <button
      type="button"
      @click="toggleDarkMode"
      class="p-1 rounded-full text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
      :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    >
      <span class="text-xs">{{ isDark ? '🌙' : '☀️' }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const emit = defineEmits<{
  (e: 'theme-change', theme: string): void;
  (e: 'dark-toggle', isDark: boolean): void;
}>();

const currentTheme = ref('aura');
const isDark = ref(false);

const onThemeChange = () => {
  emit('theme-change', currentTheme.value);
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-primax-theme', currentTheme.value);
  }
};

const toggleDarkMode = () => {
  isDark.value = !isDark.value;
  emit('dark-toggle', isDark.value);
  if (typeof document !== 'undefined') {
    if (isDark.value) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
};

onMounted(() => {
  if (typeof document !== 'undefined') {
    isDark.value = document.documentElement.classList.contains('dark');
    const existingTheme = document.documentElement.getAttribute('data-primax-theme');
    if (existingTheme) currentTheme.value = existingTheme;
  }
});
</script>
