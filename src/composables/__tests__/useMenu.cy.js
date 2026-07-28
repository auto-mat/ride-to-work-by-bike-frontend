import { useMenu } from '../useMenu';

const { getMenuTop } = useMenu();

// test parameters for getMenuTop
const defaultMenuParams = {
  isUserOrganizationAdmin: false,
  isUserStaff: false,
  urlAdmin: 'http://example.com/admin',
  isEntryEnabled: true,
  isResultsEnabled: true,
  getHasOrganizationAdmin: true,
};

describe('useMenu composable', () => {
  describe('getMenuTop - prizes/discounts menu item visibility', () => {
    context('when challengeMonth is may', () => {
      it('includes the discounts menu item', () => {
        const menuTop = getMenuTop({
          ...defaultMenuParams,
          challengeMonth: 'may',
        });
        const discountsItem = menuTop.find((item) => item.name === 'discounts');
        expect(discountsItem).to.exist;
        expect(discountsItem.title).to.equal('discounts');
      });
    });

    context('when challengeMonth is october', () => {
      it('includes the discounts menu item', () => {
        const menuTop = getMenuTop({
          ...defaultMenuParams,
          challengeMonth: 'october',
        });
        const discountsItem = menuTop.find((item) => item.name === 'discounts');
        expect(discountsItem).to.exist;
        expect(discountsItem.title).to.equal('discounts');
      });
    });

    context('when challengeMonth is january', () => {
      it('includes the discounts menu item', () => {
        const menuTop = getMenuTop({
          ...defaultMenuParams,
          challengeMonth: 'january',
        });
        const discountsItem = menuTop.find((item) => item.name === 'discounts');
        expect(discountsItem).to.exist;
        expect(discountsItem.title).to.equal('discounts');
      });
    });

    context('when challengeMonth is september', () => {
      it('does NOT include the discounts menu item', () => {
        const menuTop = getMenuTop({
          ...defaultMenuParams,
          challengeMonth: 'september',
        });
        const discountsItem = menuTop.find((item) => item.name === 'discounts');
        expect(discountsItem).to.not.exist;
      });
    });

    context(
      'when challengeMonth is not provided (uses default from config)',
      () => {
        it('returns menu items (discounts visibility depends on config)', () => {
          const menuTop = getMenuTop(defaultMenuParams);
          // verify basic menu structure exists
          expect(menuTop).to.be.an('array');
          expect(menuTop.length).to.be.greaterThan(0);
          // home item should always be present
          const homeItem = menuTop.find((item) => item.name === 'home');
          expect(homeItem).to.exist;
        });
      },
    );
  });
});
