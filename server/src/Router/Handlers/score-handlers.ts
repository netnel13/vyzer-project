import { RequestHandler } from "express";
import { updateGame } from "../../DB/Controllers/game-controllers";
import { createScore, getScoreById, updateScore } from "../../DB/Controllers/score-controllers";

export const findScoreHandler: RequestHandler = async (req, res, next) => {
    const {id} = req.params
    const score = await getScoreById(id)
    res.send(score)
}

export const createScoreHandler: RequestHandler = async (req, res, next) => {
    const score = await createScore(req.body.player)
    res.send(score)
}

export const updateScoreHandler: RequestHandler = async (req, res, next) => {
    const {id, score, gameId} = req.body
    const newScore = await updateScore(id, score)
    await updateGame(gameId, {
        $inc: {
            combinedScores: score
        }
    })
    res.send(newScore)
}