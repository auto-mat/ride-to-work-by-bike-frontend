<script lang="ts">
/**
 * FormCompanyChallenge Component
 *
 * @description * Use this component to render a form to create a new company
 * challenge. This is a used on `CompanyCoordinatorPage`.
 *
 * @slots
 * - `controls`: For triggering the form via dialog buttons.
 *   exposed props and methods:
 *     - `submit`: Method to submit the form inside the slot
 *
 * @components
 * - `FormFieldDateRequired`: Component to render required date field.
 * - `FormFieldTextRequired`: Component to render required text field.
 *
 * @example
 * <form-company-challenge>
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=4858-106325&t=MqCoIBTXNV4xkXVk-1)
 */

// libraries
import { computed, defineComponent, onMounted } from 'vue';

// components
import FormFieldDateRequired from '../form/FormFieldDateRequired.vue';
import FormFieldTextRequired from '../global/FormFieldTextRequired.vue';

// composables
import { useRoutes } from '../../composables/useRoutes';

// stores
import { useAdminCompetitionStore } from 'src/stores/adminCompetition';
import { useChallengeStore } from 'src/stores/challenge';
import { useTripsStore } from '../../stores/trips';

// enums
import { CompetitorType, CompetitionType } from '../enums/Challenge';

export default defineComponent({
  name: 'FormCompanyChallenge',
  components: {
    FormFieldDateRequired,
    FormFieldTextRequired,
  },
  setup() {
    const adminCompetitionStore = useAdminCompetitionStore();
    const challengeStore = useChallengeStore();
    const tripsStore = useTripsStore();
    const { getRouteIcon, getTransportLabel } = useRoutes();

    const minDate = computed(() => challengeStore.getCompetitionStart);
    const maxDate = computed(() => challengeStore.getCompetitionEnd);

    const iconSize = '18px';

    // load commute modes when component mounts
    onMounted(async () => {
      if (!tripsStore.getCommuteModes.length) {
        await tripsStore.loadCommuteModes();
      }
    });

    const challengeType = computed({
      get: () => adminCompetitionStore.getChallengeType,
      set: (value) =>
        adminCompetitionStore.setCompanyChallengeFormField(
          'challengeType',
          value,
        ),
    });

    const challengeParticipants = computed({
      get: () => adminCompetitionStore.getChallengeParticipants,
      set: (value) =>
        adminCompetitionStore.setCompanyChallengeFormField(
          'challengeParticipants',
          value,
        ),
    });

    const challengeTransportType = computed({
      get: () => adminCompetitionStore.getChallengeTransportType,
      set: (value) =>
        adminCompetitionStore.setCompanyChallengeFormField(
          'challengeTransportType',
          value,
        ),
    });

    const challengeTitle = computed({
      get: () => adminCompetitionStore.getChallengeTitle,
      set: (value) =>
        adminCompetitionStore.setCompanyChallengeFormField(
          'challengeTitle',
          value,
        ),
    });

    const challengeDescription = computed({
      get: () => adminCompetitionStore.getChallengeDescription,
      set: (value) =>
        adminCompetitionStore.setCompanyChallengeFormField(
          'challengeDescription',
          value,
        ),
    });

    const challengeInfoUrl = computed({
      get: () => adminCompetitionStore.getChallengeInfoUrl,
      set: (value) =>
        adminCompetitionStore.setCompanyChallengeFormField(
          'challengeInfoUrl',
          value,
        ),
    });

    const challengeStart = computed({
      get: () => adminCompetitionStore.getChallengeStart,
      set: (value) =>
        adminCompetitionStore.setCompanyChallengeFormField(
          'challengeStart',
          value,
        ),
    });

    const challengeStop = computed({
      get: () => adminCompetitionStore.getChallengeStop,
      set: (value) =>
        adminCompetitionStore.setCompanyChallengeFormField(
          'challengeStop',
          value,
        ),
    });

    const commuteModes = computed(() => {
      return tripsStore.getCommuteModes;
    });

    return {
      challengeType,
      challengeParticipants,
      challengeTransportType,
      challengeTitle,
      challengeDescription,
      challengeInfoUrl,
      challengeStart,
      challengeStop,
      commuteModes,
      iconSize,
      minDate,
      maxDate,
      getRouteIcon,
      getTransportLabel,
      CompetitionType,
      CompetitorType,
    };
  },
});
</script>

<template>
  <div data-cy="form-company-challenge">
    <!-- Section: Challenge type -->
    <fieldset data-cy="form-challenge-type" class="q-pa-none no-border">
      <legend class="text-grey-10 text-caption text-bold q-mb-sm">
        {{ $t('form.labelChallengeType') }}
      </legend>
      <div class="q-gutter-sm">
        <!-- Frequency -->
        <q-radio
          v-model="challengeType"
          :val="CompetitionType.frequency"
          :label="$t('form.labelChallengeTypeRegularity')"
          data-cy="form-challenge-type-regularity"
        />
        <!-- Length -->
        <q-radio
          v-model="challengeType"
          :val="CompetitionType.length"
          :label="$t('form.labelChallengeTypePerformance')"
          data-cy="form-challenge-type-performance"
        />
      </div>
    </fieldset>
    <!-- Section: Participants -->
    <fieldset
      class="q-mt-lg q-pa-none no-border"
      data-cy="form-challenge-participants"
    >
      <legend class="text-grey-10 text-caption text-bold q-mb-sm">
        {{ $t('form.labelParticipants') }}
      </legend>
      <div class="q-gutter-sm">
        <!-- Individuals -->
        <q-radio
          v-model="challengeParticipants"
          :val="CompetitorType.singleUser"
          data-cy="form-participants-individuals"
        >
          <q-icon name="person" class="q-mr-xs text-grey-6" :size="iconSize" />
          {{ $t('form.labelParticipantsIndividuals') }}
        </q-radio>
        <!-- Teams -->
        <q-radio
          v-model="challengeParticipants"
          :val="CompetitorType.team"
          data-cy="form-participants-teams"
        >
          <q-icon name="people" class="q-mr-xs text-grey-6" :size="iconSize" />
          {{ $t('form.labelParticipantsTeams') }}
        </q-radio>
        <!-- Subsidiaries -->
        <q-radio
          v-model="challengeParticipants"
          :val="CompetitorType.subsidiary"
          data-cy="form-participants-subsidiaries"
        >
          <q-icon
            name="mdi-office-building"
            class="q-mr-xs text-grey-6"
            :size="iconSize"
          />
          {{ $t('form.labelParticipantsSubsidiaries') }}
        </q-radio>
      </div>
    </fieldset>
    <!-- Section: Acceptable transport -->
    <fieldset
      class="q-mt-lg q-pa-none no-border"
      data-cy="form-challenge-transport"
    >
      <legend class="text-grey-10 text-caption text-bold q-mb-sm">
        {{ $t('form.labelTransportAcceptable') }}
      </legend>
      <div class="q-gutter-sm">
        <template v-for="mode in commuteModes" :key="mode.slug">
          <q-checkbox
            v-model="challengeTransportType"
            :val="mode.slug"
            :data-cy="`form-acceptable-transport-${mode.slug}`"
          >
            <q-icon
              :name="getRouteIcon(mode.slug)"
              class="q-mr-xs text-grey-6"
              :size="iconSize"
            />
            {{ getTransportLabel(mode.slug) }}
          </q-checkbox>
        </template>
      </div>
    </fieldset>
    <!-- Section: Challenge title -->
    <div class="q-mt-lg">
      <form-field-text-required
        v-model="challengeTitle"
        name="title"
        label="form.labelChallengeTitle"
        data-cy="form-challenge-title"
      />
    </div>
    <!-- Section: Challenge description -->
    <div class="q-mt-sm" data-cy="form-challenge-description">
      <label
        for="form-challenge-description"
        class="text-grey-10 text-caption text-bold"
      >
        {{ $t('form.labelChallengeDescription') }}
      </label>
      <q-input
        dense
        outlined
        hide-bottom-space
        id="form-challenge-description"
        v-model="challengeDescription"
        type="textarea"
        data-cy="form-challenge-description-input"
      />
    </div>
    <!-- Section: Info URL -->
    <div class="q-mt-lg" data-cy="form-challenge-info-url">
      <!-- Label -->
      <label
        for="form-challenge-url"
        class="text-grey-10 text-caption text-bold"
      >
        {{ $t('form.labelChallengeInfoUrl') }}
      </label>
      <!-- Input -->
      <q-input
        dense
        outlined
        hide-bottom-space
        v-model="challengeInfoUrl"
        class="q-mt-sm"
        id="form-challenge-url"
        name="challenge-url"
        data-cy="form-challenge-url-input"
      />
    </div>
    <!-- Section: Dates -->
    <div class="q-mt-lg">
      <div class="row q-col-gutter-lg">
        <div class="col-12 col-sm-6" data-cy="date-column-start">
          <!-- Input: Challenge start -->
          <form-field-date-required
            v-model="challengeStart"
            name="date-start"
            label="form.labelChallengeStart"
            :min-date="minDate"
            :max-date="maxDate"
            data-cy="form-challenge-start"
          />
        </div>
        <div class="col-12 col-sm-6" data-cy="date-column-stop">
          <!-- Input: Challenge stop -->
          <form-field-date-required
            v-model="challengeStop"
            name="date-stop"
            label="form.labelChallengeStop"
            :min-date="minDate"
            :max-date="maxDate"
            data-cy="form-challenge-stop"
          />
        </div>
      </div>
    </div>
  </div>
</template>
