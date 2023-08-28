<script lang="ts">
import { defineComponent } from 'vue';

// components
import VueLanguageSwitcher from 'components/VueLanguageSwitcher.vue';

export default defineComponent({
  name: 'VueFooter',
  components: {
    VueLanguageSwitcher,
  },
  setup() {
    const copyrightList = ['copyrightOpenSource', 'copyrightAuthor'];

    function scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }

    return {
      copyrightList,
      scrollToTop,
    };
  },
});
</script>

<template>
  <div class="absolute-bottom text-white overflow-hidden" data-cy="footer">
    <q-img
      class="absolute-top-left h-254"
      src="~assets/svg/bg-footer.svg"
      data-cy="footer-background"
    />
    <div class="relative-position pt-112">
      <div
        class="footer-wrapper h-lg-142 max-w-lg-90perc flex items-end q-px-md"
      >
        <div class="footer-scroll-top shrink-0">
          <q-btn
            class="w-38 h-38 gt-sm"
            color="white"
            outline
            round
            data-cy="footer-top-button"
            @click.prevent="scrollToTop"
          >
            <q-icon name="arrow_upward" size="18px" />
          </q-btn>
        </div>
        <div class="footer-content h-full grow">
          <div class="grow flex flex-wrap items-start justify-between gap-8">
            <q-img
              src="~assets/svg/logo-white.svg"
              width="142px"
              height="40px"
              data-cy="footer-logo"
            />
            <q-btn
              class="w-38 h-38 lt-md"
              color="white"
              outline
              round
              data-cy="footer-top-button"
              @click.prevent="scrollToTop"
            >
              <q-icon name="arrow_upward" size="18px" />
            </q-btn>
            <div
              class="flex w-full w-md-auto flex-wrap items-center justify-center text-center gap-12 copyright lt-md"
              data-cy="footer-copyright-list"
            >
              <div
                v-for="(message, index) in copyrightList"
                :key="message"
                class="text-white flex items-center gap-12"
              >
                <span v-html="$t('index.footer.' + message)"></span>
                <span v-if="index < copyrightList.length - 1" class="gt-sm">|</span>
              </div>
            </div>
            <div class="flex column items-center md-row w-full w-md-auto">
              <div
                class="flex items-center gap-32"
                data-cy="footer-social-menu"
              >
                <q-icon name="mdi-facebook" size="18px" />
                <q-icon name="mdi-instagram" size="18px" />
                <q-icon name="mdi-youtube" size="18px" />
              </div>
              <span class="q-mx-lg gt-sm">|</span>
              <vue-language-switcher />
            </div>
          </div>
          <div
            class="flex flex-wrap items-center gap-12 copyright gt-sm"
            data-cy="footer-copyright-list"
          >
            <div
              v-for="(message, index) in copyrightList"
              :key="message"
              class="text-white flex items-center gap-12"
            >
              <span v-html="$t('index.footer.' + message)"></span>
              <span v-if="index < copyrightList.length - 1" class="gt-sm">|</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div></div>
  </div>
</template>

<style scoped lang="scss">
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
.w-md-auto {
  @media (min-width: $breakpoint-md-min) {
    width: auto;
  }
}
.max-w-lg-90perc {
  @media (min-width: $breakpoint-lg-min) {
    max-width: 90%;
  }
}
.h-full {
  height: 100%;
}
.h-lg-142 {
  @media (min-width: $breakpoint-lg-min) {
    height: 142px;
  }
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
.gap-8 {
  gap: 8px;
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
.md-flex {
  @media (min-width: $breakpoint-md-min) {
    display: flex;
  }
}
.md-row {
  @media (min-width: $breakpoint-md-min) {
    flex-direction: row;
  }
}
.footer-wrapper {
  background-color: $grey-10;
  @media (min-width: $breakpoint-md-min) {
    background-color: transparent;
  }
}
.footer-scroll-top {
  padding-top: 16px;
  @media (min-width: $breakpoint-md-min) {
    padding-left: 16px;
    padding-right: 16px;
    padding-bottom: 8px;
  }
  @media (min-width: $breakpoint-md-min) {
    padding-top: 0;
    padding-bottom: 24px;
  }
}
.footer-content {
  padding-top: 16px;
  padding-bottom: 70px;
  @media (min-width: $breakpoint-md-min) {
    padding-top: 32px;
  }
  @media (min-width: $breakpoint-md-min) {
    padding-bottom: 0;
  }
}
.language-list {
  list-style: none;
  font-size: 14px;
  padding-left: 0;
  padding-inline-start: 0;
}
.copyright {
  padding-bottom: 16px;
  @media (min-width: $breakpoint-sm-min) {
    height: 38px;
    min-height: 0;
  }
  :deep(a) {
    color: #fff;
  }
}
</style>
