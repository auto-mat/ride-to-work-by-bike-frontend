<script lang="ts">
import { defineComponent, reactive } from 'vue';

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

    const isContactFormValid = (val: string): boolean => val?.length > 0;

    const onSubmit = () => {
      emit('formSubmit');

      // TODO: add api call
    };

    return {
      contactForm,
      onSubmit,
      isContactFormValid,
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
        v-model="contactForm.subject"
        id="contact-form-subject"
        name="subject"
        lazy-rules
        :rules="[
          (val) =>
            isContactFormValid(val) || $t('index.contact.subjectRequired'),
        ]"
        class="q-mt-sm"
        outlined
        dense
        data-cy="contact-form-subject-input"
      />
    </div>
    <!-- Message input widget -->
    <div class="q-mt-none" data-cy="contact-form-message">
      <label for="contact-form-message" class="text-caption text-bold">
        {{ $t('index.contact.message') }}
      </label>
      <q-input
        v-model="contactForm.message"
        id="contact-form-message"
        name="message"
        type="textarea"
        :rules="[
          (val) =>
            isContactFormValid(val) || $t('index.contact.messageRequired'),
        ]"
        class="q-mt-sm"
        outlined
        dense
        data-cy="contact-form-message-input"
      />
    </div>
    <!-- File input widget -->
    <div data-cy="contact-form-file">
      <q-file
        v-model="contactForm.file"
        :label="$t('index.contact.file')"
        label-color="black"
        class="file-input text-body2 text-uppercase"
        borderless
        dense
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
        v-model="contactForm.email"
        id="contact-form-email"
        name="email"
        type="email"
        lazy-rules
        :rules="[
          (val) => isContactFormValid(val) || $t('index.contact.emailRequired'),
        ]"
        class="q-mt-sm"
        outlined
        dense
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

<style scoped>
form :deep(.q-field__control) {
  border-radius: 8px;
}
</style>
