<script lang="ts">
import { defineComponent } from 'vue';
import { BannerImage } from 'components/types';

export default defineComponent({
  name: 'VueBannerImage',
  props: {
    banner: {
      type: Object as () => BannerImage,
      required: true,
    },
  },
  setup() {
    return {};
  },
});
</script>

<template>
  <div>
    <q-card
      :dark="true"
      :flat="true"
      :bordered="true"
      class="rounded-20 row"
      data-testid="banner"
    >
      <q-img
        :src="banner?.image"
        :ratio="3 / 1"
        class="col-6"
        data-testid="banner-half"
      />
      <div
        class="col-6 flex items-center q-px-md q-py-lg"
        data-testid="banner-half"
      >
        <div>
          <div
            v-if="banner.title"
            class="text-dark text-subtitle1"
            data-testid="banner-title"
          >
            {{ banner.title }}
          </div>
          <div
            v-if="banner.perex"
            class="text-dark text-caption"
            data-testid="banner-perex"
          >
            {{ banner.perex }}
          </div>
        </div>
      </div>
    </q-card>
  </div>
</template>

<style scoped>
.rounded-20 {
  border-radius: 20px;
}

.q-card > div:first-child {
  border-top-left-radius: inherit;
  border-bottom-left-radius: inherit;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
</style>
