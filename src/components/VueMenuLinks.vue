<script lang="ts">
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'VueMenuLinks',
  props: {
    title: {
      type: String
    },
    variant: {
      type: String
    }
  },
  setup(props) {
    const itemsSocialLinks = [
      {
        title: 'Instagram',
        icon: 'mdi-instagram',
        url: 'https://www.instagram.com/spolekautomat',
      },
      {
        title: 'Facebook',
        icon: 'mdi-facebook',
        url: 'https://www.facebook.com/spolekautomat',
      },
      {
        title: 'Twitter',
        icon: 'mdi-twitter',
        url: 'https://twitter.com/spolekautomat',
      },
      {
        title: 'Youtube',
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
        return itemsSocialLinks
      }
      if (props.variant === 'useful') {
        return itemsUsefulLinks
      }
      return []
    })

    return {
      items
    }
  }
})
</script>

<template>
  <div class="q-px-md q-mt-xl">
    <h4 class="text-h5 text-weight-bold q-my-none">
      {{ title }}
    </h4>
    <div class="flex flex-wrap gap-x-24">
      <q-btn
        v-for="item in items"
        :key="item.title"
        :href="item.url"
        rounded
        color="blue-grey-1"
        unelevated
        class="q-btn-no-uppercase q-btn-underline text-body2 q-mt-md"
        data-cy="button-socials"
      >
        <q-icon
          :name="item.icon"
          size="xs"
          color="blue-grey-3"
        ></q-icon>
        <span class="inline-block text-black q-pl-sm">{{
          item.title
        }}</span>
      </q-btn>
    </div>
  </div>
</template>


<style scoped lang="scss">
.gap-x-24 {
  column-gap: 24px;
}

.q-btn {
  &.q-btn-no-uppercase {
    text-transform: none;
  }
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
