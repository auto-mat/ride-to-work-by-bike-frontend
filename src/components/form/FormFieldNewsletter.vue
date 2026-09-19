<script lang="ts">
/**
 * FormFieldNewsletter Component
 *
 * @description Use this component to render a newsletter subscription form
 * with options.
 * Note: Used in `FormRegisterCoordinator` and `ProfileDetails` components.
 *
 * @props
 * - `modelValue` (NewsletterType[], required): The array of selected
 * newsletter types.
 *
 * @events
 * - `update:modelValue`: Emitted as a part of v-model structure.
 *
 * @example
 * <form-field-newsletter v-model="newsletter" />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=4858-102976&t=TcHleH8k6gHKSzeE-1)
 */

// libraries
import { defineComponent, computed, ref, watch } from 'vue';

// types
import { NewsletterType } from '../types/Newsletter';

export default defineComponent({
  name: 'FormFieldNewsletter',
  props: {
    modelValue: {
      type: Array as () => NewsletterType[],
      required: true,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    // hidden option `events` stays on backend but is not shown
    const newsletterOptions = [
      {
        label: 'form.personalDetails.labelNewsletterChallenges',
        value: NewsletterType.challenge,
      },
      {
        label: 'form.personalDetails.labelNewsletterMobility',
        value: NewsletterType.mobility,
      },
    ];

    const visibleValues = newsletterOptions.map((option) => option.value);

    const newsletter = computed({
      get: () => props.modelValue,
      set: (value) => {
        isNewsletterAll.value = visibleValues.every((visibleValue) =>
          value.includes(visibleValue),
        );
        emit('update:modelValue', value);
      },
    });

    const isNewsletterAll = ref(false);
    watch(isNewsletterAll, (newVal) => {
      newsletter.value = newVal
        ? [...visibleValues]
        : newsletter.value.filter((value) => !visibleValues.includes(value));
    });

    return {
      isNewsletterAll,
      newsletter,
      newsletterOptions,
    };
  },
});
</script>

<template>
  <div data-cy="form-field-newsletter">
    <!-- Label -->
    <label
      for="form-newsletter"
      class="text-grey-10 text-caption text-bold"
      data-cy="newsletter-label"
    >
      {{ $t('form.personalDetails.titleNewsletter') }}
    </label>
    <!-- Enable all option -->
    <div class="q-mt-sm">
      <q-checkbox
        dense
        v-model="isNewsletterAll"
        color="primary"
        :label="$t('form.personalDetails.labelNewsletterAll')"
        data-cy="newsletter-option-all"
      />
    </div>
    <!-- Checkbox group -->
    <q-option-group
      dense
      id="form-newsletter"
      v-model="newsletter"
      :options="newsletterOptions"
      :disable="isNewsletterAll"
      color="primary"
      type="checkbox"
      class="q-gutter-md q-mt-md"
      data-cy="newsletter-options"
    >
      <!-- Default slot: label (used so that label is translated dynamically) -->
      <template v-slot:label="option">
        <span data-cy="newsletter-option">{{ $t(option.label) }}</span>
      </template>
    </q-option-group>
  </div>
</template>
