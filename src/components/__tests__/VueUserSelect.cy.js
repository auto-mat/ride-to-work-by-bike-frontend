import VueUserSelect from '../VueUserSelect.vue';

const user = {
  label: 'User 1',
  value: '1',
  image: 'https://picsum.photos/id/40/300/300',
};

const options = [
  {
    title: 'Vaše údaje',
    url: '#',
  },
  {
    title: 'Odebírat newsletter',
    url: '#',
  },
  {
    title: 'Propojit aplikace',
    url: '#',
  },
  {
    title: 'Historie notifikací',
    url: '#',
  },
  {
    title: 'Stát se firemním koordinátorem',
    url: '#',
  },
  {
    title: 'Odhlásit se',
    url: '#',
  },
];

describe('<VueUserSelect>', () => {
  beforeEach(() => {
    cy.mount(VueUserSelect, {
      props: {
        options,
      },
    });
  });

  it('renders select with default value', () => {
    cy.dataCy('user-select-input')
      .should('be.visible')
      .should('have.css', 'height', '56px')
      .should('contain', user.label);
  });

  it('renders rounded avatar', () => {
    cy.dataCy('avatar')
      .should('be.visible')
      .should('have.css', 'border-radius', '50%')
      .find('img')
      .should(($img) => {
        expect($img[0].naturalWidth).to.be.greaterThan(0);
        expect($img.attr('src')).to.equal(user.image);
      });
  });

  it('shows dropdown on click', () => {
    cy.dataCy('user-select-input')
      .click()
      .then(() => {
        cy.get('.q-item__label').should('be.visible').should('have.length', 6);
      });
  });
});
