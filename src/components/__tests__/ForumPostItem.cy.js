import ForumPostItem from 'components/community/ForumPostItem.vue';
import { i18n } from '../../boot/i18n';

describe('<ForumPostItem>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'index.component', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.fixture('forumPostList').then((postList) => {
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

  context('mobile', () => {
    beforeEach(() => {
      cy.fixture('forumPostList').then((postList) => {
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
}
