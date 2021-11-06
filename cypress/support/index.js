require('@4tw/cypress-drag-drop');
import 'cypress-file-upload';
import 'cypress-real-events/support';

import './commands';

Cypress.Commands.add('setupAssertTests', () => {
    cy.request('DELETE', '/api/boards')
    cy.intercept('/login').as('login')
    cy.visit('/')
})

Cypress.Commands.add('login', (username = Cypress.env('username'), password = Cypress.env('password')) => {
    cy.get('[data-cy=login-menu]').click()
    cy.get('[data-cy=login-email]').type(username)
    cy.get('[data-cy=login-password]').type(password)
    cy.get('[data-cy=login]').click()
    cy.wait('@login')
})

Cypress.Commands.add('logout', () => {
    cy.get('[data-cy=logged-user]').click()
    cy.get('[data-cy=logout]').click()
})