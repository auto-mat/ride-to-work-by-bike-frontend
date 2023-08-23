<script lang='ts'>
import { defineComponent } from 'vue';

// types
import { NewsletterOption } from './types';

export default defineComponent({
  name: 'NewsletterSwitch',
  props: {
    options: {
      type: Array as () => NewsletterOption[],
      required: true,
    }
  }
})
</script>

<template>
  <div
    data-cy="newsletter-switch"
    class="row q-col-gutter-lg items-center justify-between"
  >
    <div class="gt-sm col-md-3" data-cy="newsletter-col-image">
      <div class="q-px-xl">
        <q-img
          src="~assets/image/newsletter-envelope.png"
          data-cy="newsletter-switch-image"
        />
      </div>
    </div>
    <div class="col-12 col-md-9" data-cy="newsletter-col-content">
      <h2 class="q-mb-md q-mt-none text-h6" data-cy="newsletter-switch-title">
        {{ $t('index.newsletterSwitch.title') }}
      </h2>
      <div
        class="q-my-md"
        v-html="$t('index.newsletterSwitch.description')"
        data-cy="newsletter-switch-description"
      ></div>
      <div>
        <h3 class="text-caption text-weight-bold" data-cy="newsletter-switch-group-title">{{ $t('index.newsletterSwitch.groupTitle') }}</h3>
        <div v-for="option in options" :key="option.id" data-cy="newsletter-switch-group">
          <div>
            <q-toggle size="sm" v-model="option.id" val="sm" :label="option.label" />
          </div>
        </div>
        <p class="text-caption text-blue-grey-7" data-cy="newsletter-switch-group-message">{{ $t('index.newsletterSwitch.message') }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
:deep(.q-toggle__label) {
  color: $grey-10;
}
</style>
