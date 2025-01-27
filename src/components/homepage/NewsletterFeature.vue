<script lang="ts">
/**
 * NewsletterFeature Component
 *
 * @description
 * Display a newsletter section with a title, description, and a list of
 * newsletter items. You can subscribe to the different topics.
 * You can use the title prop to override the default title.
 * You can use the description prop to override the default description.
 *
 * @props
 * - `title`: (string) Custom title for the newsletter section.
 * - `description`: (string) Custom description for the newsletter section.
 *
 * @components
 * - `NewsletterItem`: Component to render individual newsletter details.
 *
 * @example
 * <newsletter-feature :title="customTitle" :description="customDescription" />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=4858%3A105656&mode=dev)
 */

// libraries
import { Notify, Screen } from 'quasar';
import { computed, defineComponent, onMounted, reactive } from 'vue';

// adapters
import { registerChallengeAdapter } from '../../adapters/registerChallengeAdapter';

// components
import NewsletterItem from './NewsletterItem.vue';

// composables
import { i18n } from '../../boot/i18n';
import { useApiPutRegisterChallenge } from '../../composables/useApiPutRegisterChallenge';

// mocks
import { newsletterItems as newsletterItemsFixture } from '../../mocks/homepage';

// stores
import { useLoginStore } from '../../stores/login';
import { useRegisterChallengeStore } from '../../stores/registerChallenge';

// types
import { NewsletterItem as NewsletterItemType, NewsletterType } from '../types';

export default defineComponent({
  name: 'NewsletterFeature',
  props: {
    title: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
  },
  components: {
    NewsletterItem,
  },
  setup(props) {
    const loginStore = useLoginStore();
    const registerChallengeStore = useRegisterChallengeStore();
    const user = reactive(loginStore.getUser);

    onMounted(async () => {
      await registerChallengeStore.loadRegisterChallengeToStore();
    });

    const getRegistrationId = computed((): number | null => {
      return registerChallengeStore.getRegistrationId;
    });

    // update register challenge data
    const { isLoading, updateChallenge } = useApiPutRegisterChallenge(
      registerChallengeStore.$log,
    );

    const newsletter = computed({
      get: () => registerChallengeStore.getPersonalDetails?.newsletter,
      set: async (value: NewsletterType[]) => {
        // create payload from local storage data structure
        const payload = registerChallengeAdapter.toApiPayload({
          personalDetails: {
            newsletter: value,
          },
        });
        // post payload to API
        if (getRegistrationId.value) {
          await updateChallenge(getRegistrationId.value, payload);
          await registerChallengeStore.loadRegisterChallengeToStore();
        } else {
          Notify.create({
            message: i18n.global.t('profile.messagegetRegistrationIdMissing'),
            color: 'negative',
          });
        }
      },
    });

    const newsletterTitle = computed(() => {
      return props.title
        ? props.title
        : i18n.global.t('index.newsletterFeature.title');
    });

    const newsletterDescription = computed(() => {
      return props.description
        ? props.description
        : i18n.global.t('index.newsletterFeature.description', {
            email: user?.email ? ` <b>${user.email}</b>` : '',
          });
    });

    const newsletterItems = newsletterItemsFixture as NewsletterItemType[];

    const headingMaxWidth = Screen.sizes.sm;

    return {
      headingMaxWidth,
      isLoading,
      newsletter,
      newsletterDescription,
      newsletterItems,
      newsletterTitle,
    };
  },
});
</script>

<template>
  <div
    data-cy="newsletter-feature"
    class="row q-col-gutter-lg items-center justify-between"
  >
    <!-- Section image -->
    <div class="gt-sm col-md-3" data-cy="newsletter-col-image">
      <div class="q-px-lg">
        <!-- Image -->
        <q-img
          src="~assets/image/newsletter-feature/newsletter.webp"
          ratio="1"
          fit="contain"
          data-cy="newsletter-feature-image"
        />
      </div>
    </div>

    <!-- Section content -->
    <div class="col-12 col-md-9" data-cy="newsletter-col-content">
      <!-- Title -->
      <h2
        class="text-h5 text-weight-bold text-primary text-balance q-my-none"
        :style="{ maxWidth: `${headingMaxWidth}px` }"
        data-cy="section-heading-title"
      >
        {{ newsletterTitle }}
      </h2>
      <div
        class="q-mt-md text-subtitle2 text-weight-regular text-grey-10"
        data-cy="section-heading-perex"
        v-html="newsletterDescription"
      />
      <div
        class="q-mt-md text-subtitle2 text-weight-regular text-grey-10"
        data-cy="section-heading-perex"
      >
        {{ $t('index.newsletterFeature.hint') }}
      </div>
      <div
        v-for="(item, index) in newsletterItems"
        :key="item.title"
        class="q-mt-lg"
      >
        <!-- Item - subscription variant -->
        <newsletter-item
          v-model="newsletter"
          :loading="isLoading"
          :item="item"
          :data-id="item.id"
          data-cy="newsletter-feature-item"
        />
        <!-- Separator -->
        <q-separator
          v-if="index < newsletterItems.length - 1"
          class="q-my-md"
          data-cy="newsletter-feature-separator"
        />
      </div>
    </div>
  </div>
</template>
