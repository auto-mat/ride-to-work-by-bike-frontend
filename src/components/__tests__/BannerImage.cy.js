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

  beforeEach(() => {
    cy.mount(BannerImage, {
      props: {
        banner: {
          title,
          perex,
          image,
        },
      },
    });

    it('renders two columns', () => {
      cy.window().then(() => {
        cy.dataCy('banner')
          .should('be.visible')
          .should('have.css', 'display', 'flex')
          .should('have.css', 'flex-wrap', 'wrap');

        cy.dataCy('banner-half').should('have.length', 2).should('be.visible');
      });
    });

    it('renders title', () => {
      cy.window().then(() => {
        cy.dataCy('banner-title')
          .should('be.visible')
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
          const naturalHeight = $img[0].naturalHeight;
          expect(naturalHeight).to.be.greaterThan(0);
          expect($img.attr('src')).to.equal(image.src);
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

        cy.viewport('iphone-6');

        cy.dataCy('banner-half')
          .first()
          .should('have.css', 'border-top-left-radius', '20px')
          .should('have.css', 'border-top-right-radius', '20px');

        cy.viewport('macbook-13');

        cy.dataCy('banner-half')
          .first()
          .should('have.css', 'border-top-left-radius', '20px')
          .should('have.css', 'border-bottom-left-radius', '20px');
      });
    });
  })
})
});
