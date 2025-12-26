import 'colors';

import users = require('../../server-script/users/users');
import deal = require('../../server-script/cards/deal');
import hand = require('../../server-script/cards/hand-eval');
import deck = require('../../server-script/cards/deck');
import game = require('../../server-script/game/game');
import gameVars = require('../../server-script/game/game-variables');



export = function (io: any) {
    io.on('connection', (socket: any) => {
        socket.on('play hand', (msg: string) => {
            console.log('hand running status is ', gameVars.handIsRunning.get());
            if (gameVars.handIsRunning.get()) {
                console.log('hacking detected');
                return;
            } else {
                gameVars.handIsRunning.set(true);
            }

            //Define who is in play and check if it is possible to play:
            const playingUsers = users.getPlayingUsers();
            if (playingUsers.length < 2) {
                console.log('Too few players, cannot proceed.');
                return;
            }

            //Backup the users state:
            gameVars.usersBackup.set(
                JSON.parse(
                    JSON.stringify(
                        users.getAllUsers()
                    )
                )
            );
            console.log(`Created the backup. number of users is , ${gameVars.usersBackup.get().length}`.blue);

            //Reset the showdown state:
            gameVars.showdown.set(false);

            //Identify the acting player
            const thisPlayer = users.getUserFromId(socket.id);
            console.log(thisPlayer.userName.blue + ': ' + msg.magenta);

            //Get fresh deck and reset game variables
            gameVars.commCards.set([]);                 //resetting community cards
            const deckObj = deck.getFullDeckObj();      //getting a fresh deck of cards

            //Remove old cards
            io.emit('empty the table', 'dumpem');

            //Reset user states
            users.resetUsersState();



            //Make sure that there is a dealer, move it to the next user and update the blind bet if needed
            const oldDealer = users.getDealer();
            if (oldDealer) {
                const newDealer = users.getNextDealer();
                newDealer.isDealer = true;
                oldDealer.isDealer = false;
                if (newDealer.userName === gameVars.firstDealer.get().userName) {
                    gameVars.smallBlind.set(gameVars.smallBlind.get() + 1);
                }
                console.log(`${newDealer.userName} is now a dealer`);
            } else {
                playingUsers[0].isDealer = true;
                gameVars.firstDealer.set(playingUsers[0]);
                console.log(`${playingUsers[0].userName} is now a dealer`);
            }

            //Reset pot and put in a residue
            gameVars.handPot.set(gameVars.potResidue.get());        //resetting the hand pot
            gameVars.potResidue.set(0);
            const dealer = users.getDealer();

            //Betting small blind
            const smallBlind = gameVars.smallBlind.get();
            const bigBlind = smallBlind * 2
            let blindPlayer = game.getNextPlayerById(playingUsers, dealer.id);
            if (blindPlayer.stack > smallBlind) {
                blindPlayer.stack -= smallBlind;
                blindPlayer.roundBet += smallBlind;
            } else {
                game.updateOnAllIn(blindPlayer, blindPlayer.stack)
            }

            //Betting big blind
            blindPlayer = game.getNextPlayerById(playingUsers, blindPlayer.id);
            if (blindPlayer.stack > bigBlind) {
                blindPlayer.stack -= bigBlind;
                blindPlayer.roundBet += bigBlind;
            } else {
                game.updateOnAllIn(blindPlayer, blindPlayer.stack)
            }

            //deal hole cards
            playingUsers.forEach(user => {
                user.currentHand = deal.dealNCards(deckObj, 2);
                user.hasCards = true;
                const evaledHand = hand.evaluateHand(user.currentHand);
                //console.log(`${user.userName}'s hand is ${evaledHand.string}`);
                io.to(user.id).emit('dealing hole cards', { userHoleCards: user.currentHand, evaledHand: evaledHand.string });
            });
            gameVars.gameDeckObj.set(deckObj);      //updating the game deck 

            //Rerendering screen and urging the user to act
            const actingPlayer = game.getNextPlayerById(playingUsers, blindPlayer.id);
            actingPlayer.acting = true;
            io.emit('updating users', { users: users.getPlayersData(), handpot: gameVars.handPot.get(), msg: 'Dealing hole cards' });
            console.log('Rerendered on dealing hole cards'.yellow);
            io.to(actingPlayer.id).emit('time to act', `ACT`);
        });
    });
};