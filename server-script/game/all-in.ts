import 'colors';
import gameVars = require('./game-variables');
import hand = require('../cards/hand-eval');
import users = require('../users/users');


const updatePotsAndQues = () => {
    const roundAllInQue = gameVars.roundAllInQue.get();
    let handPot = gameVars.handPot.get();
    if (roundAllInQue.length) {
        roundAllInQue.sort((a: any, b: any) => (a.bet - b.bet));

        console.log(`Main pot (${handPot}) is moved to the ${roundAllInQue[0].player.userName}'s sidepot`);
        roundAllInQue[0].player.sidePot += handPot;

        //Moving the bets to call the sidepots:
        roundAllInQue.forEach((allInData: any, allInIdx: number) => {
            let prevAllInBet = 0;
            users.getAllUsers().forEach((user: any) => {
                if (allInIdx > 0) {
                    prevAllInBet = roundAllInQue[allInIdx - 1].bet;
                }
                if (user.roundBet > allInData.bet - prevAllInBet) {
                    allInData.player.sidePot += allInData.bet - prevAllInBet;
                    user.roundBet -= allInData.bet - prevAllInBet;
                } else {
                    allInData.player.sidePot += user.roundBet;
                    user.roundBet = 0;
                }
            });
            gameVars.handAllInQue.add({ player: allInData.player, sidePot: allInData.player.sidePot });
        });
    }

    //Moving the remaining bets into the main pot:
    users.getAllUsers().forEach((user: any) => {
        handPot += user.roundBet;
        console.log('updating handpot'.green);
        user.roundBet = 0;
        user.acted = false;
    });

    gameVars.handPot.set(handPot);
    gameVars.roundAllInQue.reset();
    console.log('After updating pots and ques, this side pots are:');
    console.log(users.getActivePlayers().map((user: any) => user.sidePot).join(' , '));
};

const awardAllPots = (mainWinners: any[], mainPot: any) => {
    let message = 'Hand is ended. ';
    const commCards = gameVars.commCards.get();
    const handAllInQue = gameVars.handAllInQue.get();
    console.log(`There are ${handAllInQue.length} all-in players.`)
    const pots = handAllInQue.map((data: any) => data.sidePot);
    let players = handAllInQue.map((data: any) => data.player);
    const checkedPlayers: any[] = [];
    if (mainWinners.length) {
        players = players.concat(mainWinners);
        console.log(`Adding the main pot (${mainPot}$)`);
        pots.push(mainPot);
    }
    console.log(`After updating the state, there are ${pots.length} pots to award and ${players.length} potential winners`);
    pots.forEach((pot: any, idx: number) => {
        const winnerSet = hand.getWinners(players, commCards);

        if (idx === pots.length - 1 && mainPot) {
            console.log(`This is the main pot, it is ${pot}$ strong.`);
            console.log(`There are ${winnerSet.length} winners.`),
                console.log(`Each one will get ${Math.floor(pot / winnerSet.length)} $.`);
            const potResidue = pot - (winnerSet.length * Math.floor(pot / winnerSet.length));
            console.log(`The residue will be ${potResidue}.`);
            if (potResidue) {
                gameVars.potResidue.set(potResidue);
            }
            winnerSet.forEach((potWinner: any) => {
                potWinner.stack += Math.floor(pot / winnerSet.length);
                console.log(`After awarding the ${potWinner.userName}'s stack is ${potWinner.stack}`);
            });
            message += `Main pot (${pot}) goes to: \n${winnerSet.map((winner: any) => winner.userName).join(',\n')}.`;
        } else {
            console.log(`Winners of the ${players[0].userName}'s side pot (${pot}$ strong) : `, winnerSet.map((winner: any) => winner.userName));
            if (winnerSet.map((winner: any) => winner.userName).includes(players[0].userName)) {
                console.log(`${players[0].userName} is among the winners!`)
                winnerSet.forEach((potWinner: any) => {
                    potWinner.stack += Math.floor(pot / winnerSet.length);
                    console.log(`${potWinner.userName}'s stack is now ${potWinner.stack}`);
                });
                message += `${players[0].userName}'s sidepot (${pot}) goes to: 
                           \n ${winnerSet.map((winner: any) => winner.userName).join(', \n')}\n`;

            } else {
                console.log('Sidepot owner is not among the winners. Spilling this pot to the next one');
                pots[idx + 1] += pot;
            }
        }
        checkedPlayers.push(players.shift());
    });
    gameVars.handAllInQue.reset();

    //Update small blind on a bust:
    let smallBlind = gameVars.smallBlind.get();
    smallBlind += checkedPlayers.filter(player => player.stack === 0).length;
    gameVars.smallBlind.set(smallBlind);

    return message;
};



export = {
    updatePotsAndQues,
    awardAllPots
};