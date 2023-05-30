<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'VueHeadingBackground',
  props: {
    title: {
      type: String,
    }
  }
})
</script>

<template>
  <div class="wrapper relative-position">
    <q-img src="~assets/svg/bg-community.svg" class="w-100"></q-img>
    <div class="absolute-center flex justify-center">
      <h2 class="text-h5 text-weight-bold" data-testid="heading-bg-title">
        {{ title }}
      </h2>
    </div>
  </div>
</template>

<style scoped lang="scss">
.wrapper {
  margin: 0 -24px;
}
</style>
