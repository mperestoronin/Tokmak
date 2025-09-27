<template>
  <q-page class="flex flex-center">
    <FiltersPanel
  v-model="filters"
  @apply="onApply"
/>
  </q-page>
</template>

<script setup>
import FiltersPanel from '../components/FiltersPanel.vue'
</script>
