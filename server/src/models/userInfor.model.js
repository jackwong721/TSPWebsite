const users = require('./userInfor.mongo')

let counter = 1

function generateUniqueNumber(prefix, counter, length) {
    const paddedCounter = String(counter).padStart(length, '0');
    return `${prefix}${paddedCounter}`;
}

function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
}

const defaultNewUser = {
        accountCreateDate: getTodayDate(),
        subsription: {
            subscribed: false,
            package: 'Z'
        },
        historyRoute: [],
        totalTimeQuery: 0
}

// Check if got existing user
async function checkExistingUserID(userID){
    return users.findOne({
        userID: userID
    })
}

// Create new user
async function createNewUser(userID, username){
    await users.findOneAndUpdate({
        userID: userID,
        username: username
    }, defaultNewUser, {
        upsert: true
    })

    console.log('Successful create new user')
}

async function queryUser(userID){
    return await users.find({
        userID: userID
    }, {
        '_id': 0, '__v': 0
    })
}

async function queryRoute(userID){
    return await users.find({
        userID: userID
    }, {
        historyRoute: 1, '_id': 0,
    })
}

async function queryProfile(userID){
    return await users.find({
        userID: userID
    }, {
        historyRoute: 0, '_id': 0, accountCreateDate: 0, subsription: 0
    })
}

async function saveRoute(userID, route, date, totalDistance, totalDuration){

    const uniqueNumber = generateUniqueNumber('A', counter, 6)
    counter+=1

    return await users.updateOne(
        { userID: userID },
        {
          $push: {
            historyRoute: {
              $each: [
                {
                  queryID: uniqueNumber,
                  route: route,
                  date: date,
                  totalDistance: totalDistance,
                  totalDuration: totalDuration,
                },
              ],
              $position: 0, // This will push the new data to the front of the array
            },
          },
        }
      );
      
}

async function deleteRoute(userId, queryId){

    try {
        const user = await users.findOne({ userID: userId });
    
        if (!user) {
          console.log('User not found');
          return;
        }
    
        // Remove the route with the given queryId from historyRoute array
        user.historyRoute = user.historyRoute.filter(route => route.get('queryID') !== queryId);
    
        await user.save();

      } catch (error) {
        console.error('Error deleting route:', error);
      }
}

async function addUserTotalQuery(userId){
    await users.updateOne(
        {userID: userId},
        {$inc: {totalTimeQuery: 1}}
    )
}


module.exports = {
    checkExistingUserID,
    createNewUser,
    queryUser,
    queryRoute,
    saveRoute,
    queryProfile,
    deleteRoute,
    addUserTotalQuery
}