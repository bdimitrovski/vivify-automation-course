import Boards from '../support/classes/boards';

const boards = new Boards();

describe('Creating a custom command', () => {
    before(() => {
        boards.setupTests();
    })

    it('Create a new board via the UI', () => {
        boards.addBoard('Beers of the world');
        boards.returnToBoardsView();

        cy.contains('Beers of the world').should('be.visible');
    });

    it('Can delete a board via the UI', () => {
        boards.deleteBoard('Beers of the world');
        cy.contains('Beers of the world').should('not.exist');
    });
});