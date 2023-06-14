import VueUserSelect from '../VueUserSelect.vue';

// TODO: add dynamic way of checking user data
const image = "https://picsum.photos/id/40/300/300";

describe('<VueUserSelect>', () => {
  beforeEach(() => {
    cy.mount(VueUserSelect, {});
  });

  it('renders select', () => {
    cy.dataCy('select')
      .should('be.visible')
      .should('have.css', 'height', '56px')

  });

  it('renders rounded avatar', () => {
    cy.dataCy('avatar')
      .should('be.visible')
      .should('have.css', 'border-radius', '50%')
      .find('img')
      .should(($img) => {
        expect($img[0].naturalWidth).to.be.greaterThan(0);
        expect($img.attr('src')).to.equal(image);
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
});
