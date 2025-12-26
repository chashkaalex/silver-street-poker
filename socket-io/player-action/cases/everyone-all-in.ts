import gameVars = require('../../../server-script/game/game-variables');
import allIn = require('../../../server-script/game/all-in');
import users = require('../../../server-script/users/users');
import deal = require('../../../server-script/cards/deal');
import hand = require('../../../server-script/cards/hand-eval');

const everyoneAllIn = (io: any) => {
    let connectedUsers = users.getConnectedUsers();
    const deckObj = gameVars.gameDeckObj.get();
    let commCards = gameVars.commCards.get();
    let msg = '';

    //Deal the rest of the community cards if needed
    if (commCards.length < 5) {
        commCards = commCards.concat(deal.dealNCards(deckObj, 5 - commCards.length));
        connectedUsers.forEach((user: any) => {
            if (user.hasCards) {
                const evaledHand = hand.evaluateHand(user.currentHand.concat(commCards));
                console.log(`${user.userName}'s hand is ${evaledHand.string}`);
                io.to(user.id).emit('dealing community cards', { commCards, evaledHand: evaledHand.string });
            } else {
                io.to(user.id).emit('dealing community cards', { commCards, evaledHand: undefined });
            }
        });
        msg = `Dealing the rest of community cards`;
        io.emit('updating users', { users: users.getPlayersData(), handPot: gameVars.handPot.get(), msg });
        gameVars.commCards.set(commCards);
    }


    //Move the round all-in's to the hand all-in's and disperse the hand pot to the side pots 
    allIn.updatePotsAndQues();

    //Award the winnings
    msg = allIn.awardAllPots([], gameVars.handPot.get());
    gameVars.showdown.set(true);
    io.emit('updating users', { users: users.getPlayersData(), handPot: gameVars.handPot.get(), msg });
};

export = everyoneAllIn;
