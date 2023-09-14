<script lang="ts">
// libraries
import { defineComponent, computed } from 'vue';

// mocks
import { faqParticipant, faqCoordinator } from 'src/mocks/homepage';

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
