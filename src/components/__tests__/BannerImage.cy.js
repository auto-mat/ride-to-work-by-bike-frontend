import BannerImage from 'components/BannerImage.vue';

const config = JSON.parse(process.env.RIDE_TO_WORK_BY_BIKE_CONFIG);

describe('<BannerImage>', () => {
  const title = 'Fill in our questionnaire and win one of our great prizes!';
  const perex =
    'You can help us decide what to spend more time on next time and what should stay the same.';
  const image = {
    src: 'https://picsum.photos/id/70/600/200',
    alt: 'road lined with trees',
  };

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(BannerImage, {
        props: {
          banner: {
            title,
            perex,
            image,
          },
        }
      })
    });

    cy.viewport('macbook-16');

    it('renders two columns', () => {
      cy.window().then(() => {
        cy.dataCy('banner')
          .should('be.visible')
          .should('have.css', 'display', 'flex')
          .should('have.css', 'flex-wrap', 'wrap');

        cy.dataCy('banner-half').should('have.length', 2).should('be.visible');

        cy.testElementPercentageWidth(cy.dataCy('banner-half'), 50);
      });
    });

    it('renders title', () => {
      cy.window().then(() => {
        cy.dataCy('banner-title')
          .should('be.visible')
          .should('have.css', 'font-size', '16px')
          .should('have.css', 'font-weight', '500')
          .should('have.color', '#000000')
          .should('contain.text', title)
          .then(($title) => {
            expect($title.text()).to.equal(title);
          });
      });
    });

    it('renders perex', () => {
      cy.window().then(() => {
        cy.dataCy('banner-perex')
          .should('be.visible')
          .should('have.css', 'font-size', '12px')
          .should('have.css', 'font-weight', '400')
          .should('have.color', '#000000')
          .should('contain.text', perex)
          .then((perexNode) => {
            expect(perexNode.text()).to.equal(perex);
          });
      });
    });

    it('renders image', () => {
      cy.window().then(() => {
        cy.dataCy('banner')
          .find('img')
          .should('be.visible')
          .then(($img) => {
            cy.testImageHeight($img);
            expect($img.attr('src')).to.equal(image);
          });

        cy.dataCy('banner')
          .find('img')
          .matchImageSnapshot({
            failureThreshold: 0.5,
            failureThresholdType: 'percent',
          });
      });
    });

    it('has correct background color', () => {
      cy.window().then(() => {
        cy.dataCy('banner')
          .should('have.backgroundColor', config.colorGrayLight);
      });

    it('has rounded corners', () => {
      cy.window().then(() => {
        cy.dataCy('banner')
          .should('be.visible')
          .should('have.css', 'border-radius', '20px')
          .should('have.css', 'overflow', 'hidden');

          cy.dataCy('banner-half')
            .first()
            .should('have.css', 'border-top-left-radius', '20px')
            .should('have.css', 'border-bottom-left-radius', '20px');
        });
      });
    })
  })

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(VueBannerImage, {
        props: {
          banner: {
            title,
            perex,
            image,
          },
        },
      });

      cy.viewport('iphone-6');
    });

    it('renders single column', () => {
      cy.window().then(() => {
        cy.dataCy('banner')
          .should('be.visible')
          .should('have.css', 'display', 'flex')
          .should('have.css', 'flex-wrap', 'wrap');

        cy.dataCy('banner-half').should('have.length', 2).should('be.visible');

        cy.testElementPercentageWidth(cy.dataCy('banner-half'), 100);
      });
    });

    it('renders title', () => {
      cy.window().then(() => {
        cy.dataCy('banner-title')
          .should('be.visible')
          .should('have.css', 'font-size', '16px')
          .should('have.css', 'font-weight', '500')
          .should('have.color', '#000000')
          .should('contain.text', title)
          .then(($title) => {
            expect($title.text()).to.equal(title);
          });
      });
    });

    it('renders perex', () => {
      cy.window().then(() => {
        cy.dataCy('banner-perex')
          .should('be.visible')
          .should('have.css', 'font-size', '12px')
          .should('have.css', 'font-weight', '400')
          .should('have.color', '#000000')
          .should('contain.text', perex)
          .then((perexNode) => {
            expect(perexNode.text()).to.equal(perex);
          });
      });
    });

    it('renders image', () => {
      cy.window().then(() => {
        cy.dataCy('banner')
          .find('img')
          .should('be.visible')
          .then(($img) => {
            cy.testImageHeight($img);
            expect($img.attr('src')).to.equal(image);
          });

        cy.dataCy('banner').find('img').matchImageSnapshot({
          failureThreshold: 0.5,
          failureThresholdType: 'percent',
        });
      });
    });

    it('has correct background color', () => {
      cy.window().then(() => {
        cy.dataCy('banner').should(
          'have.backgroundColor',
          config.colorGrayLight
        );
      });
    });

    it('has rounded corners', () => {
      cy.window().then(() => {
        cy.dataCy('banner')
          .should('be.visible')
          .should('have.css', 'border-radius', '20px');

        cy.dataCy('banner-half')
          .first()
          .should('have.css', 'border-top-left-radius', '20px')
          .should('have.css', 'border-top-right-radius', '20px');
      });
    });
  });
});
