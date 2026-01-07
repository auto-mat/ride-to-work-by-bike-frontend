<script lang="ts">
/**
 * FormAddTeam Component
 *
 * @description * Use this component to render form for registering a new
 * team.
 *
 * Note: This component is commonly used in `FormFieldSelectTable`.
 *
 * @props
 * - `formValues` (Object, required): The object representing the form state.
 *
 * @events
 * - `update:formValues`: Emitted as a part of v-model structure.
 *
 * @components
 * - `FormFieldTextRequired`: Component to render required field.
 *
 * @example
 * <form-add-team />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=6691%3A28263&mode=dev)
 */

import { computed, defineComponent, nextTick, ref } from 'vue';

// components
import FormFieldTextRequired from '../global/FormFieldTextRequired.vue';

// i18n
import { i18n } from 'src/boot/i18n';

// stores
import { useChallengeStore } from 'src/stores/challenge';

// types
import type { FormTeamFields } from '../types/Form';

export default defineComponent({
  name: 'FormAddTeam',
  components: {
    FormFieldTextRequired,
  },
  props: {
    formValues: {
      type: Object as () => FormTeamFields,
      required: true,
    },
  },
  emits: ['update:formValues'],
  setup(props, { emit }) {
    const team = ref(props.formValues);
    const challengeStore = useChallengeStore();

    const onUpdate = (): void => {
      // wait for next tick to emit the value after update
      nextTick((): void => {
        emit('update:formValues', team.value);
      });
    };

    const maxTeamMembers = computed<number | null>(
      () => challengeStore.getMaxTeamMembers,
    );

    const teamText = computed(() => {
      // text is relevant/shown only if maxTeamMembers > 1
      if (!maxTeamMembers.value || maxTeamMembers.value === 1) {
        return '';
      } else {
        return i18n.global.t(
          'form.team.textTeam',
          { count: maxTeamMembers.value },
          maxTeamMembers.value,
        );
      }
    });

    return {
      team,
      teamText,
      onUpdate,
    };
  },
});
</script>

<template>
  <div>
    <form-field-text-required
      v-model="team.name"
      name="name"
      :label="$t('form.team.labelTeamName')"
      :label-short="$t('form.team.labelTeam')"
      @update:model-value="onUpdate"
      data-cy="form-add-team-name"
    />
    <div v-html="teamText" class="q-mt-sm" data-cy="form-add-team-text" />
  </div>
</template>
