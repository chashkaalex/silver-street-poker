import gameVars = require('../game/game-variables');

let users: any[] = [];

const getAllUsers = () => {
    return users;
};

const setAllUsers = (newUsers: any[]) => {
    users = newUsers;
};

const getConnectedUsers = () => {
    return users.filter(user => user.status === 'connected');
};

const getActivePlayers = () => {
    return users.filter(user => user.hasCards
        // && user.status === 'connected'
    );
};

const getPlayingUsers = () => {
    return users.filter(user =>
        user.status === 'connected'
        && user.stack > 0);
};

const getBettingPlayers = () => {
    return users.filter(user =>
        user.hasCards &&
        user.stack > 0 &&
        !user.isAllIn);
};

const getDealer = () => {
    return users.find(player => player.isDealer);
};

const getNextDealer = () => {
    const dealerIdx = users.findIndex(player => player.isDealer);
    for (let i = 0; i < users.length; i++) {
        const thisUser = users[(dealerIdx + i + 1) % users.length];
        if (thisUser.stack) {
            return thisUser;
        }
    }
    console.log('somethis gone WRONG.');
};

const getNextToDealer = () => {
    const connectedUsers = getConnectedUsers();
    const dealerIdx = connectedUsers.findIndex(player => player.isDealer);
    for (let i = 0; i < connectedUsers.length; i++) {
        if (connectedUsers[(dealerIdx + i + 1) % connectedUsers.length].hasCards) {
            return connectedUsers[(dealerIdx + i + 1) % connectedUsers.length];
        }
    }
    console.log('somethis gone WRONG.');
};

const getNewFirstDealer = () => {
    const connectedUsers = getConnectedUsers();
    const dealerIdx = connectedUsers.findIndex(player => player.isDealer);
    for (let i = 0; i < connectedUsers.length; i++) {
        if (connectedUsers[(dealerIdx + i + 1) % connectedUsers.length].stack > 0) {
            return connectedUsers[(dealerIdx + i + 1) % connectedUsers.length];
        }
    }
    console.log('something gone WRONG.');
};


const addUser = (user: any) => {
    users.push({
        userName: user.userName,
        id: user.id,
        status: 'connected',
        stack: 150,
        hasCards: false,
        isDealer: false,
        isAllIn: false,
        acting: false,
        roundBet: 0,
        sidePot: 0,
        acted: false,
        folded: false,
        currentHand: []

    });
    console.log('Added a user. Number of connected user is now: ', users.filter(user => user.status === 'connected').length);
};

const getUsersPublicData = () => {
    return users.map(user => {
        return {
            userName: user.userName,
            status: user.status,
            stack: user.stack,
            hasCards: user.hasCards,
            isDealer: user.isDealer,
            isAllIn: user.isAllIn,
            acting: user.acting,
            roundBet: user.roundBet,
            sidePot: user.sidePot,
            acted: user.acted,
            folded: user.folded,
        };
    });
};

const getUsersShowdownData = () => {
    return getAllUsers().map(user => {
        return {
            userName: user.userName,
            stack: user.stack,
            status: user.status,
            hasCards: user.hasCards,
            isDealer: user.isDealer,
            currentHand: user.currentHand
        };
    });
};

const getPlayersData = () => {
    const showdown = gameVars.showdown.get();
    if (showdown) {
        return getUsersShowdownData();
    } else {
        return getUsersPublicData();
    }
};

const removeUser = (nameToRemove: string) => {
    let idToRemove = '';
    for (const [idx, user] of users.entries()) {
        if (user.userName === nameToRemove) {
            idToRemove = user.id;
            users.splice(idx, 1);
            break;
        }
    }
    return idToRemove;
};

const rebuyUser = (name: string) => {
    for (const user of users) {
        if (user.userName === name) {
            if (user.stack) {
                console.log('You cannot rebuy a user that still has money');
                return;
            }
            user.stack = 75;
            break;
        }
    }
};

const disconnectUser = (userId: string) => {
    for (let i = 0; i < users.length; i++) {
        if (users[i].id === userId) {
            users[i].status = 'disconnected';
            console.log('updated status to disconnected');
        }
    }
    console.log('Removed a user. Number of connected user is now: ', users.filter(user => user.status === 'connected').length);
};

const getUserFromId = (userId: string) => {
    return users.find(user => user.id === userId)
};


const connectUser = (newUser: any) => {
    const exsitingUser = users.find(user => user.userName === newUser.userName);
    if (!exsitingUser) {
        console.log('This is a new user, pushing in.')
        addUser(newUser);
    } else if (exsitingUser.status === 'connected') {
        return 'user is connected';
    } else {
        console.log('reconnecting user');
        exsitingUser.id = newUser.id;
        exsitingUser.status = 'connected';
    }
};

const resetUsersState = () => {        //reserring the users state in the beginning of a new hand
    users.forEach(user => {
        user.hasCards = false;
        user.isAllIn = false;
        user.acting = false,
            user.roundBet = 0,
            user.sidePot = 0,
            user.acted = false,
            user.folded = false,
            user.currentHand = [];
    })
}

export = {
    getAllUsers,
    setAllUsers,
    getConnectedUsers,
    getPlayingUsers,
    getActivePlayers,
    getBettingPlayers,
    getUsersPublicData,
    getUsersShowdownData,
    getPlayersData,
    getDealer,
    getNextDealer,
    getNextToDealer,
    getNewFirstDealer,
    addUser,
    removeUser,
    rebuyUser,
    disconnectUser,
    getUserFromId,
    connectUser,
    resetUsersState
};