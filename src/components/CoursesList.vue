<template>
  <section class="q-pa-md courses-list" :style="sectionStyle">
    <div class="row items-center justify-between q-mb-sm sticky-actions">
      <div class="text-subtitle2">Курсы</div>
      <div class="row q-gutter-sm">
        <q-btn
          size="sm"
          flat
          icon="done_all"
          label="выделить все"
          @click="selectAll"
          :disable="filtered.length === 0"
        />
        <q-btn
          size="sm"
          flat
          color="negative"
          icon="restart_alt"
          label="сбросить"
          @click="resetAll"
          :disable="isEmptySelection"
        />
      </div>
    </div>

    <q-separator class="q-mb-sm" />

    <q-scroll-area :horizontal="false" class="course-scroll" :style="{ height: scrollHeight }" content-class="course-scroll__content">
      <div v-if="filtered.length === 0" class="text-grey q-pa-md">Ничего не найдено</div>

      <div v-else class="card-list">
        <CourseCard
          v-for="course in filtered"
          :key="course.id"
          :course="course"
          :checked="!!selectionMap[course.id]"
          @update:checked="onToggle(course.id, $event)"
        />
      </div>
    </q-scroll-area>
  </section>
</template>

<script setup>
import { computed, reactive, watch } from 'vue'
import { coursesList } from '../data/lookups.js'
import CourseCard from './CourseCard.vue'

const props = defineProps({
  modelValue: { type: Array, default: () => [] },

  filters: {
    type: Object,
    default: () => ({ faculty: null, program: null, course: null, module: null }),
  },

  search: { type: String, default: '' },

  activeTags: { type: Array, default: () => [] },

  height: { type: String, default: '100%' },
})

const emit = defineEmits(['update:modelValue', 'reset'])

function normalizeCourse(raw, idx) {
  const title = raw.title ?? raw.name ?? raw.label ?? `Курс #${idx + 1}`
  const tags = Array.isArray(raw.tags) ? raw.tags : raw.keywords || []
  return {
    id: raw.id ?? `${idx}`,
    title,
    tags,
    faculty: raw.faculty ?? raw.facultyId ?? raw.facultyCode ?? null,
    program: raw.program ?? raw.programId ?? raw.programCode ?? null,
    course: raw.course ?? raw.courseId ?? raw.courseNum ?? null,
    module: raw.module ?? raw.moduleId ?? raw.moduleCode ?? null,
  }
}

const catalog = computed(() => (coursesList || []).map((c, i) => normalizeCourse(c, i)))

const filtered = computed(() => {
  const q = props.search?.trim().toLowerCase()
  const tagsFilter = new Set((props.activeTags || []).map(String))

  return catalog.value.filter((c) => {
    if (props.filters?.faculty && c.faculty !== props.filters.faculty) return false
    if (props.filters?.program && c.program !== props.filters.program) return false
    if (props.filters?.course && String(c.course) !== String(props.filters.course)) return false
    if (props.filters?.module && c.module !== props.filters.module) return false

    if (tagsFilter.size > 0) {
      const any = c.tags?.some((t) => tagsFilter.has(String(t)))
      if (!any) return false
    }

    if (q) {
      const inTitle = c.title.toLowerCase().includes(q)
      const inTags = (c.tags || []).some((t) => String(t).toLowerCase().includes(q))
      if (!inTitle && !inTags) return false
    }

    return true
  })
})

const selectionMap = reactive({})

watch(
  () => props.modelValue,
  (val) => {
    const m = {}
    for (const id of val) m[id] = true
    for (const k of Object.keys(selectionMap)) delete selectionMap[k]
    Object.assign(selectionMap, m)
  },
  { immediate: true },
)

const selectedIds = computed(() => Object.keys(selectionMap).filter((id) => selectionMap[id]))
const isEmptySelection = computed(() => selectedIds.value.length === 0)

function onToggle(id, checked) {
  selectionMap[id] = !!checked
  emit('update:modelValue', selectedIds.value)
}

function selectAll() {
  for (const c of filtered.value) selectionMap[c.id] = true
  emit('update:modelValue', selectedIds.value)
}

function resetAll() {
  for (const k of Object.keys(selectionMap)) selectionMap[k] = false
  emit('update:modelValue', [])
  emit('reset')
}

const scrollHeight = computed(() => props.height)
const sectionStyle = computed(() => ({ '--clist-h': props.height }))
</script>

<style scoped>
.courses-list {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.sticky-actions {
  position: sticky;
  top: 0;
  z-index: 1;
  background: var(--q-background, white);
  padding-top: 4px;
}

.course-scroll {
  height: 100%;
  min-height: 0;
}

.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}

.card-list {
  display: flex;
  flex-direction: column;
  gap: 12px;              /* вместо q-gutter-md */
  max-width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;     /* критично для мобилок */
}

/* «подушка» внутри области скролла, чтобы не липло к скроллбару */
.course-scroll__content {
  padding: 4px 12px 12px 8px;  /* top right bottom left */
  box-sizing: border-box;
  overflow-x: hidden;
}

/* сама карточка точно не шире контейнера */
:deep(.course-card) {
  max-width: 100%;
  width: 100%;
  box-sizing: border-box;
}

/* мобильные: чуть меньше отступы */
@media (max-width: 600px) {
  .card-list { gap: 10px; }
  .course-scroll__content { padding-right: 10px; padding-left: 6px; }
}
</style>
