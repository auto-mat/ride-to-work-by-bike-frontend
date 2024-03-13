<script lang="ts">
/**
 * RouteListItem Component
 *
 * @description * Use this component to render an item in a list of routes.
 *
 * @props
 * - `route` (object, required): The object representing the route.
 *   It should be of type `object` with properties:
 *   - id (string)
 *   - date (string)
 *   - type (string)
 *   - distance (number)
 *
 * @events
 * - `update:modelValue`: Emitted as a part of v-model structure.
 *
 * @components
 * - `CHILD`: Component to ... .
 *
 * @example
 * <route-list-item />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=4858%3A104042&mode=dev)
 */

// libraries
import { defineComponent, ref } from 'vue';
import { i18n } from 'src/boot/i18n';

// types
import type { FormOption } from '../types/Form';

export default defineComponent({
  name: 'RouteListItem',
  props: {
    route: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const action = ref<string>('input-distance');
    const optionsAction: FormOption[] = [
      {
        label: i18n.global.t('routes.actionInputDistance'),
        value: 'input-distance',
      },
    ];

    const distance = ref<number>(0);

    return {
      action,
      distance,
      optionsAction,
    };
  },
});
</script>

<template>
  <div class="row items-center" data-cy="route-list-item">
    <div class="col-12 col-sm-2" data-cy="column-direction">
      <!-- Column: Direction -->
      <div data-cy="label-direction">
        <!-- From work -->
        <span v-if="route.direction === 'home'">
          {{ $t('routes.labelDirectionHome') }}
        </span>
        <!-- To work -->
        <span v-if="route.direction === 'work'">
          {{ $t('routes.labelDirectionWork') }}
        </span>
      </div>
    </div>
    <div class="col-12 col-sm-10">
      <div class="row">
        <!-- Column: Transport type -->
        <div class="col-12 col-sm-4" data-cy="column-transport">
          <!-- Label -->
          <div data-cy="label-transport">
            {{ $t('routes.labelTransportType') }}
          </div>
          <div data-cy="select-transport">TODO: add component</div>
        </div>
        <!-- Column: Distance -->
        <div class="col-12 col-sm-8" data-cy="column-distance">
          <!-- Label -->
          <div data-cy="label-distance">{{ $t('routes.labelDistance') }}</div>
          <div class="row q-col-gutter-sm">
            <div class="col-12 col-sm-4">
              <!-- Select: Action -->
              <q-select
                dense
                outlined
                emit-value
                map-options
                v-model="action"
                :id="`route-item-action-${route.id}`"
                :options="optionsAction"
                class="q-mt-sm"
                data-cy="select-action"
              ></q-select>
            </div>
            <div class="col-12 col-sm-4">
              <!-- Input -->
              <q-input
                dense
                outlined
                type="number"
                v-model="distance"
                class="q-mt-sm"
                :id="`route-item-distance-${route.id}`"
                :name="`route-item-distance-${route.id}`"
                data-cy="input-distance"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
