describe('Asserts, hooks and other crooks', () => {
    beforeEach(() => {
        // prepare testing env - delete boards before each test to have a clean slate
        cy.request('DELETE', '/api/boards')

        // define login route to wait for after clicking on the login button
        cy.intercept('/login').as('login')

        // begin with loading the app
        cy.visit('/')

        // login the user
        cy.get('[data-cy=login-menu]').click()
        cy.get('[data-cy=login-email]').type(Cypress.env('username'))
        cy.get('[data-cy=login-password]').type(Cypress.env('password'))
        cy.get('[data-cy=login]').click()

        // we wait for the login request to be fulfilled until we go any further
        cy.wait('@login')

        // show the concept of not waiting for animations before asserting DOM: https://docs.cypress.io/guides/references/configuration#Actionability
        // configure the flag in cypress.json

        cy.get('[data-cy=loggedin-bar]')
            .should('be.visible')
            .and('contain', 'User is logged in')

        // assert the logged in state
        cy.get('[data-cy=logged-user]').should(($loggedInUser) => {
            expect($loggedInUser).to.contain('b.g.dimitrovski@gmail.com')
        })

    });

    afterEach(() => {
        cy.get('[data-cy=logged-user]').click()
        cy.get('[data-cy=logout]').click()

        // assert that we've been logged out
        cy.get('[data-cy=login-menu] > svg').should('be.visible')
        cy.get('[data-cy=login-menu]').should('contain', 'Log in')
    })

    it('I can create a board, assert its ID, star it, and assert that it is in my `Favorites`', () => {
        // assert that there is a `Create board` element
        cy.get('[data-cy=create-board]').should(($elem) => {
            expect($elem).to.contain('Create a board')
        })

        // creating a new board
        cy.get('[data-cy=create-board]').click();
        cy.get('[data-cy=new-board-input]').type('My board{enter}')

        // extract the board ID from the URL, assert dynamically
        cy
            .url()
            .then((url) => {
                const id = url.match(/\/(\d+?)$/)

                cy
                    .url()
                    .should(
                        'eq',
                        `${Cypress.config('baseUrl')}/board/${id[1]}`
                    )
            })

        // go back to boards view using the `go` method, or alternatively, use `cy.visit('/')`
        cy.go('back')

        // use `trigger` method to cause the `mouseover` event over the board element
        // make sure that when hovering, the start element is visible, and then click on it
        cy
            .get('[data-cy=board-item]')
            .trigger('mouseover')

        cy
            .get('[data-cy=star]')
            .should('be.visible')
            .click()

        // get all the boards in the `My boards (Favorite)` list and assert their number
        cy.get('[data-cy=favorite-boards]')
            .children()
            .should('have.length', 1)
    })

    it('I can create a new board, add a list with `Task 1`, `Task 2`, `Task 3` to the board and assert them', () => {
        // creating a new board
        cy.get('[data-cy=create-board]').click();
        cy.get('[data-cy=new-board-input]').type('My board{enter}')

        // i want to click on a name of my board... hmm... if only i had a selector for it?
        // hint: look into the interpolation in index.html {{ board.name }} and make a dynamic data-cy
        cy.visit('/')
        cy.get('[data-cy="My board"]').click();

        // adding a new list
        cy
            .get('[data-cy=add-list]')
            .click();

        cy
            .get('[data-cy=add-list-input]')
            .type('New list{enter}');

        // add 3 tasks (Task 1, Task 2, Task 3) - the elegant, shorter way
        for (let i = 0; i <= 2; i++) {
            cy
                .get('[data-cy=new-task]')
                .click()

            cy
                .get('[data-cy=task-input]')
                .type(`Task ${i + 1}{enter}`);
        }

        // assert number of tasks and their names (children way)
        cy.get('[data-cy=tasks-list]')
            .children()
            .should('have.length', 3)
            .then(($child) => {
                expect($child[0].innerText).to.eq('Task 1')
                expect($child[1].innerText).to.eq('Task 2')
                expect($child[2].innerText).to.eq('Task 3')
            })

        // assert number of tasks and their names (eq way)
        cy.get('[data-cy=tasks-list]')
            .children()
            .eq(0)
            .should('have.text', ' Task 1')

        cy.get('[data-cy=tasks-list]')
            .children()
            .eq(1)
            .should('have.text', ' Task 2')

        cy.get('[data-cy=tasks-list]')
            .children()
            .eq(2)
            .should('have.text', ' Task 3')
    })

    it('Do assertions over a task item + CRUD actions/assertions', () => {
        // register the tasks update route, it might come in handy while working
        cy.intercept('PATCH', '/api/tasks/*').as('updateTasks')

        cy.get('[data-cy=create-board]').click();
        cy.get('[data-cy=new-board-input]').type('My board{enter}')

        // adding a new list
        cy
            .get('[data-cy=add-list]')
            .click();

        cy
            .get('[data-cy=add-list-input]')
            .type('New list{enter}');

        cy
            .get('[data-cy=new-task]')
            .click()

        cy
            .get('[data-cy=task-input]')
            .type(`Task 1{enter}`)

        cy
            .get('[data-cy=task]')
            .click()

        // since this is an input field, we need to assert its value
        cy
            .get('[data-cy=task-module-name]')
            .should('have.value', 'Task 1')

        cy
            .get('.TaskModule_list')
            .should('have.text', 'in list New list')

        // change task name, asser it, change back, assert it (do it in the list too, once you close the modal)
        cy
            .get('[data-cy=task-module-name]')
            .click()
            .clear()
            .type('Something completely different{enter}')

        cy.wait('@updateTasks');

        cy
            .get('[data-cy=task-module-name]')
            .should('have.value', 'Something completely different')

        // close the modal, assert the changed task name in the list
        cy
            .get('[data-cy=task-module-close] > .options')
            .click({ force: true })

        cy
            .get('[data-cy=task-dropdown] > :nth-child(1)')
            .click({ force: true })

        cy
            .get('[data-cy=task-title]')
            .should('contain', 'Something completely different')


        // complete the task and asser that it has been done
        cy.get('[data-cy=task-done]').click()
        cy.get('.Task_title').should('have.css', 'text-decoration', 'line-through solid rgb(77, 77, 77)')

        // re-enable the task, asser that it is re-enabled
        cy.get('[data-cy=task-done]').click();
        cy.get('.Task_title').should('not.have.css', 'text-decoration', 'line-through solid rgb(77, 77, 77)')

        // add new task, this time we click the "Add" button
        cy.get('[data-cy=new-task]').click()
        cy.get('[data-cy=task-input]').type('A new task')
        cy.get('[data-cy=add-task]').click()

        // select the newly created task
        cy.get('[data-cy=tasks-list]')
            .children()
            .eq(1)
            .click()

        // edit the task title again
        cy
            .get('[data-cy=task-module-name]')
            .click()
            .clear()
            .type('Change the title again{enter}')

        cy
            .get('[data-cy=task-module-name]')
            .should('have.value', 'Change the title again')

        // add the task description
        cy
            .get('[data-cy=task-description]')
            .click()

        cy
            .get('[data-cy=task-description-input]')
            .type('Aww yiss, a description')

        cy
            .get('[data-cy=task-description-save]')
            .click()

        cy
            .get('.TaskModule_description')
            .should('contain', 'Aww yiss, a description')

        // change task deadline to a past date
        cy
            .get('[data-cy=task-deadline]')
            .focus()
            .type('2021-01-01')
            .blur();

        cy
            .get('[data-cy=task-deadline]')
            .should('have.class', 'overDue')
            .and('have.css', 'background-color', 'rgb(231, 116, 141)')

        // close the modal and assert that it's not visible
        cy
            .get('[data-cy=task-module-close]')
            .click()

        cy
            .get('[data-cy=task-dropdown] > :nth-child(1)')
            .click()

        cy
            .get('[data-cy=task-module]')
            .should('not.be.visible')

        // find overdue task(s) in the list using the `find()` method, assert them, and log their number using `cy.log()`
        cy
            .get('[data-cy=tasks-list]')
            .find('.overDue')
            .should('have.class', 'overDue')
            .and('have.css', 'background-color', 'rgb(231, 116, 141)')
            .then((el) => {
                cy.log(`There is a total of ${el.length} overdue tasks in the backlog.`)
            })
    })

    it('I can delete a task', () => {
        // creating a new board
        cy.get('[data-cy=create-board]').click();
        cy.get('[data-cy=new-board-input]').type('My board{enter}')

        // let's assert the board URL once again just for fun 
        cy
            .url()
            .then((url) => {
                const id = url.match(/\/(\d+?)$/)

                cy
                    .url()
                    .should(
                        'eq',
                        `${Cypress.config('baseUrl')}/board/${id[1]}`
                    )
            })

        cy.visit('/')
        cy.get('[data-cy=board-item] > [data-cy="My board"]').click();

        // adding a new list
        cy
            .get('[data-cy=add-list]')
            .click();

        cy
            .get('[data-cy=add-list-input]')
            .type('New list{enter}');

        cy
            .get('[data-cy=new-task]')
            .click()

        cy
            .get('[data-cy=task-input]')
            .type(`Task 1{enter}`);

        // assert newly created task
        cy
            .get('[data-cy=task]')
            .should('be.visible')
            .and('contain', 'Task 1')

        // open the first task in the list using `first()` method
        cy
            .get('[data-cy=tasks-list]')
            .first()
            .click()

        cy
            .get('[data-cy=task-module-close] > .options')
            .click({ force: true })

        // click on the `Delete task` action using `cy.contains()`
        cy
            .contains('Delete task')
            .click()

        cy
            .get('[data-cy=task]')
            .should('not.exist')
    })

    it('I can delete a list', () => {
        // creating a new board
        cy.get('[data-cy=create-board]').click();
        cy.get('[data-cy=new-board-input]').type('My board{enter}')

        cy.visit('/')
        cy.get('[data-cy=board-item] > [data-cy="My board"]').click();

        // adding a new list
        cy
            .get('[data-cy=add-list]')
            .click();

        cy
            .get('[data-cy=add-list-input]')
            .type('New list{enter}');

        // assert list
        cy
            .get('[data-cy=list]')
            .should('be.visible')

        cy
            .get('[data-cy=list] > .dropdown > .options')
            .click()

        cy
            .get('[data-cy=list] > .dropdown > #myDropdown > .delete')
            .click()

        // assert list does not exist anymore
        cy
            .get('[data-cy=list]')
            .should('not.exist')
    })

    it('I can crete two list with identical tasks, and assert the tasks on the 2nd list', () => {
        // we intercept list creation in order to take the list ID to work with later when creating a different list
        cy.intercept('POST', '/api/lists').as('createList')

        // creating a new board
        cy.get('[data-cy=create-board]').click();
        cy.get('[data-cy=new-board-input]').type('My board{enter}')

        // i want to click on a name of my board... hmm... if only i had a selector for it?
        // hint: look into index.html {{ board.name }} and make a dynamic data-cy
        cy.visit('/')
        cy.get('[data-cy=board-item] > [data-cy="My board"]').click();

        cy
            .get('[data-cy=add-list]')
            .click();

        cy
            .get('[data-cy=add-list-input]')
            .type('New list{enter}');

        cy
            .wait('@createList')
            .its('response')
            .then((data) => {
                // just for shows since we are creating the intial list here
                console.log(data)
            })

        // add 3 tasks (Task 1, Task 2, Task 3) - the elegant, shorter way
        for (let i = 0; i <= 2; i++) {
            cy
                .get('[data-cy=new-task]')
                .click()

            cy
                .get('[data-cy=task-input]')
                .type(`Task ${i + 1}{enter}`);
        }

        cy
            .get('[data-cy=add-list]')
            .click();

        cy
            .get('[data-cy=add-list-input]')
            .type('New list{enter}');

        cy
            .wait('@createList')
            .its('response')
            .then((data) => {
                // create 3 new list items dynamically on the 2nd list
                for (let i = 0; i <= 2; i++) {
                    cy.get(`[data-id=${data.body.id}] > [data-cy=new-task]`).click()
                    cy.get(`[data-id=${data.body.id}] > [data-cy=task-input]`).type(`Task ${i + 1}{enter}`)
                }

                // now we can assert stuff here
                cy
                    .get(`[data-id=${data.body.id}] > [data-cy=tasks-list]`)
                    .children()
                    .should('have.length', 3)
                    .then(($child) => {
                        expect($child[0].innerText).to.eq('Task 1')
                        expect($child[1].innerText).to.eq('Task 2')
                        expect($child[2].innerText).to.eq('Task 3')
                    })
            })
    })
})
