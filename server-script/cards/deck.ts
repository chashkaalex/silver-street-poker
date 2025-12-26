const twoOfSpades = { suit: "spades", strength: 1, symbol: '🂢' };
const threeOfSpades = { suit: "spades", strength: 2, symbol: '🂣' };
const fourOfSpades = { suit: "spades", strength: 3, symbol: '🂤' };
const fiveOfSpades = { suit: "spades", strength: 4, symbol: '🂥' };
const sixOfSpades = { suit: "spades", strength: 5, symbol: '🂦' };
const sevenOfSpades = { suit: "spades", strength: 6, symbol: '🂧' };
const eightOfSpades = { suit: "spades", strength: 7, symbol: '🂨' };
const nineOfSpades = { suit: "spades", strength: 8, symbol: '🂩' };
const tenOfSpades = { suit: "spades", strength: 9, symbol: '🂪' };
const jackOfSpades = { suit: "spades", strength: 10, symbol: '🂫' };
const queenOfSpades = { suit: "spades", strength: 11, symbol: '🂭' };
const kingOfSpades = { suit: "spades", strength: 12, symbol: '🂮' };
const aceOfSpades = { suit: "spades", strength: 13, symbol: '🂡' };

const twoOfDiamonds = { suit: "diamonds", strength: 1, symbol: '🃂' };
const threeOfDiamonds = { suit: "diamonds", strength: 2, symbol: '🃃' };
const fourOfDiamonds = { suit: "diamonds", strength: 3, symbol: '🃄' };
const fiveOfDiamonds = { suit: "diamonds", strength: 4, symbol: '🃅' };
const sixOfDiamonds = { suit: "diamonds", strength: 5, symbol: '🃆' };
const sevenOfDiamonds = { suit: "diamonds", strength: 6, symbol: '🃇' };
const eightOfDiamonds = { suit: "diamonds", strength: 7, symbol: '🃈' };
const nineOfDiamonds = { suit: "diamonds", strength: 8, symbol: '🃉' };
const tenOfDiamonds = { suit: "diamonds", strength: 9, symbol: '🃊' };
const jackOfDiamonds = { suit: "diamonds", strength: 10, symbol: '🃋' };
const queenOfDiamonds = { suit: "diamonds", strength: 11, symbol: '🃍' };
const kingOfDiamonds = { suit: "diamonds", strength: 12, symbol: '🃎' };
const aceOfDiamonds = { suit: "diamonds", strength: 13, symbol: '🃁' };

const twoOfClubs = { suit: "clubs", strength: 1, symbol: '🃒' };
const threeOfClubs = { suit: "clubs", strength: 2, symbol: '🃓' };
const fourOfClubs = { suit: "clubs", strength: 3, symbol: '🃔' };
const fiveOfClubs = { suit: "clubs", strength: 4, symbol: '🃕' };
const sixOfClubs = { suit: "clubs", strength: 5, symbol: '🃖' };
const sevenOfClubs = { suit: "clubs", strength: 6, symbol: '🃗' };
const eightOfClubs = { suit: "clubs", strength: 7, symbol: '🃘' };
const nineOfClubs = { suit: "clubs", strength: 8, symbol: '🃙' };
const tenOfClubs = { suit: "clubs", strength: 9, symbol: '🃚' };
const jackOfClubs = { suit: "clubs", strength: 10, symbol: '🃛' };
const queenOfClubs = { suit: "clubs", strength: 11, symbol: '🃝' };
const kingOfClubs = { suit: "clubs", strength: 12, symbol: '🃞' };
const aceOfClubs = { suit: "clubs", strength: 13, symbol: '🃑' };

const twoOfHearts = { suit: "hearts", strength: 1, symbol: '🂲' };
const threeOfHearts = { suit: "hearts", strength: 2, symbol: '🂳' };
const fourOfHearts = { suit: "hearts", strength: 3, symbol: '🂴' };
const fiveOfHearts = { suit: "hearts", strength: 4, symbol: '🂵' };
const sixOfHearts = { suit: "hearts", strength: 5, symbol: '🂶' };
const sevenOfHearts = { suit: "hearts", strength: 6, symbol: '🂷' };
const eightOfHearts = { suit: "hearts", strength: 7, symbol: '🂸' };
const nineOfHearts = { suit: "hearts", strength: 8, symbol: '🂹' };
const tenOfHearts = { suit: "hearts", strength: 9, symbol: '🂺' };
const jackOfHearts = { suit: "hearts", strength: 10, symbol: '🂻' };
const queenOfHearts = { suit: "hearts", strength: 11, symbol: '🂽' };
const kingOfHearts = { suit: "hearts", strength: 12, symbol: '🂾' };
const aceOfHearts = { suit: "hearts", strength: 13, symbol: '🂱' };



const fulldeck = [
    twoOfSpades, threeOfSpades, fourOfSpades, fiveOfSpades, sixOfSpades, sevenOfSpades, eightOfSpades,
    nineOfSpades, tenOfSpades, jackOfSpades, queenOfSpades, kingOfSpades, aceOfSpades,
    twoOfDiamonds, threeOfDiamonds, fourOfDiamonds, fiveOfDiamonds, sixOfDiamonds, sevenOfDiamonds, eightOfDiamonds,
    nineOfDiamonds, tenOfDiamonds, jackOfDiamonds, queenOfDiamonds, kingOfDiamonds, aceOfDiamonds,
    twoOfClubs, threeOfClubs, fourOfClubs, fiveOfClubs, sixOfClubs, sevenOfClubs, eightOfClubs,
    nineOfClubs, tenOfClubs, jackOfClubs, queenOfClubs, kingOfClubs, aceOfClubs,
    twoOfHearts, threeOfHearts, fourOfHearts, fiveOfHearts, sixOfHearts, sevenOfHearts, eightOfHearts,
    nineOfHearts, tenOfHearts, jackOfHearts, queenOfHearts, kingOfHearts, aceOfHearts
];

const getFullDeckObj = () => {
    return { deck: [...fulldeck], deckLen: fulldeck.length }
};

export = {
    getFullDeckObj
};