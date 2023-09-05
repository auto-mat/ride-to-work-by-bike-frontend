<script lang="ts">
import { defineComponent, computed } from 'vue';
import { i18n } from 'src/boot/i18n';

export default defineComponent({
  name: 'VueMenuLinks',
  props: {
    title: {
      type: String,
    },
    variant: {
      type: String as () => 'social' | 'useful',
    },
  },
  setup(props) {
    const itemsSocialLinks = [
      {
        title: i18n.global.t('index.menuLinks.instagram'),
        icon: 'mdi-instagram',
        url: 'https://www.instagram.com/spolekautomat',
      },
      {
        title: i18n.global.t('index.menuLinks.facebook'),
        icon: 'mdi-facebook',
        url: 'https://www.facebook.com/spolekautomat',
      },
      {
        title: i18n.global.t('index.menuLinks.twitter'),
        icon: 'mdi-twitter',
        url: 'https://twitter.com/spolekautomat',
      },
      {
        title: i18n.global.t('index.menuLinks.youtube'),
        icon: 'mdi-youtube',
        url: 'https://www.youtube.com/@spolekautomat',
      },
    ];

    const itemsUsefulLinks = [
      {
        title: 'Auto-Mat.cz',
        icon: 'link',
        url: 'https://auto-mat.cz/',
      },
      {
        title: 'Podpořte nás',
        icon: 'volunteer_activism',
        url: '#',
      },
      {
        title: 'Kód projektu',
        icon: 'mdi-github',
        url: 'https://github.com/auto-mat/ride-to-work-by-bike-frontend',
      },
      {
        title: 'Mobilní aplikace',
        icon: 'smartphone',
        url: '#',
      },
    ];

    const items = computed(() => {
      if (props.variant === 'social') {
        return itemsSocialLinks;
      }
      if (props.variant === 'useful') {
        return itemsUsefulLinks;
      }
      return [];
    });

    return {
      items,
    };
  },
});
</script>

<template>
  <div class="q-px-md q-mt-xl">
    <!-- Btns group title -->
    <h4 class="text-h5 text-weight-bold q-my-none" data-cy="title-menu-links">
      {{ title }}
    </h4>
    <div class="flex flex-wrap gap-x-24" data-cy="menu-links-list">
      <!-- Button -->
      <q-btn
        v-for="item in items"
        :key="item.title"
        :href="item.url"
        rounded
        no-caps
        color="blue-grey-1"
        unelevated
        class="q-btn-underline text-body2 q-mt-md"
        data-cy="button-menu-links"
      >
        <q-icon :name="item.icon" size="xs" color="blue-grey-3"></q-icon>
        <span class="inline-block text-black q-pl-sm">{{ item.title }}</span>
      </q-btn>
    </div>
  </div>
</template>

<style scoped lang="scss">
.gap-x-24 {
  column-gap: 24px;
}

.q-btn {
  &.q-btn-underline {
    span {
      text-decoration: underline;
    }
    &:hover {
      span {
        text-decoration: none;
      }
    }
  }
}
</style>
