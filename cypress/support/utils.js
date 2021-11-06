import BoardElements from './elements/board-elements';

Cypress.Commands.add('addBoard', (boardName) => {
  cy.get(BoardElements.createBoard).click();
  cy.get(BoardElements.newBoardInput).type(`${boardName}{enter}`);
})

Cypress.Commands.add('returnToBoardsView', () => {
    cy.get(BoardElements.boardsView).click();
})

Cypress.Commands.add('deleteBoard', (boardName) => {
    cy.contains(boardName).click();
    cy.get(BoardElements.boardOptions).click();
    cy.get(BoardElements.deleteBoard).click();
})
