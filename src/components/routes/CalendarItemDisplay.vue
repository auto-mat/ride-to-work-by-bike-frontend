<script lang="ts">
/**
 * CalendarItemDisplay Component
 *
 * @description * Use this component to display a single route item in
 * the calendar.
 * You can adjust its appearance by specifying the `to-work` or `from-work`
 * props. Each shows arrow pointing in a different direction.
 *
 * @props
 * - `route` (Route): The object representing the associated route.
 *   It should be of type `Route`. It can be null or undefined.
 * - `toWork` (boolean, optional): Whether the route is to work.
 * - `fromWork` (boolean, optional): Whether the route is from work.
 * - `active` (boolean, optional): Whether the route is active (currently
 *   being edited).
 *
 * @events
 * - `click`: Register click on item.
 *
 * @example
 * <calendar-item />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=8279-39418&t=baRxKn3ERzsqCVyl-1)
 */

// libraries
import { computed, defineComponent } from 'vue';

export default defineComponent({
  name: 'CalendarItemDisplay',
  props: {
    day: {
      type: Object,
      default: null,
    },
    direction: {
      type: String as () => 'toWork' | 'fromWork',
      required: true,
    },
    timestamp: {
      type: Object,
      required: true,
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['item-click'],
  setup(props, { emit }) {
    const onClick = (): void => {
      emit('item-click', {
        timestamp: props.timestamp,
        direction: props.direction,
      });
    };

    const route = computed(() => {
      if (!props.day) return null;
      return props.day[props.direction] ? props.day[props.direction] : null;
    });

    return {
      route,
      onClick,
    };
  },
});
</script>

<template>
  <div class="q-my-sm">
    <q-item
      dense
      clickable
      v-ripple
      class="relative-position flex justify-center items-center text-center gap-8"
      @click.prevent="onClick()"
    >
      <!-- Route: Logged -->
      <template v-if="route && route.id">
        <template v-if="direction === 'toWork'">
          <!-- Icon: Active - To work -->
          <q-icon
            v-if="active"
            color="primary"
            class="full-width full-height absolute-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 135 38">
              <path
                fill-rule="evenodd"
                d="M8.857 0a8 8 0 0 0-8 8v22a8 8 0 0 0 8 8h99.2l26.8-19-26.8-19h-99.2Z"
                clip-rule="evenodd"
              />
            </svg>
          </q-icon>
          <!-- Icon: Not active - To work -->
          <q-icon
            v-else
            color="secondary"
            class="full-width full-height absolute-full"
            style="opacity: 0.4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 135 38">
              <path
                fill-rule="evenodd"
                d="M8.857 0a8 8 0 0 0-8 8v22a8 8 0 0 0 8 8h99.2l26.8-19-26.8-19h-99.2Z"
                clip-rule="evenodd"
              />
            </svg>
          </q-icon>
        </template>
        <template v-if="direction === 'fromWork'">
          <!-- Icon: Active - From work -->
          <q-icon
            v-if="active"
            color="primary"
            class="full-width full-height absolute-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 135 38">
              <path
                fill-rule="evenodd"
                d="M126.857 0a8 8 0 0 1 8 8v22a8 8 0 0 1-8 8h-99.2L.857 19l26.8-19h99.2Z"
                clip-rule="evenodd"
              />
            </svg>
          </q-icon>
          <!-- Icon: Not active - From work -->
          <q-icon
            v-else
            color="secondary"
            class="full-width full-height absolute-full"
            style="opacity: 0.4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 135 38">
              <path
                fill-rule="evenodd"
                d="M126.857 0a8 8 0 0 1 8 8v22a8 8 0 0 1-8 8h-99.2L.857 19l26.8-19h99.2Z"
                clip-rule="evenodd"
              />
            </svg>
          </q-icon>
        </template>
        <!-- Icon: Transport type -->
        <q-icon
          :color="active ? 'white' : 'primary'"
          name="pedal_bike"
          size="18px"
        />
        <!-- Distance -->
        <span
          class="relative-position text-caption"
          :class="[active ? 'text-white' : 'text-primary']"
        >
          {{ route.distance }} km
        </span>
      </template>

      <!-- Route: Not logged -->
      <template v-else>
        <template v-if="direction === 'toWork'">
          <!-- Icon: Background fill - To work -->
          <q-icon
            v-if="active"
            color="primary"
            class="full-width full-height absolute-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 135 38">
              <path
                fill-rule="evenodd"
                d="M8.857 0a8 8 0 0 0-8 8v22a8 8 0 0 0 8 8h99.2l26.8-19-26.8-19h-99.2Z"
                clip-rule="evenodd"
              />
            </svg>
          </q-icon>
          <!-- Icon: Background outline - To work -->
          <q-icon
            v-else
            color="primary"
            class="full-width full-height absolute-full"
            style="opacity: 0.5"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="-1 -1 138 40"
            >
              <path
                fill="currentColor"
                d="M108 38v.5h.158l.13-.091L108 38Zm27-19 .288.409.581-.409-.581-.409L135 19ZM108 0l.288-.409-.13-.091H108V0ZM-.5 8v.917h1V8h-1Zm0 2.75v1.833h1V10.75h-1Zm0 3.667v1.833h1v-1.833h-1Zm0 3.666v1.834h1v-1.834h-1Zm0 3.667v1.833h1V21.75h-1Zm0 3.667v1.833h1v-1.833h-1Zm0 3.666V30h1v-.917h-1Zm0 .917c0 .376.024.746.072 1.11l.991-.13A7.575 7.575 0 0 1 .5 30h-1Zm.645 3.254a8.49 8.49 0 0 0 1.111 1.92l.793-.608a7.491 7.491 0 0 1-.98-1.695l-.924.383Zm2.68 3.49c.585.449 1.23.824 1.921 1.11l.383-.923a7.487 7.487 0 0 1-1.695-.98l-.609.793Zm4.065 1.684c.364.048.734.072 1.11.072v-1c-.332 0-.66-.022-.98-.063l-.13.991ZM8 38.5h1v-1H8v1Zm3 0h2v-1h-2v1Zm4 0h2v-1h-2v1Zm4 0h2v-1h-2v1Zm4 0h2v-1h-2v1Zm4 0h2v-1h-2v1Zm4 0h2v-1h-2v1Zm4 0h2v-1h-2v1Zm4 0h2v-1h-2v1Zm4 0h2v-1h-2v1Zm4 0h2v-1h-2v1Zm4 0h2v-1h-2v1Zm4 0h2v-1h-2v1Zm4 0h2v-1h-2v1Zm4 0h2v-1h-2v1Zm4 0h2v-1h-2v1Zm4 0h2v-1h-2v1Zm4 0h2v-1h-2v1Zm4 0h2v-1h-2v1Zm4 0h2v-1h-2v1Zm4 0h2v-1h-2v1Zm4 0h2v-1h-2v1Zm4 0h2v-1h-2v1Zm4 0h2v-1h-2v1Zm4 0h2v-1h-2v1Zm4 0h1v-1h-1v1Zm1.288-.091.844-.594-.576-.818-.844.594.576.818Zm2.531-1.781 1.688-1.188-.576-.818-1.688 1.188.576.818Zm3.375-2.375 1.688-1.188-.576-.818-1.687 1.188.575.818Zm3.375-2.375 1.688-1.188-.576-.818-1.687 1.188.575.818Zm3.375-2.375 1.688-1.188-.576-.818-1.687 1.188.575.818Zm3.375-2.375 1.688-1.188-.576-.818-1.688 1.188.576.818Zm3.375-2.375 1.688-1.188-.576-.818-1.688 1.188.576.818Zm3.375-2.375 1.688-1.188-.576-.818-1.688 1.188.576.818Zm3.375-2.375.844-.594-.576-.818-.844.594.576.818Zm.844-1.412-.844-.594-.576.818.844.594.576-.818Zm-2.531-1.781-1.688-1.188-.576.818 1.688 1.188.576-.818Zm-3.375-2.375-1.688-1.188-.576.818 1.688 1.188.576-.818Zm-3.376-2.375-1.687-1.188-.576.818 1.688 1.188.575-.818Zm-3.375-2.375-1.687-1.188-.576.818 1.688 1.188.575-.818Zm-3.374-2.375-1.688-1.188-.576.818 1.688 1.188.576-.818Zm-3.375-2.375-1.688-1.188-.575.818 1.687 1.188.576-.818Zm-3.375-2.375-1.688-1.188-.575.818 1.687 1.188.576-.818ZM109.132.185l-.844-.594-.576.818.844.594.576-.818ZM108-.5h-1v1h1v-1Zm-3 0h-2v1h2v-1Zm-4 0h-2v1h2v-1Zm-4 0h-2v1h2v-1Zm-4 0h-2v1h2v-1Zm-4 0h-2v1h2v-1Zm-4 0h-2v1h2v-1Zm-4 0h-2v1h2v-1Zm-4 0h-2v1h2v-1Zm-4 0h-2v1h2v-1Zm-4 0h-2v1h2v-1Zm-4 0h-2v1h2v-1Zm-4 0h-2v1h2v-1Zm-4 0h-2v1h2v-1Zm-4 0h-2v1h2v-1Zm-4 0h-2v1h2v-1Zm-4 0h-2v1h2v-1Zm-4 0h-2v1h2v-1Zm-4 0h-2v1h2v-1Zm-4 0h-2v1h2v-1Zm-4 0h-2v1h2v-1Zm-4 0h-2v1h2v-1Zm-4 0h-2v1h2v-1Zm-4 0h-2v1h2v-1Zm-4 0h-2v1h2v-1Zm-4 0H8v1h1v-1Zm-1 0c-.376 0-.746.024-1.11.072l.13.991C7.34.522 7.668.5 8 .5v-1ZM4.746.145a8.492 8.492 0 0 0-1.92 1.111l.608.793a7.492 7.492 0 0 1 1.695-.98L4.746.145Zm-3.49 2.68a8.492 8.492 0 0 0-1.11 1.921l.923.383c.253-.61.584-1.178.98-1.695l-.793-.609ZM-.428 6.89A8.576 8.576 0 0 0-.5 8h1c0-.332.022-.66.063-.98l-.991-.13ZM108 38v1h.317l.258-.182L108 38Zm27-19 .576.818 1.162-.818-1.162-.818L135 19ZM108 0l.575-.818-.258-.182H108v1ZM-1 8v.917h2V8h-2Zm0 2.75v1.833h2V10.75h-2Zm0 3.667v1.833h2v-1.833h-2Zm0 3.666v1.834h2v-1.834h-2Zm0 3.667v1.833h2V21.75h-2Zm0 3.667v1.833h2v-1.833h-2Zm0 3.666V30h2v-.917h-2ZM-1 30c0 .398.026.79.076 1.174l1.983-.258C1.02 30.616 1 30.31 1 30h-2Zm.683 3.445c.304.733.701 1.416 1.177 2.035l1.586-1.22a6.99 6.99 0 0 1-.915-1.58l-1.848.765ZM2.52 37.14a8.993 8.993 0 0 0 2.035 1.177l.766-1.848a6.989 6.989 0 0 1-1.582-.915L2.52 37.14Zm4.306 1.784c.385.05.777.076 1.174.076v-2c-.31 0-.616-.02-.916-.06l-.258 1.984ZM8 39h1v-2H8v2Zm3 0h2v-2h-2v2Zm4 0h2v-2h-2v2Zm4 0h2v-2h-2v2Zm4 0h2v-2h-2v2Zm4 0h2v-2h-2v2Zm4 0h2v-2h-2v2Zm4 0h2v-2h-2v2Zm4 0h2v-2h-2v2Zm4 0h2v-2h-2v2Zm4 0h2v-2h-2v2Zm4 0h2v-2h-2v2Zm4 0h2v-2h-2v2Zm4 0h2v-2h-2v2Zm4 0h2v-2h-2v2Zm4 0h2v-2h-2v2Zm4 0h2v-2h-2v2Zm4 0h2v-2h-2v2Zm4 0h2v-2h-2v2Zm4 0h2v-2h-2v2Zm4 0h2v-2h-2v2Zm4 0h2v-2h-2v2Zm4 0h2v-2h-2v2Zm4 0h2v-2h-2v2Zm4 0h2v-2h-2v2Zm4 0h1v-2h-1v2Zm1.575-.182.844-.594-1.151-1.636-.843.594 1.15 1.636Zm2.532-1.781 1.687-1.188-1.151-1.636-1.687 1.188 1.151 1.636Zm3.375-2.375 1.687-1.188-1.151-1.636-1.687 1.188 1.151 1.636Zm3.375-2.375 1.687-1.188-1.151-1.636-1.687 1.188 1.151 1.636Zm3.375-2.375 1.687-1.188-1.151-1.636-1.687 1.188 1.151 1.636Zm3.375-2.375 1.687-1.188-1.151-1.636-1.687 1.188 1.151 1.636Zm3.375-2.375 1.687-1.188-1.151-1.636-1.687 1.188 1.151 1.636Zm3.375-2.375 1.687-1.188-1.151-1.636-1.687 1.188 1.151 1.636Zm3.375-2.375.844-.594-1.152-1.636-.843.594 1.151 1.636Zm.844-2.23-.844-.594-1.151 1.636.843.594 1.152-1.636Zm-2.532-1.781-1.687-1.188-1.151 1.636 1.687 1.188 1.151-1.636Zm-3.375-2.375-1.687-1.188-1.151 1.636 1.687 1.188 1.151-1.636Zm-3.375-2.375-1.687-1.188-1.151 1.636 1.687 1.188 1.151-1.636Zm-3.375-2.375-1.687-1.188-1.151 1.636 1.687 1.188 1.151-1.636ZM119.544 6.9l-1.687-1.188-1.151 1.636 1.687 1.188 1.151-1.636Zm-3.375-2.375-1.687-1.188-1.151 1.636 1.687 1.188 1.151-1.636Zm-3.375-2.375L111.107.963 109.956 2.6l1.687 1.188 1.151-1.636Zm-3.375-2.375-.844-.594-1.15 1.636.843.594 1.151-1.636ZM108-1h-1v2h1v-2Zm-3 0h-2v2h2v-2Zm-4 0h-2v2h2v-2Zm-4 0h-2v2h2v-2Zm-4 0h-2v2h2v-2Zm-4 0h-2v2h2v-2Zm-4 0h-2v2h2v-2Zm-4 0h-2v2h2v-2Zm-4 0h-2v2h2v-2Zm-4 0h-2v2h2v-2Zm-4 0h-2v2h2v-2Zm-4 0h-2v2h2v-2Zm-4 0h-2v2h2v-2Zm-4 0h-2v2h2v-2Zm-4 0h-2v2h2v-2Zm-4 0h-2v2h2v-2Zm-4 0h-2v2h2v-2Zm-4 0h-2v2h2v-2Zm-4 0h-2v2h2v-2Zm-4 0h-2v2h2v-2Zm-4 0h-2v2h2v-2Zm-4 0h-2v2h2v-2Zm-4 0h-2v2h2v-2Zm-4 0h-2v2h2v-2Zm-4 0h-2v2h2v-2ZM9-1H8v2h1v-2ZM8-1c-.397 0-.79.026-1.174.076l.258 1.983C7.384 1.02 7.69 1 8 1v-2Zm-3.445.683C3.822-.013 3.139.384 2.52.86l1.22 1.586a6.992 6.992 0 0 1 1.58-.915L4.556-.317ZM.86 2.52A8.992 8.992 0 0 0-.317 4.555l1.848.766c.236-.569.544-1.1.915-1.582L.86 2.52ZM-.924 6.826C-.974 7.21-1 7.603-1 8h2c0-.31.02-.616.06-.916l-1.984-.258Z"
              />
            </svg>
          </q-icon>
        </template>
        <template v-if="direction === 'fromWork'">
          <!-- Icon: Background fill - From work -->
          <q-icon
            v-if="active"
            color="primary"
            class="full-width full-height absolute-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 135 38">
              <path
                fill-rule="evenodd"
                d="M126.857 0a8 8 0 0 1 8 8v22a8 8 0 0 1-8 8h-99.2L.857 19l26.8-19h99.2Z"
                clip-rule="evenodd"
              />
            </svg>
          </q-icon>
          <!-- Icon: Background outline - From work -->
          <q-icon
            v-else
            color="primary"
            class="full-width full-height absolute-full"
            style="opacity: 0.5"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="-1 -1 138 40"
            >
              <path
                fill="currentColor"
                d="M27 38v.5h-.158l-.13-.091L27 38ZM0 19l-.288.409-.58-.409.58-.409L0 19ZM27 0l-.288-.409.13-.091H27V0Zm108.5 8v.917h-1V8h1Zm0 2.75v1.833h-1V10.75h1Zm0 3.667v1.833h-1v-1.833h1Zm0 3.666v1.834h-1v-1.834h1Zm0 3.667v1.833h-1V21.75h1Zm0 3.667v1.833h-1v-1.833h1Zm0 3.666V30h-1v-.917h1Zm0 .917c0 .376-.024.746-.072 1.11l-.991-.13c.041-.32.063-.648.063-.98h1Zm-.645 3.254a8.516 8.516 0 0 1-1.111 1.92l-.793-.608a7.527 7.527 0 0 0 .98-1.695l.924.383Zm-2.68 3.49c-.585.449-1.23.824-1.921 1.11l-.383-.923a7.515 7.515 0 0 0 1.695-.98l.609.793Zm-4.065 1.684a8.587 8.587 0 0 1-1.11.072v-1c.332 0 .66-.022.98-.063l.13.991ZM127 38.5h-1v-1h1v1Zm-3 0h-2v-1h2v1Zm-4 0h-2v-1h2v1Zm-4 0h-2v-1h2v1Zm-4 0h-2v-1h2v1Zm-4 0h-2v-1h2v1Zm-4 0h-2v-1h2v1Zm-4 0h-2v-1h2v1Zm-4 0h-2v-1h2v1Zm-4 0h-2v-1h2v1Zm-4 0h-2v-1h2v1Zm-4 0h-2v-1h2v1Zm-4 0h-2v-1h2v1Zm-4 0h-2v-1h2v1Zm-4 0h-2v-1h2v1Zm-4 0h-2v-1h2v1Zm-4 0h-2v-1h2v1Zm-4 0h-2v-1h2v1Zm-4 0h-2v-1h2v1Zm-4 0h-2v-1h2v1Zm-4 0h-2v-1h2v1Zm-4 0h-2v-1h2v1Zm-4 0h-2v-1h2v1Zm-4 0h-2v-1h2v1Zm-4 0h-2v-1h2v1Zm-4 0h-1v-1h1v1Zm-1.288-.091-.843-.594.575-.818.844.594-.576.818Zm-2.531-1.781-1.688-1.188.576-.818 1.688 1.188-.576.818Zm-3.375-2.375-1.688-1.188.576-.818 1.688 1.188-.576.818Zm-3.375-2.375-1.688-1.188.576-.818 1.688 1.188-.576.818Zm-3.375-2.375-1.688-1.188.576-.818 1.688 1.188-.576.818Zm-3.375-2.375L8.993 25.94l.576-.818 1.688 1.188-.576.818Zm-3.375-2.375-1.688-1.188.576-.818 1.688 1.188-.576.818Zm-3.375-2.375L2.243 21.19l.576-.818 1.688 1.188-.576.818ZM.556 20.003l-.844-.594.576-.818.843.594-.575.818Zm-.844-1.412.844-.594.575.818-.843.594-.576-.818Zm2.531-1.781 1.688-1.188.575.818-1.687 1.188-.575-.818Zm3.376-2.375 1.687-1.188.575.818-1.687 1.188-.575-.818Zm3.375-2.375 1.687-1.188.576.818-1.688 1.188-.575-.818Zm3.374-2.375 1.688-1.188.576.818-1.688 1.188-.576-.818Zm3.375-2.375 1.688-1.188.575.818-1.687 1.188-.575-.818Zm3.376-2.375 1.687-1.188.575.818-1.687 1.188-.575-.818Zm3.375-2.375 1.687-1.188.575.818-1.687 1.188-.575-.818ZM25.869.185l.843-.594.576.818-.844.594-.575-.818ZM27-.5h1v1h-1v-1Zm3 0h2v1h-2v-1Zm4 0h2v1h-2v-1Zm4 0h2v1h-2v-1Zm4 0h2v1h-2v-1Zm4 0h2v1h-2v-1Zm4 0h2v1h-2v-1Zm4 0h2v1h-2v-1Zm4 0h2v1h-2v-1Zm4 0h2v1h-2v-1Zm4 0h2v1h-2v-1Zm4 0h2v1h-2v-1Zm4 0h2v1h-2v-1Zm4 0h2v1h-2v-1Zm4 0h2v1h-2v-1Zm4 0h2v1h-2v-1Zm4 0h2v1h-2v-1Zm4 0h2v1h-2v-1Zm4 0h2v1h-2v-1Zm4 0h2v1h-2v-1Zm4 0h2v1h-2v-1Zm4 0h2v1h-2v-1Zm4 0h2v1h-2v-1Zm4 0h2v1h-2v-1Zm4 0h2v1h-2v-1Zm4 0h1v1h-1v-1Zm1 0c.376 0 .746.024 1.11.072l-.13.991A7.57 7.57 0 0 0 127 .5v-1Zm3.254.645a8.503 8.503 0 0 1 1.921 1.111l-.609.793a7.52 7.52 0 0 0-1.695-.98l.383-.924Zm3.49 2.68c.449.585.824 1.23 1.111 1.921l-.924.383a7.527 7.527 0 0 0-.98-1.695l.793-.609Zm1.684 4.065c.048.364.072.734.072 1.11h-1c0-.332-.022-.66-.063-.98l.991-.13ZM27 38v1h-.317l-.259-.182L27 38ZM0 19l-.576.818L-1.737 19l1.163-.818L0 19ZM27 0l-.576-.818.26-.182H27v1Zm109 8v.917h-2V8h2Zm0 2.75v1.833h-2V10.75h2Zm0 3.667v1.833h-2v-1.833h2Zm0 3.666v1.834h-2v-1.834h2Zm0 3.667v1.833h-2V21.75h2Zm0 3.667v1.833h-2v-1.833h2Zm0 3.666V30h-2v-.917h2Zm0 .917c0 .398-.026.79-.076 1.174l-1.983-.258c.039-.3.059-.605.059-.916h2Zm-.683 3.445a8.995 8.995 0 0 1-1.177 2.035l-1.586-1.22a6.977 6.977 0 0 0 .915-1.58l1.848.765Zm-2.837 3.695a8.981 8.981 0 0 1-2.035 1.177l-.766-1.848a6.98 6.98 0 0 0 1.582-.915l1.219 1.586Zm-4.306 1.784c-.385.05-.777.076-1.174.076v-2c.311 0 .616-.02.916-.06l.258 1.984ZM127 39h-1v-2h1v2Zm-3 0h-2v-2h2v2Zm-4 0h-2v-2h2v2Zm-4 0h-2v-2h2v2Zm-4 0h-2v-2h2v2Zm-4 0h-2v-2h2v2Zm-4 0h-2v-2h2v2Zm-4 0h-2v-2h2v2Zm-4 0h-2v-2h2v2Zm-4 0h-2v-2h2v2Zm-4 0h-2v-2h2v2Zm-4 0h-2v-2h2v2Zm-4 0h-2v-2h2v2Zm-4 0h-2v-2h2v2Zm-4 0h-2v-2h2v2Zm-4 0h-2v-2h2v2Zm-4 0h-2v-2h2v2Zm-4 0h-2v-2h2v2Zm-4 0h-2v-2h2v2Zm-4 0h-2v-2h2v2Zm-4 0h-2v-2h2v2Zm-4 0h-2v-2h2v2Zm-4 0h-2v-2h2v2Zm-4 0h-2v-2h2v2Zm-4 0h-2v-2h2v2Zm-4 0h-1v-2h1v2Zm-1.576-.182-.843-.594 1.15-1.636.845.594-1.152 1.636Zm-2.53-1.781-1.688-1.188 1.15-1.636 1.688 1.188-1.15 1.636Zm-3.376-2.375-1.687-1.188 1.15-1.636 1.688 1.188-1.15 1.636Zm-3.375-2.375-1.687-1.188 1.15-1.636 1.688 1.188-1.15 1.636Zm-3.375-2.375-1.687-1.188 1.15-1.636 1.688 1.188-1.15 1.636Zm-3.375-2.375-1.687-1.188 1.15-1.636 1.688 1.188-1.15 1.636Zm-3.375-2.375-1.687-1.188 1.15-1.636 1.688 1.188-1.15 1.636Zm-3.375-2.375-1.687-1.188 1.15-1.636 1.688 1.188-1.15 1.636ZM.268 20.412l-.844-.594 1.151-1.636.844.594-1.15 1.636Zm-.844-2.23.844-.594 1.151 1.636-.844.594-1.15-1.636Zm2.532-1.781 1.687-1.188 1.151 1.636-1.687 1.188L1.956 16.4Zm3.375-2.375 1.687-1.188 1.151 1.636-1.687 1.188-1.151-1.636Zm3.375-2.375 1.687-1.188 1.151 1.636-1.687 1.188-1.151-1.636Zm3.375-2.375 1.687-1.188 1.151 1.636-1.687 1.188-1.151-1.636ZM15.456 6.9l1.687-1.188 1.151 1.636-1.687 1.188L15.456 6.9Zm3.375-2.375 1.687-1.188 1.151 1.636-1.687 1.188-1.151-1.636Zm3.375-2.375L23.893.963 25.044 2.6l-1.687 1.188-1.151-1.636ZM25.58-.224l.843-.594L27.576.818l-.844.594L25.58-.224ZM27-1h1v2h-1v-2Zm3 0h2v2h-2v-2Zm4 0h2v2h-2v-2Zm4 0h2v2h-2v-2Zm4 0h2v2h-2v-2Zm4 0h2v2h-2v-2Zm4 0h2v2h-2v-2Zm4 0h2v2h-2v-2Zm4 0h2v2h-2v-2Zm4 0h2v2h-2v-2Zm4 0h2v2h-2v-2Zm4 0h2v2h-2v-2Zm4 0h2v2h-2v-2Zm4 0h2v2h-2v-2Zm4 0h2v2h-2v-2Zm4 0h2v2h-2v-2Zm4 0h2v2h-2v-2Zm4 0h2v2h-2v-2Zm4 0h2v2h-2v-2Zm4 0h2v2h-2v-2Zm4 0h2v2h-2v-2Zm4 0h2v2h-2v-2Zm4 0h2v2h-2v-2Zm4 0h2v2h-2v-2Zm4 0h2v2h-2v-2Zm4 0h1v2h-1v-2Zm1 0c.398 0 .789.026 1.174.076l-.258 1.983c-.3-.039-.605-.059-.916-.059v-2Zm3.445.683A8.98 8.98 0 0 1 132.48.86l-1.219 1.586a6.984 6.984 0 0 0-1.582-.915l.766-1.848Zm3.695 2.837a8.994 8.994 0 0 1 1.177 2.035l-1.848.766a6.978 6.978 0 0 0-.915-1.582l1.586-1.219Zm1.784 4.306c.05.385.076.777.076 1.174h-2c0-.31-.02-.616-.059-.916l1.983-.258Z"
              />
            </svg>
          </q-icon>
        </template>
        <!-- Icon: Plus -->
        <q-icon
          :color="active ? 'white' : 'primary'"
          name="mdi-plus"
          size="18px"
        />
      </template>
    </q-item>
  </div>
</template>
