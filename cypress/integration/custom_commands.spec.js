describe('Creating and using custom commands', () => {
    beforeEach(() => {
        cy.resetDB('boards');
        cy.visit('/')
    })

    it('Create a new board via the UI', () => {
        cy.addBoard('New board')
        cy.returnToBoardsView();

        cy.contains('New board').should("be.visible")
    });

    it('Login via UI', () => {
        cy.loginViaUI();
    });

    it('Login via API', () => {
        cy.loginViaApi();
    });

    it('Can create a new board via API and edit it', () => {
        cy.log('create a new board via API...').addBoardApi('surfboard')
        cy.visit('/')
        cy.get('[data-cy=board-item]').should('contain.text', 'surfboard')

        cy.updateBoardApi('updated board name');

        cy.get('[data-cy=board-item]').should('contain.text', 'updated board name')
    });

    it('Can create a list via API', () => {
        cy.addBoardApi('nice board')
        cy.visit('/')
        cy.contains('nice board').click()
        cy.addListApi({
            boardId: 0,
            title: 'new list'
        })
    });

    it('Open task detail', () => {
        cy.addBoardApi("bbb")
        cy.contains('bbb').click()
        cy.addListApi({
            boardId: 0,
            title: 'new list',
        })
        .addTaskApi({
            boardId: 0,
            listId: 0,
            title: 'new taskkk'
        })
        cy.addTaskDesc('helloooo')
    });

});