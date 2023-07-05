import VueCardDialog from 'components/VueCardDialog.vue';
import { i18n } from '../../boot/i18n';

describe('<VueCardDialog>', () => {
  const title = 'Dialog title';
  const meta = [
    {
      icon: '',
      description: '',
    },
    {
      icon: '',
      description: '',
    },
  ];
  const content = '';
  const image = 'https://picsum.photos/id/100/500/550';

  beforeEach(() => {
    cy.mount(VueCardDialog, {
      props: {
        card: {
          title,
          meta,
          content,
          image,
        },
      },
    });
  })


  it('shows title', () => {
    cy.window().then(() => {
      cy.dataCy('dialog-header')
        .find('h3')
        .should('be.visible')
        .should('have.css', 'font-size', '20px')
        .should('have.css', 'font-weight', '500')
        .should('contain', title)
        .then(($title) => {
          expect($title.text()).to.equal(title);
        });
    });
  });

  it('shows meta', () => {
    cy.window().then(() => {
      cy.dataCy('dialog-date')
        .should('be.visible')
        .should('have.css', 'font-size', '14px')
        .should('have.css', 'font-weight', '400')
        .should('have.color', '#546e7a')
        .should('contain', expirationDate)
        .find('i')
        .should('be.visible')
        .should('have.color', '#b0bec5');
    });
  });

  it('shows content', () => {
    cy.window().then(() => {
      cy.dataCy('dialog-body')
        .should('be.visible')
        .should('have.css', 'font-size', '14px')
        .should('have.css', 'font-weight', '400')
        .should('have.color', '#000000')
        .should('contain', content);
    });
  });

  it('shows image', () => {
    cy.window().then(() => {
      cy.dataCy('dialog-body')
        .scrollTo('bottom')
        .find('img')
        .should('be.visible')
        .then(($img) => {
          const naturalHeight = $img[0].naturalHeight;
          expect(naturalHeight).to.be.greaterThan(0);
          expect($img.attr('src')).to.equal(image);
        });
    });
  });
});
