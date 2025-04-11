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
import { computed, defineComponent } from 'vue';

// composables
import { i18n } from '../../boot/i18n';
import { useValidation } from '../../composables/useValidation';

// enums
import { RouteInputType } from '../types/Route';

// utils
import { localizedFloatNumStrToFloatNumber } from 'src/utils';

import { rideToWorkByBikeConfig } from '../../boot/global_vars';

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
      type: Array as () => RouteInputType[],
      required: true,
    },
    hasValidation: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['update:modelValue', 'update:modelAction'],
  setup(props, { emit }) {
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

    const customSVGIconsFilePath = 'icons/routes_calendar/icons.svg';

    const { isFilled, isAboveZero } = useValidation();

    const isShownDistance = computed((): boolean => {
      return [
        RouteInputType.inputNumber,
        RouteInputType.copyYesterday,
      ].includes(action.value as RouteInputType);
    });

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
      </div>
    </div>
  </div>
</template>
