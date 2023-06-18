import VueUserSelect from '../VueUserSelect.vue';

const options = [
  { label: 'User 1', value: '1', image: 'https://picsum.photos/id/40/300/300' },
  { label: 'User 2', value: '2', image: 'https://picsum.photos/id/64/300/300' },
  { label: 'User 3', value: '3', image: 'https://picsum.photos/id/91/300/300' },
];

describe('<VueUserSelect>', () => {
  beforeEach(() => {
    cy.mount(VueUserSelect, {
      props: {
        options
      }
    });
  });

  it('renders select with default value', () => {
    cy.dataCy('select')
      .should('be.visible')
      .should('have.css', 'height', '56px')
      .should('contain', options[0].label);
  });

  it('renders rounded avatar', () => {
    cy.dataCy('avatar')
      .should('be.visible')
      .should('have.css', 'border-radius', '50%')
      .find('img')
      .should(($img) => {
        expect($img[0].naturalWidth).to.be.greaterThan(0);
        expect($img.attr('src')).to.equal(options[0].image);
      });
  })

  it ('shows dropdown on click', () => {
    cy.dataCy('select').click().then(() => {
        cy.get(".q-item__label")
          .should('be.visible')
          .should('have.length', 3)
          .should('contain.text', 'User');
    })
  })

  it ('allows to change user', () => {
    cy.dataCy('select').click().then(() => {
      cy.get(".q-item__label")
        .should('be.visible')
        .should('have.length', 3)
        .should('contain.text', 'User')
        .last()
        .click().then(() => {
          cy.dataCy('avatar')
            .should('be.visible')
            .find('img')
            .should(($img) => {
              expect($img[0].naturalWidth).to.be.greaterThan(0);
              expect($img.attr('src')).to.equal(options[2].image);
            });

          cy.dataCy('select')
            .should('contain', options[2].label);
        })
    })
  })
});
