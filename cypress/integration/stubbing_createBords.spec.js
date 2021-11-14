describe('Network stubbing', () => {
  it('create 4 boards', () => {
    cy.intercept('/api/boards', { fixture: 'intercept.json' }).as('createBoards');
    cy.visit('/');

    //assertions
    cy.get('div[class="background_container"]')
      .should('contain', 'In progress')
      .and('contain', 'Todo')
      .and('contain', 'In QA')
      .and('contain', 'Done');

    cy.get('@createBoards').should(({ request, response }) => {
      expect(request.url).to.match(/\/boards/);
      expect(request.method).to.equal('GET');
      expect(response.statusCode).to.equal(200);
      expect(request.headers).to.include({
        accept: 'application/json, text/plain, */*',
        host: 'localhost:3000'
      });
    });
  });

  it('create 1st lists "In QA" board', () => {
    cy.request('POST', '/api/lists', { boardId: 2, title: 'Stubbing network responses' });
    cy.visit('/board/2');

    //assertions
    cy.get('[data-cy=list-name]').should('have.class', 'Input taskTitle');
    cy.get('[data-cy=list-name]').should('have.css', 'background-color', 'rgb(226, 228, 230)');
    cy.get('[data-cy=new-task]').eq(0).should('contain', 'Add new task');
  });

  it('create 2nd lists "In QA" board', () => {
    cy.request('POST', '/api/lists', { boardId: 2, title: 'Changing parts of response data' });
    cy.visit('/board/2');

    //assertions
    cy.get('[data-cy=list-name]').should('have.class', 'Input taskTitle');
    cy.get('[data-cy=list-name]').should('have.css', 'background-color', 'rgb(226, 228, 230)');
    cy.get('[data-cy=new-task]').eq(1).should('contain', 'Add new task');
  });

  it('create 3rd lists "In QA" board', () => {
    cy.request('POST', '/api/lists', { boardId: 2, title: 'Intercepting' });
    cy.visit('/board/2');

    //assertions
    cy.get('[data-cy=list-name]').should('have.class', 'Input taskTitle');
    cy.get('[data-cy=list-name]').should('have.css', 'background-color', 'rgb(226, 228, 230)');
    cy.get('[data-cy=new-task]').eq(2).should('contain', 'Add new task');
  });

  it('delete boards', () => {
    cy.intercept('DELETE', '/api/boards', {
      statusCode: 200,
    }).as('deleteBoards');
    cy.visit('/');

    //assertions
    cy.get('[id=new-board]').should('contain', 'Create a board...');
    cy.get('[id=new-board]').should('have.css', 'background-color', 'rgb(205, 210, 212)');
  });
});
