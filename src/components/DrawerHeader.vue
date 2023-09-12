<script lang="ts">
import { defineComponent, ref, computed } from 'vue';

// import components
import MenuLinks from './MenuLinks.vue';
import ListFaq from './ListFaq.vue';
import ContactForm from './ContactForm.vue';
import UserSelect from './UserSelect.vue';

export default defineComponent({
  name: 'DrawerHeader',
  components: {
    MenuLinks,
    ListFaq,
    ContactForm,
    UserSelect,
  },
  props: {
    showLogo: {
      type: Boolean,
      default: true,
    },
    showDrawerOpenButton: {
      type: Boolean,
      default: false,
    },
    modelValue: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const dialogOpened = ref(false);
    const dialogState = ref('default');

    const classes = computed(() => {
      return props.showLogo ? 'justify-between' : 'justify-end';
    });

    const drawerOpened = computed({
      get: () => props.modelValue,
      set: (value) => {
        emit('update:modelValue', value);
      },
    });

    const resetDialog = () => {
      dialogOpened.value = false;
      dialogState.value = 'default';
    };

    return {
      classes,
      drawerOpened,
      dialogOpened,
      dialogState,
      resetDialog,
    };
  },
});
</script>

<template>
  <div class="full-width flex items-center justify-between q-py-sm" :class="classes">
    <!-- RTWBB logo -->
    <img class="logo" src="~assets/svg/logo.svg" :alt="$t('index.logoAltText')" data-cy="logo" />
    <!-- Content -->
    <div class="flex items-center gap-24">
      <!-- Help icon link for displaying modal dialog-->
      <a href="#" data-cy="link-help" @click.prevent="dialogOpened = true">
        <q-icon name="help" size="sm" color="black" data-cy="icon-help" />
      </a>
      <!-- Notification icon link -->
      <a href="#">
        <q-icon
          name="notifications"
          size="sm"
          color="black"
          data-cy="icon-notification"
        />
      </a>
      <!-- User menu dropdown -->
      <user-select variant="mobile" class="lt-md" />
    </div>

    <!-- Modal dialog -->
    <q-dialog
      square
      persistent
      v-model="dialogOpened"
      data-cy="dialog-help"
      class="dialog-help"
    >
      <!-- Header -->
      <q-card class="full-width relative-position overflow-visible bg-white">
        <q-card-section
          data-cy="dialog-header"
          class="flex items-center gap-12"
        >
          <!-- Navigation button: Back (arrow) -->
          <q-btn
            v-if="dialogState !== 'default'"
            round
            color="transparent"
            size="xs"
            unelevated
            @click.prevent="dialogState = 'default'"
          >
            <q-icon name="west" size="xs" color="black" />
          </q-btn>
          <!-- Dialog heading -->
          <h3 class="text-h6 q-my-none">
            <template v-if="dialogState === 'default'">
              {{ $t('index.help.titleStateDefault') }}
            </template>
            <template v-if="dialogState === 'contact'">
              {{ $t('index.help.titleStateContact') }}
            </template>
          </h3>
        </q-card-section>

        <q-separator />

        <!-- Dialog content: Default state -->
        <q-card-section
          v-if="dialogState === 'default'"
          class="scroll q-px-none"
          data-cy="dialog-content"
          style="max-height: 50vh"
        >
          <!-- FAQ for pariticipants -->
          <list-faq
            :title="$t('index.help.titleParticipants')"
            variant="participant"
          ></list-faq>
          <!-- FAQ for Company coordinators -->
          <list-faq
            :title="$t('index.help.titleCoordinators')"
            variant="coordinator"
            class="q-mt-xl"
          ></list-faq>

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
              @click.prevent="dialogState = 'contact'"
            />
          </div>

          <!-- Section: Useful links -->
          <menu-links
            :title="$t('index.help.titleLinks')"
            variant="useful"
          ></menu-links>
          <!-- Section: Social media links -->
          <menu-links
            :title="$t('index.help.titleSocials')"
            variant="social"
          ></menu-links>
        </q-card-section>

        <!-- Dialog content: Contact form state -->
        <q-card-section
          v-if="dialogState === 'contact'"
          class="scroll"
          style="max-height: 50vh"
          data-cy="dialog-content"
        >
          <!-- Contact form -->
          <contact-form @formSubmit="resetDialog"></contact-form>
        </q-card-section>

        <!-- Dialog: Button close -->
        <q-card-actions
          class="dialog-close inline-block absolute-top-right q-px-none q-py-none"
          data-cy="dialog-close"
        >
          <q-btn
            v-close-popup
            round
            unelevated
            color="blue-grey-2"
            icon="close"
            class="text-blue-grey-9"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<style scoped lang="scss">
.gap-12 {
  gap: 12px;
}

.gap-24 {
  gap: 24px;
}

.logo {
  height: 40px;
}

.q-dialog__inner > div {
  overflow: visible !important;
}

.dialog-close {
  top: -21px;
  right: -21px;
}
</style>
