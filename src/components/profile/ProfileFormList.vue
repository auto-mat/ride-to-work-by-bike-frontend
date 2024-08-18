<script lang="ts">
/**
 * ProfileFormList Component
 *
 * @description * Use this component to display user's forms.
 *
 * @example
 * <profile-form-list :forms="[]" />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=6726-57401&t=3uHWCH62UGU9y1JE-0)
 */

// libraries
import { defineComponent } from 'vue';

// types
import type { ProfileForm } from '../types';

export default defineComponent({
  name: 'ProfileFormList',
  props: {
    forms: {
      type: Array as () => ProfileForm[],
      default: () => [],
    },
  },
});
</script>

<template>
  <q-list>
    <q-item v-for="form in forms" :key="form.id">
      <q-item-section avatar top>
        <q-img :src="form.img" data-cy="profile-form-image" />
      </q-item-section>

      <q-item-section>
        <q-item-label>{{ form.name }}</q-item-label>
        <q-item-label v-if="form.caption" caption>
          {{ form.caption }}</q-item-label>
      </q-item-section>

      <q-item-section side>
        <q-btn rounded :to="`/forms/${form.id}`">
          {{ $t('profile.fillFormButton') }}
        </q-btn>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<style lang="scss" scoped>
.q-item {
  border: 1px solid #e0e0e0;
  border-radius: 24px;
  margin-top: 16px;
  padding: 18px;

  .q-img {
    border-radius: 50%;
  }

  .q-btn {
    border: 1px solid #e0e0e0;
    padding: 8px 24px;
  }

  .q-btn::before {
    box-shadow: none;
  }
}
</style>
