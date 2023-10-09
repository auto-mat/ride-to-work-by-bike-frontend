<script lang="ts">
/**
 * ListFaq Component
 *
 * The `ListFaq` component renders a list of frequently asked questions
 * (FAQs) based on the specified variant.
 *
 * @description
 * This component displays a list of FAQs, which can be for either
 * participants or coordinators. The FAQ items are collapsible and can
 * be expanded to view the answers.
 *
 * @props
 * - `title` (String): The heading or title for the list of FAQs.
 * - `variant` (String: 'participant' | 'coordinator'): Determines the
 *   type of FAQs to display, either for participants or coordinators.
 *
 * @example
 * <list-faq :title="faqTitle" variant="participant" />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=4858%3A103853&mode=dev)
 */

// libraries
import { defineComponent, computed } from 'vue';

// mocks
import { faqParticipant, faqCoordinator } from 'src/mocks/layout';

export default defineComponent({
  name: 'ListFaq',
  props: {
    title: {
      type: String,
    },
    variant: {
      type: String as () => 'participant' | 'coordinator',
    },
  },
  setup(props) {
    const items = computed(() => {
      if (props.variant === 'participant') {
        return faqParticipant;
      }
      if (props.variant === 'coordinator') {
        return faqCoordinator;
      }
      return [];
    });

    return {
      items,
    };
  },
});
</script>

<template>
  <div>
    <!-- Title -->
    <h4
      class="text-h5 text-weight-bold q-my-none q-px-md"
      data-cy="list-faq-title"
    >
      {{ title }}
    </h4>
    <!-- Questions list -->
    <q-list separator class="faq-list q-mt-md" data-cy="list-faq-list">
      <!-- Question - dropdown item button -->
      <q-expansion-item
        v-for="item in items"
        :key="item.title"
        :label="item.title"
      >
        <!-- Answer - dropdown item content -->
        <q-card>
          <q-card-section>
            {{ item.text }}
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-list>
  </div>
</template>
