import FormCardMerch from 'components/form/FormCardMerch.vue';
import { i18n } from '../../boot/i18n';

describe('<FormCardMerch>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['labelAuthor', 'labelMaterial', 'labelSizes'],
      'form.merch',
      i18n,
    );
    cy.testLanguageStringsInContext(['moreInfo'], 'navigation', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(FormCardMerch, {
        props: {
          option: {
            dialogDescription:
              'Qui veniam labore nisi laborum nisi occaecat et voluptate aute labore nulla. Velit deserunt eiusmod consequat ea qui esse minim officia culpa ea. Labore excepteur elit quis eiusmod velit aute eiusmod ut. Laboris consectetur sunt amet id ut ullamco eu aliquip minim aliqua nostrud dolor veniam exercitation. Consequat magna consectetur elit nostrud do qui amet deserunt excepteur enim id labore consectetur amet. Esse et et nulla. Aliquip occaecat laboris elit mollit proident occaecat enim anim minim. Voluptate excepteur officia cillum id proident ex dolor esse ad duis aliquip esse laboris.',
            dialogImages: ['https://picsum.photos/id/70/340/200'],
            dialogTitle: 'dialogTitle',
            image: 'https://picsum.photos/id/70/340/200',
            title: 'title',
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
          },
        },
      });
      cy.viewport('macbook-16');
    });

    it('renders card', () => {
      cy.dataCy('form-card-merch').should('be.visible');
    });
  });
});
