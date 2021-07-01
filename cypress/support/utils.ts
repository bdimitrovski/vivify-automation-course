Cypress.Commands.add('addBoard', (boardName: string) => {
  cy.get('[data-cy="create-board"]').click();
  cy.get('[data-cy=new-board-input]').type(`${boardName}{enter}`);
})

Cypress.Commands.add('returnToBoardsView', () => {
    cy.get('.Nav_boards').click();
})

Cypress.Commands.add('deleteBoard', (boardName: string) => {
    cy.contains(boardName).click();
    cy.get('[data-cy=board-options] > .options > path').click();
    cy.get('[data-cy=board-options] > #myDropdown > .delete').click();
})