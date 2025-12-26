import deck = require('../cards/deck');


let gameDeckObj = deck.getFullDeckObj();
const getGameDeckObj = () => {
    return gameDeckObj;
};

const setGameDeckObj = (deckObj: any) => {
    gameDeckObj = deckObj;
};

let handPot = 0;
const getHandPot = () => {
    return handPot;
};

const setHandPot = (newHandPot: number) => {
    handPot = newHandPot;
};

let smallBlind = 1;

const getSmallBlind = () => {
    return smallBlind;
};

const setSmallBlind = (newSmallBlind: number) => {
    smallBlind = newSmallBlind;
};

let commCards: any[] = [];

const getCommCards = () => {
    return commCards;
};

const setCommCards = (newCommCards: any[]) => {
    commCards = newCommCards;
};

let roundAllInQue: any[] = [];

const addRoundAllInQue = (allInData: any) => {
    roundAllInQue.push(allInData);
};

const getRoundAllInQue = () => {
    return roundAllInQue;
};

const resetRoundAllInQue = () => {
    roundAllInQue = []
};

let handAllInQue: any[] = [];

const addHandAllInQue = (allInData: any) => {
    handAllInQue.push(allInData);
};

const getHandAllInQue = () => {
    return handAllInQue;
};

const resetHandAllInQue = () => {
    handAllInQue = [];
};

let firstDealer: any;
const setFirstDealer = (dealer: any) => {
    firstDealer = dealer;
};

const getFirstDealer = () => {
    return firstDealer;
};

let potResidue = 0;
const setPotResidue = (residue: number) => {
    potResidue = residue;
    ;
}

const getPotResidue = () => {
    return potResidue;
};

let foldCounter = 0
const setFoldCounter = (newCounter: number) => {
    foldCounter = newCounter;
}

const getFoldCounter = () => {
    return foldCounter;
};

let handIsRunning = false;
const setHandIsRunning = (value: boolean) => {
    handIsRunning = value;
};

const getHandIsRunning = () => {
    return handIsRunning;
};

let showdown = false;
const getShowdown = () => {
    return showdown;
};

const setShowdown = (value: boolean) => {
    showdown = value;
};

let landingMessage = 'Please input your name below';
const setLandingMessage = (newMessage: string) => {
    landingMessage = newMessage;
};

const getLandingMessage = () => {
    return landingMessage;
};

let usersBackup: any[] = [];

const setUsersBackup = (newBackup: any[]) => {
    usersBackup = newBackup;
};

const getUsersBackup = () => {
    return usersBackup;
};

let gameLocked = false;
const toggleGameLocked = () => {
    gameLocked = !gameLocked;
    return gameLocked;
};

const getGameLocked = () => {
    return gameLocked;
}

let managerSocket: any = undefined;
const getManagerSocket = () => {
    return managerSocket;
};

const setManagerSocket = (socket: any) => {
    managerSocket = socket;
};


export = {
    gameDeckObj: { set: setGameDeckObj, get: getGameDeckObj },
    handPot: { set: setHandPot, get: getHandPot },
    smallBlind: { set: setSmallBlind, get: getSmallBlind },
    commCards: { set: setCommCards, get: getCommCards },
    roundAllInQue: { add: addRoundAllInQue, get: getRoundAllInQue, reset: resetRoundAllInQue },
    handAllInQue: { add: addHandAllInQue, get: getHandAllInQue, reset: resetHandAllInQue },
    firstDealer: { set: setFirstDealer, get: getFirstDealer },
    potResidue: { set: setPotResidue, get: getPotResidue },
    foldCounter: { set: setFoldCounter, get: getFoldCounter },
    handIsRunning: { set: setHandIsRunning, get: getHandIsRunning },
    showdown: { set: setShowdown, get: getShowdown },
    landingMessage: { set: setLandingMessage, get: getLandingMessage },
    usersBackup: { set: setUsersBackup, get: getUsersBackup },
    managerSocket: { get: getManagerSocket, set: setManagerSocket },
    gamelock: { get: getGameLocked, toggle: toggleGameLocked }
};