<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'VueFooter',
  setup() {
    const copyrightList = ['copyrightOpenSource', 'copyrightAuthor'];

    return {
      copyrightList
    };
  }
})
</script>

<template>
  <div class="relative-position text-white overflow-hidden q-px-md" data-cy="footer">
    <q-img class="absolute-top-left h-254" src="~assets/svg/bg-footer.svg" data-cy="footer-background" />
    <div class="relative-position pt-112">
      <div class="h-142 max-w-lg-90perc flex items-end">
        <div class="q-px-md q-pb-md shrink-0">
          <q-btn class="w-38 h-38" color="white" outline round data-cy="footer-top-button">
            <q-icon name="arrow_upward" size="18px" />
          </q-btn>
        </div>
        <div class="h-full grow">
          <div class="grow flex items-start justify-between pt-32">
            <q-img src="~assets/svg/logo-white.svg" width="142px" height="40px" data-cy="footer-logo" />
            <div class="flex items-center">
              <div class="flex items-center gap-32" data-cy="footer-social-menu">
                <q-icon name="mdi-facebook" size="18px" />
                <q-icon name="mdi-instagram" size="18px" />
                <q-icon name="mdi-youtube" size="18px" />
              </div>
              <span class="q-mx-lg">|</span>
              <ul class="language-list flex items-center text-subtitle1 gap-24" data-cy="footer-language-switcher">
                <li v-for="item in Object.keys($i18n.messages)" :key="item" class="text-uppercase">
                  <a href="#" @click.prevent="$i18n.locale = item" class="text-white" :class="{'text-bold': item === $i18n.locale}">
                    {{item}}
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div class="h-38 flex flex-wrap items-center gap-12 copyright" data-cy="footer-copyright-list">
            <div v-for="(message, index) in copyrightList" :key="message" class="text-white flex items-center gap-12">
              <span v-html="$t('index.footer.' + message)"></span>
              <span v-if="index < copyrightList.length - 1">|</span>
            </div>
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
.max-w-lg-90perc {
@media (min-width: $breakpoint-lg-min) {
  max-width: 90%;
}
}
.h-full {
  height: 100%;
}
.h-142 {
  height: 142px;
}
.h-254 {
  height: 254px;
}
.w-38 {
  width: 38px;
  min-width: 0;
}
.h-38 {
  height: 38px;
  min-height: 0;
}
.gap-12 {
  gap: 12px;
}
.gap-24 {
  gap: 24px;
}
.gap-32 {
  gap: 32px;
}
.language-list {
  list-style: none;
  font-size: 14px;
  padding-left: 0;
  padding-inline-start: 0;
}
.copyright {
  :deep(a) {
    color: #fff;
  }
}
</style>
