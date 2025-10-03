<template>
  <aside class="q-pa-md right-panel">
    <q-card flat bordered>
      <q-card-section class="row items-center justify-between">
        <div class="text-subtitle2">Выбранные курсы</div>
        <q-badge outline :label="selectedCount" v-if="selectedCount > 0" />
      </q-card-section>

      <q-separator />

      <div v-if="selectedCount === 0" class="q-pa-md text-grey">Ничего не выбрано</div>

      <q-scroll-area v-else class="q-pa-sm list-scroll" :style="{ height: listHeight }">
        <q-list separator>
          <q-item v-for="c in selectedCourses" :key="c.id">
            <q-item-section>
              <div class="ellipsis" :title="c.title">{{ c.title }}</div>
            </q-item-section>
            <q-item-section side>
              <q-btn
                flat
                dense
                round
                icon="close"
                @click="remove(c.id)"
                :aria-label="`Убрать ${c.title}`"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>

      <q-separator />

      <q-card-actions vertical class="q-pa-sm q-gutter-xs">
        <q-btn
          :disable="selectedCount === 0"
          color="primary"
          unelevated
          label="Построить граф схожести дисциплин"
          :to="{ name: 'graph', query: queryParams }"
        />
        <q-btn
          :disable="selectedCount === 0"
          color="primary"
          unelevated
          label="Построить дашборды"
          :to="{ name: 'dashboard', query: queryParams }"
        />
        <q-btn
          :disable="selectedCount === 0"
          color="primary"
          unelevated
          label="Построить облако тегов"
          :to="{ name: 'cloud', query: queryParams }"
        />
      </q-card-actions>
    </q-card>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { coursesList } from '../data/lookups.js'

const props = defineProps({
  selectedIds: { type: Array, default: () => [] },
  height: { type: String, default: 'calc(100vh - 400px)' },
})

const emit = defineEmits(['remove'])

function parseArrayish (val) {
  if (Array.isArray(val)) return val
  if (typeof val === 'string') {
    const s = val.trim()
    if (s.startsWith('[') && s.endsWith(']')) {
      try { return JSON.parse(s.replace(/'/g, '"')) } catch {console.log("error")}
      return s.slice(1, -1)
        .split(',')
        .map(x => x.trim().replace(/^['"]|['"]$/g, ''))
        .filter(Boolean)
    }
    return s ? [s] : []
  }
  return val != null ? [String(val)] : []
}

function normalizeCourse (raw, idx) {
  const id = raw['Уникальный ключ'] ?? raw.id ?? `${idx}`
  const title = raw['Название дисциплины'] ?? raw.title ?? raw.name ?? raw.label ?? `Курс #${idx + 1}`
  const tags = parseArrayish(raw['Ключевые слова'] ?? raw.tags ?? raw.keywords ?? []).map(String)
  return { id: String(id), title, tags }
}

const byId = computed(() => {
  const res = new Map()
  ;(coursesList || []).forEach((c, i) => {
    const n = normalizeCourse(c, i)
    res.set(n.id, n)
  })
  return res
})


const selectedCourses = computed(() =>
  props.selectedIds.map((id) => byId.value.get(id)).filter(Boolean),
)

const selectedCount = computed(() => selectedCourses.value.length)
const listHeight = computed(() => props.height)

function remove(id) {
  emit('remove', id)
}

const queryParams = computed(() => ({ ids: props.selectedIds.join(',') }))
</script>

<style scoped>
.right-panel {
  position: sticky;
  top: 16px;
}

.list-scroll {
}

.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}
</style>
