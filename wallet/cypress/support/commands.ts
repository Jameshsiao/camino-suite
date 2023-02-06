// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//

before(() => {
  cy.visit('/')
  // header - app(left) menu aliases
  cy.get('header > .MuiToolbar-root > .MuiBox-root:nth-child(1)').as('appMenu')

  // header - preference(right) menu aliases
  cy.get('header > .MuiToolbar-root > .MuiBox-root:nth-child(2)').as('preferenceMenu')
  cy.get('@preferenceMenu').find('.MuiInputBase-root > .MuiSelect-select', { timeout: 30000 }).as('btnNetworkSwitcher')
  cy.get('@btnNetworkSwitcher').find('.MuiTypography-root').as('txtSelectedNetwork')
  cy.get('@preferenceMenu').find('> .MuiBox-root').as('btnWallet')

  cy.switchToWalletApp()
})

// -- This is a parent command --
Cypress.Commands.add('changeNetwork', (network = 'Columbus') => {
  cy.get('@txtSelectedNetwork').invoke('text')
    .then(currentNetwork => {
      if (currentNetwork !== network) {
        cy.get('@btnNetworkSwitcher').click(); // Network Switcher
        cy.get(`[data-value="${network}"]`).click(); // Select Columbus Network
        // increasing timeout to make sure the network is selected, especially on slowly local dev env
        cy.get('@txtSelectedNetwork', { timeout: 15000 }).invoke('text').should('eq', network)
      }
    })
})
Cypress.Commands.add('accessWallet', (type) => {
  cy.get('@btnWallet').click();
  cy.get('h6 + .MuiGrid-container').as('walletOptions')
  cy.get('@walletOptions').find('> .MuiGrid-container:nth-child(1) > :nth-child(1)').as('privateKeyOption')
  cy.get('@walletOptions').find('> .MuiGrid-container:nth-child(1) > :nth-child(2)').as('mnemonicOption')
  switch (type) {
    case 'privateKey':
      break
    case 'mnemonic':
      break
    default:
      break
  }
  if (type === "mnemonic") {
    cy.get('@mnemonicOption').find('> .MuiButtonBase-root').click();
    cy.fixture('wallets/mnemonic_wallet').then((phraseArr) => {
      cy.get('input.phrase_word').first()?.type(phraseArr.join(' '))
      cy.get('button[type="button"]').contains('Access Wallet').click({ force: true });
    });
  } else if (type === "privateKey") {
    cy.get('@privateKeyOption').click()
    cy.fixture('wallets/private_key_wallet.json').then((privateKey) => {
      cy.get('input[type="password"]').type(privateKey.privateKey)
    })
    cy.get('button[type="button"]').contains('Access Wallet').click();
    // cy.get('#router_view > div.container.content > div.main_panel > div > div.header > h2')
  }
})
Cypress.Commands.add('switchToWalletApp', () => {
  cy.get('@appMenu').click();
  cy.get('.MuiPopover-paper > .MuiMenu-list').as('appOptions')
  cy.get('@appOptions').find('[data-value="Wallet"]').as('appOptionWallet') // could directly selected ?
  cy.get('@appOptions').find('[data-value="Explorer"]').as('appOptionExplorer') // could directly selected ?

  cy.get('@appOptionWallet').click();
})

//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
