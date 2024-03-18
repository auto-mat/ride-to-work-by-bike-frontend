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
import { QForm } from 'quasar';
import { computed, defineComponent, ref } from 'vue';

// composables
import { i18n } from 'src/boot/i18n';
import { useValidation } from 'src/composables/useValidation';

// types
import type { FormOption } from '../types/Form';

export default defineComponent({
  name: 'FormInviteFriends',
  setup() {
    const emailAddresses = ref<string>('');
    const language = ref<string>(i18n.global.locale);

    // dynamically build array of language options
    const optionsLanguage = computed((): FormOption[] => {
      const locales = i18n.global.availableLocales;
      const options: FormOption[] = [];
      locales.forEach((locale) => {
        options.push({
          label: i18n.global.t(`language.${locale}`),
          value: locale,
          icon: `img:${
            new URL(`../../assets/svg/flag-${locale}.svg`, import.meta.url).href
          }`,
        });
      });
      return options;
    });
    const selectedLanguage = computed((): FormOption | null => {
      const languageObject: FormOption | undefined = optionsLanguage.value.find(
        (option) => option.value === language?.value,
      );
      if (languageObject) {
        return languageObject;
      }
      return null;
    });

    const formInviteRef = ref<typeof QForm | null>(null);
    const onSubmit = () => {
      formInviteRef.value?.validate();
    };

    const { isEmailList, isFilled } = useValidation();

    return {
      emailAddresses,
      formInviteRef,
      language,
      optionsLanguage,
      selectedLanguage,
      isEmailList,
      isFilled,
      onSubmit,
    };
  },
});
</script>

<template>
  <div class="row q-col-gutter-md" data-cy="form-invite-friends">
    <!-- Description text -->
    <q-form ref="formInviteRef" class="col-12 col-sm-6" data-cy="column-1">
      <div
        v-html="$t('onboarding.descriptionInvite')"
        class="text-grey-10 q-mb-lg"
        data-cy="invite-description"
      />
      <!-- Input widget: Email addresses -->
      <div class="q-my-md" data-cy="invite-email-addresses">
        <label
          for="invite-email-addresses"
          class="text-caption text-bold text-grey-10"
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
            (val) => isFilled(val) || $t('onboarding.messageRequiredEmailList'),
            (val) =>
              isEmailList(val) || $t('onboarding.messageInvalidEmailList'),
          ]"
          class="q-mt-sm"
          data-cy="invite-email-addresses-input"
        />
      </div>
      <!-- Input widget: Language select -->
      <div class="q-my-md" data-cy="invite-language">
        <label
          for="select-language"
          class="text-caption text-bold text-grey-10"
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
          <!-- Item: Selected language -->
          <template v-slot:selected>
            <q-item dense v-if="selectedLanguage">
              <!-- Flag -->
              <q-item-section avatar>
                <q-icon :name="selectedLanguage.icon" size="18px" />
              </q-item-section>
              <!-- Label -->
              <q-item-section>
                <q-item-label class="text-subtitle2 text-grey-10">
                  {{ selectedLanguage.label }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </template>
          <!-- Item: Option -->
          <template v-slot:option="scope">
            <q-item dense v-bind="scope.itemProps">
              <!-- Flag -->
              <q-item-section avatar>
                <q-icon :name="scope.opt.icon" size="18px" />
              </q-item-section>
              <!-- Label -->
              <q-item-section>
                <q-item-label class="text-subtitle2 text-grey-10">{{
                  scope.opt.label
                }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
      <!-- Button: Invite friends -->
      <div class="q-mt-md">
        <q-btn
          rounded
          unelevated
          color="primary"
          class="q-mt-sm"
          data-cy="form-invite-submit"
          @click="onSubmit"
        >
          <q-icon name="send" size="18px" class="q-mr-sm" />
          {{ $t('onboarding.buttonInviteFriends') }}
        </q-btn>
      </div>
    </q-form>
    <!-- Message text -->
    <div class="col-12 col-sm-6" data-cy="column-2">
      <div class="bg-grey-1 q-pa-md">
        <!-- Title -->
        <h3
          class="text-subtitle2 text-weight-bold q-my-none"
          data-cy="title-message"
        >
          {{ $t('onboarding.titleMessage', language) }}
        </h3>
        <!-- Text -->
        <div
          v-html="$t('onboarding.textMessage', language)"
          class="q-mt-lg"
          data-cy="text-message"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
