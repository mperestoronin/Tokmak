<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-3">
        <FiltersPanel v-model="filters" @apply="onApply" />
      </div>

      <div class="col-12 col-md-6">
        <CoursesList
          v-model="selectedCourseIds"
          :filters="filters"
          height="calc(100vh - 230px)"
          :search="searchQuery"
          :activeTags="activeTags"
          @reset="onReset"
        />
      </div>

      <div class="col-12 col-md-3">
        <RightSelectedCourses
          :selected-ids="selectedCourseIds"
          @remove="
            (id) => {
              selectedCourseIds = selectedCourseIds.filter((x) => x !== id)
            }
          "
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import FiltersPanel from '../components/FiltersPanel.vue'
import CoursesList from '../components/CoursesList.vue'
import RightSelectedCourses from '../components/RightSelectedCourses.vue'

const filters = ref({
  faculty: null,
  program: null,
  course: null,
  module: null,
})

const selectedCourseIds = ref([])

const searchQuery = ref('')
const activeTags = ref([])

function onApply(payload) {
  console.log(payload)
}

function onReset() {
  selectedCourseIds.value = []
}
</script>

<style scoped></style>
