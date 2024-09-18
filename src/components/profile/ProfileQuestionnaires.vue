<script lang="ts">
/**
 * ProfileQuestionnaires Component
 *
 * @description * Use this component to render a list of links to
 * questionnaires.
 *
 * Used in `ProfileTabs` component
 *
 * @components
 * - `QuestionnaireItem`: Component to render a questionnaire link.
 *
 * @example
 * <profile-questionnaires />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=6726-57401&t=OG3sxreCJ41q0gWd-1)
 */

// libraries
import { defineComponent } from 'vue';

// components
import QuestionnaireItem from './QuestionnaireItem.vue';

// fixtures
import questionnairesFixture from '../../../test/cypress/fixtures/listQuestionnaires.json';

// types
import type { QuestionnaireLink } from '../types/Questionnaire';

export default defineComponent({
  name: 'ProfileQuestionnaires',
  components: {
    QuestionnaireItem,
  },
  setup() {
    const questionnaires = questionnairesFixture as QuestionnaireLink[];

    return {
      questionnaires,
    };
  },
});
</script>

<template>
  <div data-cy="profile-questionnaires">
    <questionnaire-item
      v-for="(questionnaire, index) in questionnaires"
      :key="`questionnaire-${index}`"
      :questionnaire="questionnaire"
      :class="{ 'q-mb-md': index < questionnaires.length - 1 }"
    />
  </div>
</template>
