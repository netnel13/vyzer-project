import express from "express";
import { createGameHandler, findGameHandler, highestScoreHandler, joinGameHandler, updateGameHandler } from "../Handlers/game-handlers";
const router = express.Router()

router.get('/highestScore', highestScoreHandler)
router.get('/:id', findGameHandler)
router.post('/create', createGameHandler)
router.patch('/update', updateGameHandler)
router.patch('/join', joinGameHandler)

export default router