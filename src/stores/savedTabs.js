import { defineStore } from 'pinia'
import { nanoid } from 'nanoid/non-secure' 

const STORAGE_KEY = 'saved-tabs-v1'

export const useSavedTabs = defineStore('savedTabs', {
  state: () => ({
    tabs: [] // [{ id, title, type: 'html'|'images', payload: { html? , images?[] }, createdAt }]
  }),

  getters: {
    byId: (state) => (id) => state.tabs.find(t => t.id === id)
  },

  actions: {
    _persist() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.tabs))
      } catch (e) {
        console.error('Persist error', e)
      }
    },
    load() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        this.tabs = raw ? JSON.parse(raw) : []
      } catch (e) {
        console.error('Load error', e)
        this.tabs = []
      }
    },
    addHtml({ title, html }) {
      const id = nanoid(8)
      this.tabs.push({
        id,
        title: title || 'Граф',
        type: 'html',
        payload: { html },
        createdAt: Date.now()
      })
      this._persist()
      return id
    },
    addImages({ title, images }) {
      const id = nanoid(8)
      this.tabs.push({
        id,
        title: title || 'Изображения',
        type: 'images',
        payload: { images }, 
        createdAt: Date.now()
      })
      this._persist()
      return id
    },
    rename(id, title) {
      const t = this.byId(id)
      if (t) {
        t.title = title || t.title
        this._persist()
      }
    },
    remove(id) {
      this.tabs = this.tabs.filter(t => t.id !== id)
      this._persist()
    }
  }
})
