
export function changeNetwork(cy: any) {
    cy.get('.css-1nt3z7i > .MuiInputBase-root > .MuiSelect-select').click(); //Network Switcher
    cy.get('[data-value="Columbus"] > .MuiTypography-root').click(); //Select Columbus Network
}

export function accessWallet(cy: any, type: string) {
    cy.get('.css-1gr9h7h > .MuiTypography-root').click();
    if(type === "mnemonic"){
        cy.get('.css-1u20msc > :nth-child(1) > :nth-child(2) > .MuiButtonBase-root').click();
        cy.readFile(`cypress/temp/wallets/mnemonic_wallet.json`).then((data) => {
        let phraseArr = data;
        for (let i = 0; i < phraseArr.length; i++) {
            let indexInput = i + 1;
            cy.get(`:nth-child(${indexInput}) > .phrase_word`).type(phraseArr[i])
        }

        cy.contains('Access Wallet').click({ force: true });
        cy.get('.css-1ahpw46 > .MuiInputBase-root > .MuiSelect-select').click();
        cy.get('.MuiList-root > [tabindex="-1"]').click();
    });
    }
    if(type === "privateKey"){
        cy.get('.css-1ahpw46 > .MuiInputBase-root > .MuiSelect-select').click()
        cy.get(
            '#menu- > div.MuiPaper-root.MuiPaper-elevation.MuiPaper-rounded.MuiPaper-elevation0.MuiPaper-root.MuiMenu-paper.MuiPaper-elevation.MuiPaper-rounded.MuiPaper-elevation8.MuiPopover-paper.css-zu36zd > ul > li:nth-child(2)'
        ).click()
        cy.url().should('include', '/login') 
        cy.get('#app > div > div.MuiBox-root.css-ymnp2l > div > div:nth-child(3) > div > div:nth-child(1) > div:nth-child(1)').click()
        cy.get('#input-11').type('a40c8d19fe548f2471ef9f909c516632fa6f40c638c73348b4063baedfe59434')
        cy.get('#app > div > div.MuiBox-root.css-ymnp2l > div > div > div > div > form > button').click()
        cy.get('#router_view > div.container.content > div.main_panel > div > div.header > h2')
    }

    
}