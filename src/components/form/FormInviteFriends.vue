<script lang="ts">
/**
 * FormInviteFriends Component
 *
 * @description * Use this component to render a form for inviting friends.
 *
 * Note: This component is commonly used in `OnboardingStepper`.
 *
 * Component uses lazy-rules="ondemand" which means that validation will be
 * triggered only when component’s validate() method is manually called or
 * when the wrapper QForm submits itself.
 *
 * @example
 * <form-invite-friends />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=4858%3A105087&mode=dev)
 */

// libraries
import { computed, defineComponent, ref } from 'vue';

// composables
import { useValidation } from 'src/composables/useValidation';

// types
import type { FormOption } from '../types/Form';

export default defineComponent({
  name: 'FormInviteFriends',
  setup() {
    const emailAddresses = ref<string>('');
    const language = ref<string>('');
    // Flag icons
    const iconFlagCz = `img:${
      new URL('../assets/svg/flag-cz.svg', import.meta.url).href
    }`;
    const iconFlagSk = `img:${
      new URL('../assets/svg/flag-sk.svg', import.meta.url).href
    }`;
    const iconFlagEn = `img:${
      new URL('../assets/svg/flag-en.svg', import.meta.url).href
    }`;
    // Country options
    const optionsLanguage: FormOption[] = [
      {
        label: 'Czech',
        value: 'cz',
        icon: iconFlagCz,
      },
      {
        label: 'English',
        value: 'en',
        icon: iconFlagEn,
      },
      {
        label: 'Slovak',
        value: 'sk',
        icon: iconFlagSk,
      },
    ];
    const selectedLanguage = computed((): FormOption | null => {
      const languageObject: FormOption | undefined = optionsLanguage.find(
        (option) => option.value === language?.value,
      );
      if (languageObject) {
        return languageObject;
      }
      return null;
    });

    const { isFilled } = useValidation();

    return {
      emailAddresses,
      iconFlagCz,
      iconFlagSk,
      iconFlagEn,
      language,
      optionsLanguage,
      selectedLanguage,
      isFilled,
    };
  },
});
</script>

<template>
  <div class="row q-col-gutter-md">
    <!-- Description text -->
    <div class="col-12 col-sm-6">
      <div
        v-html="$t('onboarding.descriptionStep2')"
        class="text-grey-10 q-mb-lg"
      />
      <!-- Message input widget -->
      <div data-cy="invite-email-addresses">
        <label
          for="invite-email-addresses"
          class="text-caption text-bold text-gray-10"
        >
          {{ $t('onboarding.labelInviteEmailAddresses') }}
        </label>
        <q-input
          dense
          outlined
          hide-bottom-space
          lazy-rules="ondemand"
          v-model="emailAddresses"
          id="invite-email-addresses"
          name="email-addresses"
          type="textarea"
          :rules="[
            (val) => isFilled(val) || $t('onboarding.messageRequiredAddresses'),
          ]"
          class="q-mt-sm"
          data-cy="invite-email-addresses-input"
        />
      </div>
      <div class="q-my-md">
        <label
          for="select-language"
          class="text-caption text-bold text-gray-10"
          >{{ $t('onboarding.labelLanguage') }}</label
        >
        <q-select
          dense
          outlined
          emit-value
          map-options
          hide-bottom-space
          v-model="language"
          :rules="[
            (val) =>
              isFilled(val) ||
              $t('form.messageFieldRequired', {
                fieldName: $t('form.labelLanguage'),
              }),
          ]"
          id="select-language"
          :options="optionsLanguage"
          class="q-mt-sm"
          data-cy="invite-language-input"
        >
          <template v-slot:selected>
            <q-item dense v-if="selectedLanguage">
              <q-item-section avatar>
                <q-icon :name="selectedLanguage.icon" size="18px" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-subtitle2 text-grey-10">{{
                  selectedLanguage.label
                }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
          <template v-slot:option="scope">
            <q-item dense v-bind="scope.itemProps">
              <q-item-section avatar>
                <q-icon :name="scope.opt.icon" size="18px" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-subtitle2 text-grey-10">{{
                  scope.opt.label
                }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
      <div class="q-mt-md">
        <q-btn
          rounded
          unelevated
          color="primary"
          icon="send"
          :label="$t('onboarding.buttonInviteFriends')"
          class="q-mt-sm"
          data-cy="invite-email-addresses-button"
        />
      </div>
    </div>
    <div class="col-12 col-sm-6">
      <div class="bg-grey-1 q-pa-md">
        <h3 class="text-subtitle2 text-weight-bold q-my-none">
          {{ $t('onboarding.titleMessage') }}
        </h3>
        <div v-html="$t('onboarding.textMessage')" class="q-mt-lg" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
