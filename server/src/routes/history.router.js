const express = require('express')

const { getHistoryRoute, saveRouteInfor, httpDeteleRoute } = require('./history.controller')

const historyRouter = express.Router()

historyRouter.get('/', getHistoryRoute)
historyRouter.post('/save', saveRouteInfor)
historyRouter.post('/delete', httpDeteleRoute)

module.exports = historyRouter