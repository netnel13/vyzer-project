import express from "express";
import { createGameHandler, findGameHandler, highestScoreHandler, joinGameHandler, updateGameHandler } from "../Handlers/game-handlers";
const router = express.Router()

router.get('/:id', findGameHandler)
router.get('/highestScore', highestScoreHandler)
router.post('/create', createGameHandler)
router.patch('/update', updateGameHandler)
router.patch('/join', joinGameHandler)

export default router