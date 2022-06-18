import Boards from '../support/classes/boards';
const boards = new Boards();

describe('Plugins', () => {
    beforeEach(() => {
        boards.setupTests({
            resetDB: true
        });
    });

    it('Can fetch data from backend and create a new board', () => {
        
    });
})