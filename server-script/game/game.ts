import 'colors';

import gameVars = require('./game-variables');
import users = require('../users/users');

const getNextPlayerById = (players: any[], thisPlayerId: string) => {
    const thisPlayerIdx = players.findIndex((player: any) => player.id === thisPlayerId);
    if (thisPlayerIdx === players.length - 1) {
        return players[0];
    } else {
        return players[thisPlayerIdx + 1];
    }
};

const getMaxBet = () => {
    const activePlayers = users.getActivePlayers();
    return Math.max(...activePlayers.map((player: any) => player.roundBet));
}

const updateOnRaise = (player: any) => {
    console.log('This was a raise, resetting "acted" property');
    const bettingPLayers = users.getBettingPlayers();
    bettingPLayers.forEach((bettingPlayer: any) => {
        if (bettingPlayer.userName !== player.userName) {
            bettingPlayer.acted = false;
        }
    });
};

const updateOnFold = (player: any) => {
    player.hasCards = false;
    player.currentHand = [];
    player.folded = true;
    player.acted = true;
};

const updateOnAllIn = (player: any, bet: number) => {
    player.acted = true;
    player.isAllIn = true;
    player.stack = 0;
    player.roundBet += bet;
    gameVars.roundAllInQue.add({ player, bet: player.roundBet });
};

const roundEndCheck = () => {
    console.log('Round end check fired');
    users.getBettingPlayers().forEach((user: any) => {
        console.log(`${user.userName} - is acted: ${user.acted}`);
    });
    const bettingPLayers = users.getBettingPlayers();
    return bettingPLayers.every((player: any) => player.acted);
};




export = {
    getMaxBet,
    getNextPlayerById,
    updateOnRaise,
    updateOnFold,
    updateOnAllIn,
    roundEndCheck,
};