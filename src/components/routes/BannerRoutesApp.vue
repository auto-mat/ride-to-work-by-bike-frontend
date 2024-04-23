<script lang="ts">
/**
 * BannerRoutesApp Component
 *
 * @description * Use this component to render a banner for an app
 * in the `RoutesApps` view.
 *
 * @props
 * - `app` (BannerRoutesApp, required): The object representing banner data.
 *   It should be of type `BannerRoutesApp`.
 *
 * @example
 * <banner-routes-app></banner-routes-app>
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=5190%3A125828&mode=dev)
 */

// libraries
import { defineComponent } from 'vue';

import type { BannerRoutesApp } from '../types/Banner';

export default defineComponent({
  name: 'BannerRoutesApp',
  props: {
    app: {
      type: Object as () => BannerRoutesApp,
    },
  },
});
</script>

<template>
  <div v-if="app" class="q-pa-md" data-cy="banner-routes-app">
    <div class="row items-center gap-8">
      <!-- Image -->
      <q-img
        v-if="app.image"
        :src="app.image.src"
        :alt="app.title"
        :ratio="1"
        width="48px"
        height="48px"
        class="col-shrink-0 q-mr-md"
        data-cy="banner-routes-app-image"
      />
      <!-- Text -->
      <div class="col flex items-center justify-between gap-8">
        <!-- Title -->
        <h3 class="text-body1 q-my-none" data-cy="banner-routes-app-title">
          {{ app.title }}
        </h3>
        <!-- Metadata -->
        <div class="flex items-center justify-between gap-8">
          <!-- Status (linked) -->
          <div
            v-if="app.linked"
            class="col-shrink-0 flex items-center gap-8 q-mr-md"
          >
            <q-avatar size="18px">
              <q-icon
                class="inline-block"
                name="check"
                size="18px"
                data-cy="banner-routes-app-icon"
              />
            </q-avatar>
            <span
              class="inline-block text-subtitle2 text-weight-bold"
              data-cy="banner-routes-app-status"
              >{{ $t('routes.statusLinked') }}</span
            >
          </div>
          <!-- Button (link) -->
          <q-btn
            v-if="app.button && app.linkable"
            unelevated
            outline
            rounded
            color="primary"
            :href="app.button.url"
            target="_blank"
            data-cy="banner-routes-app-button"
          >
            <!-- Button text -->
            <span v-if="!app.linked && app.linkable">
              {{ $t('routes.buttonLinkToApp') }}
            </span>
            <span v-if="app.linked && app.linkable">
              {{ $t('routes.buttonLinkNewDevice') }}
            </span>
          </q-btn>
        </div>
      </div>
    </div>
  </div>
</template>
