<script lang="ts">
import { defineComponent, ref, computed } from 'vue';

// import components
import VueMenuLinks from './VueMenuLinks.vue';
import VueListFaq from './VueListFaq.vue';
import VueContactForm from './VueContactForm.vue';

export default defineComponent({
  name: 'VueDrawerHeader',
  components: {
    VueMenuLinks,
    VueListFaq,
    VueContactForm,
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
  <div class="full-width flex items-center" :class="classes">
    <!-- Logo -->
    <img class="logo" src="/logo.svg" :alt="$t('index.logoAltText')" />

    <div class="flex items-center gap-32">
      <!-- Button: Help -->
      <a href="#" data-cy="link-help" @click.prevent="dialogOpened = true">
        <q-icon name="help" size="sm" color="black" data-cy="icon-help" />
      </a>
      <!-- Button: Notifications -->
      <a href="#">
        <q-icon
          name="notifications"
          size="sm"
          color="black"
          data-cy="icon-notification"
        />
      </a>
      <!-- Button: Mobile menu -->
      <q-btn
        v-if="showDrawerOpenButton"
        flat
        round
        icon="menu"
        color="black"
        @click="drawerOpened = true"
        data-cy="drawer-open-button"
      />
    </div>

    <!-- Modal dialog -->
    <q-dialog
      v-model="dialogOpened"
      square
      data-cy="dialog-help"
      class="dialog-help"
    >
      <q-card class="w-100 relative-position overflow-visible bg-white">
        <q-card-section
          data-cy="dialog-header"
          class="flex items-center gap-12"
        >
          <!-- Navigation button: Back -->
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
          <vue-list-faq
            :title="$t('index.help.titleParticipants')"
            variant="participant"
          ></vue-list-faq>
          <!-- FAQ for coordinators -->
          <vue-list-faq
            :title="$t('index.help.titleCoordinators')"
            variant="coordinator"
            class="q-mt-xl"
          ></vue-list-faq>

          <!-- Section: Guide -->
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

          <!-- Section: Contact -->
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
          <vue-menu-links
            :title="$t('index.help.titleLinks')"
            variant="useful"
          ></vue-menu-links>
          <!-- Section: Social links -->
          <vue-menu-links
            :title="$t('index.help.titleSocials')"
            variant="social"
          ></vue-menu-links>
        </q-card-section>

        <!-- Dialog content: Contact form state -->
        <q-card-section
          v-if="dialogState === 'contact'"
          class="scroll"
          style="max-height: 50vh"
          data-cy="dialog-content"
        >
          <!-- Contact form -->
          <vue-contact-form @formSubmit="resetDialog"></vue-contact-form>
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

.gap-x-24 {
  column-gap: 24px;
}

.w-100 {
  width: 100%;
}

.logo {
  height: 40px;
}

.file-input :deep(.q-field__label) {
  font-weight: 600;
}

.q-btn {
  &.q-btn-no-uppercase {
    text-transform: none;
  }
  &.q-btn-underline {
    span {
      text-decoration: underline;
    }
    &:hover {
      span {
        text-decoration: none;
      }
    }
  }
}

.q-dialog__inner > div {
  overflow: visible !important;
}

.dialog-close {
  top: -21px;
  right: -21px;
}

.gap-32 {
  gap: 32px;
}

.dialog-help {
  .q-dialog__inner--minimized > div {
    @media (min-width: $breakpoint-md-min) {
      width: 100%;
      max-width: 784px;
    }
  }
}
</style>
