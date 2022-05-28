import Boards from '../support/classes/boards';

const boards = new Boards();

describe('Creating a custom command', () => {
    before(() => {
        boards.setupTests({
            resetDB: true
        });
    })

    it('Create a new board via the UI', () => {
        boards.addBoard('Beers of the world');
        boards.returnToBoardsView();

        boards.assertBoardName('Beers of the world')
        // cy.contains('Beers of the world').should('be.visible');
    });

    it('Can delete a board via the UI', () => {
        boards.deleteBoard('Beers of the world');
        cy.contains('Beers of the world').should('not.exist');
    });
    it('Create new list', () => {
        boards.createNewList('task list')
    })
    it('Add new task', () => {
        boards.addTask('task test')
    })
    it('Add new task 2', () => {
        boards.addTask('task 3')
    })
    it('Add new task 3', () => {
        boards.addTask('task 2')
    })
    it('Upload file', () => {
        boards.uploadFile()
    })
});