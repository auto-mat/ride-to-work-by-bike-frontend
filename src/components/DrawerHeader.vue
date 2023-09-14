<script lang="ts">
import { defineComponent, ref, computed } from 'vue';

// import components
import MenuLinks from './MenuLinks.vue';
import ListFaq from './ListFaq.vue';
import ContactForm from './ContactForm.vue';
import UserSelect from './UserSelect.vue';
import DialogStates from './DialogStates.vue';

export default defineComponent({
  name: 'DrawerHeader',
  components: {
    MenuLinks,
    ListFaq,
    ContactForm,
    UserSelect,
    DialogStates,
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
    const isDialogOpen = ref(false);

    const classes = computed(() => {
      return props.showLogo ? 'justify-between' : 'justify-end';
    });

    const drawerOpened = computed({
      get: () => props.modelValue,
      set: (value) => {
        emit('update:modelValue', value);
      },
    });

    return {
      classes,
      isDialogOpen,
      drawerOpened,
    };
  },
});
</script>

<template>
  <div
    class="full-width flex items-center justify-between q-py-sm"
    :class="classes"
  >
    <!-- RTWBB logo -->
    <img
      class="logo"
      src="~assets/svg/logo.svg"
      :alt="$t('index.logoAltText')"
      data-cy="logo"
    />
    <!-- Content -->
    <div class="flex items-center gap-24">
      <!-- Help icon link for displaying modal dialog-->
      <a href="#" data-cy="link-help" @click.prevent="isDialogOpen = true">
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

    <!-- Dialog -->
    <dialog-states v-model="isDialogOpen" data-cy="dialog-help">
      <template #title="{ state }">
        <span v-if="state === 'default'">
          {{ $t('index.help.titleStateDefault') }}
        </span>
        <span v-if="state === 'form'">
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
  </div>
</template>

<style scoped lang="scss">
.logo {
  height: 40px;
}
.gap-24 {
  gap: 24px;
}
</style>
