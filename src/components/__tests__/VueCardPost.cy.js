import VueCardPost from 'components/VueCardPost.vue';

describe('<VueCardPost>', () => {
  const title = 'Jak na cyklistiku v zimě? Co všechno se můžeme učit od Finů?';
  const date = new Date(2023, 8, 1);
  const image = 'https://picsum.photos/id/100/380/380';

  beforeEach(() => {
    cy.mount(VueCardPost, {
      props: {
        card: {
          title,
          date,
          image,
        },
      },
    });
  });

  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'index.cardPost');
  });

  it('has correct background color', () => {
    cy.window().then(() => {
      cy.dataCy('card-post')
        .should('be.visible')
        .should('have.backgroundColor', '#ffffff');
    });
  });

  it('has rounded corners', () => {
    cy.window().then(() => {
      cy.dataCy('card-post')
        .should('be.visible')
        .should('have.css', 'border-radius', '20px');
    });
  });

  it('has border', () => {
    cy.window().then(() => {
      cy.dataCy('card-post').should(
        'have.css',
        'border',
        '1px solid rgba(0, 0, 0, 0.12)'
      );
    });
  });

  it('has no shadow', () => {
    cy.window().then(() => {
      cy.dataCy('card-post').should('have.css', 'box-shadow', 'none');
    });
  });

  it('renders title', () => {
    cy.window().then(() => {
      cy.dataCy('card-post-title')
        .should('have.css', 'font-size', '14px')
        .should('have.css', 'font-weight', '400')
        .should('have.color', '#212121')
        .should('contain', title)
        .then(($title) => {
          expect($title.text()).to.equal(title);
        });
    });
  });

  it('renders date', () => {
    cy.window().then(() => {
      cy.dataCy('card-post-date')
        .should('have.css', 'font-size', '12px')
        .should('have.css', 'font-weight', '400')
        .should('have.color', '#78909c')
        .should('contain', '1. Sept. 2023')
        .then(($date) => {
          expect($date.text()).to.equal('1. Sept. 2023');
        });
    });
  });

  it('renders image', () => {
    cy.window().then(() => {
      cy.dataCy('card-post-image')
        .should('be.visible')
        .find('img')
        .should(($img) => {
          expect($img[0].naturalWidth).to.be.greaterThan(0);
        })
        .invoke('attr', 'src')
        .should('contains', image);

      cy.dataCy('card-post-image').matchImageSnapshot({
        failureThreshold: 0.5,
        failureThresholdType: 'percent',
      });
    });
  });
});
