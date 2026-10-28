<template>
  <div class="my-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-sm">
    <!-- Header with tab switches and copy button -->
    <div class="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 bg-zinc-50/70 dark:bg-zinc-900/50">
      <div class="flex items-center gap-1">
        <button
          type="button"
          data-test="tab-preview"
          @click="activeTab = 'preview'"
          :class="[
            'px-3 py-1 text-xs font-medium rounded-lg transition',
            activeTab === 'preview'
              ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm'
              : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
          ]"
        >
          Preview
        </button>
        <button
          type="button"
          data-test="tab-code"
          @click="activeTab = 'code'"
          :class="[
            'px-3 py-1 text-xs font-medium rounded-lg transition',
            activeTab === 'code'
              ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm'
              : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
          ]"
        >
          Code
        </button>
      </div>

      <div class="flex items-center gap-2">
        <span v-if="copied" class="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Copied!</span>
        <button
          type="button"
          data-test="copy-button"
          @click="copyCode"
          class="px-2.5 py-1 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-md hover:bg-zinc-200/50 dark:hover:bg-zinc-800 transition"
          title="Copy code"
        >
          Copy
        </button>
      </div>
    </div>

    <!-- Tab contents -->
    <div v-show="activeTab === 'preview'" class="p-6 flex items-center justify-center min-h-[140px] bg-zinc-50/30 dark:bg-zinc-900/20">
      <slot />
    </div>

    <div v-show="activeTab === 'code'" class="p-4 bg-zinc-900 dark:bg-black text-zinc-100 text-xs font-mono overflow-x-auto">
      <pre><code>{{ code }}</code></pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = withDefaults(
  defineProps<{
    code: string;
    title?: string;
  }>(),
  {
    code: '',
    title: ''
  }
);

const activeTab = ref<'preview' | 'code'>('preview');
const copied = ref(false);

const copyCode = async () => {
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(props.code);
      copied.value = true;
      setTimeout(() => {
        copied.value = false;
      }, 2000);
    }
  } catch (err) {
    // Graceful fallback for insecure contexts
    console.warn('Failed to copy to clipboard', err);
  }
};
</script>
