<script lang="ts">
/**
 * FormRegisterCoordinator Component
 *
 * The `FormRegisterCoordinator` is used to allow coordinators to register.
 *
 * @description * Use this component to display registration form.
 *
 * Note: This component is commonly used in `RegisterCoordinatorPage`.
 *
 * @events
 *
 * @slots
 * - `content`: For ... .
 *   exposed props and methods:
 *     - `state`
 *
 * @components
 *
 * @example
 * <form-register-coordinator />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=6356%3A25476&mode=dev)
 */

import { defineComponent } from 'vue';

export default defineComponent({
  name: 'FormRegisterCoordinator',
  script() {
    const onSubmit = (): void => {
      // noop
    };

    const onReset = (): void => {
      // noop
    };

    return {
      onReset,
      onSubmit,
    };
  },
});
</script>

<template>
  <div>
    <q-form autofocus @submit="onSubmit" @reset="onReset" class="q-gutter-md">
    </q-form>
  </div>
</template>

<style scoped lang="scss"></style>
