<template>
  <q-page class="q-pa-md">
    <AwaitServer :loading="loading" :error="error" @retry="retry">
      <div class="text-positive text-subtitle1">Запрос отправлен успешно.</div>
    </AwaitServer>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { backendURL } from '../data/lookups.js'
import { useQuasar } from 'quasar'
import AwaitServer from '../components/AwaitServer.vue'

const $q = useQuasar()
const route = useRoute()
const loading = ref(true)
const error = ref('')

function parseIds () {
  const raw = route.query.ids
  if (!raw) return []
  return String(raw).split(',').map(s => Number(s.trim())).filter(Number.isFinite)
}

async function postData () {
  loading.value = true
  error.value = ''
  try {
    const ids = parseIds()
    if (!ids.length) throw new Error('Пустой список идентификаторов')
    const res = await fetch(`${backendURL}/dashboards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 'Уникальный ключ': ids })
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    $q.notify({ type: 'positive', message: 'Данные отправлены' })
  } catch (e) {
    error.value = e?.message || String(e)
    $q.notify({ type: 'negative', message: 'Не удалось отправить данные' })
  } finally {
    loading.value = false
  }
}
function retry () { postData() }

onMounted(postData)
</script>
