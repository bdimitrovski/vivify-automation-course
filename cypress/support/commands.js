import BoardElements from '../support/elements/board-elements';
import LoginElements from '../support/elements/login-elements';

Cypress.Commands.add('resetDB', (type) => {
    switch(type) {
        case 'boards':
            cy.request('DELETE', '/api/boards');
            break;
        case 'lists':
            cy.request('DELETE', '/api/lists');
            break;
        case 'users':
            cy.request('DELETE', '/api/users');
            break;
        case 'all':
            cy.request('DELETE', '/api/reset');
            break;
        default:
            throw new Error('Type of DB reset must be specified!');
    }
});

Cypress.Commands.add('loginViaUI', (username = Cypress.env('username'), password = Cypress.env('password')) => {
    cy.get(LoginElements.loginMenu).click();
    cy.get(LoginElements.email).type(username);
    cy.get(LoginElements.password).type(password);
    cy.get(LoginElements.loginButton).click();
});

Cypress.Commands.add('loginViaAPI', (username = Cypress.env('username'), password = Cypress.env('password')) => {
    cy.request({
        method: 'POST',
        url: '/login',
        body: {
            email: username,
            password: password
        }
    }).as('login').then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.accessToken).to.have.length(189);
    })
});

Cypress.Commands.add('logout', () => {
    cy.get('[data-cy=logged-user]').click();
    cy.get('[data-cy=logout]').click();
});

Cypress.Commands.add('addBoard', (boardName) => {
    cy.get(BoardElements.createBoard).click();
    cy.get(BoardElements.newBoardInput).type(`${boardName}{enter}`);
});

Cypress.Commands.add('returnToBoardsView', () => {
    cy.get(BoardElements.boardsView).click();
});

Cypress.Commands.add('addBoardApi', (name) => {
    cy.request('POST', '/api/boards', { name }).then(({ body }) => {
        Cypress.env('boards').push(body);
    });
});

Cypress.Commands.add('addListApi', ({ title,  boardIndex = 0 }) => {
    cy.request(
        'POST',
        '/api/lists', {
            boardId: Cypress.env('boards')[boardIndex].id,
            title
        }
    ).then(({ body }) => {
        Cypress.env('lists').push(body);
    })
});

Cypress.Commands.add('addTaskApi', ({ title, boardIndex = 0, listIndex = 0}) => {
    cy.request(
        'POST',
        '/api/tasks',
        {
            title,
            boardId: Cypress.env('boards')[boardIndex].id,
            listId: Cypress.env('lists')[listIndex].id
        }
    ).then(({ body }) => {
        Cypress.env('tasks').push(body);
    })
});

Cypress.Commands.add('updateBoardApi', ({ name, index = 0}) => {
    cy.request(
        'PATCH',
        `/api/boards/${Cypress.env('boards')[index].id}`, { name }
    ).then(({ body }) => {
        Cypress.env('boards')[index] = body;
    })
});

Cypress.Commands.add('addTaskDescription', (description) => {
    cy.get('[data-cy=task-module]').should('be.visible');
    cy.get('[data-cy=task-description]').click();
    cy.get('[data-cy=task-description-input]').type(description);
    cy.get('[data-cy=task-description-save]').click();
});

Cypress.Commands.add('addDeadline', () => {
    cy.get('[data-cy=task-deadline]')
        .focus()
        .type(new Date().toISOString().split('T')[0])
        .blur()
})

Cypress.Commands.add('deleteBoardApi', () => {

});
