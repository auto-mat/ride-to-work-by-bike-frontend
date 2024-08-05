import { colors } from 'quasar';
import RoutesMapToolbar from 'components/routes/RoutesMapToolbar.vue';
import { i18n } from '../../boot/i18n';

// selectors
const selectorAddRouteAvatar = 'add-route-avatar';
const selectorAddRouteButton = 'add-route-button';
const selectorAddRouteIcon = 'add-route-icon';
const selectorCurrentPositionAvatar = 'current-position-avatar';
const selectorCurrentPositionButton = 'current-position-button';
const selectorCurrentPositionIcon = 'current-position-icon';
const selectorDeleteRouteAvatar = 'delete-route-avatar';
const selectorDeleteRouteButton = 'delete-route-button';
const selectorDeleteRouteIcon = 'delete-route-icon';
const selectorUndoButton = 'undo-button';
const selectorUndoAvatar = 'undo-avatar';
const selectorUndoIcon = 'undo-icon';
const selectorSaveRouteAvatar = 'save-route-avatar';
const selectorSaveRouteButton = 'save-route-button';
const selectorSaveRouteIcon = 'save-route-icon';
const selectorSource = 'change-source-select';
const selectorToolbarTop = 'toolbar-top';
const selectorToolbarBottom = 'toolbar-bottom';
const selectorTooltipAddRouteDisabled = 'tooltip-add-route-disabled';
const selectorTooltipAddRouteDisable = 'tooltip-add-route-disable';
const selectorTooltipAddRouteEnable = 'tooltip-add-route-enable';
const selectorTooltipDeleteRouteEnable = 'tooltip-delete-route-enable';
const selectorTooltipDeleteRouteDisable = 'tooltip-delete-route-disable';
const selectorTooltipDeleteRouteDisabled = 'tooltip-delete-route-disabled';
const selectorTooltipSave = 'tooltip-save';
const selectorTooltipUndo = 'tooltip-undo';

// variables
const avatarSize = 32;
const iconSize = 18;

// colors
const { getPaletteColor } = colors;
const grey3 = getPaletteColor('grey-3');
const primary = getPaletteColor('primary');
const white = getPaletteColor('white');

describe('<RoutesMapToolbar>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(['rtwbb'], 'global', i18n);
    cy.testLanguageStringsInContext(
      [
        'tooltipDrawDisable',
        'tooltipDrawDisabled',
        'tooltipDrawEnable',
        'tooltipDeleteDisable',
        'tooltipDeleteDisabled',
        'tooltipDeleteEnable',
        'tooltipSave',
        'tooltipUndo',
      ],
      'routes',
      i18n,
    );
  });

  context('draw inactive', () => {
    beforeEach(() => {
      cy.mount(RoutesMapToolbar, {
        props: {
          drawEnabled: false,
        },
      });
      cy.viewport('macbook-16');
    });

    coreTests();
    inactiveDrawTest();
    inactiveDeleteTest();
    inactiveUndoTest();
    inactiveSaveTest();
  });

  context('draw enabled', () => {
    beforeEach(() => {
      cy.mount(RoutesMapToolbar, {
        props: {
          drawEnabled: true,
        },
      });
      cy.viewport('macbook-16');
    });

    coreTests();
    activeDrawTest();
    inactiveDeleteTest();
    inactiveUndoTest();
    inactiveSaveTest();
  });

  context('delete enabled', () => {
    beforeEach(() => {
      cy.mount(RoutesMapToolbar, {
        props: {
          drawEnabled: false,
          deleteEnabled: true,
        },
      });
      cy.viewport('macbook-16');
    });

    coreTests();
    inactiveDrawTest();
    activeDeleteTest();
    inactiveUndoTest();
    inactiveSaveTest();
  });

  context('draw disabled + delete disabled', () => {
    beforeEach(() => {
      cy.mount(RoutesMapToolbar, {
        props: {
          drawDisabled: true,
          deleteDisabled: true,
        },
      });
      cy.viewport('macbook-16');
    });

    coreTests();

    it('shows a disabled draw button with tooltip', () => {
      cy.dataCy(selectorAddRouteButton)
        .invoke('attr', 'disabled')
        .should('eq', 'disabled');
      cy.dataCy(selectorAddRouteAvatar).should('have.backgroundColor', grey3);
      cy.dataCy(selectorAddRouteIcon).should('have.color', primary);
      cy.dataCy(selectorAddRouteAvatar).trigger('mouseenter');
      cy.dataCy(selectorTooltipAddRouteDisabled)
        .should('be.visible')
        .and('contain', i18n.global.t('routes.tooltipDrawDisabled'));
    });

    it('shows a disabled delete button with tooltip', () => {
      cy.dataCy(selectorDeleteRouteButton)
        .invoke('attr', 'disabled')
        .should('eq', 'disabled');
      cy.dataCy(selectorDeleteRouteAvatar).should(
        'have.backgroundColor',
        grey3,
      );
      cy.dataCy(selectorDeleteRouteIcon).should('have.color', primary);
      cy.dataCy(selectorDeleteRouteAvatar).trigger('mouseenter');
      cy.dataCy(selectorTooltipDeleteRouteDisabled)
        .should('be.visible')
        .and('contain', i18n.global.t('routes.tooltipDeleteDisabled'));
    });

    inactiveUndoTest();
    inactiveSaveTest();
  });

  context('undo and save disabled', () => {
    beforeEach(() => {
      cy.mount(RoutesMapToolbar, {
        props: {
          undoDisabled: true,
          saveDisabled: true,
        },
      });
      cy.viewport('macbook-16');
    });

    coreTests();

    it('shows a disabled undo button', () => {
      cy.dataCy(selectorUndoButton)
        .invoke('attr', 'disabled')
        .should('eq', 'disabled');
      cy.dataCy(selectorUndoAvatar).should('have.backgroundColor', grey3);
      cy.dataCy(selectorUndoIcon).should('have.color', primary);
    });

    it('shows a disabled save button', () => {
      cy.dataCy(selectorSaveRouteButton)
        .invoke('attr', 'disabled')
        .should('eq', 'disabled');
      cy.dataCy(selectorSaveRouteAvatar).and('have.backgroundColor', grey3);
      cy.dataCy(selectorSaveRouteIcon).and('have.color', primary);
    });
  });
});

function coreTests() {
  it('renders component', () => {
    cy.dataCy(selectorToolbarTop).should('be.visible');
    cy.dataCy(selectorToolbarBottom).should('be.visible');
    // draw button
    cy.dataCy(selectorAddRouteButton)
      .should('be.visible')
      .and('have.css', 'padding', '0px');
    cy.dataCy(selectorAddRouteAvatar).should('be.visible');
    cy.dataCy(selectorAddRouteAvatar)
      .invoke('height')
      .should('be.equal', avatarSize);
    cy.dataCy(selectorAddRouteAvatar)
      .invoke('width')
      .should('be.equal', avatarSize);
    cy.dataCy(selectorAddRouteIcon)
      .invoke('height')
      .should('be.equal', iconSize);
    cy.dataCy(selectorAddRouteIcon)
      .invoke('width')
      .should('be.equal', iconSize);
    // delete button
    cy.dataCy(selectorDeleteRouteButton)
      .should('be.visible')
      .and('have.css', 'padding', '0px');
    cy.dataCy(selectorDeleteRouteAvatar).should('be.visible');
    cy.dataCy(selectorDeleteRouteAvatar)
      .invoke('height')
      .should('be.equal', avatarSize);
    cy.dataCy(selectorDeleteRouteAvatar)
      .invoke('width')
      .should('be.equal', avatarSize);
    cy.dataCy(selectorDeleteRouteIcon)
      .invoke('height')
      .should('be.equal', iconSize);
    cy.dataCy(selectorDeleteRouteIcon)
      .invoke('width')
      .should('be.equal', iconSize);
    // undo button
    cy.dataCy(selectorUndoButton)
      .should('be.visible')
      .and('have.css', 'padding', '0px');
    cy.dataCy(selectorUndoAvatar).should('be.visible');
    cy.dataCy(selectorUndoAvatar)
      .invoke('height')
      .should('be.equal', avatarSize);
    cy.dataCy(selectorUndoAvatar)
      .invoke('width')
      .should('be.equal', avatarSize);
    cy.dataCy(selectorUndoIcon).invoke('height').should('be.equal', iconSize);
    cy.dataCy(selectorUndoIcon).invoke('width').should('be.equal', iconSize);
    // save button
    cy.dataCy(selectorSaveRouteButton)
      .should('be.visible')
      .and('have.css', 'padding', '0px');
    cy.dataCy(selectorSaveRouteAvatar).should('be.visible');
    cy.dataCy(selectorSaveRouteAvatar)
      .invoke('height')
      .should('be.equal', avatarSize);
    cy.dataCy(selectorSaveRouteAvatar)
      .invoke('width')
      .should('be.equal', avatarSize);
    cy.dataCy(selectorSaveRouteIcon)
      .invoke('height')
      .should('be.equal', iconSize);
    cy.dataCy(selectorSaveRouteIcon)
      .invoke('width')
      .should('be.equal', iconSize);
    // current position button
    cy.dataCy(selectorCurrentPositionButton)
      .should('be.visible')
      .and('have.css', 'padding', '0px');
    cy.dataCy(selectorCurrentPositionAvatar).should('be.visible');
    cy.dataCy(selectorCurrentPositionAvatar)
      .invoke('height')
      .should('be.equal', avatarSize);
    cy.dataCy(selectorCurrentPositionAvatar)
      .invoke('width')
      .should('be.equal', avatarSize);
    cy.dataCy(selectorCurrentPositionIcon)
      .invoke('height')
      .should('be.equal', iconSize);
    cy.dataCy(selectorCurrentPositionIcon)
      .invoke('width')
      .should('be.equal', iconSize);
    // source select
    cy.dataCy(selectorSource).should('be.visible');
    cy.dataCy(selectorSource).click();
    cy.get('.q-menu')
      .find('.q-item')
      .should('have.length', 2)
      .and('contain', i18n.global.t('global.rtwbb'))
      .and('contain', i18n.global.t('global.osm'));
  });
}

function activeDrawTest() {
  it('shows active draw button with tooltip', () => {
    cy.dataCy(selectorAddRouteAvatar).should('have.backgroundColor', primary);
    cy.dataCy(selectorAddRouteIcon).should('have.color', white);
    cy.dataCy(selectorAddRouteButton).trigger('mouseenter');
    cy.dataCy(selectorTooltipAddRouteDisable)
      .should('be.visible')
      .and('contain', i18n.global.t('routes.tooltipDrawDisable'));
  });
}

function activeDeleteTest() {
  it('shows active delete button with tooltip', () => {
    cy.dataCy(selectorDeleteRouteAvatar).should(
      'have.backgroundColor',
      primary,
    );
    cy.dataCy(selectorDeleteRouteIcon).should('have.color', white);
    cy.dataCy(selectorDeleteRouteButton).trigger('mouseenter');
    cy.dataCy(selectorTooltipDeleteRouteDisable)
      .should('be.visible')
      .and('contain', i18n.global.t('routes.tooltipDeleteDisable'));
  });
}

function inactiveDeleteTest() {
  it('shows inactive delete button with tooltip', () => {
    cy.dataCy(selectorDeleteRouteAvatar).should('have.backgroundColor', grey3);
    cy.dataCy(selectorDeleteRouteIcon).should('have.color', primary);
    cy.dataCy(selectorDeleteRouteButton).trigger('mouseenter');
    cy.dataCy(selectorTooltipDeleteRouteEnable)
      .should('be.visible')
      .and('contain', i18n.global.t('routes.tooltipDeleteEnable'));
  });
}

function inactiveDrawTest() {
  it('shows inactive draw button with tooltip', () => {
    cy.dataCy(selectorAddRouteAvatar).should('have.backgroundColor', grey3);
    cy.dataCy(selectorAddRouteIcon).should('have.color', primary);
    cy.dataCy(selectorAddRouteButton).trigger('mouseenter');
    cy.dataCy(selectorTooltipAddRouteEnable)
      .should('be.visible')
      .and('contain', i18n.global.t('routes.tooltipDrawEnable'));
  });
}

function inactiveUndoTest() {
  it('shows inactive undo button with tooltip', () => {
    cy.dataCy(selectorUndoAvatar).should('have.backgroundColor', grey3);
    cy.dataCy(selectorUndoIcon).should('have.color', primary);
    cy.dataCy(selectorUndoButton).trigger('mouseenter');
    cy.dataCy(selectorTooltipUndo)
      .should('be.visible')
      .and('contain', i18n.global.t('routes.tooltipUndo'));
  });
}

function inactiveSaveTest() {
  it('shows inactive save button with tooltip', () => {
    cy.dataCy(selectorSaveRouteAvatar).should('have.backgroundColor', grey3);
    cy.dataCy(selectorSaveRouteIcon).should('have.color', primary);
    cy.dataCy(selectorSaveRouteButton).trigger('mouseenter');
    cy.dataCy(selectorTooltipSave)
      .should('be.visible')
      .and('contain', i18n.global.t('routes.tooltipSave'));
  });
}
