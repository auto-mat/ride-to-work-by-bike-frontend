import ForumPostList from 'components/community/ForumPostList.vue';
import { i18n } from '../../boot/i18n';

describe('<ForumPostList>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['titleRecentPosts', 'buttonVisitForum'],
      'forumPostList',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(ForumPostList, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(ForumPostList, {
        props: {},
      });
      cy.viewport('iphone-6');
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    cy.dataCy('forum-post-list').should('be.visible');
    cy.dataCy('forum-post-title')
      .should('be.visible')
      .and('contain', i18n.global.t('forumPostList.titleRecentPosts'));
    cy.dataCy('forum-post-item').should('be.visible').and('have.length', 4);
    cy.dataCy('forum-post-button')
      .should('be.visible')
      .and('contain', i18n.global.t('forumPostList.buttonVisitForum'));
  });
}
