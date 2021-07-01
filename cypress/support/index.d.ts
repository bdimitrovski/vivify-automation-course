/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
       /**
       * Creates a new board via UI
       *
       * @example
       * cy.addBoard('Beers of the world')
       */
      addBoard(boardName: string): Chainable<Element>;

      /**
       * Deletes a board via the UI
       * @example
       * cy.deleteBoard('Beers of the world')
       */
      deleteBoard(boardName: string): Chainable<Element>;
      
      /**
       * Return to boards view
       * @example
       * cy.returnToBoardsView();
       */
      returnToBoardsView(): Chainable<Element>;
  }
}