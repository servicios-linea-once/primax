<template>
  <div class="my-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4">
    <div class="flex items-center justify-between mb-3">
      <h4 class="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
        PassThrough (PT) Anatomy
      </h4>
      <span class="text-xs text-zinc-400 font-mono">{{ sections.length }} sections</span>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
      <button
        v-for="section in sections"
        :key="section.key"
        type="button"
        @mouseenter="highlightSection(section.key)"
        @click="highlightSection(section.key)"
        class="flex flex-col text-left p-2.5 rounded-lg border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/40 hover:border-emerald-500/50 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/20 transition group"
      >
        <div class="flex items-center justify-between">
          <span class="font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400 group-hover:underline">
            pt.{{ section.key }}
          </span>
          <span v-if="section.tag" class="text-[10px] text-zinc-400 font-mono">&lt;{{ section.tag }}&gt;</span>
        </div>
        <span class="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
          {{ section.description }}
        </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface PtSection {
  key: string;
  description: string;
  tag?: string;
}

const props = withDefaults(
  defineProps<{
    sections: PtSection[];
  }>(),
  {
    sections: () => []
  }
);

const emit = defineEmits<{
  (e: 'highlight', key: string): void;
}>();

const highlightSection = (key: string) => {
  emit('highlight', key);
};
</script>
