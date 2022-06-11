class Boards {
    setupTests() {
        cy.visit('/');

        cy.resetDB({
            resetBoards: true
        })
    }
}

export default Boards;