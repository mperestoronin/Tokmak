<template>
  <q-card flat bordered class="course-card">
    <q-card-section class="card-section">
      <div class="card-main">
        <div class="card-header">
          <q-checkbox
            :model-value="checked"
            @update:model-value="$emit('update:checked', $event)"
          />
          <div
            class="title ellipsis cursor-pointer"
            :title="c.title"
            @click="show = true"
          >
            {{ c.title }}
          </div>
        </div>

        <div class="tags">
          <q-chip v-for="tg in c.tags.slice(0, 3)" :key="tg" dense>{{ tg }}</q-chip>
        </div>
      </div>
    </q-card-section>

    <!-- Диалог с подробной информацией о курсе -->
    <q-dialog v-model="show">
      <q-card style="max-width: 760px; width: 100%">
        <q-card-section class="row items-center justify-between">
          <div class="text-h6">{{ c.title }}</div>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />

        <q-card-section class="q-gutter-sm">
          <div><strong>Кто читает:</strong> {{ c.department || '—' }}</div>
          <div><strong>Когда читается:</strong> {{ c.when || '—' }}</div>
          <div><strong>Охват аудитории:</strong> {{ c.audience || '—' }}</div>
          <div><strong>Язык:</strong> {{ c.language || '—' }}</div>

          <div class="text-subtitle2 q-mt-md">Аннотация:</div>
          <div class="prewrap">{{ c.annotation || '—' }}</div>

          <div v-if="c.outcomes.length" class="text-subtitle2 q-mt-md">Планируемые результаты обучения:</div>
          <ul v-if="c.outcomes.length" class="q-pl-md">
            <li v-for="(item, i) in c.outcomes" :key="i">{{ item }}</li>
          </ul>

          <div v-if="c.controls.length" class="text-subtitle2 q-mt-md">Элементы контроля:</div>
          <ul v-if="c.controls.length" class="q-pl-md">
            <li v-for="(item, i) in c.controls" :key="i">{{ item }}</li>
          </ul>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  course: { type: Object, required: true },
  /** v-model для чекбокса */
  checked: { type: Boolean, default: false }
})

const show = ref(false)

// Мягкая нормализация полей, чтобы компонент был устойчив к разным ключам из lookups.js
const c = computed(() => {
  const raw = props.course || {}
  return {
    id: raw.id,
    title: raw.title ?? raw.name ?? raw.label ?? 'Без названия',
    tags: Array.isArray(raw.tags) ? raw.tags : (raw.keywords || []),
    department: raw.department ?? raw.whoReads ?? raw.lecturer ?? raw.readBy ?? raw.departmentName,
    when: raw.when ?? raw.schedule ?? raw.time,
    audience: raw.audience ?? raw.coverage ?? raw.scope,
    language: raw.language ?? raw.lang,
    annotation: raw.annotation ?? raw.summary ?? raw.description ?? raw.desc,
    outcomes: raw.outcomes ?? raw.learningOutcomes ?? raw.results ?? [],
    controls: raw.controls ?? raw.assessment ?? raw.controlElements ?? []
  }
})
</script>

<style scoped>
.course-card {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  overflow: hidden; /* страхуемся от горизонтального скролла */
}

/* Без .row: делаем собственный флекс без отрицательных маржинов */
.card-section {
  display: flex;
  padding: 12px 16px;
  overflow: hidden;
}

.card-main {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-width: 0; /* критично для ellipsis */
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;          /* вместо q-gutter */
  min-width: 0;
}

.title {
  flex: 1 1 auto;
  min-width: 0;
}

.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}

/* теги — гибкий ряд без .row/.q-gutter */
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding-top: 4px;
  min-width: 0;
}

.prewrap {
  white-space: pre-wrap;
}

/* На узких экранах добавим дополнительную «подушку» справа */
@media (max-width: 600px) {
  .card-section { padding-right: 20px; }
}
</style>
