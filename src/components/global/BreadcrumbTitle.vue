<script lang="ts">
/**
 * BreadcrumbTitle Component
 *
 * @description * Use this component to display page title as a part of
 * a breadcrumb.
 *
 * @props
 * - `title` (string, required): The object representing title of the
 * current page.
 *   It should be of type `string`.
 *
 * @example
 * <breadcrumb-title :title="$t('index.titleHome')" />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=4858-105197&t=UxaDEZYDQu3Og9i6-1)
 */

// libraries
import { computed, defineComponent } from 'vue';
import { useRoute } from 'vue-router';

// types
import type { BreadcrumbPage } from '../types/Breadcrumb';

export default defineComponent({
  name: 'BreadcrumbTitle',
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  setup() {
    const route = useRoute();

    /**
     * Get the list of breadcrumb pages from the route meta object.
     * Route matched returns a hierarchy of routes.
     * If specific breadcrumb structure is defined in route meta, use it.
     * Otherwise, use the hierarchy of routes.
     * @returns BreadcrumbPage[]
     */
    const pages = computed((): BreadcrumbPage[] => {
      // If matched returns a single route or nothing, return an empty array
      if (!route?.matched.length || route?.matched.length === 1) return [];
      // Breadcrumbs defined in `routes.ts`
      const current = route.matched.find((r) => r.path == route.path);
      if (current && current.meta && current.meta.breadcrumb) {
        return current.meta.breadcrumb as BreadcrumbPage[];
      }
      // Default page hierarchy
      else {
        return route.matched.map(
          (r): BreadcrumbPage => ({
            path: r.path || '',
            name: String(r.name) || '',
          }),
        );
      }
    });

    return {
      pages,
    };
  },
});
</script>

<template>
  <q-breadcrumbs
    class="text-h5 text-gray-7 text-weight-regular"
    active-color="gray-10"
    data-cy="breadcrumb-title"
  >
    <template v-slot:separator>
      <q-icon size="24px" name="chevron_right" />
    </template>

    <q-breadcrumbs-el
      v-for="page in pages"
      :key="page.path"
      :label="$t(`breadcrumb.${page.name}`)"
      :icon="page.icon"
      :to="page.path"
      data-cy="breadcrumb-title-el"
    />
    <q-breadcrumbs-el
      class="text-weight-bold"
      :label="title"
      data-cy="breadcrumb-title-current"
    />
  </q-breadcrumbs>
</template>
