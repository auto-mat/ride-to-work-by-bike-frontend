<script lang="ts">
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'VueListFaq',
  props: {
    title: {
      type: String,
    },
    variant: {
      type: String as () => 'participant' | 'coordinator',
    },
  },
  setup(props) {
    const dummyText =
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';

    const itemsFAQParticipant = [
      {
        title: 'Chci z toho vycouvat. Vrátite mi startovné?',
        text: dummyText,
      },
      {
        title: 'Nechcete přijmout moji platbu startovného.',
        text: dummyText,
      },
      {
        title:
          'Do práce mi to na kole deska nějak nevyšlo. Můžu si místo toho zapsat víkendový vylet?',
        text: dummyText,
      },
      {
        title: 'Jak se propojím se svojí mobilní aplikací?',
        text: dummyText,
      },
      {
        title: 'Jak si zapíšu cestu na noční směnu?',
        text: dummyText,
      },
      {
        title: 'Můžu na cestě do práce kombinovat dopravní prostředky?',
        text: dummyText,
      },
      {
        title: 'Chci změnit adresu, na kterou mi pošlete startovní balíček.',
        text: dummyText,
      },
      {
        title: 'Ještě nemám startovní balíček, safra.',
        text: dummyText,
      },
      {
        title: 'Nechci to moc rozebírat, ale velikost trička mi nesedí.',
        text: dummyText,
      },
    ];

    const itemsFAQCoordinator = [
      {
        title: 'Jsem hodný šéf a chci zaplatit za své zaměstnance.',
        text: dummyText,
      },
      {
        title: 'Chci predat břímě firemniho koordinátora někomu jinému.',
        text: dummyText,
      },
      {
        title: 'Chci vidět výsledky výzev.',
        text: dummyText,
      },
      {
        title: 'Jak se stanu hrdým firemním koordinátorem?',
        text: dummyText,
      },
      {
        title:
          'Jak se stát firemním koordinátorem a zároveň se účastnit výzvy Do práce na kole?',
        text: dummyText,
      },
      {
        title:
          'Nechcete se účastnit výzvy, ale chcete se stát firemním koordinátorem?',
        text: dummyText,
      },
      {
        title: 'Jak uhradit startovné za kolegy?',
        text: dummyText,
      },
      {
        title: 'Jak se hlásí kolegové?',
        text: dummyText,
      },
      {
        title: 'Kde najdu fakturu?',
        text: dummyText,
      },
    ];

    const items = computed((): Array<object> => {
      if (props.variant === 'participant') {
        return itemsFAQParticipant;
      }
      if (props.variant === 'coordinator') {
        return itemsFAQCoordinator;
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
    <!-- Heading -->
    <h4
      class="text-h5 text-weight-bold q-my-none q-px-md"
      data-cy="list-faq-title"
    >
      {{ title }}
    </h4>
    <q-list separator class="faq-list q-mt-md" data-cy="list-faq-list">
      <!-- Dropdown item -->
      <q-expansion-item
        v-for="item in items"
        :key="item.title"
        :label="item.title"
      >
        <!-- Dropdown content -->
        <q-card>
          <q-card-section>
            {{ item.text }}
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-list>
  </div>
</template>
