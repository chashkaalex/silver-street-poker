
import allIn from '../server-script/game/all-in';
import gameVars from '../server-script/game/game-variables';
import users from '../server-script/users/users';

// Mock dependencies
jest.mock('../server-script/users/users');
jest.mock('../server-script/game/game-variables');
jest.mock('../server-script/cards/hand-eval', () => ({
    getWinners: jest.fn()
}));

const mockGetWinners = require('../server-script/cards/hand-eval').getWinners;


describe('All-In Logic Tests', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        // Reset game variables mocks
        (gameVars.roundAllInQue.get as jest.Mock).mockReturnValue([]);
        (gameVars.handAllInQue.get as jest.Mock).mockReturnValue([]);
        (gameVars.handPot.get as jest.Mock).mockReturnValue(0);
        (gameVars.potResidue.set as jest.Mock).mockImplementation(() => { });
    });

    test('should correctly calculate pot residue for single winner', () => {
        const players = [{ userName: 'Winner', stack: 100 }];
        const commCards: any[] = [];
        const mainPot = 100;

        (gameVars.handAllInQue.get as jest.Mock).mockReturnValue([]);
        (gameVars.commCards.get as jest.Mock).mockReturnValue(commCards);

        mockGetWinners.mockReturnValue(players); // Winner wins everything

        // Mock gameVars setters/getters 
        let currentResidue = 0;
        (gameVars.potResidue.set as jest.Mock).mockImplementation((val) => { currentResidue = val; });

        allIn.awardAllPots(players, mainPot);

        // Residue is 0, so it should NOT be set (efficiency check)
        expect(gameVars.potResidue.set).not.toHaveBeenCalled();
    });

    test('should handling odd splits correctly', () => {
        const players = [{ userName: 'Winner1', stack: 0 }, { userName: 'Winner2', stack: 0 }, { userName: 'Winner3', stack: 0 }];
        const commCards: any[] = [];
        const mainPot = 100;

        (gameVars.handAllInQue.get as jest.Mock).mockReturnValue([]);
        (gameVars.commCards.get as jest.Mock).mockReturnValue(commCards);

        mockGetWinners.mockReturnValue(players); // 3 way split

        // Mock gameVars setters/getters 
        let currentResidue = 0;
        (gameVars.potResidue.set as jest.Mock).mockImplementation((val) => { currentResidue = val; });

        allIn.awardAllPots(players, mainPot);

        // 100 / 3 = 33 each, 1 remainder
        expect(gameVars.potResidue.set).toHaveBeenCalledWith(1);

        // Check stacks (mocked logic in awardAllPots modifies objects directly)
        expect(players[0].stack).toBe(33);
        expect(players[1].stack).toBe(33);
        expect(players[2].stack).toBe(33);

    });

    test('should NOT produce NaN when splitting side pots (The Bug Fix Verification)', () => {
        // This test simulates the condition that caused the NaN bug
        // Scenario: Side pot of 100, 2 winners. 
        // Bug was: pots (array) / winnerSet.length -> NaN

        const sidePotAmount = 100;
        const player1 = { userName: 'P1', stack: 0, sidePot: sidePotAmount };
        const player2 = { userName: 'P2', stack: 0, sidePot: 100 }; // just for context

        // Setup handshake queue for side pot
        (gameVars.handAllInQue.get as jest.Mock).mockReturnValue([
            { player: player1, sidePot: sidePotAmount }
        ]);

        const players = [player1, player2]; // Both win this sidepot
        mockGetWinners.mockReturnValue(players);

        // Run logic
        allIn.awardAllPots([], 0); // No main pot, just side pot processing

        // Verify stacks are numbers, not NaN
        expect(player1.stack).toBe(50);
        expect(player2.stack).toBe(50);
        expect(Number.isNaN(player1.stack)).toBe(false);
    });

});
