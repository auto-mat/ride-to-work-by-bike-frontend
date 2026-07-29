import { useMenu } from '../useMenu';

// composables
const { getMenuTop } = useMenu();

// default params
const defaultMenuParams = {
  isUserOrganizationAdmin: false,
  isUserStaff: false,
  urlAdmin: 'http://example.com/admin',
  isEntryEnabled: true,
  isResultsEnabled: true,
  getHasOrganizationAdmin: true,
  challengeMonth: 'may',
};

describe('useMenu', () => {
  describe('"prizes/discounts" item visibility', () => {
    context('when challengeMonth is "may"', () => {
      it('shows "discounts" menu item', () => {
        const menuTop = getMenuTop({
          ...defaultMenuParams,
          challengeMonth: 'may',
        });
        const discountsItem = menuTop.find((item) => item.name === 'discounts');
        expect(discountsItem).to.exist;
        expect(discountsItem.title).to.equal('discounts');
      });
    });

    context('when challengeMonth is "october"', () => {
      it('does NOT show "discounts" menu item', () => {
        const menuTop = getMenuTop({
          ...defaultMenuParams,
          challengeMonth: 'october',
        });
        const discountsItem = menuTop.find((item) => item.name === 'discounts');
        expect(discountsItem).to.not.exist;
      });
    });

    context('when challengeMonth is "january"', () => {
      it('shows "discounts" menu item', () => {
        const menuTop = getMenuTop({
          ...defaultMenuParams,
          challengeMonth: 'january',
        });
        const discountsItem = menuTop.find((item) => item.name === 'discounts');
        expect(discountsItem).to.exist;
        expect(discountsItem.title).to.equal('discounts');
      });
    });

    context('when challengeMonth is "september"', () => {
      it('does NOT show "discounts" menu item', () => {
        const menuTop = getMenuTop({
          ...defaultMenuParams,
          challengeMonth: 'september',
        });
        const discountsItem = menuTop.find((item) => item.name === 'discounts');
        expect(discountsItem).to.not.exist;
      });
    });
  });
});
