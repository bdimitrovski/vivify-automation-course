describe('Creating and using custom commands', () => {
    beforeEach(() => {
        cy.resetDB('boards');
        cy.visit('/');
    })

    it('Create a new board via the UI', () => {
        cy.addBoard('New board');
        cy.returnToBoardsView();

        cy.contains('New board').should('be.visible').and('contain.text', 'New board');
    });

    it('Login via UI', () => {
        cy.loginViaUI();
    });

    it('Login via API', () => {
        cy.loginViaAPI();
    })

    it('Can create a new board via API and edit it', () => {
        cy
            .log('creating a new board via API...')
            .addBoardApi('surfing board');

        cy.visit('/');

        cy.get('[data-cy=board-item]').should('contain.text', 'surfing board');

        cy.updateBoardApi({
            name: 'nesto drugo'
        });

        cy.get('[data-cy=board-item]').should('contain.text', 'nesto drugo');
    });

    it('Can create a list via API', () => {
        cy.addBoardApi('some nice board');

        cy.visit('/');

        cy.addListApi({
            boardIndex: 0,
            title: 'New list'
        })
    });

    it('Open task detail', () => {
        
    });

});