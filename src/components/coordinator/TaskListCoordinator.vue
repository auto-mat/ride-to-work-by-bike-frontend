<script lang="ts">
/**
 * TaskListCoordinator Component
 *
 * @description * Use this component to render a list of tasks
 * for a company coordinator in the form of a vertical timeline.
 *
 * @props
 * - `tasks` (CoordinatorTask, required): The object representing the tasks.
 *   It should be of type `CoordinatorTask`.
 *
 * @example
 * <TaskListCoordinator :tasks="tasks" />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=6699-27628&t=JZZe82aEPkedUcAG-1)
 */

// libraries
import { computed, defineComponent, ref } from 'vue';

// composables
import { i18n } from '../../boot/i18n';

// types
import type { TaskCoordinator } from '../types/Task';

// fixtures
import taskListFixture from '../../../test/cypress/fixtures/taskListCoordinator.json';

export default defineComponent({
  name: 'TaskListCoordinator',
  props: {
    tasks: {
      type: Object as () => TaskCoordinator[],
      required: true,
      default: taskListFixture,
    },
  },
  setup(props) {
    const { chevronIcon, isShownPast, taskListFuture, taskListPast } =
      useTaskList();

    return {
      chevronIcon,
      isShownPast,
      taskListFuture,
      taskListPast,
    };

    /**
     * useTaskList encapsulates the task list logic.
     */
    function useTaskList() {
      const isShownPast = ref<boolean>(false);

      const chevronIcon = computed((): string => {
        return isShownPast.value ? 'mdi-chevron-up' : 'mdi-chevron-down';
      });

      /**
       * Task list
       * Loops throught the tasks and assigns the `month` property to first
       * task of each month.
       */
      const taskList = computed((): TaskCoordinator[] => {
        if (!props.tasks) {
          return [];
        }

        const tasks: TaskCoordinator[] = [];
        let month = '';
        props.tasks.forEach((task: TaskCoordinator) => {
          const taskMonth = i18n.global.d(new Date(task.date), 'monthYear');
          // if a new month, push month into the task
          if (taskMonth !== month) {
            tasks.push({ ...task, month: taskMonth });
          } else {
            tasks.push(task);
          }
          month = taskMonth;
        });

        return tasks;
      });

      /**
       * Filter future tasks
       */
      const taskListFuture = computed((): TaskCoordinator[] => {
        return taskList.value.filter((task: TaskCoordinator) => {
          return new Date(task.date) > new Date();
        });
      });

      /**
       * Filter past tasks
       */
      const taskListPast = computed((): TaskCoordinator[] => {
        return taskList.value.filter((task: TaskCoordinator) => {
          return new Date(task.date) < new Date();
        });
      });

      return {
        chevronIcon,
        isShownPast,
        taskListFuture,
        taskListPast,
      };
    }
  },
});
</script>

<template>
  <q-timeline color="primary" data-cy="task-list-coordinator">
    <q-timeline-entry>
      <template v-slot:title>
        <q-item
          dense
          clickable
          v-ripple
          class="text-body1 q-pl-none"
          @click.prevent="isShownPast = !isShownPast"
          data-cy="task-list-show-past"
        >
          <q-item-section class="text-uppercase text-weight-bold">
            {{ $t('coordinator.labelShowPastTasks') }}
          </q-item-section>
          <q-item-section avatar>
            <q-icon color="primary" :name="chevronIcon" size="18px" />
          </q-item-section>
        </q-item>
      </template>
    </q-timeline-entry>
    <!-- Past tasks -->
    <template v-if="taskListPast.length && isShownPast">
      <q-timeline-entry
        v-for="task in taskListPast"
        :key="task.id"
        class="light-dimmed"
        data-cy="task-item-past"
      >
        <!-- Subtitle: month name -->
        <template v-if="task.month" v-slot:subtitle>
          <span class="text-caption text-weight-bold text-capitalize">{{
            task.month
          }}</span>
        </template>
        <!-- Title + date -->
        <template v-slot:title>
          <div
            class="flex gap-8 text-body1 text-weight-bold"
            data-cy="task-item-past-title"
          >
            <span v-if="task.date" class="text-grey-7">
              {{ $d(new Date(task.date), 'numeric') }}
            </span>
            <span v-if="task.title" class="text-grey-10">{{ task.title }}</span>
          </div>
        </template>
        <!-- Body -->
        <div v-if="task.body" v-html="task.body" />
      </q-timeline-entry>
    </template>
    <!-- Future tasks -->
    <q-timeline-entry
      v-for="task in taskListFuture"
      :key="task.id"
      data-cy="task-item-future"
    >
      <!-- Subtitle: month name -->
      <template v-if="task.month" v-slot:subtitle>
        <span class="text-caption text-weight-bold text-capitalize">{{
          task.month
        }}</span>
      </template>
      <!-- Title + date -->
      <template v-slot:title>
        <div class="flex gap-8 text-body1 text-weight-bold">
          <span v-if="task.date" class="text-grey-7">
            {{ $d(new Date(task.date), 'numeric') }}
          </span>
          <span v-if="task.title" class="text-grey-10">{{ task.title }}</span>
        </div>
      </template>
      <!-- Body -->
      <div v-if="task.body" v-html="task.body" />
    </q-timeline-entry>
  </q-timeline>
</template>

<style scoped lang="scss">
:deep(.q-timeline__subtitle) {
  text-transform: none;
  color: $dark;
  opacity: 1;
}
</style>
