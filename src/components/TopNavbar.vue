<template>
  <q-header reveal class="no-pointer custom-navbar">
    <q-toolbar class="q-py-sm">
      <div class="row items-center" style="margin-left: 18vw">
        <div class="hidden-sm-and-down row items-center">
          <TopNavBarButton
            label="Главная"
            :to="{ name: 'home' }"
            style="font-size: 18px; font-weight: bold; color: white; text-transform: none"
          />
        </div>
      </div>
    </q-toolbar>
  </q-header>
</template>

<script setup>
import TopNavBarButton from '../components/TopNavbarButton.vue'
</script>

<style lang="scss">
.no-pointer {
  cursor: default;
}

.custom-navbar {
  color: $secondary;
}
</style>
