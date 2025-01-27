<script lang="ts">
/**
 * ButtonNotifications Component
 *
 * @description * Use this component to render a notification button with
 * a dialog popup, containing a list of unread notifications.
 *
 * Used in `DrawerHeader` component.
 *
 * @slots
 * - `button`: For rendering a custom button
 *   exposed methods:
 *     - `openDialog`
 *
 * @components
 * - `DialogDefault`: Component to render a dialog with notifications.
 *
 * @example
 * <button-notifications>
 *  <template #button>
 *    <q-btn>
 *      <q-icon name="notifications" />
 *    </q-btn>
 *  </template>
 * </button-notifications>
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=7004-32012&t=3cf3dt8cy6quEPfT-1)
 */

// libraries
import { defineComponent, ref } from 'vue';

// components
import DialogDefault from './DialogDefault.vue';

// composables
import { useFormatDate } from '../../composables/useFormatDate';
import { useNotifications } from '../../composables/useNotifications';

// config
import { routesConf } from '../../router/routes_conf';

export default defineComponent({
  name: 'ButtonNotifications',
  components: {
    DialogDefault,
  },
  setup() {
    const isButtonNotificationsEnabled = false;

    const isDialogOpen = ref<boolean>(false);

    const openDialog = (): void => {
      isDialogOpen.value = true;
    };

    const {
      notificationsUnread,
      notificationsUnreadCount,
      markAsRead,
      markAllAsRead,
      onNotificationClick,
    } = useNotifications();

    const { formatDateTimeLabel } = useFormatDate();

    return {
      formatDateTimeLabel,
      isDialogOpen,
      markAllAsRead,
      markAsRead,
      notificationsUnread,
      notificationsUnreadCount,
      openDialog,
      onNotificationClick,
      routesConf,
      isButtonNotificationsEnabled,
    };
  },
});
</script>

<template>
  <div v-if="isButtonNotificationsEnabled">
    <slot
      name="button"
      :open-dialog="openDialog"
      :notifications-unread-count="notificationsUnreadCount"
    >
      <!-- Default slot button -->
      <q-btn
        unelevated
        round
        color="primary"
        size="8px"
        @click.prevent="openDialog"
        data-cy="button-notifications"
      >
        <!-- Badge -->
        <q-badge
          floating
          rounded
          v-if="notificationsUnreadCount > 0"
          color="red"
          style="z-index: 1"
          data-cy="notifications-count-badge"
        />
        <!-- Icon -->
        <q-icon
          name="svguse:/icons/button_notifications/icons.svg#bell"
          size="18px"
          color="white"
          data-cy="notifications-icon"
        />
      </q-btn>
    </slot>
    <!-- Dialog -->
    <dialog-default
      no-padding
      v-model="isDialogOpen"
      min-width="0"
      data-cy="notifications-dialog"
    >
      <template #title>
        <div class="flex items-center justify-between gap-4">
          <div class="flex items-center justify-between">
            <!-- Dialog title -->
            <h3
              class="text-h6 text-weight-normal text-grey-10 q-my-none"
              data-cy="notifications-title"
            >
              {{ $t('notifications.dialogTitle') }}
            </h3>
            <!-- Badge: unread count -->
            <q-badge
              v-if="notificationsUnreadCount > 0"
              color="red"
              class="q-ml-md"
              data-cy="notifications-count-badge-dialog"
            >
              {{ notificationsUnreadCount }}
            </q-badge>
          </div>
          <div>
            <!-- Button: notification history -->
            <q-btn
              flat
              color="primary"
              :to="routesConf['profile_notifications'].children.fullPath"
              data-cy="notifications-history-button"
            >
              {{ $t('notifications.buttonNotificationHistory') }}
            </q-btn>
          </div>
        </div>
      </template>
      <template #content>
        <!-- Button: mark all as read -->
        <div
          v-if="notificationsUnreadCount > 0"
          class="flex items-center justify-end q-px-md"
        >
          <q-btn
            flat
            color="primary"
            @click="markAllAsRead"
            data-cy="mark-all-read-button"
          >
            {{ $t('notifications.buttonMarkAllAsRead') }}
          </q-btn>
        </div>
        <!-- Empty state -->
        <div v-else class="q-px-md" data-cy="no-unread-notifications">
          <p class="text-grey-10 q-my-sm">
            {{ $t('notifications.textNoUnreadNotifications') }}
          </p>
        </div>
        <!-- List -->
        <q-list data-cy="notifications-list">
          <!-- Notification item -->
          <q-item
            v-for="notification in notificationsUnread"
            :key="notification.id"
            class="q-my-sm"
            clickable
            v-ripple
            :data-cy="`notification-item-${notification.id}`"
            @click="onNotificationClick(notification)"
          >
            <!-- Avatar -->
            <q-item-section avatar>
              <q-avatar
                v-if="notification.data.icon"
                color="primary"
                text-color="white"
                :data-cy="`notification-icon-${notification.id}`"
              >
                <q-icon :name="notification.data.icon" />
              </q-avatar>
            </q-item-section>
            <!-- Content -->
            <q-item-section>
              <!-- Title -->
              <q-item-label
                v-if="notification.verb"
                :data-cy="`notification-verb-${notification.id}`"
              >
                {{ notification.verb }}
              </q-item-label>
              <!-- Description -->
              <q-item-label
                v-if="notification.timestamp"
                caption
                lines="1"
                :data-cy="`notification-timestamp-${notification.id}`"
              >
                {{ formatDateTimeLabel(notification.timestamp) }}
              </q-item-label>
            </q-item-section>
            <!-- Actions -->
            <q-item-section side>
              <!-- Button: mark as read -->
              <q-btn
                round
                flat
                size="sm"
                :outline="!notification.unread"
                :disabled="!notification.unread"
                color="primary"
                :icon="
                  notification.unread
                    ? 'mdi-email-check-outline'
                    : 'mdi-email-open-outline'
                "
                @click.stop="markAsRead(notification)"
                :data-cy="`notification-state-icon-${notification.id}`"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </template>
    </dialog-default>
  </div>
</template>
