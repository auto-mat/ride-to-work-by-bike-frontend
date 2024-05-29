import { date } from 'quasar';
import ForumPostItem from 'components/community/ForumPostItem.vue';
import { i18n } from '../../boot/i18n';

describe('<ForumPostItem>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      [
        'lessThanAnHourAgo',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
        'sunday',
      ],
      'time',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.fixture('forumPostList').then((postList) => {
        const currentDate = postList[0].date;
        cy.clock(new Date(currentDate).getTime());
        cy.tick(1000);
        cy.mount(ForumPostItem, {
          props: {
            post: postList[0],
          },
        });
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('desktop - hour ago', () => {
    beforeEach(() => {
      cy.fixture('forumPostList').then((postList) => {
        const currentDate = postList[0].date;
        cy.clock(new Date(currentDate).getTime());
        cy.tick(1000);
        cy.tick(60 * 60 * 1000);
        cy.mount(ForumPostItem, {
          props: {
            post: postList[0],
          },
        });
      });
      cy.viewport('macbook-16');
    });
    it('shows hour ago label', () => {
      cy.dataCy('forum-post-date').should(
        'contain',
        i18n.global.t('time.hoursAgo', { hours: 1 }),
      );
    });
  });

  context('desktop - yesterday', () => {
    beforeEach(() => {
      cy.fixture('forumPostList').then((postList) => {
        const currentDate = postList[0].date;
        cy.clock(new Date(currentDate).getTime());
        cy.tick(1000);
        cy.tick(24 * 60 * 60 * 1000);
        cy.mount(ForumPostItem, {
          props: {
            post: postList[0],
          },
        });
      });
      cy.viewport('macbook-16');
    });

    it('shows yesterday label', () => {
      cy.fixture('forumPostList').then((postList) => {
        cy.dataCy('forum-post-date').should(
          'contain',
          `${i18n.global.t('time.yesterday')}, ${date.formatDate(postList[0].date, 'HH:mm')}`,
        );
      });
    });
  });

  context('desktop - wednesday', () => {
    beforeEach(() => {
      cy.fixture('forumPostList').then((postList) => {
        const currentDate = postList[0].date;
        cy.clock(new Date(currentDate).getTime());
        cy.tick(1000);
        cy.tick(24 * 60 * 60 * 1000);
        cy.tick(24 * 60 * 60 * 1000);
        cy.mount(ForumPostItem, {
          props: {
            post: postList[0],
          },
        });
      });
      cy.viewport('macbook-16');
    });

    it('shows wednesday label', () => {
      cy.fixture('forumPostList').then((postList) => {
        cy.dataCy('forum-post-date').should(
          'contain',
          `${i18n.global.t('time.wednesday')}, ${date.formatDate(postList[0].date, 'HH:mm')}`,
        );
      });
    });
  });

  context('desktop - date', () => {
    beforeEach(() => {
      cy.fixture('forumPostList').then((postList) => {
        const currentDate = postList[0].date;
        cy.clock(new Date(currentDate).getTime());
        cy.tick(1000);
        cy.tick(7 * 24 * 60 * 60 * 1000);
        cy.mount(ForumPostItem, {
          props: {
            post: postList[0],
          },
        });
      });
      cy.viewport('macbook-16');
    });

    it('shows date label', () => {
      cy.fixture('forumPostList').then((postList) => {
        cy.dataCy('forum-post-date').should(
          'contain',
          date.formatDate(postList[0].date, 'D. MMM., HH:mm'),
        );
      });
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.fixture('forumPostList').then((postList) => {
        const currentDate = postList[0].date;
        cy.clock(new Date(currentDate).getTime());
        cy.tick(1000);
        cy.mount(ForumPostItem, {
          props: {
            post: postList[0],
          },
        });
      });
      cy.viewport('iphone-6');
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    cy.fixture('forumPostList').then((postList) => {
      cy.dataCy('forum-post-item').should('be.visible');
      cy.dataCy('forum-post-image')
        .should('be.visible')
        .find('img')
        .and('have.attr', 'src', postList[0].user.image);
      cy.dataCy('forum-post-title')
        .should('be.visible')
        .and('contain', postList[0].title);
      cy.dataCy('forum-post-date').should('be.visible');
      cy.dataCy('forum-post-comment-count')
        .find('i')
        .should('be.visible')
        .and('contain', 'reply');
      cy.dataCy('forum-post-comment-count')
        .should('be.visible')
        .and('contain', `${postList[0].comments.length}`);
    });
  });

  it('renders correct date', () => {
    // based on current date, render proper label
    cy.fixture('forumPostList').then(() => {
      cy.dataCy('forum-post-date')
        .should('be.visible')
        .and('contain', i18n.global.t('time.lessThanAnHourAgo'));
    });
  });
}
