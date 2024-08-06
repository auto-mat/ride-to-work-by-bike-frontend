<script lang="ts">
/**
 * RouteInputDistance Component
 *
 * @description * Use this component to render distance inputs for routes.
 * It allows to switch between number input and map input.
 * This component is used by `RouteItemEdit` and `RouteCalendarPanel`.
 *
 * @props
 * - `modelValue` (number, required): The route distance in km.
 *   It should be of type `number`.
 * - `modelAction` (string, required): The selected distance input type.
 *   It should be of type `string`.
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

// types
import type { FormOption } from '../types/Form';

export default defineComponent({
  name: 'RouteInputDistance',
  props: {
    modelValue: {
      type: Number,
      required: true,
    },
    modelAction: {
      type: String,
      required: true,
    },
    isValidated: {
      type: Boolean,
      default: true,
    }
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
      get(): number {
        return props.modelValue;
      },
      set(value: number): void {
        emit('update:modelValue', value);
      },
    });

    const optionsAction: FormOption[] = [
      {
        label: i18n.global.t('routes.actionInputDistance'),
        value: 'input-number',
      },
      {
        label: i18n.global.t('routes.actionTraceMap'),
        value: 'input-map',
      },
    ];

    const customSVGIconsFilePath = 'icons/routes_calendar/icons.svg';

    const { isFilled } = useValidation()

    return {
      action,
      customSVGIconsFilePath,
      distance,
      optionsAction,
      isFilled,
    };
  },
});
</script>

<template>
  <div class="q-mt-lg" data-cy="route-input-distance">
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
          v-if="action === 'input-number'"
          class="col-auto items-center"
          data-cy="section-input-number"
        >
          <!-- Input: Distance -->
          <q-input
            dense
            outlined
            type="number"
            v-model="distance"
            min="0"
            max="999"
            data-cy="input-distance"
            :rules="[
              (val) =>
                isFilled(val) || !isValidated ||
                $t('form.messageFieldRequired', {
                  fieldName: $t('routes.labelValidationDistance'),
                }),
            ]"
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
          v-else-if="action === 'input-map'"
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
