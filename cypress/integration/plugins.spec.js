import Boards from '../support/classes/boards';
const boards = new Boards();

describe('Plugins', () => {
    beforeEach(() => {
        boards.setupTests({
            resetDB: true
        });
    });

    it('Can fetch data from backend and create a new board', () => {
        boards.createBoard();

        boards.createNewBoardFromApi('https://jsonplaceholder.typicode.com/posts/').then((data) => {
            const boardName = data[Math.floor(Math.random() * 99) + 1].title;
 
            boards.addBoard(boardName);

            // TODO: convert to returnToBoardsView() method
            cy.get('.Nav_boards').click();

            // TODO: convert to deleteBoards() method
            cy.get('[data-cy=board-item]').click();
            cy.get('[data-cy=board-options] > .options > path').click();
            cy.get('[data-cy=board-options] > #myDropdown > .delete').click();
        });
    });
})