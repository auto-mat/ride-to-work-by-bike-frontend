<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'EventCountdown',
  props: {
    date: {
      type: Date,
    }
  },
  setup() {
    return {
    }
  }
})
</script>

<template>
  <q-card square flat class="row items-center justify-evenly q-py-xl">
    <div class="text-center">
      <div class="text-weight-medium">Říjnová výzva začíná 1. 10., to je za</div>
      <div class="row items-center justify-evenly	q-mt-md">
        <div class="q-px-md">
          <div class="text-h3 text-weight-bold">12</div>
          <div class="q-mt-xs">{{ $t('index.days') }}</div>
        </div>
        <div class="q-px-md">
          <div class="text-h3 text-weight-bold">11</div>
          <div class="q-mt-xs">{{ $t('index.hours') }}</div>
        </div>
        <div class="q-px-md">
          <div class="text-h3 text-weight-bold">58</div>
          <div class="q-mt-xs">{{ $t('index.minutes') }}</div>
        </div>
        <div class="q-px-md">
          <div class="text-h3 text-weight-bold">20</div>
          <div class="q-mt-xs">{{ $t('index.seconds') }}</div>
        </div>
      </div>
    </div>
  </q-card>
</template>

<style>
.q-card {
  background-color: var(--q-gray-light);
}
</style>
