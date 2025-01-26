<script lang="ts">
/**
 * HelpButton Component
 *
 * The `HelpButton` component renders a help button with a help dialog.
 * It provides a default slot for custom button rendering.
 * It exposes an `openDialog` method that can be used as a click handler.
 *
 * @description * Use this component to render a custom help button with help dialog.
 *
 * Note: This component is commonly used in `DrawerHeader` and `LoginRegisterHeader`.
 *
 * @slots
 * - `button`: Slot for custom button rendering. Receives `openDialog` method.
 *
 * @components
 * - `ContactForm`: Component to display contact form inside the dialog.
 * - `DialogDefault`: Component to render help dialog with slots.
 * - `ListFaq`: Component to display FAQ list inside the dialog.
 * - `MenuLinks`: Component to display social links and useful links inside
 *   the dialog.
 *
 * @example
 * <HelpButton>
 *   <template #button="{ openDialog }">
 *     <q-btn @click="openDialog">Help</q-btn>
 *   </template>
 * </HelpButton>
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=6269%3A24768&mode=dev)
 */

// libraries
import { defineComponent, ref } from 'vue';

// types
import type { Ref } from 'vue';
import type { DialogStates } from 'components/types';

// components
import ContactForm from './ContactForm.vue';
import DialogDefault from './DialogDefault.vue';
import ListFaq from './ListFaq.vue';
import MenuLinks from './MenuLinks.vue';

export default defineComponent({
  name: 'HelpButton',
  components: {
    ContactForm,
    DialogDefault,
    ListFaq,
    MenuLinks,
  },
  setup() {
    const isButtonHelpEnabled = false;
    const isDialogOpen = ref(false);
    const userEmail = ref('');
    const activeState: Ref<DialogStates> = ref('default');

    const setState = (value: DialogStates): void => {
      activeState.value = value;
    };

    const reset = (): void => {
      setState('default');
      isDialogOpen.value = false;
    };

    const onFormSubmit = (email: string) => {
      activeState.value = 'sent';
      userEmail.value = email;
    };

    const openDialog = (): void => {
      isDialogOpen.value = true;
    };

    return {
      activeState,
      isDialogOpen,
      userEmail,
      onFormSubmit,
      openDialog,
      reset,
      setState,
      isButtonHelpEnabled,
    };
  },
});
</script>

<template>
  <div v-if="isButtonHelpEnabled">
    <slot name="button" :open-dialog="openDialog">
      <!-- Default slot button -->
      <q-btn
        unelevated
        round
        size="15px"
        color="white"
        @click.prevent="openDialog"
        data-cy="button-help"
      >
        <q-icon
          name="svguse:/icons/button_icons.svg#question-mark"
          size="38px"
          color="primary"
          data-cy="icon-help"
        />
      </q-btn>
    </slot>
    <!-- Dialog -->
    <dialog-default
      no-padding
      v-model="isDialogOpen"
      min-width="0"
      data-cy="dialog-help"
    >
      <template #title>
        <!-- Navigation button: Default state (arrow) -->
        <q-btn
          v-if="activeState !== 'default'"
          round
          unelevated
          size="xs"
          color="transparent"
          class="q-mr-sm"
          @click.prevent="setState('default')"
        >
          <q-icon name="west" size="xs" color="grey-8" />
        </q-btn>
        <span v-if="activeState === 'default'">
          {{ $t('index.help.titleStateDefault') }}
        </span>
        <span v-else-if="activeState === 'form' || activeState === 'sent'">
          {{ $t('index.help.titleStateContact') }}
        </span>
      </template>
      <template #content>
        <div v-if="activeState === 'default'">
          <!-- FAQ for pariticipants -->
          <list-faq
            :title="$t('index.help.titleParticipants')"
            variant="participant"
          />
          <!-- FAQ for Company coordinators -->
          <list-faq
            :title="$t('index.help.titleCoordinators')"
            variant="coordinator"
            class="q-mt-xl"
          />
          <!-- Section: App Guide -->
          <div class="q-px-md q-mt-xl">
            <h4
              class="text-h5 text-weight-bold q-my-none"
              data-cy="title-guide"
            >
              {{ $t('index.help.titleGuide') }}
            </h4>
            <!-- Button: Replay guide -->
            <q-btn
              rounded
              color="primary"
              unelevated
              outline
              :label="$t('index.help.buttonGuide')"
              class="q-mt-md"
              data-cy="button-guide"
            />
          </div>
          <!-- Section: Contact us via form modal dialog -->
          <div class="q-px-md q-mt-xl">
            <h4
              class="text-h5 text-weight-bold q-my-none"
              data-cy="title-contact"
            >
              {{ $t('index.help.titleContact') }}
            </h4>
            <!-- Button: Switch to contact form -->
            <q-btn
              rounded
              color="primary"
              unelevated
              :label="$t('index.help.buttonContact')"
              class="q-mt-md"
              data-cy="button-contact"
              @click.prevent="setState('form')"
            />
          </div>
          <!-- Section: Useful links -->
          <menu-links :title="$t('index.help.titleLinks')" variant="useful" />
          <!-- Section: Social media links -->
          <menu-links :title="$t('index.help.titleSocials')" variant="social" />
        </div>
        <div v-else-if="activeState === 'form'">
          <contact-form
            class="q-px-md"
            @form-submit="onFormSubmit"
          ></contact-form>
        </div>
        <div v-else-if="activeState === 'sent'">
          <div class="q-pa-lg text-center">
            <div
              class="text-h5 text-weight-bold q-my-none"
              data-cy="title-sent"
            >
              {{ $t('index.help.titleSent') }}
            </div>
            <p
              class="q-mt-lg"
              v-html="$t('index.help.textSent', { email: userEmail })"
              data-cy="text-sent"
            />
            <q-btn
              rounded
              color="primary"
              unelevated
              class="q-mt-lg"
              :label="$t('index.help.buttonBackToHelp')"
              @click.prevent="setState('default')"
              data-cy="button-back-to-help"
            />
          </div>
        </div>
      </template>
    </dialog-default>
  </div>
</template>
