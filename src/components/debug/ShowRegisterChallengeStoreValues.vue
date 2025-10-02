<script lang="ts">
/**
 * Show Register Challenge store values for debugging
 *
 * @description Use this component to debug selected values from the Register Challenge store
 * Note: Only visible in Cypress testing environment. Pass an array of getter names to display specific values.
 *
 * @props
 * - `keys` (Array, required): Array of getter names
 *
 * @example
 * <show-register-challenge-store-values
 *   :keys="['getOrganizationId', 'getSubsidiaryId', 'getTeamId']"
 * />
 *
 */

// libraries
import { defineComponent, computed } from 'vue';

// stores
import { useRegisterChallengeStore } from 'src/stores/registerChallenge';

export default defineComponent({
  name: 'ShowRegisterChallengeStoreValues',
  props: {
    keys: {
      type: Array as () => string[],
      required: true,
    },
  },
  setup(props) {
    const showComponent = computed(() => !!window.Cypress);

    const registerChallengeStore = useRegisterChallengeStore();

    // create keys for data-cy attributes
    const normalizeKey = (key: string): string => {
      return key
        .toLowerCase()
        .replace(/^get/, '')
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .toLowerCase();
    };

    // format value for display
    const formatValue = (value: unknown): string => {
      if (value === null) return 'null';
      if (value === undefined) return 'undefined';
      if (typeof value === 'object') {
        try {
          return JSON.stringify(value, null, 2);
        } catch {
          return '[Object]';
        }
      }
      return String(value);
    };

    // function to get the store value
    const getStoreValue = (key: string): unknown => {
      try {
        // access the getter from the store
        const getter = (
          registerChallengeStore as unknown as Record<string, unknown>
        )[key];
        if (typeof getter === 'function') {
          return getter();
        }
        // if not a function, return the value
        return getter;
      } catch (error) {
        return `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      }
    };

    // create a data object to loop over
    const displayValues = computed(() => {
      const values: Record<string, unknown> = {};
      props.keys.forEach((key) => {
        const label = key
          .replace(/^get/, '')
          .replace(/([a-z])([A-Z])/g, '$1 $2');
        values[label] = getStoreValue(key);
      });
      return values;
    });

    return {
      showComponent,
      normalizeKey,
      formatValue,
      displayValues,
    };
  },
});
</script>

<template>
  <div v-if="showComponent" data-cy="debug-register-challenge-store">
    <div class="text-red text-bold">
      <div
        v-for="(value, label) in displayValues"
        :key="label"
        :data-cy="`debug-${normalizeKey(String(label))}`"
        class="q-mb-xs"
      >
        <span class="text-weight-medium">{{ label }}:</span>
        <span
          :data-cy="`debug-${normalizeKey(String(label))}-value`"
          class="q-ml-sm"
          style="white-space: pre-wrap"
        >
          {{ formatValue(value) }}
        </span>
      </div>
    </div>
  </div>
</template>
