const { queryProfile } = require('../models/userInfor.model')

async function getUserInfor(req, res){

    const userProfile = await queryProfile(req.user)
    return res.status(200).json(userProfile)
}

module.exports = {
    getUserInfor
}