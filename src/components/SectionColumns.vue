<script lang="ts">
/**
 * SectionColumns Component
 *
 * The `SectionColumns`
 *
 * @description * Use this component to render content in columns.
 * You can adjust its appearance by passing the `columns` prop.
 *
 * Note: This component is commonly used with Card-type components.
 *
 * @props
 * - `columns` (Number, required): The number of columns.
 *   It should be one of these options: 2 | 3 | 4 | 6.
 *
 * @slots
 * - `default`: For displaying content.
 *
 * Note: each element in content slot takes up one grid column.
 *
 * @example
 * <section-columns :columns="4">
 *   <card-stats v-for="card in cardsStats" :key="card.title" :card="card" />
 * </section-columns>
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=4858%3A106374&mode=dev)
 */

// libraries
import { h } from 'vue';

export default {
  name: 'SectionColumns',
  props: {
    columns: {
      type: Number as () => 2 | 3 | 4 | 6,
      required: true,
    },
  },
  render() {
    // Access the default slot
    const defaultSlot = this.$slots.default && this.$slots.default();
    if (!defaultSlot) {
      // Render empty wrapper
      return h('div', {}, defaultSlot);
    }

    // Map over each child in the default slot
    const childrenWithClass = defaultSlot.map((slot) => {
      // If children are VNodes
      if (Array.isArray(slot.children)) {
        return slot.children.map((child) => {
          // Render each child with the appropriate column classes
          return h(
            'div',
            {
              'class': [`col-12 col-sm-6 col-lg-${12 / this.columns}`],
              'data-cy': 'section-columns-column',
            },
            [child]
          );
        });
      }

      // Render content
      return h('div', {}, slot);
    });

    // Return the component VNode
    return h(
      'div',
      {
        'class': ['row'],
        'data-cy': 'section-columns-row',
      },
      childrenWithClass
    );
  },
};
</script>
