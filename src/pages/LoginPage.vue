<template>
  <q-page padding>
    <div class="q-px-lg">
      <!-- Page header -->
      <div class="flex items-center justify-between q-py-lg">
        <!-- RTWBB logo -->
        <img class="logo" src="~assets/svg/logo.svg" :alt="$t('index.logoAltText')" :title="$t('header.siteTitle')"
          data-cy="logo" />
        <div class="flex items-center gap-32">
          <!-- Help icon link for displaying modal dialog -->
          <help-button size="13px" color="primary" />
          <!-- Language switcher -->
          <language-switcher variant="light" />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
// libraries
import { setCssVar } from 'quasar';
import { defineComponent } from 'vue'

// types
import { ConfigGlobal } from 'components/types'

// components
import HelpButton from 'components/HelpButton.vue'
import LanguageSwitcher from 'src/components/LanguageSwitcher.vue';

// config
const rideToWorkByBikeConfig: ConfigGlobal = JSON.parse(
  process.env.RIDE_TO_WORK_BY_BIKE_CONFIG
);
setCssVar('primary', rideToWorkByBikeConfig.colorPrimary);

export default defineComponent({
  name: 'LoginPage',
  components: {
    HelpButton,
    LanguageSwitcher,
  }
})
</script>

<style scoped lang="scss">
.logo {
  height: 80px;
}
</style>
