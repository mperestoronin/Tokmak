<template>
  <section class="q-pa-md courses-list" :style="sectionStyle">
    <div class="row items-center justify-between q-mb-sm sticky-actions">
      <div class="text-subtitle2">Курсы</div>
      <div class="row q-gutter-sm">
        <q-btn size="sm" flat icon="done_all" label="выделить все" @click="selectAll" :disable="filtered.length === 0" />
        <q-btn size="sm" flat color="negative" icon="restart_alt" label="сбросить" @click="resetAll" :disable="isEmptySelection" />
      </div>
    </div>

    <q-separator class="q-mb-sm" />


    <q-scroll-area :horizontal="false" class="course-scroll" :style="{ height: scrollHeight }">
      <div v-if="filtered.length === 0" class="text-grey q-pa-md">Ничего не найдено</div>

      <div v-else class="column q-gutter-md">
        <q-card v-for="course in filtered" :key="course.id" flat bordered>
          <q-card-section class="row items-center justify-between no-wrap">
            <div class="col-grow q-mr-md">
              <div class="row items-center no-wrap">
                <q-checkbox :model-value="!!selectionMap[course.id]" @update:model-value="onToggle(course.id, $event)" class="q-mr-sm"/>
                <div class="text-body1 ellipsis" :title="course.title">{{ course.title }}</div>
              </div>
              <div class="q-mt-xs row q-gutter-xs">
                <q-chip v-for="tg in course.tags.slice(0, 3)" :key="tg" dense>{{ tg }}</q-chip>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </q-scroll-area>
  </section>
</template>

<script setup>
import { computed, reactive, watch } from 'vue'
import { coursesList } from '../data/lookups.js'

const props = defineProps({

  modelValue: { type: Array, default: () => [] },

  filters: {
    type: Object,
    default: () => ({ faculty: null, program: null, course: null, module: null })
  },

  search: { type: String, default: '' },
 
  activeTags: { type: Array, default: () => [] },

  height: { type: String, default: 'calc(100vh - 160px)' }
})

const emit = defineEmits(['update:modelValue', 'reset'])


function normalizeCourse (raw, idx) {
  const title = raw.title ?? raw.name ?? raw.label ?? `Курс #${idx + 1}`
  const tags = Array.isArray(raw.tags) ? raw.tags : (raw.keywords || [])
  return {
    id: raw.id ?? `${idx}`,
    title,
    tags,
    faculty: raw.faculty ?? raw.facultyId ?? raw.facultyCode ?? null,
    program: raw.program ?? raw.programId ?? raw.programCode ?? null,
    course: raw.course ?? raw.courseId ?? raw.courseNum ?? null,
    module: raw.module ?? raw.moduleId ?? raw.moduleCode ?? null
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
  { immediate: true }
)

const selectedIds = computed(() => Object.keys(selectionMap).filter((id) => selectionMap[id]))
const isEmptySelection = computed(() => selectedIds.value.length === 0)

function onToggle (id, checked) {
  selectionMap[id] = !!checked
  emit('update:modelValue', selectedIds.value)
}

function selectAll () {
  for (const c of filtered.value) selectionMap[c.id] = true
  emit('update:modelValue', selectedIds.value)
}

function resetAll () {
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
 
}


.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}
</style>
