
const dealNCards = (deckObj, n) => {
    const result = [];
    for (let i = 0; i < n; i++) {
        const randCard = Math.floor(Math.random() * deckObj.deckLen)
        result.push(deckObj.deck[randCard]);
        [deckObj.deck[randCard], deckObj.deck[deckObj.deckLen - 1]] = [deckObj.deck[deckObj.deckLen - 1], deckObj.deck[randCard]];
        deckObj.deckLen--;
        // console.log(deckObj.deckLen);
    }
    return result;
};

export = {
    dealNCards
};