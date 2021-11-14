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
            boards.assertBoardName(boardName);
            boards.returnToBoardsView();
            boards.deleteBoard(boardName);
        });
    });
})