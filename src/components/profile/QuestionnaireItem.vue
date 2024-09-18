<script lang="ts">
/**
 * QuestionnaireItem Component
 *
 * @description * Use this component to render a link to a questionnaire.
 *
 * Used in `ProfileQuestionnaires` component.
 *
 * @props
 * - `questionnaire` (QuestionnaireLink, required): Questionnaire object.
 *   It should be of type `QuestionnaireLink`.
 *
 * @example
 * <questionnaire-item :questionnaire="questionnaire" />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=6726-57401&t=T5wPNRBro9elerFm-1)
 */

// libraries
import { defineComponent } from 'vue';

// config
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

// types
import type { QuestionnaireLink } from '../types/Questionnaire';

export default defineComponent({
  name: 'QuestionnaireItem',
  props: {
    questionnaire: {
      type: Object as () => QuestionnaireLink,
      required: true,
    },
  },
  setup() {
    const borderRadius = rideToWorkByBikeConfig.borderRadiusCard;
    const borderColor = rideToWorkByBikeConfig.colorGrayMiddle;

    return {
      borderColor,
      borderRadius,
    };
  },
});
</script>

<template>
  <q-card
    class="q-pa-md bg-white"
    bordered
    flat
    :style="{
      border: `1px solid ${borderColor}`,
      'border-radius': borderRadius,
    }"
    data-cy="questionnaire-item"
  >
    <q-card-section horizontal>
      <!-- Card avatar -->
      <q-item-section
        class="col-auto items-center"
        data-cy="questionnaire-section-image"
      >
        <!-- Image -->
        <q-avatar size="56px" data-cy="questionnaire-avatar">
          <q-img
            :src="questionnaire.image.src"
            data-cy="questionnaire-image"
            :alt="questionnaire.image.alt"
            ratio="1"
          />
        </q-avatar>
      </q-item-section>
      <q-item-section class="col q-pl-sm">
        <div class="row q-col-gutter-sm items-center">
          <div class="col-12 col-sm text-body1" data-cy="questionnaire-title">
            {{ questionnaire.title }}
          </div>
          <div class="col-12 col-sm-auto">
            <q-btn
              v-if="questionnaire.link"
              outline
              rounded
              unelevated
              color="primary"
              :href="questionnaire.link.url"
              :target="questionnaire.link.target"
              data-cy="questionnaire-button"
            >
              <q-icon
                size="18px"
                class="q-mr-sm"
                name="open_in_new"
                data-cy="questionnaire-button-icon"
              />
              <span>{{ $t('profile.buttonFillQuestionnaire') }}</span>
            </q-btn>
          </div>
        </div>
      </q-item-section>
    </q-card-section>
  </q-card>
</template>
