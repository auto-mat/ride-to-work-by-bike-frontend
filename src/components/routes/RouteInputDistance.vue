<script lang="ts">
/**
 * RouteInputDistance Component
 *
 * @description * Use this component to render distance inputs for routes.
 * It allows to switch between number input and map input.
 * This component is used by `RouteItemEdit` and `RouteCalendarPanel`.
 *
 * @props
 * - `modelValue` (string, required): The route distance in km.
 *   It should be of type `string`.
 * - `modelAction` (string, required): The selected distance input type.
 *   It should be of type `string`.
 * - `hasValidation` (boolean, default: true): Whether the input should
 *   be validated.
 *
 * @events
 * - `update:modelValue`: Emitted as a part of v-model structure.
 * - `update:modelAction`: Emitted as a part of v-model structure.
 *
 * @example
 * <route-input-distance v-model="distance">
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=8283-9639&t=PziLuaudaU55JoHX-1)
 */

// libraries
import { Notify } from 'quasar';
import { computed, defineComponent } from 'vue';

// composables
import { i18n } from '../../boot/i18n';
import { useValidation } from '../../composables/useValidation';

// config
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

// enums
import { RouteInputType } from '../types/Route';

// utils
import { localizedFloatNumStrToFloatNumber } from 'src/utils';

// types
import type { QRejectedEntry } from 'quasar';
import type { FormOption } from '../types/Form';

const { defaultDistanceZero } = rideToWorkByBikeConfig;

export default defineComponent({
  name: 'RouteInputDistance',
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    modelAction: {
      type: String,
      required: true,
    },
    optionsAction: {
      type: Array as () => FormOption[],
      required: true,
    },
    hasValidation: {
      type: Boolean,
      default: true,
    },
    modelFile: {
      type: [File, null],
      default: null,
    },
  },
  emits: ['update:modelValue', 'update:modelAction', 'update:modelFile'],
  setup(props, { emit }) {
    // constants
    const maxFileSizeMegabytes =
      rideToWorkByBikeConfig.tripMaxFileUploadSizeMegabytes;
    const maxFileSizeBytes = maxFileSizeMegabytes * 1024 * 1024; // convert MB to bytes
    const acceptedFileFormats = '.gpx, .gz';

    // model action
    const action = computed({
      get(): string {
        return props.modelAction;
      },
      set(value: string): void {
        emit('update:modelAction', value);
      },
    });

    // model value
    const distance = computed({
      get(): string {
        return props.modelValue;
      },
      set(value: string): void {
        value = value ? value : defaultDistanceZero;
        emit('update:modelValue', value);
      },
    });

    const uploadFile = computed<File | null>({
      get(): File | null {
        return props.modelFile;
      },
      set(value: File | null): void {
        emit('update:modelFile', value);
      },
    });

    const customSVGIconsFilePath = 'icons/routes_calendar/icons.svg';

    const { isFilled, isAboveZero } = useValidation();

    const isShownDistance = computed((): boolean => {
      return [
        RouteInputType.inputNumber,
        RouteInputType.copyYesterday,
      ].includes(action.value as RouteInputType);
    });

    /**
     * Handle file rejection. By displaying a notification.
     * We expect only one rejected entry (single file upload).
     * @param rejectedEntries - The rejected entries.
     */
    const onFileRejected = (rejectedEntries: QRejectedEntry[]): void => {
      if (!rejectedEntries.length) {
        return;
      }
      if (rejectedEntries[0].failedPropValidation === 'max-file-size') {
        Notify.create({
          type: 'negative',
          message: i18n.global.t('routes.messageFileTooLarge', {
            size: `${maxFileSizeMegabytes} MB`,
          }),
        });
      } else if (rejectedEntries[0].failedPropValidation === 'accept') {
        Notify.create({
          type: 'negative',
          message: i18n.global.t('routes.messageFileInvalidFormat', {
            formats: acceptedFileFormats,
          }),
        });
      }
    };

    return {
      action,
      customSVGIconsFilePath,
      distance,
      i18n,
      isFilled,
      isAboveZero,
      isShownDistance,
      localizedFloatNumStrToFloatNumber,
      RouteInputType,
      uploadFile,
      onFileRejected,
      acceptedFileFormats,
      maxFileSizeBytes,
    };
  },
});
</script>

<template>
  <div data-cy="route-input-distance">
    <!-- Label -->
    <div
      class="text-caption text-weight-bold text-grey-10"
      data-cy="label-distance"
    >
      {{ $t('routes.labelDistance') }}
    </div>
    <div class="q-mt-sm">
      <div class="row q-col-gutter-sm">
        <div class="col-auto" data-cy="section-input-action">
          <!-- Select: Action -->
          <q-select
            dense
            outlined
            emit-value
            map-options
            v-model="action"
            :options="optionsAction"
            data-cy="select-action"
          />
        </div>
        <div
          v-if="isShownDistance"
          class="col-auto items-center"
          data-cy="section-input-number"
        >
          <!-- Input: Distance
               with maxlength="6" max. allowed value is 999.99
               according backend Trip DB model distance field max.
               validator value
          -->
          <q-input
            dense
            outlined
            reverse-fill-mask
            v-model="distance"
            :mask="
              i18n.global
                .n(
                  localizedFloatNumStrToFloatNumber(distance),
                  'routeDistanceDecimalNumber',
                )
                .includes(',')
                ? '#,##'
                : '#.##'
            "
            fill-mask="0"
            :rules="[
              (val) =>
                isAboveZero(localizedFloatNumStrToFloatNumber(val)) ||
                !hasValidation ||
                $t('form.messageFieldAboveZero'),
            ]"
            data-cy="input-distance"
            maxlength="6"
          >
            <template v-slot:append>
              <span
                class="text-subtitle2 text-weight-regular text-grey-10"
                data-cy="units-distance"
              >
                {{ $t('global.routeLengthUnit') }}
              </span>
            </template>
          </q-input>
        </div>
        <div
          v-else-if="action === RouteInputType.inputMap"
          class="col-auto items-center"
          data-cy="section-input-map"
        >
          <!-- Button: Trace map -->
          <q-btn
            flat
            rounded
            color="primary"
            size="16px"
            data-cy="button-trace-map"
          >
            <!-- Icon -->
            <q-icon
              :name="`svguse:${customSVGIconsFilePath}#pencil`"
              size="24px"
              class="q-mr-sm"
              data-cy="icon-trace-map"
            />
            <!-- Label -->
            <span>{{ $t('routes.buttonTraceMap') }}</span>
          </q-btn>
        </div>
        <div
          v-else-if="action === RouteInputType.uploadFile"
          class="col items-center"
          data-cy="section-input-map"
        >
          <!-- Input: File -->
          <q-file
            dense
            outlined
            v-model="uploadFile"
            :label="$t('routes.labelUploadFile')"
            :hint="$t('routes.hintUploadFile')"
            :accept="acceptedFileFormats"
            :max-file-size="maxFileSizeBytes"
            data-cy="input-file"
            @rejected="onFileRejected"
          />
        </div>
      </div>
    </div>
  </div>
</template>
