import gameVars = require('../../../server-script/game/game-variables');
import allIn = require('../../../server-script/game/all-in');
import users = require('../../../server-script/users/users');
import deal = require('../../../server-script/cards/deal');
import hand = require('../../../server-script/cards/hand-eval');


const roundEnded = (io: any) => {

    let connectedUsers = users.getConnectedUsers();
    let activePlayers = users.getActivePlayers();
    const deckObj = gameVars.gameDeckObj.get();
    let commCards = gameVars.commCards.get();
    let msg = '';
    console.log('Ending round properly.');
    console.log(`there are ${commCards.length} community cards now.`);
    switch (commCards.length) {
        case 0:
            //deal flop
            commCards = commCards.concat(deal.dealNCards(deckObj, 3));
            connectedUsers.forEach((user: any) => {
                if (user.hasCards) {
                    console.log(`evaluating ${user.currentHand.concat(commCards).length} cards`);
                    const evaledHand = hand.evaluateHand(user.currentHand.concat(commCards));
                    console.log(`${user.userName}'s hand is ${evaledHand.string}`);
                    io.to(user.id).emit('dealing community cards', { commCards, evaledHand: evaledHand.string });
                } else {
                    io.to(user.id).emit('dealing community cards', { commCards, evaledHand: undefined });
                }
            });
            msg = `Dealing flop`;

            break;
        case 3:
        case 4:
            //deal turn/river        
            commCards.push(deal.dealNCards(deckObj, 1)[0]);
            connectedUsers.forEach((user: any) => {
                if (user.hasCards) {
                    console.log(`evaluating ${user.currentHand.concat(commCards).length} cards`);
                    const evaledHand = hand.evaluateHand(user.currentHand.concat(commCards));
                    console.log(`${user.userName}'s hand is ${evaledHand.string}`);
                    io.to(user.id).emit('dealing community cards', { commCards, evaledHand: evaledHand.string });
                } else {
                    io.to(user.id).emit('dealing community cards', { commCards, evaledHand: undefined });
                }
            });
            msg = commCards.length === 3 ? 'Dealing turn' : 'Dealing river';
            break;
        case 5:
            // End of the hand, showdown, awarding the pot, etc:
            allIn.updatePotsAndQues();

            //Award the winnings
            msg = allIn.awardAllPots(activePlayers, gameVars.handPot.get());
            gameVars.showdown.set(true);
            io.emit('updating users', { users: users.getPlayersData(), handPot: gameVars.handPot.get(), msg });
            gameVars.handIsRunning.set(false);

            return false;
    }
    io.emit('updating users', { users: users.getPlayersData(), handPot: gameVars.handPot.get(), msg });
    console.log('Setting the game variables');
    gameVars.gameDeckObj.set(deckObj);
    gameVars.commCards.set(commCards);
    return true;
}

export = roundEnded;