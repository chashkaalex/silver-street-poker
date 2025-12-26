import users = require('../../server-script/users/users');
import game = require('../../server-script/game/game');
import gameVars = require('../../server-script/game/game-variables');
import allIn = require('../../server-script/game/all-in');

import roundEnded = require('../player-action/cases/round-ended');

export = function (io: any) {
    io.on('connection', (socket: any) => {
        socket.on('remove user', (rmUserName: string) => {
            if (socket.id === gameVars.managerSocket.get()) {
                console.log('user to remove: ', rmUserName);
                const idToRemove = users.removeUser(rmUserName);
                if (idToRemove) {
                    console.log('id to remove is ', idToRemove);
                    gameVars.landingMessage.set('You have been removed from the game by game manager.');
                    io.to(idToRemove).emit('relogin', 'please relogin');
                    console.log(`Successfully removed ${rmUserName}`.red);
                } else {
                    console.log('Name not found');
                }

                io.emit('updating users', { users: users.getPlayersData(), handPot: gameVars.handPot.get() });
            }
            else {
                console.log('Management hacking detected');
                return;
            }
        });

        socket.on('toggle game lock', () => {
            if (socket.id === gameVars.managerSocket.get()) {
                const gameLock = gameVars.gamelock.toggle();
                if (gameLock) {
                    console.log('Game is now locked'.magenta);
                } else {
                    console.log('Game is now unlocked'.green);
                }
            }
            else {
                console.log('Management hacking detected');
                return;
            }
        });

        socket.on('rebuy user', (rebuyUserName: string) => {
            if (socket.id === gameVars.managerSocket.get()) {
                users.rebuyUser(rebuyUserName);
            }
            else {
                console.log('Management hacking detected');
                return;
            }
            io.emit('updating users', { users: users.getPlayersData(), handPot: gameVars.handPot.get() });
        });

        socket.on('pass move on', () => {
            if (socket.id === gameVars.managerSocket.get()
                && gameVars.handIsRunning.get()) {
                let actingUser = users.getAllUsers().find(user => user.acting);
                const bettingPlayers = users.getBettingPlayers();
                const maxBet = game.getMaxBet();
                let handPot = gameVars.handPot.get();
                let msg = `${actingUser.userName}: `;
                if (actingUser.roundBet >= maxBet) {
                    //check
                    actingUser.acted = true;
                    msg += 'check';
                } else {
                    //fold
                    game.updateOnFold(actingUser);
                    msg += 'fold';
                }

                actingUser.acting = false;
                io.to(actingUser.id).emit('lost the move', '');

                if (game.roundEndCheck()) {
                    console.log('betting round is complete');
                    if (!roundEnded(io)) {
                        console.log('the hand has ended!');
                        return;
                    }

                    //Updating all-in ques if necessary and moving the bets to the hand pot:
                    allIn.updatePotsAndQues()
                    handPot = gameVars.handPot.get();
                    io.emit('updating users', { users: users.getPlayersData(), handPot, msg: undefined });
                    console.log('Rerendered on round end'.yellow);
                    console.log(`handpot is now ${handPot}`);
                    actingUser = users.getNextToDealer();
                } else {
                    actingUser = game.getNextPlayerById(bettingPlayers, actingUser.id);
                }
                actingUser.acting = true;
                io.emit('updating users', { users: users.getPlayersData(), handPot, msg });
                io.to(actingUser.id).emit('time to act', `ACT`);
            }
            else {
                console.log('Management hacking detected');
                return;
            }
            io.emit('updating users', { users: users.getPlayersData(), handPot: gameVars.handPot.get() });
        });
    });
};