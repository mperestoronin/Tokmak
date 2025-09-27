<template>
  <q-page class="flex flex-center">
    <FiltersPanel v-model="filters" @apply="onApply" />
    <search-with-tags
      v-model="search"
      v-model:tags="picked"
      @submit="onSubmit"
      @change="onChange"
    />
  </q-page>
</template>

<script setup>
import FiltersPanel from '../components/FiltersPanel.vue'
import SearchWithTags from '../components/SearchSection.vue'
</script>
