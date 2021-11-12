class Utils {
    visitUrl(url) {
        cy.visit(url);
    }

    uploadFile(selector, file) {
        cy.get(selector)
            .attachFile(file)
    }
}

export default Utils;