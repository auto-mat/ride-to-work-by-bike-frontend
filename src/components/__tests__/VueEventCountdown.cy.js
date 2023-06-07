import VueEventCountdown from '../VueEventCountdown.vue';

describe('Event Countdown', () => {
  const releaseDate = '2023-10-01T12:00:00';

  beforeEach(() => {
    cy.mount(VueEventCountdown, {
      props: {
        releaseDate,
      },
    });
  });

  it('should render the component', () => {
    cy.get('[data-testid="countdown-component"]').should('exist');
  });

  it('should display correct values when a custom date is passed', () => {
    cy.get('[data-testid="countdown-label-days"]').should(
      'contain.text',
      'days'
    );
    cy.get('[data-testid="countdown-label-hours"]').should(
      'contain.text',
      'hours'
    );
    cy.get('[data-testid="countdown-label-minutes"]').should(
      'contain.text',
      'minutes'
    );
    cy.get('[data-testid="countdown-label-seconds"]').should(
      'contain.text',
      'seconds'
    );
  });
});
