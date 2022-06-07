describe('Network stubbing', () => {
 beforeEach('', () => {
  cy.request('DELETE', 'api/boards')
  cy.request('DELETE', 'api/users')

 })
  // 1st batch
  it('Stubbing response', () => {
    cy.intercept('api/boards', { fixture: 'threeBoards.json'}).as('threeBoards')
    cy.visit('/')
  });

  it('Create board via API', () => {
    cy.request({
      method: 'POST',
      url: '/boards',
      body: {
        name: 'Super board'
      }
    })
  });
  
  it('Use intercept to signup the user', () => {
    cy.intercept({
      method: 'POST',
      url: '/welcomeemail'
      }, 'sucess').as('welcomeEmail');
      cy.visit('/')
      cy.get("[data-cy='login-menu']").click()
      cy.get("[data-cy='login-module']").should('be.visible')
      cy.get("[data-cy='close-login']").click()

      cy.get("[data-cy='login-menu']").click()
      cy.contains("Sign up here").click()

      cy.get("[data-cy='signup-email]").type("user@uu.com")
      cy.get("[data-cy='signup-password]").type("Pass1234")

      cy.get("[data-cy='welcome-email-checkbox]").check()

      cy.get("[data-cy='signup]").click()
      cy.wait('@welcomeEmail')
      cy.get("[data-cy='login-module']").should('not.be.visible')
      cy.location('pathname').should('eq', '/')
      cy.url().should('eq', 'http://localhost:3000/')
      cy.getCookie('trello_token').should('exist')
  })
  // 2nd batch
  it('Create 4 boards', () => {
    cy.intercept('api/boards', {fixture: 'intercept.json'}).as('createBoards')
   cy.request({
     method: 'POST',
     url: "api/boards"
   })
    cy.visit('/boardss')
    cy.get('@createBoards').should(({request, response}) => {
     expect(request.url).to.match(/\/boards/)
     expect(request.method).to.equal('GET')
     expect(response.statusCode).to.equal(200)
     expect(response.headers).to.include({
      "access-control-allow-credentials": 'true',
      "content-type": 'application/json'
     })
    })
  });

  it('Create 1st lists "In QA" board', () => {
    cy.request('POST', 'api/lists', {boardId: 2, title: 'Stubbing network response'})
    cy.visit('/board/2')
    cy.get('[data-cy="list-name"]').should('have.class', 'Input taskTitle')
    cy.get('[data-cy="list-name"]').should('have.css',  'background-color', 'rgb(226, 228, 230)')

    cy.visit('/board/2')
  });

  it('Create 2nd lists "In QA" board', () => {
    cy.request('POST', 'api/lists', {
      boardId: 2,
      title: 'Add One more list' 
    })
  });

  it('Create 3rd lists "In QA" board', () => {

  });

  it.only('Delete boards', () => {
    cy.intercept('DELETE', 'api/boards', {
    statusCode: 200}).as('deleteBoards')

    cy.visit('/')
    cy.get('[id=new-board]').should('contain', 'Create a board...')
    cy.get('[id=new-board]').should('have.css', 'background-color', 'rgb(205, 210, 212)')
  });
});
