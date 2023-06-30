// import RideToWorkByBike from '../RideToWorkByBike.vue';
// import { whiteColor } from '../../../test/cypress/utils/';

// describe('<RideToWorkByBike>', () => {
//   it('render <q-card>', () => {
//     cy.mount(RideToWorkByBike, {});
//     let config;
//     cy.window()
//       .then((win) => {
//         config = win.RideToWorkByBike.rideToWorkByBikeConfig;
//       })
//       .then(() => {
//         cy.dataCy('q-card')
//           .should('be.visible')
//           .and('have.css', 'width', config.width);
//       });
//   });

//   it('render <q-card-section>', () => {
//     cy.mount(RideToWorkByBike, {});
//     let config;
//     cy.window()
//       .then((win) => {
//         config = win.RideToWorkByBike.rideToWorkByBikeConfig;
//       })
//       .then(() => {
//         cy.dataCy('q-card-section')
//           .should('be.visible')
//           .and('have.class', 'bg-primary', 'text-white')
//           .and('have.backgroundColor', config.primaryColor);
//       });
//   });

//   it('render <q-card-section-title>', () => {
//     cy.mount(RideToWorkByBike, {});
//     let config;
//     cy.window()
//       .then((win) => {
//         config = win.RideToWorkByBike.rideToWorkByBikeConfig;
//       })
//       .then(() => {
//         cy.dataCy('q-card-section-title')
//           .should('be.visible')
//           .and('have.class', 'text-h6')
//           .and('have.text', config.title)
//           .and('have.css', 'color', whiteColor);
//       });
//   });

//   it('render <q-card-section-subtitle>', () => {
//     cy.mount(RideToWorkByBike, {});
//     let config;
//     cy.window()
//       .then((win) => {
//         config = win.RideToWorkByBike.rideToWorkByBikeConfig;
//       })
//       .then(() => {
//         cy.dataCy('q-card-section-subtitle')
//           .should('be.visible')
//           .and('have.class', 'text-subtitle2')
//           .and('have.text', config.subtitle)
//           .and('have.css', 'color', whiteColor);
//       });
//   });

//   it('render <q-card-img>', () => {
//     cy.mount(RideToWorkByBike, {});
//     let config;
//     cy.window()
//       .then((win) => {
//         config = win.RideToWorkByBike.rideToWorkByBikeConfig;
//       })
//       .then(() => {
//         cy.dataCy('q-card-img')
//           .should('be.visible')
//           .find('img')
//           .should(($img) => {
//             // "naturalWidth" and "naturalHeight" are set when the image loads
//             expect($img[0].naturalWidth).to.be.greaterThan(0);
//           })
//           .invoke('attr', 'src')
//           .should('contains', config.image);
//       });
//     cy.dataCy('q-card-img').matchImageSnapshot({
//       failureThreshold: 0.5, // threshold for entire image
//       failureThresholdType: 'percent', // percent of image or number of pixels)
//     });
//   });
// });
