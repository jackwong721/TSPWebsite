const { queryRoute, saveRoute, deleteRoute } = require('../models/userInfor.model')

function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
}


async function getHistoryRoute(req, res){
    const userId = req.user
    const historyRoute = await queryRoute(userId)

    return res.status(200).json(historyRoute)
}

async function saveRouteInfor(req, res){

    const { totalDistance, totalDuration, sortedRoute } = req.body
    const userId = req.user
    const dateSaved = getTodayDate()

    const savedRoute = await saveRoute(userId, sortedRoute, dateSaved, totalDistance, totalDuration)

    return res.status(200).json(savedRoute)

}

async function httpDeteleRoute(req, res){

    const { queryID } = req.body
    const userId = req.user

    const remainRoute = await deleteRoute(userId, queryID)

    return res.status(200).json({"DeleteRoute": "Successfull"})

}
module.exports = {
    getHistoryRoute,
    saveRouteInfor,
    httpDeteleRoute
}