<template>
  <q-page class="q-pa-md">
    <AwaitServer :loading="loading" :error="error" @retry="retry">
      <div v-if="images.length" class="row q-col-gutter-md">
        <div v-for="(src, i) in images" :key="i" class="col-12 col-md-6">
          <q-img :src="src" ratio="16/9" spinner-color="primary" />
        </div>
      </div>
    </AwaitServer>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { backendURL } from '@/data/lookups.js'
import { blobToDataURL } from '@/utils/response'
import { useSavedTabs } from '@/stores/savedTabs'
import AwaitServer from '@/components/AwaitServer.vue'

const route = useRoute()
const store = useSavedTabs()

const loading = ref(true)
const error = ref('')
const images = ref([])

function parseIds () {
  const raw = route.query.ids
  if (!raw) return []
  return String(raw).split(',').map(s => Number(s.trim())).filter(Number.isFinite)
}

async function postData () {
  loading.value = true
  error.value = ''
  images.value = []
  try {
    const ids = parseIds()
    if (!ids.length) throw new Error('Пустой список идентификаторов')
    const res = await fetch(`${backendURL}/dashboards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 'Уникальный ключ': ids })
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const ct = res.headers.get('content-type') || ''

    // Вариант 1: сервер вернул JSON с base64/URL массива
    if (ct.includes('application/json')) {
      const data = await res.json()
      const arr = data?.images || data?.imgs || []
      images.value = arr
      store.addImages({ title: `Дашборды (${new Date().toLocaleString()})`, images: arr })
    }
    // Вариант 2: сервер вернул multipart (реже) — здесь нужен парсер, пропускаем
    // Вариант 3: сервер вернул ZIP/октет-стрим — нужен JSZip, пропустим
    else if (ct.includes('image/png')) {
      // теоретически может прийти одна картинка; кладём как одну
      const blob = await res.blob()
      const url = await blobToDataURL(blob)
      images.value = [url]
      store.addImages({ title: `Дашборды (${new Date().toLocaleString()})`, images: [url] })
    } else {
      throw new Error('Ожидали JSON с массивом PNG или PNG')
    }
  } catch (e) {
    error.value = e?.message || String(e)
  } finally {
    loading.value = false
  }
}
function retry() { postData() }
onMounted(postData)
</script>
