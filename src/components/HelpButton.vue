<script lang="ts">
/**
 * HelpButton Component
 *
 * The `HelpButton`
 * You can adjust its appearance by passing in `color` and `size` props.
 *
 * @description * Use this component to render help icon with help dialog .
 *
 * Note: This component is commonly used in `DrawerHeader` and `PageHeader`.
 *
 * @props
 * - `color`: Color of the help button.
 * - `size`: Size of the help button.
 *
 * @components
 * - `ContactForm`: Component to display contact for inside the dialog.
 * - `DialogStates`: Component to render help dialog with slots.
 * - `ListFaq`: Component to display FAQ list inside the dialog.
 * - `MenuLinks`: Component to display social links and useful links inside
 *   the dialog.
 *
 * @example
 * <HelpButton />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=6269%3A24768&mode=dev)
 */

// libraries
import { setCssVar } from 'quasar';
import { defineComponent, ref } from 'vue';

// types
import { ConfigGlobal } from 'components/types';

// components
import ContactForm from './ContactForm.vue';
import DialogStates from './DialogStates.vue';
import ListFaq from './ListFaq.vue';
import MenuLinks from './MenuLinks.vue';

// config
const rideToWorkByBikeConfig: ConfigGlobal = JSON.parse(
  process.env.RIDE_TO_WORK_BY_BIKE_CONFIG
);
setCssVar('primary', rideToWorkByBikeConfig.colorPrimary);

export default defineComponent({
  name: 'HelpButton',
  components: {
    MenuLinks,
    ListFaq,
    ContactForm,
    DialogStates,
  },
  props: {
    color: {
      type: String as () => 'grey-10' | 'primary',
      default: 'grey-10',
    },
    size: {
      type: String,
      default: '11px',
    },
  },
  setup() {
    const isDialogOpen = ref(false);

    return {
      isDialogOpen,
    };
  },
});
</script>

<template>
  <q-btn
    unelevated
    round
    :size="size"
    :color="color"
    @click.prevent="isDialogOpen = true"
    data-cy="button-help"
  >
    <q-icon name="question_mark" color="white" data-cy="icon-help" />
  </q-btn>
  <!-- Dialog -->
  <dialog-states v-model="isDialogOpen" data-cy="dialog-help">
    <template #title="{ state }">
      <span v-if="state === 'default'">
        {{ $t('index.help.titleStateDefault') }}
      </span>
      <span v-else-if="state === 'form'">
        {{ $t('index.help.titleStateContact') }}
      </span>
    </template>
    <template #content="{ state, setState, reset }">
      <div v-if="state === 'default'">
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
          <h4 class="text-h5 text-weight-bold q-my-none" data-cy="title-guide">
            {{ $t('index.help.titleGuide') }}
          </h4>
          <!-- Button: Replay guide -->
          <q-btn
            rounded
            color="black"
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
            color="black"
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
      <div v-if="state === 'form'">
        <contact-form @formSubmit="reset" class="q-px-md"></contact-form>
      </div>
    </template>
  </dialog-states>
</template>
