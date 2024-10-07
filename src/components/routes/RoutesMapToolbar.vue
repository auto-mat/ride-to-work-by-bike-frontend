<script lang="ts">
/**
 * RoutesMapToolbar Component
 *
 * @description * Use this component to render a toolbar for a RoutesMap.
 *
 * @props
 * - `deleteEnabled` (boolean, required): Enabled state for delete tool.
 * - `deleteDisabled` (boolean, required): Disabled state for delete button.
 * - `drawEnabled` (boolean, required): Enabled state for draw tool.
 * - `drawDisabled` (boolean, required): Disabled state for draw button.
 * - `saveDisabled` (boolean, required): Disabled state for save button.
 * - `undoDisabled` (boolean, required): Disabled state for undo button.
 *
 *
 * @events
 * - `current-position`: Emitted when current position button is clicked.
 * - `save:route`: Emitted when save button is clicked.
 * - `undo`: Emitted when undo button is clicked.
 * - `update:draw-enabled`: Emitted when draw tool is toggled.
 * - `update:delete-enabled`: Emitted when delete tool is toggled.
 * - `update:source`: Emitted when source is changed.
 *
 * @example
 * <routes-map-toolbar />
 */

// libraries
import { computed, defineComponent, ref } from 'vue';

// composables
import { i18n } from '../../boot/i18n';

// config
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

export default defineComponent({
  name: 'RoutesMapToolbar',
  emits: [
    'current-position',
    'save:route',
    'undo',
    'update:delete-enabled',
    'update:draw-enabled',
    'update:source',
  ],
  props: {
    deleteEnabled: {
      type: Boolean,
      default: false,
    },
    deleteDisabled: {
      type: Boolean,
      default: false,
    },
    drawEnabled: {
      type: Boolean,
      default: false,
    },
    drawDisabled: {
      type: Boolean,
      default: false,
    },
    saveDisabled: {
      type: Boolean,
      default: false,
    },
    undoDisabled: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const avatarSize = '32px';
    const iconSize = '18px';
    const mapSourceRtwbb = rideToWorkByBikeConfig.mapSourceRtwbb;
    const mapSourceOsm = rideToWorkByBikeConfig.mapSourceOsm;
    const source = ref(mapSourceRtwbb);
    const sourceOptions = computed(() => [
      {
        label: i18n.global.t('global.rtwbb'),
        value: mapSourceRtwbb,
      },
      {
        label: i18n.global.t('global.osm'),
        value: mapSourceOsm,
      },
    ]);
    const tooltipDelay = 300;

    return {
      avatarSize,
      iconSize,
      source,
      sourceOptions,
      tooltipDelay,
    };
  },
});
</script>

<template>
  <div>
    <!-- Toolbar: Top -->
    <div
      class="flex justify-center absolute-top q-pa-sm"
      :style="{ zIndex: 1, pointerEvents: 'none' }"
      data-cy="toolbar-top"
    >
      <q-toolbar
        class="col-auto gap-8 q-pa-sm"
        :style="{
          borderRadius: '9999px',
          backgroundColor: 'white',
          pointerEvents: 'auto',
        }"
      >
        <!-- Button: Enable draw (draw route) -->
        <q-btn
          dense
          round
          unelevated
          class="q-pa-none q-ma-none"
          color="transparent"
          text-color="primary"
          :disabled="drawDisabled"
          @click.prevent="$emit('update:draw-enabled', !drawEnabled)"
          data-cy="add-route-button"
        >
          <!-- Tooltip -->
          <q-tooltip
            :delay="tooltipDelay"
            class="text-body2"
            data-cy="tooltip-add-route"
          >
            <span v-if="drawDisabled" data-cy="tooltip-add-route-disabled">
              {{ $t('routes.tooltipDrawDisabled') }}
            </span>
            <span v-else-if="!drawEnabled" data-cy="tooltip-add-route-enable">
              {{ $t('routes.tooltipDrawEnable') }}
            </span>
            <span v-else-if="drawEnabled" data-cy="tooltip-add-route-disable">
              {{ $t('routes.tooltipDrawDisable') }}
            </span>
          </q-tooltip>
          <q-avatar
            :size="avatarSize"
            class="q-pa-none q-ma-none"
            :color="drawEnabled ? 'primary' : 'grey-3'"
            data-cy="add-route-avatar"
          >
            <!-- Icon -->
            <q-icon
              name="mdi-pencil-plus"
              :color="drawEnabled ? 'white' : 'primary'"
              :size="iconSize"
              data-cy="add-route-icon"
            />
          </q-avatar>
        </q-btn>
        <!-- Button: Enable delete (delete point/vertex) -->
        <q-btn
          dense
          round
          unelevated
          class="q-pa-none q-ma-none"
          color="transparent"
          text-color="primary"
          :disabled="deleteDisabled"
          @click.prevent="$emit('update:delete-enabled', !deleteEnabled)"
          data-cy="delete-route-button"
        >
          <!-- Tooltip -->
          <q-tooltip :delay="tooltipDelay" class="text-body2">
            <span v-if="deleteDisabled" data-cy="tooltip-delete-route-disabled">
              {{ $t('routes.tooltipDeleteDisabled') }}
            </span>
            <span
              v-else-if="!deleteEnabled"
              data-cy="tooltip-delete-route-enable"
              >{{ $t('routes.tooltipDeleteEnable') }}</span
            >
            <span
              v-else-if="deleteEnabled"
              data-cy="tooltip-delete-route-disable"
              >{{ $t('routes.tooltipDeleteDisable') }}</span
            >
          </q-tooltip>
          <q-avatar
            :size="avatarSize"
            class="q-pa-none q-ma-none"
            :color="deleteEnabled ? 'primary' : 'grey-3'"
            data-cy="delete-route-avatar"
          >
            <!-- Icon -->
            <q-icon
              name="mdi-eraser"
              :color="deleteEnabled ? 'white' : 'primary'"
              :size="iconSize"
              data-cy="delete-route-icon"
            />
          </q-avatar>
        </q-btn>
        <!-- Button: Undo -->
        <q-btn
          dense
          round
          unelevated
          class="q-pa-none q-ma-none"
          color="transparent"
          text-color="primary"
          :disabled="undoDisabled"
          @click.prevent="$emit('undo')"
          data-cy="undo-button"
        >
          <!-- Tooltip -->
          <q-tooltip
            :delay="tooltipDelay"
            class="text-body2"
            data-cy="tooltip-undo"
          >
            {{ $t('routes.tooltipUndo') }}
          </q-tooltip>
          <q-avatar
            :size="avatarSize"
            class="q-pa-none q-ma-none"
            color="grey-3"
            data-cy="undo-avatar"
          >
            <!-- Icon -->
            <q-icon
              name="mdi-undo"
              color="primary"
              :size="iconSize"
              data-cy="undo-icon"
            />
          </q-avatar>
        </q-btn>
        <!-- Button: Save route -->
        <q-btn
          dense
          round
          unelevated
          class="q-pa-none q-ma-none"
          color="transparent"
          text-color="primary"
          :disabled="saveDisabled"
          @click.prevent="$emit('save:route')"
          data-cy="save-route-button"
        >
          <!-- Tooltip -->
          <q-tooltip
            :delay="tooltipDelay"
            class="text-body2"
            data-cy="tooltip-save"
          >
            {{ $t('routes.tooltipSave') }}
          </q-tooltip>
          <q-avatar
            :size="avatarSize"
            class="q-pa-none q-ma-none"
            color="grey-3"
            data-cy="save-route-avatar"
          >
            <!-- Icon -->
            <q-icon
              name="mdi-check"
              color="primary"
              :size="iconSize"
              data-cy="save-route-icon"
            />
          </q-avatar>
        </q-btn>
      </q-toolbar>
    </div>
    <!-- Toolbar: Bottom -->
    <div
      class="flex column items-start justify-start absolute-bottom q-pa-sm gap-8"
      :style="{ zIndex: 1, pointerEvents: 'none' }"
      data-cy="toolbar-bottom"
    >
      <!-- Button: Center on current location -->
      <q-btn
        dense
        round
        unelevated
        class="q-pa-none q-ma-none"
        color="transparent"
        text-color="primary"
        :style="{
          pointerEvents: 'auto',
        }"
        @click.prevent="$emit('current-position')"
        data-cy="current-position-button"
      >
        <q-avatar
          :size="avatarSize"
          class="q-pa-none q-ma-none"
          color="white"
          data-cy="current-position-avatar"
        >
          <!-- Icon -->
          <q-icon
            name="sym_s_my_location"
            color="primary"
            :size="iconSize"
            data-cy="current-position-icon"
          />
        </q-avatar>
      </q-btn>
      <!-- Select: Map source -->
      <q-select
        dense
        rounded
        filled
        emit-value
        map-options
        bg-color="white"
        v-model="source"
        :options="sourceOptions"
        :style="{
          pointerEvents: 'auto',
        }"
        @update:model-value="$emit('update:source', source)"
        data-cy="change-source-select"
      />
    </div>
  </div>
</template>
