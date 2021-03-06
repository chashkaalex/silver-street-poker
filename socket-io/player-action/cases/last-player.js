const gameVars = require('../../../server-script/game/game-variables');
const game     = require('../../../server-script/game/game');
const allIn    = require('../../../server-script/game/all-in');
const users    = require('../../../server-script/users/users');
const deal     = require('../../../server-script/cards/deal');
const hand     = require('../../../server-script/cards/hand-eval');


const lastPlayer = (io) => {

    let connectedUsers = users.getConnectedUsers();
    let activePlayers = users.getActivePlayers();
    let bettingPlayers = users.getBettingPlayers();
    const deckObj = gameVars.gameDeckObj.get();
    let commCards = gameVars.commCards.get();
    let msg = '';

    allIn.updatePotsAndQues();                    
    const winner = bettingPlayers[0];
    if(activePlayers.some(player => player.isAllIn) && activePlayers.length > 1) {
        gameVars.showdown.set(true);
        //Deal the rest of the community cards
        if(commCards.length < 5) {
            commCards = commCards.concat(deal.dealNCards(deckObj, 5-commCards.length));
            connectedUsers.forEach(user => {
                if(user.hasCards) {
                    const evaledHand = hand.evaluateHand(user.currentHand.concat(commCards));
                    console.log(`${user.userName}'s hand is ${evaledHand.string}`);
                    io.to(user.id).emit('dealing community cards', {commCards, evaledHand: evaledHand.string});        
                } else {
                    io.to(user.id).emit('dealing community cards', {commCards, evaledHand: undefined});
                }
            });
            msg = `Dealing the rest of community cards`;  
            io.emit('updating users', {users: users.getPlayersData(), handPot: gameVars.handPot.get(), msg});
            console.log('Rerendered on dealing the rest of community cards'.yellow);
            gameVars.commCards.set(commCards);
        }
    }
    
    //Award the pots:                   
    msg = allIn.awardAllPots([winner], gameVars.handPot.get());                    
    console.log(`The winner is ${winner.userName}, the pot was ${gameVars.handPot.get()}, stack is now ${winner.stack}`);
    gameVars.handIsRunning.set(false);
    
    //Render after awarding hte pots:
    io.emit('updating users', {users: users.getPlayersData(), handPot: gameVars.handPot.get(), msg});
}

module.exports = lastPlayer;
