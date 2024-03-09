const express = require('express')

const distanceMatrixRouter = express.Router()

const { heuristicTSP } = require('./distanceMatrix.heuristic.controller')
const { brutalForceTSP } = require('./distanceMatrix.brutal.controller')


distanceMatrixRouter.post('/heuristic', heuristicTSP)
distanceMatrixRouter.post('/brutal', brutalForceTSP)

module.exports = distanceMatrixRouter