import Utils from '../utils';
import BoardElements from '../../elements/board-elements';

const utils = new Utils();
class Boards {

    setupTests(options) {
        if (options && options.resetDB) {
            cy.request('DELETE', '/api/boards')
        }
        utils.visitUrl(Cypress.config('baseUrl'));
    }

    createBoard() {
        cy.get(BoardElements.createBoard).click()
    }
    addBoard(boardName) {
        this.createBoard();
        cy.get(BoardElements.newBoardInput).type(`${boardName}{enter}`)
    }
    assertBoardName(boardName) {
        cy.contains(`${boardName}`).should('be.visible').and('contain', boardName);     
    }
    returnToBoardsView(){
        cy.get(BoardElements.boardsView).click()
    }
    deleteBoard(boardName){
        cy.contains(boardName).click()
        cy.get(BoardElements.boardOptions).click()
        cy.get(BoardElements.deleteBoard).click()
    }
    assertBoardDoesNotExist(boardName){
        cy.contains(boardName).should('not.exist')
    }

    createNewList(listName){
        this.addBoard();
        cy.get(BoardElements.addNewListBtn).click()
        cy.get(BoardElements.addListName).type(`${listName}{enter}`)
    }

    addTask(taskName){
        cy.get(BoardElements.newTask).click()
        cy.get(BoardElements.taskTitle).type(`${taskName}{enter}`)
    }

    uploadFile(){

        var titleTest = cy.get(BoardElements.clickTask).wrap('test test')
        cy.get(titleTest).click();
    }
}

export default Boards;