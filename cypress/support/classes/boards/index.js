import Utils from '../utils';
import BoardElements from '../../elements/board-elements';

const utils = new Utils();
class Boards {
    setupTests(options) {
        if (options && options.resetDB) {
            cy.request('DELETE', '/api/boards');
        }

        utils.visitUrl('/');
    }

    createBoard() {
        cy.get(BoardElements.createBoard).click();
    }

    addBoard(boardName) {
        cy.get(BoardElements.createBoard).click();
        cy.get(BoardElements.newBoardInput).type(`${boardName}{enter}`);
    }

    assertBoardName(boardName) {
        cy.get(BoardElements.boardTitle).then(($title) => {
            expect($title[0]._value).to.equal(boardName);
        })
    }

    createNewBoardFromApi(url) {
        return cy.task('fetchData', {
            url: url
        });
    }

    returnToBoardsView() {
        cy.get(BoardElements.boardsView).click();
    }

    deleteBoard(boardName) {
        cy.contains(boardName).click();
        cy.get(BoardElements.boardOptions).click();
        cy.get(BoardElements.deleteBoard).click();
    }
}

export default Boards;