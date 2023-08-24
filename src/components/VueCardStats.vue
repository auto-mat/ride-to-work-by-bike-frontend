<script lang='ts'>
import { defineComponent } from 'vue';
import { i18n } from 'src/boot/i18n';

// types
import { CardStats } from './types';

export default defineComponent({
  name: 'VueCardStats',
  props: {
    card: {
      type: Object as () => CardStats,
      required: true,
    },
  }
})
</script>

<template>
  <div class="q-pt-lg max-w-420">
    <q-card flat bordered class="rounded-20" data-cy="card-stats">
      <q-card-section avatar class="q-py-none">
        <q-icon :name="card.icon" size="48px" class="text-blue-grey-3 -mt-24" data-cy="card-stats-icon" />
      </q-card-section>
      <q-card-section>
        <h3 class="text-body1 text-weight-bold text-black" data-cy="card-stats-title">{{ card.title }}</h3>
        <q-list class="q-pa-none">
          <q-item v-for="item in card.stats" :key="item.id" class="q-px-none text-black" data-cy="card-stats-item">
            <q-item-section avatar class="text-blue-grey-3">
              <q-icon :name="item.icon" size="14px" />
            </q-item-section>
            <q-item-section>
              <q-item-label>
                {{ item.text }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </div>
</template>

<style>
.rounded-20 {
  border-radius: 20px;
}
.max-w-420 {
  max-width: 420px;
}
.-mt-24 {
  margin-top: -24px;
}
.q-item__section--avatar {
  min-width: 14px;
}
</style>
