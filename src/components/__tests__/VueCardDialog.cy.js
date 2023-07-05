import VueCardDialog from 'components/VueCardDialog.vue';
import { i18n } from '../../boot/i18n';

describe('<VueCardDialog>', () => {
  const title = 'Dialog title';
  const meta = [
    {
      icon: 'event',
      description: 'Platí po dobu výzvy (1. říj.–31. říj. 2022)',
    },
    {
      icon: 'place',
      description: 'Automat',
    },
  ];
  const content = '';
  const image = 'https://picsum.photos/id/100/500/550';

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(VueCardDialog, {
        props: {
          dialog: {
            title,
            meta,
            content,
            image,
          },
          opened: true,
        },
      });
      cy.viewport('macbook-13');
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
        cy.dataCy('dialog-meta')
          .should('be.visible')
          .should('have.css', 'font-size', '14px')
          .should('have.css', 'font-weight', '400')
          .should('have.color', '#546e7a')
          .each(($el, index, $list) => {
            cy.wrap($el)
              .should('contain', meta[index].description);

            const $icon = $el.find('i');
            if ($icon.length) {
              cy.wrap($icon)
                .should('be.visible')
                .should('have.color', '#b0bec5')
                .should('contain', meta[index].icon);
            }
          })
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
          .find('img')
          .should('be.visible')
          .then(($img) => {
            const naturalHeight = $img[0].naturalHeight;
            expect(naturalHeight).to.be.greaterThan(0);
            expect($img.attr('src')).to.equal(image);
          });
      });
    });

    it('shows close button', () => {
      cy.window().then(() => {
        cy.dataCy('dialog-close')
          .should('be.visible')
          .should('have.css', 'width', '38px')
          .should('have.css', 'height', '38px')
          .should('have.backgroundColor', '#eceff1')
          .should('have.color', '#212121')
      });
    });
  });


  context('mobile', () => {
    beforeEach(() => {
      cy.mount(VueCardDialog, {
        props: {
          dialog: {
            title,
            meta,
            content,
            image,
          },
          opened: true,
        },
      });
      cy.viewport('iphone-6');
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
        cy.dataCy('dialog-meta')
          .should('be.visible')
          .should('have.css', 'font-size', '14px')
          .should('have.css', 'font-weight', '400')
          .should('have.color', '#546e7a')
          .each(($el, index, $list) => {
            cy.wrap($el)
              .should('contain', meta[index].description);

            const $icon = $el.find('i');
            if ($icon.length) {
              cy.wrap($icon)
                .should('be.visible')
                .should('have.color', '#b0bec5')
                .should('contain', meta[index].icon);
            }
          })
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
          .find('img')
          .should('be.visible')
          .then(($img) => {
            const naturalHeight = $img[0].naturalHeight;
            expect(naturalHeight).to.be.greaterThan(0);
            expect($img.attr('src')).to.equal(image);
          });
      });
    });

    it('shows close button', () => {
      cy.window().then(() => {
        cy.dataCy('dialog-close')
          .should('be.visible')
          .should('have.css', 'width', '38px')
          .should('have.css', 'height', '38px')
          .should('have.backgroundColor', '#eceff1')
          .should('have.color', '#212121')
      });
    });
  });

});
