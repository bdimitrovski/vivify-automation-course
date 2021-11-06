import Utils from '../utils';

const utils = new Utils();
class Boards {
    setupTests() {
        utils.visitUrl('/');
    }

    addBoard(boardName) {
        cy.addBoard(boardName);
    }

    returnToBoardsView() {
        cy.returnToBoardsView();
    }

    deleteBoard(boardName) {
        cy.deleteBoard(boardName);
    }
}

export default Boards;