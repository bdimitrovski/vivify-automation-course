require('@4tw/cypress-drag-drop');
import 'cypress-file-upload';
import 'cypress-real-events/support';

import './commands';

beforeEach(() => {
    Cypress.env('boards', []);
    Cypress.env('lists', []);
    Cypress.env('tasks', []);
    Cypress.env('users', []);
});
