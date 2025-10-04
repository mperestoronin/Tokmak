<template>
  <q-page class="q-pa-none page-bleed">
    <div v-if="!tab" class="q-pa-md text-grey">Сохранённая вкладка не найдена</div>

    <!-- HTML -->
    <div v-else-if="tab.type === 'html'" class="frame-wrap">
      <iframe class="html-frame" :srcdoc="srcdoc"></iframe>
    </div>

    <!-- Изображения -->
    <div v-else-if="tab.type === 'images'" class="q-pa-md images-wrap">
      <div class="row q-col-gutter-md">
        <div v-for="(src, i) in tab.payload.images" :key="i" class="col-12 col-md-6">
          <q-img :src="src" ratio="16/9" spinner-color="primary" />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useSavedTabs } from '../stores/savedTabs'
import { backendURL } from '../data/lookups.js'
import { prepareVisIframeHtml } from '../utils/html'

const route = useRoute()
const store = useSavedTabs()

const tab = computed(() => store.byId(route.params.id))

const srcdoc = computed(() => {
  const t = tab.value
  if (!t || t.type !== 'html') return ''
  return prepareVisIframeHtml(t.payload?.html || '', backendURL)
})
</script>

<style scoped>
.page-bleed {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 0px);
  min-height: 0;
}
.frame-wrap {
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
}
.html-frame {
  flex: 1 1 auto;
  width: 100%;
  height: 100%;
  display: block;
  border: 0;
  background: white;
}
.images-wrap {
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
}
</style>
