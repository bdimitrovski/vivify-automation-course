class Boards {
    setupTests() {
        cy.visit('/');
        cy.resetDB('boards');
    }
}

export default Boards;