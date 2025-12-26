import gameVars = require('../../server-script/game/game-variables');
import game = require('../../server-script/game/game');
import users = require('../../server-script/users/users');

import lastPlayer = require('./cases/last-player');
import everyoneAllIn = require('./cases/everyone-all-in');

const allInAction = (io: any, socket: any, bet: number) => {
    let activePlayers = users.getActivePlayers();
    let bettingPlayers = users.getBettingPlayers();
    const thisPlayer = activePlayers.find((player: any) => player.id === socket.id);

    //let bettingPot = gameVars.bettingPot.get();

    game.updateOnAllIn(thisPlayer, bet);


    //check if all the players are now 'all-in':
    if (activePlayers.every((user: any) => user.isAllIn)) {
        console.log('Everyone are all in!!!!!');
        everyoneAllIn(io);
        gameVars.handIsRunning.set(false);
        return false;
    }

    //Check if everyone folded except the winner, no showdown except all-ins
    bettingPlayers = users.getBettingPlayers();
    if (bettingPlayers.length === 1) {
        const last = bettingPlayers[0]
        let maxBet = game.getMaxBet();
        if (last.acted || last.roundBet === maxBet) {
            lastPlayer(io);
            return false;
        }
    }


    return true;
};

export = allInAction;