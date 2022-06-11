import BoardElements from '../support/elements/board-elements';
import LoginElements from '../support/elements/login-elements';

Cypress.Commands.add('resetDB', (type) => {
    switch (type) {
        case 'boards':
            cy.request('DELETE', '/api/boards')
            break;
        case 'lists':
            cy.request('DELETE', '/api/lists')
            break;
        case 'tasks':
            cy.request('DELETE', '/api/tasks')
            break;
        case 'users':
            cy.request('DELETE', '/api/users')
            break;
        case 'all':
            cy.request('DELETE', '/api/reset')
            break;
        default:
            throw new Error('Type of DB reset must be specificed!')
    }
});

Cypress.Commands.add('loginViaUI', (username = Cypress.env('username'), password = Cypress.env('password')) => {
    cy.get(LoginElements.loginMenu).click();
    cy.get(LoginElements.email).type(username);
    cy.get(LoginElements.password).type(password);
    cy.get(LoginElements.loginButton).click();
});

Cypress.Commands.add('logout', () => {
    cy.get(['[data-cy="logged-user"]']).click();
    cy.get(['[data-cy="logout"]']).click();
});

Cypress.Commands.add('addBoard', (boardname) => {
    cy.get(BoardElements.createBoard).click()
    cy.get(BoardElements.newBoardInput).type(`${boardname}{enter}`)
});

Cypress.Commands.add('returnToBoardsView', () => {
    cy.get(BoardElements.boardsView).click();
});

Cypress.Commands.add('loginViaApi', (username = Cypress.env('username'), password = Cypress.env('password')) =>{
    cy.request({
        method: "POST",
        url: "/login",
        body: {
            email: username,
            password: password
        }
    }).as('login').then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.accessToken).to.have.length(179)
    })

})

Cypress.Commands.add('addBoardApi', (name) => {
    cy.request('POST', '/api/boards', {name})
    .then(({body}) => {
        Cypress.env('boards').push(body)
    })
});

Cypress.Commands.add('updateBoardApi', (name, index = 0) => {
    cy.request(
        'PATCH',
        `/api/boards/${Cypress.env('boards')[index].id}`, {name}
    ).then(({body}) => {
        Cypress.env('boards')[index] = body;
    })
});

Cypress.Commands.add('addListApi', (title, boardId = 0) => {
    cy.request('POST', '/api/lists', {boardId: Cypress.env('boards')[boardId].id, title})
    .then(({body}) => {
        Cypress.env('lists').push(body) 
    })
});

Cypress.Commands.add('addTaskApi', ({title, boardId = 0, listId = 0}) => {
    cy.request(
        'POST',
        '/api/tasks',
        {title,
        boardId: Cypress.env('boards')[boardId].id,
        listId: Cypress.env('lists')[listId].id
    }).then(({body}) => {
        Cypress.env('tasks').push(body) 
    })
});
Cypress.Commands.add('addTaskDesc', (desc) => {
    cy.get('[data-cy=task-module]').click()
    cy.get('[data-cy=task-description]').click()
    cy.get('[data-cy=task-description-input]').type(desc)
    cy.get('[data-cy=task-description-save]').click()
});

Cypress.Commands.add('deleteBoardApi', () => {

});
Cypress.Commands.add('deleteBoardApi', () => {

});
