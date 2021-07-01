/// <reference types="cypress" />

describe('Creating a custom command', () => {
    before(() => {
        cy.visit('/');
    })

    it('Create a new board via the UI', () => {
        cy.addBoard('Beers of the world');
        cy.returnToBoardsView();
        cy.contains('Beers of the world').should('be.visible');
    });

    it('Can delete a board via the UI', () => {
        cy.deleteBoard('Beers of the world');
        cy.contains('Beers of the world').should('not.exist');
    });
});