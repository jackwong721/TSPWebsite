const mongoose = require('mongoose')

const userInforSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true,
    },
    username: {
        type: String,
    },
    accountCreateDate: {
        type: String,
        required: true
    },
    subsription: {
        subscribed: Boolean,
        package: String
    },
    historyRoute: [ {type: Map} ],
    totalTimeQuery: { 
        type: Number
    }
})

module.exports = mongoose.model('User', userInforSchema)