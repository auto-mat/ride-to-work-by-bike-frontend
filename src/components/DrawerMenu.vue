<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'DrawerMenu',
  setup() {
    const menuTop = [
      {
        url: '/',
        icon: 'home',
        name: 'home'
      },
      {
        url: '/cesty',
        icon: 'route',
        name: 'routes'
      },
      {
        url: '/vysledky',
        icon: 'emoji_events',
        name: 'results'
      },
      {
        url: '/komunita',
        icon: 'people',
        name: 'community'
      },
      {
        url: '/slevy',
        icon: 'verified',
        name: 'discounts'
      },
      {
        url: '/firemni-koordinator',
        icon: 'business',
        name: 'coordinator'
      },
      {
        url: '/profil',
        icon: 'account_circle',
        name: 'profile'
      }
    ]

    const menuBottom = [
      {
        url: '/',
        icon: 'email',
        name: 'inviteFriends'
      },
      {
        url: '/cesty',
        icon: 'volunteer_activism',
        name: 'donate'
      },
    ]

    return {
      menuTop,menuBottom
    }
  }
})
</script>

<template>
  <q-list>
    <q-item v-for="item in menuTop" :key="item.name" class="flex items-center gap-sm" clickable>
      <q-icon :name="item.icon" size="xs"></q-icon>
      {{ $t(`drawerMenu.${item.name}`) }}
    </q-item>
    <hr>
    <q-item v-for="item in menuBottom" :key="item.name" class="flex items-center gap-sm" clickable>
      <q-icon :name="item.icon" size="xs"></q-icon>
      {{ $t(`drawerMenu.${item.name}`) }}
    </q-item>
  </q-list>
</template>

<style scoped>
.gap-sm {
  gap: 8px;
}
</style>
