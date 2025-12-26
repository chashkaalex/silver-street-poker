//Suits definitions:
const suitsArray = ['spades', 'clubs', 'diamonds', 'hearts'];

const suitIdx = (suit) => {
	return suitsArray.indexOf(suit);
};

const suitFromIdx = (idx) => {
	return suitsArray[idx];
};

// Card strength definitions:
const cardStrengthArray = ['Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Jack', 'Queen', 'King', 'Ace'];

const getStrName = (str) => {
	return cardStrengthArray[str - 1];
};


const evaluateHand = (hand) => {
	let evaluator = 0;
	let string = '';
	const suitLut = Array(4).fill(0);
	const strengthLut = Array(13).fill(0);
	hand.forEach((card) => {
		suitLut[suitIdx(card.suit)]++;
		strengthLut[card.strength - 1]++;
	});
	let kicker = strengthLut.lastIndexOf(1);

	//Flush and Straight-Flush
	const flushSuit = suitLut.findIndex(num => num >= 5);
	if (flushSuit >= 0) {
		const suitedCards = hand.filter((card) => card.suit === suitFromIdx(flushSuit));
		const suitedStrengths = suitedCards.map(card => card.strength);
		const topCardStrength = suitedStrengths.sort((a, b) => b - a)[0];
		const straightCheck = handIsStraight(suitedCards);
		if (straightCheck) {
			evaluator = 9000000 + straightCheck * 10000;
			string = `Straight Flush from ${getStrName(straightCheck)}`;
			// console.log(`This hand is ${string}, evaluator - ${evaluator}`);
			return ({ evaluator, string });
		}
		evaluator = 6000000 + topCardStrength * 10000;
		string = `Flush from ${getStrName(topCardStrength)}`;
		// console.log(`This hand is ${string}, evaluator - ${evaluator}`);
		return ({ evaluator, string });
	}

	//Straight
	const straightCheck = handIsStraight(hand);
	if (straightCheck) {
		evaluator = 5000000 + straightCheck * 10000;
		string = `Straight from ${getStrName(straightCheck)}`;
		// console.log(`This hand is ${string}, evaluator - ${evaluator}`);
		return ({ evaluator, string });
	}

	//Four of a kind
	const fourOfaKindCheck = strengthLut.findIndex(num => num === 4);
	if (fourOfaKindCheck >= 0) {
		strengthLut.forEach((str, idx) => {
			if (str < 4 && str > 0 && idx > kicker) {
				kicker = idx;
			}
		});
		evaluator = 8000000 + (fourOfaKindCheck + 1) * 10000 + kicker;
		string = `Four of a kind of ${getStrName(fourOfaKindCheck + 1)}, the kicker is ${getStrName(kicker + 1)}`;
		// console.log(`This hand is ${string}, evaluator - ${evaluator}`);
		return ({ evaluator, string });
	}

	//Three of a kind and Full House
	let threeOfaKindCheck = 0;
	strengthLut.forEach((str, idx) => {
		if (str === 3 && idx > threeOfaKindCheck) {
			threeOfaKindCheck = idx;
			//console.log('Found three of a kind with a str of ', threeOfaKindCheck);
		}
	});
	if (threeOfaKindCheck) {
		let additionalPairCheck = 0;
		strengthLut.forEach((str, idx) => {
			if (str >= 2 && idx !== threeOfaKindCheck) {
				additionalPairCheck = idx;
				//console.log('Found additional pair of a kind with a str of ', additionalPairCheck);
			}
		});
		if (additionalPairCheck) {
			evaluator = 7000000 + (threeOfaKindCheck + 1) * 10000 + (additionalPairCheck + 1) * 100;
			string = `Full House on ${getStrName(threeOfaKindCheck + 1)} and ${getStrName(additionalPairCheck + 1)}`;
			// console.log(`This hand is ${string}, evaluator - ${evaluator}`);
			return ({ evaluator, string });
		}
		evaluator = 4000000 + (threeOfaKindCheck + 1) * 10000 + kicker;
		string = `Three of a kind of ${getStrName(threeOfaKindCheck + 1)}, the kicker is ${getStrName(kicker + 1)}`
		// console.log(`This hand is ${string}, evaluator - ${evaluator}`);
		return ({ evaluator, string });
	}

	//Pair and Two pair
	const pairStack = [];
	strengthLut.forEach((str, idx) => {
		if (str === 2) {
			pairStack.push(idx);
		}
	});
	if (pairStack.length > 1) {
		if (pairStack.length === 3 && pairStack[0] > kicker) {
			kicker = pairStack[0];
		}
		evaluator = 3000000 + (pairStack[pairStack.length - 1] + 1) * 10000 + (pairStack[pairStack.length - 2] + 1) * 100 + kicker;;
		string = `Two pair of ${getStrName(pairStack[pairStack.length - 1] + 1)}s and ${getStrName(pairStack[pairStack.length - 2] + 1)}s, the kicker is ${getStrName(kicker + 1)}`;
		// console.log(`This hand is ${string}, evaluator - ${evaluator}`);
		return ({ evaluator, string });
	} else if (pairStack.length === 1) {
		evaluator = 2000000 + (pairStack[0] + 1) * 10000 + kicker;
		string = `Pair of ${getStrName(pairStack[0] + 1)}s, the kicker is ${getStrName(kicker + 1)}`;
		if (hand.length === 2) {
			string = `Pair of ${getStrName(pairStack[0] + 1)}s`;
		}
		// console.log(`This hand is ${string}, evaluator - ${evaluator}`);
		return ({ evaluator, string });
	}

	//Highcard
	return { evaluator: kicker, string: `Highcard ${getStrName(kicker + 1)}` };


};

const handIsStraight = (hand) => {
	const handStrengths = hand.map(card => card.strength);
	handStrengths.sort((a, b) => a - b);
	let topCardStrength = undefined;
	let counter = 0;
	for (let i = 1; i < handStrengths.length; i++) {
		//debugger;
		const diff = handStrengths[i] - handStrengths[i - 1];
		if (diff === 1) {
			counter++;
		}
		else if (diff > 1) {
			counter = 0;
		}
		if (counter >= 4) {
			topCardStrength = handStrengths[i];
		}
	}
	if (!topCardStrength &&
		handStrengths.includes(13) &&
		handStrengths.includes(1) &&
		handStrengths.includes(2) &&
		handStrengths.includes(3) &&
		handStrengths.includes(4)) {
		return 4;
	}
	return topCardStrength;
};

const getWinners = (players, commCards) => {
	const handEvals = [];
	//console.log('Finishing players: ', players);
	players.forEach(player => {
		const fullHand = player.currentHand.concat(commCards);
		//console.log(`${player.userName}'s hand: `, fullHand);
		const evalutation = evaluateHand(fullHand);
		//console.log(evalutation);
		handEvals.push({
			name: player.userName,
			eval: evalutation.evaluator
		});
	});
	handEvals.sort((a, b) => (a.eval - b.eval));
	//console.log('Evaluations:', handEvals.map(handEval => handEval.name + ' - ' + handEval.eval).join(', '));
	const winEvals = handEvals.filter(data => data.eval === handEvals[handEvals.length - 1].eval);
	const winners = players.filter(player => winEvals.map(winEval => winEval.name).includes(player.userName));
	console.log('Winners: ', winners.map(winner => winner.userName).join(' , '));
	return winners;
}


export = { evaluateHand, getWinners };