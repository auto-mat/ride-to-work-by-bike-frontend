import { colors } from 'quasar';
import FormCardMerch from 'components/form/FormCardMerch.vue';
import { i18n } from '../../boot/i18n';
import { rideToWorkByBikeConfig } from 'src/boot/global_vars';

const { getPaletteColor } = colors;
const black = getPaletteColor('black');

const option = {
  dialogDescription:
    'Qui veniam labore nisi laborum nisi occaecat et voluptate aute labore nulla. Velit deserunt eiusmod consequat ea qui esse minim officia culpa ea. Labore excepteur elit quis eiusmod velit aute eiusmod ut. Laboris consectetur sunt amet id ut ullamco eu aliquip minim aliqua nostrud dolor veniam exercitation. Consequat magna consectetur elit nostrud do qui amet deserunt excepteur enim id labore consectetur amet. Esse et et nulla. Aliquip occaecat laboris elit mollit proident occaecat enim anim minim. Voluptate excepteur officia cillum id proident ex dolor esse ad duis aliquip esse laboris.',
  dialogImages: ['https://picsum.photos/id/70/340/200'],
  dialogTitle: 'dialogTitle',
  image: 'https://picsum.photos/id/70/340/200',
  label: 'Title',
  sizes: [
    {
      label: 'L',
      value: 'L',
    },
    {
      label: 'XL',
      value: 'XL',
    },
    {
      label: 'XXL',
      value: 'XXL',
    },
  ],
  author: 'author',
  material: 'material',
};

describe('<FormCardMerch>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['labelAuthor', 'labelMaterial', 'labelSizes'],
      'form.merch',
      i18n,
    );
    cy.testLanguageStringsInContext(['select', 'selected'], 'navigation', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(FormCardMerch, {
        props: {
          option: option,
        },
      });
      cy.viewport('macbook-16');
    });

    it('renders card with image and title', () => {
      cy.dataCy('form-card-merch').should('be.visible');
      // rounded corners
      cy.dataCy('form-card-merch')
        .should(
          'have.css',
          'border-radius',
          rideToWorkByBikeConfig.borderRadiusCard,
        )
        .and('have.css', 'padding', '16px');
      // image
      cy.dataCy('form-card-merch-image')
        .find('img')
        .should('be.visible')
        .then(($img) => {
          cy.testImageHeight($img);
          expect($img.attr('src')).to.equal(option.image);
        });
      // title
      cy.dataCy('form-card-merch-title')
        .should('be.visible')
        .and('have.css', 'font-size', '16px')
        .and('have.css', 'font-weight', '700')
        .and('have.color', black)
        .and('contain', option.label);
    });

    it('renders parameters', () => {
      cy.dataCy('form-card-merch-parameters')
        .find('dt')
        .should('be.visible')
        .and('have.css', 'font-size', '14px')
        .and('have.css', 'font-weight', '400')
        .and('contain', i18n.global.t('form.merch.labelAuthor'))
        .and('contain', i18n.global.t('form.merch.labelMaterial'))
        .and('contain', i18n.global.t('form.merch.labelSizes'));
      cy.dataCy('form-card-merch-parameters')
        .find('dd')
        .should('be.visible')
        .and('have.css', 'font-size', '14px')
        .and('have.css', 'font-weight', '700')
        .and('have.color', black)
        .and('contain', option.author)
        .and('contain', option.material)
        .and('contain', option.sizes[0].label);
    });

    it('renders button', () => {
      cy.dataCy('form-card-merch-button')
        .should('be.visible')
        .and('contain.text', i18n.global.t('navigation.select'));
    });
  });

  context('selected', () => {
    beforeEach(() => {
      cy.mount(FormCardMerch, {
        props: {
          option: option,
          selected: true,
        },
      });
      cy.viewport('macbook-16');
    });

    it('renders button', () => {
      cy.dataCy('form-card-merch-button')
        .should('be.visible')
        .and('contain.text', i18n.global.t('navigation.selected'));
    });
  });
});
