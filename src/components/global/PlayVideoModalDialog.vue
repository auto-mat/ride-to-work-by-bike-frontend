<script lang="ts">
/**
 * PlayVideoModalDialog Component
 *
 * @description * Use this component to automatic playing video in the modal dialog.

 * Component is used by the `RouteCalendarPanel`, `RouteItemEdit` component.
 *
 * @props
 * - `videoUrl` (String, required): Video URL
 * - `btnLabel` (String, required): Activating video modal dialog
 *                                  button element label
 * - `btnIconName` (String, required): Activating video modal dialog
 *                                     button element icon name
 * - `btnIconColor` (String, default: 'primary'): Activating video modal dialog button
 *                                                element color name
 * - `videoContainerWidth` (String, default: '50vw'): Vide container width
 * - `videoMaxHeight` (String, default: '450px'): Video max height
 *
 * @slots
 * - `overlayedText`: Slot for video overlayed text
 *
 * @example
 * <play-video-modal-dialog
 *  :btnLabel="$t('routes.logRouterPlayVideoBtnLabel')"
 *   btnIconName="info"
 *  :videoUrl="videoUrl"
 *   videoContainerWidth="100vw"
 * />
 *
 */

// libraries
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'PlayVideoModalDialog',
  props: {
    videoUrl: {
      type: String,
      required: true,
    },
    btnLabel: {
      type: String,
      required: true,
    },
    btnIconName: {
      type: String,
      required: true,
    },
    btnIconColor: {
      type: String,
      required: false,
      default: 'primary',
    },
    videoContainerWidth: {
      type: String,
      required: false,
      default: '50vw',
    },
    videoMaxHeight: {
      type: String,
      required: false,
      default: '450px',
    },
  },
  setup(props) {
    const playVideo = ref(false);

    return {
      playVideo,
      props,
    };
  },
});
</script>

<template>
  <q-btn
    :icon="props.btnIconName"
    flat
    dense
    @click="playVideo = true"
    :color="props.btnIconColor"
    :label="props.btnLabel"
    data-cy="play-video-btn"
  />

  <q-dialog v-model="playVideo" auto-close data-cy="play-video-modal-dialog">
    <q-card>
      <q-card-section class="row items-center no-wrap">
        <video-background
          :src="props.videoUrl"
          :style="{
            width: props.videoContainerWidth,
            'max-height': props.videoMaxHeight,
            height: '100vh',
          }"
          data-cy="video"
        >
          <slot name="overlayedText"></slot>
        </video-background>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
