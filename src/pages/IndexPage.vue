<template>
<<<<<<< HEAD
  <q-page class="flex flex-center">
    <FiltersPanel v-model="filters" @apply="onApply" />
    <search-with-tags
      v-model="search"
      v-model:tags="picked"
      @submit="onSubmit"
      @change="onChange"
    />
=======
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">

      <div class="col-12 col-md-3">
        <FiltersPanel
          v-model="filters"
          @apply="onApply" 
        />
      </div>

      <div class="col-12 col-md-6">
        <CoursesList
          v-model="selectedCourseIds"
          :filters="filters"
          height="calc(100vh - 320px)"
          :search="searchQuery"
          :activeTags="activeTags"
          @reset="onReset"
        />
      </div>

      <div class="col-12 col-md-3">
        <q-card flat bordered>
          <q-card-section class="text-subtitle2">Выбранные курсы</q-card-section>
          <q-separator />
          <q-list v-if="selectedCourseIds.length">
            <q-item v-for="id in selectedCourseIds" :key="id">
              <q-item-section>{{ id }}</q-item-section>
            </q-item>
          </q-list>
          <div v-else class="q-pa-md text-grey">Ничего не выбрано</div>

          <q-separator />
          <q-card-actions align="right">
            <q-btn label="Стр. 1" flat />
            <q-btn label="Стр. 2" flat />
            <q-btn label="Стр. 3" flat />
          </q-card-actions>
        </q-card>
      </div>

    </div>
>>>>>>> 6d66a37a244d9511261e78627e8ede64e231244d
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import FiltersPanel from '../components/FiltersPanel.vue'
<<<<<<< HEAD
import SearchWithTags from '../components/SearchSection.vue'
=======
import CoursesList from '../components/CoursesList.vue'

const filters = ref({
  faculty: null,
  program: null,
  course: null,
  module: null
})

const selectedCourseIds = ref([])

const searchQuery = ref('')
const activeTags = ref([])


function onApply (payload) {
  console.log(payload)
}

function onReset () {
  selectedCourseIds.value = []
}
>>>>>>> 6d66a37a244d9511261e78627e8ede64e231244d
</script>

<style scoped>
</style>
