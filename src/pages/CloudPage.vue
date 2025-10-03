<template>
  <q-page class="q-pa-md">
    <AwaitServer :loading="loading" :error="error" @retry="retry">
      <q-img v-if="img" :src="img" ratio="16/9" spinner-color="primary" />
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
const img = ref('')

function parseIds () {
  const raw = route.query.ids
  if (!raw) return []
  return String(raw).split(',').map(s => Number(s.trim())).filter(Number.isFinite)
}

async function postData () {
  loading.value = true
  error.value = ''
  img.value = ''
  try {
    const ids = parseIds()
    if (!ids.length) throw new Error('Пустой список идентификаторов')
    const res = await fetch(`${backendURL}/cloud`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 'Уникальный ключ': ids })
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const ct = res.headers.get('content-type') || ''
    if (ct.includes('image/png')) {
      const blob = await res.blob()
      const url = await blobToDataURL(blob)
      img.value = url
      store.addImages({ title: `Облако (${new Date().toLocaleString()})`, images: [url] })
    } else if (ct.includes('application/json')) {
      const data = await res.json()
      const url = (data?.image || data?.images?.[0]) || ''
      img.value = url
      store.addImages({ title: `Облако (${new Date().toLocaleString()})`, images: [url] })
    } else {
      throw new Error('Ожидали PNG от сервера')
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
