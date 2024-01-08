<script lang="ts">
/**
 * ContactForm Component
 *
 * The `ContactForm` component provides a user interface for visitors to
 * send messages or queries through a contact form.
 *
 * @description
 * This component manages a reactive contact form with fields for subject,
 * message, file attachment, and email. The form data can be submitted,
 * and upon submission, an event is emitted to allow parent components
 * to handle the data, e.g., sending it to an API.
 *
 * @events
 * - `formSubmit`: Emitted when the form is submitted.
 *
 * @example
 * <contact-form @formSubmit="handleFormSubmit" />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=4858%3A103862&mode=dev)
 */

// libraries
import { defineComponent, reactive } from 'vue';

// composables
import { useValidation } from 'src/composables/useValidation';

export default defineComponent({
  name: 'ContactForm',
  emits: ['formSubmit'],
  setup(props, { emit }) {
    const contactForm = reactive({
      subject: '',
      message: '',
      file: null,
      email: '',
    });

    const { isEmail, isFilled } = useValidation();

    const onSubmit = () => {
      emit('formSubmit');

      // TODO: add api call
    };

    return {
      contactForm,
      onSubmit,
      isEmail,
      isFilled,
    };
  },
});
</script>

<template>
  <q-form class="q-gutter-md" @submit.prevent="onSubmit">
    <!-- Subject input widget -->
    <div class="q-mt-lg" data-cy="contact-form-subject">
      <label for="contact-form-subject" class="text-caption text-bold">
        {{ $t('index.contact.subject') }}
      </label>
      <q-input
        dense
        outlined
        lazy-rules
        v-model="contactForm.subject"
        id="contact-form-subject"
        name="subject"
        :rules="[(val) => isFilled(val) || $t('index.contact.subjectRequired')]"
        class="q-mt-sm"
        data-cy="contact-form-subject-input"
      />
    </div>
    <!-- Message input widget -->
    <div class="q-mt-none" data-cy="contact-form-message">
      <label for="contact-form-message" class="text-caption text-bold">
        {{ $t('index.contact.message') }}
      </label>
      <q-input
        dense
        outlined
        lazy-rules
        v-model="contactForm.message"
        id="contact-form-message"
        name="message"
        type="textarea"
        :rules="[(val) => isFilled(val) || $t('index.contact.messageRequired')]"
        class="q-mt-sm"
        data-cy="contact-form-message-input"
      />
    </div>
    <!-- File input widget -->
    <div data-cy="contact-form-file">
      <q-file
        dense
        borderless
        v-model="contactForm.file"
        :label="$t('index.contact.file')"
        label-color="black"
        class="file-input text-body2 text-uppercase"
        data-cy="contact-form-file-input"
      >
        <template v-slot:prepend>
          <q-icon name="attachment" color="black" size="xs" />
        </template>
      </q-file>
    </div>
    <!-- Email input widget -->
    <div class="q-mt-none" data-cy="contact-form-email">
      <label for="contact-form-email" class="text-caption text-bold">
        {{ $t('index.contact.email') }}
      </label>
      <q-input
        dense
        outlined
        lazy-rules
        v-model="contactForm.email"
        id="contact-form-email"
        name="email"
        type="email"
        :rules="[
          (val) =>
            (isFilled(val) && isEmail(val)) ||
            $t('index.contact.emailRequired'),
        ]"
        class="q-mt-sm"
        data-cy="contact-form-email-input"
      />
    </div>
    <!-- Submit button -->
    <div class="flex justify-end">
      <q-btn
        :label="$t('index.contact.submit')"
        type="submit"
        color="black"
        rounded
        unelevated
        data-cy="contact-form-submit"
      />
    </div>
  </q-form>
</template>

<style scoped lang="scss">
form :deep(.q-field__control) {
  border-radius: 8px;
}
</style>
