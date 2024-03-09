const express = require('express')

const { getUserInfor } = require('./user.controller')
const userRouter = express.Router()

userRouter.get('/', getUserInfor)

module.exports = userRouter