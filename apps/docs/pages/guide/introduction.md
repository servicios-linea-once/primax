# Introduction to Primax UI

Welcome to **@servicio-linea-once/primax**, a modular UI component library built for Vue 3 and Inertia.js with Tailwind PassThrough architecture.

## Theme Switcher

<ThemeFloatingBar />

## Component Preview

<ComponentPreview code='<Button label="Click Me" variant="primary" />'>
  <button class="px-4 py-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition">
    Click Me
  </button>
</ComponentPreview>

## PassThrough Anatomy

<script setup>
const buttonSections = [
  { key: 'root', description: 'Root button container element', tag: 'button' },
  { key: 'label', description: 'Text label span element', tag: 'span' },
  { key: 'icon', description: 'Icon element rendered before or after label', tag: 'svg' }
];

const apiRows = [
  { name: 'variant', type: "'primary' | 'secondary' | 'danger'", default: "'primary'", description: 'Button visual theme' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Whether the button is disabled' }
];
</script>

<PtViewer :sections="buttonSections" />

## API Reference

<ApiTable :rows="apiRows" />

