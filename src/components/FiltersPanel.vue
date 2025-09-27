<template>
  <aside class="q-pa-md q-gutter-md">
    <div class="text-subtitle2 q-mb-sm">Фильтры</div>

    <q-select
      v-model="local.faculty"
      :options="facultyOptions"
      label="Факультет"
      dense
      outlined
      clearable
      emit-value
      map-options
      @update:model-value="emitChange"
    />

    <q-select
      v-model="local.program"
      :options="programOptions"
      label="Программа"
      dense
      outlined
      clearable
      emit-value
      map-options
      @update:model-value="emitChange"
    />

    <q-select
      v-model="local.course"
      :options="courseOptions"
      label="Курс"
      dense
      outlined
      clearable
      emit-value
      map-options
      @update:model-value="emitChange"
    />

    <q-select
      v-model="local.module"
      :options="moduleOptions"
      label="Модуль"
      dense
      outlined
      clearable
      emit-value
      map-options
      @update:model-value="emitChange"
    />
  </aside>
</template>

<script setup>
import { reactive, watch, computed } from 'vue'

import { faculties, programs, courses, modules } from '../data/lookups.js'

/**
 * 
 * @typedef {Object} Filters
 * @property {string|null} faculty
 * @property {string|null} program
 * @property {string|null} course
 * @property {string|null} module
 */

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits([
  'update:modelValue',
  'apply'
])

const defaults = {
  faculty: null,
  program: null,
  course: null,
  module: null
}

const local = reactive({ ...defaults, ...props.modelValue })

watch(
  () => props.modelValue,
  (val) => {
    if (!val) return
    Object.assign(local, { ...defaults, ...val })
  },
  { deep: true }
)

const normalize = (list) =>
  list.map((item) =>
    typeof item === 'string'
      ? { label: item, value: item }
      : {
          label: item.label ?? item.name ?? String(item.value ?? ''),
          value: item.value ?? item.label ?? item.name
        }
  )

const facultyOptions = computed(() => normalize(faculties || []))
const programOptions = computed(() => normalize(programs || []))
const courseOptions = computed(() => normalize(courses || []))
const moduleOptions = computed(() => normalize(modules || []))

function emitChange () {
  const payload = { ...local }
  emit('update:modelValue', payload)
  emit('apply', payload)
}
</script>

<style scoped>
aside {
  min-width: 260px;
}
</style>
