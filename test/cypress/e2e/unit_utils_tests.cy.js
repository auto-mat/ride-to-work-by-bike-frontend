import { getCurrentPriceLevelsUtil } from 'src/utils/price_levels';

describe('Test utils functions', function () {
  context('Test getCurrentPriceLevelsUtil() function', () => {
    it('Test with actual date 2025-01-28', () => {
      cy.fixture('getCurrentPriceLevelsUtilTestData.json').then(
        (getCurrentPriceLevelsUtilTestData) => {
          // Test with actual date 2025-01-28
          cy.expect(
            getCurrentPriceLevelsUtil(
              getCurrentPriceLevelsUtilTestData.test_data.test_0.input_data,
              new Date(
                getCurrentPriceLevelsUtilTestData.test_data.test_0.actual_date,
              ),
            ),
          ).to.deep.equal(
            getCurrentPriceLevelsUtilTestData.test_data.test_0.test_result,
          );
        },
      );
    });

    it('Test with actual date 2025-01-29', () => {
      cy.fixture('getCurrentPriceLevelsUtilTestData.json').then(
        (getCurrentPriceLevelsUtilTestData) => {
          // Test with actual date 2025-01-29
          cy.expect(
            getCurrentPriceLevelsUtil(
              getCurrentPriceLevelsUtilTestData.test_data.test_1.input_data,
              new Date(
                getCurrentPriceLevelsUtilTestData.test_data.test_1.actual_date,
              ),
            ),
          ).to.deep.equal(
            getCurrentPriceLevelsUtilTestData.test_data.test_1.test_result,
          );
        },
      );
    });
    it('Test with actual date 2025-01-30', () => {
      cy.fixture('getCurrentPriceLevelsUtilTestData.json').then(
        (getCurrentPriceLevelsUtilTestData) => {
          // Test with actual date 2025-01-30
          cy.expect(
            getCurrentPriceLevelsUtil(
              getCurrentPriceLevelsUtilTestData.test_data.test_2.input_data,
              new Date(
                getCurrentPriceLevelsUtilTestData.test_data.test_2.actual_date,
              ),
            ),
          ).to.deep.equal(
            getCurrentPriceLevelsUtilTestData.test_data.test_2.test_result,
          );
        },
      );
    });
    it('Test with actual date 2025-01-29', () => {
      cy.fixture('getCurrentPriceLevelsUtilTestData.json').then(
        (getCurrentPriceLevelsUtilTestData) => {
          // Test with actual date 2025-01-29
          cy.expect(
            getCurrentPriceLevelsUtil(
              getCurrentPriceLevelsUtilTestData.test_data.test_3.input_data,
              new Date(
                getCurrentPriceLevelsUtilTestData.test_data.test_3.actual_date,
              ),
            ),
          ).to.deep.equal(
            getCurrentPriceLevelsUtilTestData.test_data.test_3.test_result,
          );
        },
      );
    });
    it('Test with actual date 2025-01-28', () => {
      cy.fixture('getCurrentPriceLevelsUtilTestData.json').then(
        (getCurrentPriceLevelsUtilTestData) => {
          // Test with actual date 2025-01-28
          cy.expect(
            getCurrentPriceLevelsUtil(
              getCurrentPriceLevelsUtilTestData.test_data.test_4.input_data,
              new Date(
                getCurrentPriceLevelsUtilTestData.test_data.test_4.actual_date,
              ),
            ),
          ).to.deep.equal(
            getCurrentPriceLevelsUtilTestData.test_data.test_4.test_result,
          );
        },
      );
    });
    it('Test with actual date 2025-01-27', () => {
      cy.fixture('getCurrentPriceLevelsUtilTestData.json').then(
        (getCurrentPriceLevelsUtilTestData) => {
          // Test with actual date 2025-01-27
          cy.expect(
            getCurrentPriceLevelsUtil(
              getCurrentPriceLevelsUtilTestData.test_data.test_5.input_data,
              new Date(
                getCurrentPriceLevelsUtilTestData.test_data.test_5.actual_date,
              ),
            ),
          ).to.deep.equal(
            getCurrentPriceLevelsUtilTestData.test_data.test_5.test_result,
          );
        },
      );
    });
    it('Test with actual date 2025-02-04', () => {
      cy.fixture('getCurrentPriceLevelsUtilTestData.json').then(
        (getCurrentPriceLevelsUtilTestData) => {
          // Test with actual date 2025-02-04
          cy.expect(
            getCurrentPriceLevelsUtil(
              getCurrentPriceLevelsUtilTestData.test_data.test_6.input_data,
              new Date(
                getCurrentPriceLevelsUtilTestData.test_data.test_6.actual_date,
              ),
            ),
          ).to.deep.equal(
            getCurrentPriceLevelsUtilTestData.test_data.test_6.test_result,
          );
        },
      );
    });
    it('Test with actual date 2025-02-05', () => {
      cy.fixture('getCurrentPriceLevelsUtilTestData.json').then(
        (getCurrentPriceLevelsUtilTestData) => {
          // Test with actual date 2025-02-05
          cy.expect(
            getCurrentPriceLevelsUtil(
              getCurrentPriceLevelsUtilTestData.test_data.test_7.input_data,
              new Date(
                getCurrentPriceLevelsUtilTestData.test_data.test_7.actual_date,
              ),
            ),
          ).to.deep.equal(
            getCurrentPriceLevelsUtilTestData.test_data.test_7.test_result,
          );
        },
      );
    });
    it('Test with actual date 2025-02-10', () => {
      cy.fixture('getCurrentPriceLevelsUtilTestData.json').then(
        (getCurrentPriceLevelsUtilTestData) => {
          // Test with actual date 2025-02-10
          cy.expect(
            getCurrentPriceLevelsUtil(
              getCurrentPriceLevelsUtilTestData.test_data.test_7.input_data,
              new Date(
                getCurrentPriceLevelsUtilTestData.test_data.test_7.actual_date,
              ),
            ),
          ).to.deep.equal(
            getCurrentPriceLevelsUtilTestData.test_data.test_7.test_result,
          );
        },
      );
    });
  });
});
