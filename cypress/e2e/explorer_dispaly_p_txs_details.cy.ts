import BigNumber from 'bignumber.js'
import { roundedToLocaleString, getDisplayAmount } from '../../src/utils/currency-utils'

describe(
    'Explorer: Latest block list and transaction list in P chain',
    { tags: ['@explorer', '@suite'] },
    () => {
        beforeEach(() => {
            cy.entryExplorer()
            // cy.checkValidatorsTxsGasFee()

            cy.contains('P-Chain').as('pChainTab')
            cy.fixture('mocks/p_transactions.json').then(pTransactions => {
                cy.intercept('GET', '**/v2/transactions/*', request => {
                    request.reply({
                        statusCode: 200,
                        body: pTransactions,
                    })
                }).as('transactions')
            })
        })

        it('verify latest block list and transaction list', () => {
            cy.get('@pChainTab').click()
            cy.wait(1000)
            cy.contains('Latest Transactions').parent().next().find('div').eq(1).find('a').click()

            cy.wait('@transactions', { timeout: 30000 })
                .then(intercept => {
                    return intercept.response?.body
                })
                .then(transactions => {
                    cy.get('[data-cy="Transaction"]').should('have.text', transactions.id)
                    cy.get('h5:contains(Input)').as('inputBlock')
                    cy.get('h5:contains(Input)')
                        .its('length')
                        .then(res => {
                            console.log(res)
                        })
                    cy.get('@inputBlock').each(($el, index) => {
                        cy.wrap($el)
                            .parent()
                            .find('div')
                            .first()
                            .find('div')
                            .eq(2)
                            .find('span')
                            .invoke('text')
                            .then(fromAddress => {
                                expect(fromAddress).to.equal(
                                    transactions.inputs[index].output.addresses[0],
                                )
                            })

                        cy.wrap($el)
                            .parent()
                            .find('div')
                            .eq(6)
                            .find('h6')
                            .invoke('text')
                            .then(value => {
                                const abbreviate = true
                                const amount = roundedToLocaleString(
                                    getDisplayAmount(
                                        BigNumber(
                                            transactions.inputs[index].output.amount,
                                        ).toNumber(),
                                    ).value,
                                    abbreviate ? 4 : 20,
                                    abbreviate,
                                )
                                expect(value).to.equal(amount)
                            })
                    })

                    cy.get('h5:contains(Output)').as('outputBlock')
                    cy.get('@outputBlock').each(($el, index) => {
                        cy.wrap($el)
                            .parent()
                            .find('div')
                            .first()
                            .find('div')
                            .eq(2)
                            .find('span')
                            .invoke('text')
                            .then(fromAddress => {
                                expect(fromAddress).to.equal(
                                    transactions.outputs[index].addresses[0],
                                )
                            })

                        cy.wrap($el)
                            .parent()
                            .find('div')
                            .eq(6)
                            .find('h6')
                            .invoke('text')
                            .then(value => {
                                const abbreviate = true
                                const amount = roundedToLocaleString(
                                    getDisplayAmount(
                                        BigNumber(transactions.outputs[index].amount).toNumber(),
                                    ).value,
                                    abbreviate ? 4 : 20,
                                    abbreviate,
                                )
                                expect(value).to.equal(amount)
                            })
                    })
                })
        })
    },
)