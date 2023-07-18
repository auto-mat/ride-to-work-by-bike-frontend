<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'VueFooter',
})
</script>

<template>
  <div class="relative-position text-white">
    <q-img class="absolute-top-left" src="~assets/svg/bg-footer.svg" data-cy="footer-background" />
    <div class="pt-112">
      <div class="h-142 flex items-end">
        <div class="q-px-md q-pb-md shrink-0">
          <q-btn class="w-38 h-38" color="white" outline round>
            <q-icon name="arrow_upward" size="18px" />
          </q-btn>
        </div>
        <div class="h-full grow flex items-center justify-between q-pb-md pt-32">
          <q-img src="~assets/svg/logo-white.svg" width="142px" height="40px" data-cy="footer-logo" />
          <div class="flex items-center">
            <div class="flex items-center gap-32" data-cy="footer-social-menu">
              <q-icon name="mdi-facebook" size="18px" />
              <q-icon name="mdi-instagram" size="18px" />
              <q-icon name="mdi-youtube" size="18px" />
            </div>
            <ul class="flex items-center" data-cy="footer-language-switcher">
              <li>cs</li>
              <li>sk</li>
              <li>en</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.pt-32 {
  padding-top: 32px;
}
.pt-112 {
  padding-top: 112px;
}
.grow {
  flex-grow: 1;
}
.shrink-0 {
  flex-shrink: 0;
}
.w-full {
  width: 100%;
}
.h-full {
  height: 100%;
}
.h-142 {
  height: 142px;
}
.w-38 {
  width: 38px;
}
.h-38 {
  height: 38px;
}
.gap-32 {
  gap: 32px;
}
</style>
