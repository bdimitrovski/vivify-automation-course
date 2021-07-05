describe('Plugins', () => {
    it('Can fetch data from backend', () => {
        cy.visit('/');

        cy.get('[data-cy=create-board]').click();

        cy.task('fetchData', {
            url: 'https://jsonplaceholder.typicode.com/posts/'
        }).then((data) => {
            cy.get('[data-cy=new-board-input]').type(data[Math.floor(Math.random() * 99) + 1].title);
            cy.get('[data-cy=new-board-create]').click();

            // wait 5 seconds to show the entered title
            cy.wait(5000);
            cy.get('.Nav_boards').click();
            cy.get('[data-cy=board-item]').click();
            cy.get('[data-cy=board-options] > .options > path').click();
            cy.get('[data-cy=board-options] > #myDropdown > .delete').click();
        });
    });
})