<template>
  <div class="my-6 overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
    <table class="w-full text-left border-collapse text-xs">
      <thead>
        <tr class="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-zinc-600 dark:text-zinc-400 font-semibold">
          <th v-for="header in resolvedHeaders" :key="header" class="px-4 py-3">
            {{ header }}
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-zinc-100 dark:divide-zinc-800/60">
        <tr
          v-for="(row, idx) in rows"
          :key="idx"
          class="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition"
        >
          <td v-if="row.name" class="px-4 py-3 font-mono font-semibold text-emerald-600 dark:text-emerald-400">
            {{ row.name }}
          </td>
          <td v-if="row.type" class="px-4 py-3 font-mono text-zinc-600 dark:text-zinc-400">
            {{ row.type }}
          </td>
          <td v-if="row.default !== undefined" class="px-4 py-3 font-mono text-amber-600 dark:text-amber-400">
            {{ row.default }}
          </td>
          <td v-if="row.description" class="px-4 py-3 text-zinc-700 dark:text-zinc-300">
            {{ row.description }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    headers?: string[];
    rows: Array<Record<string, any>>;
    type?: 'props' | 'events' | 'slots' | 'pt';
  }>(),
  {
    headers: () => ['Name', 'Type', 'Default', 'Description'],
    rows: () => [],
    type: 'props'
  }
);

const resolvedHeaders = computed(() => {
  if (props.headers && props.headers.length > 0) return props.headers;
  if (props.type === 'events') return ['Event', 'Payload', 'Description'];
  if (props.type === 'slots') return ['Slot Name', 'Scope Props', 'Description'];
  if (props.type === 'pt') return ['Key', 'Target Tag', 'Description'];
  return ['Name', 'Type', 'Default', 'Description'];
});
</script>
