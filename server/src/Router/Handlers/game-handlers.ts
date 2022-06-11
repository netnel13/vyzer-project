import { RequestHandler } from "express";
import { createGame, getGameById, highestScore, updateGame } from "../../DB/Controllers/game-controllers";
import { createPlayer } from "../../DB/Controllers/player-controller";
import { createScore } from "../../DB/Controllers/score-controllers";
import { GameStage, IGame } from "../../DB/Models/game";

export const findGameHandler: RequestHandler = async (req, res, next) => {
    const { id } = req.params
    const game = await getGameById(id)
    res.send(game)
}

export const createGameHandler: RequestHandler = async (req, res, next) => {
    const { name } = req.body
    const player = await createPlayer(name)
    const score = await createScore(player)
    const game = await createGame(score)
    res.send(game)
}

export const joinGameHandler: RequestHandler = async (req, res, next) => {
    const { name, id } = req.body
    const game = await getGameById(id)

    if (!game) {
        next('game cant be found')
        return
    }

    if (game?.gameStage !== GameStage.LOBBY) {
        next('cannot join game after lobby phase')
        return
    }

    const player = await createPlayer(name)
    const score = await createScore(player)
    const updatedGame = await updateGame(id, {
        $addToSet: {
            scores: score
        }
    })

    res.send(updatedGame)
}

export const updateGameHandler: RequestHandler = async (req, res, next) => {
    const { id, ...rest } = req.body
    let game = await updateGame(id, rest)
    if (game && rest?.gameStage === GameStage.OVER) {
        game = await updateGame(id, {
            time: new Date().getTime() - new Date(game.createdAt).getTime()
        })
    }
    res.send(game)
}

export const highestScoreHandler: RequestHandler = async (req, res, next) => {
    const game = await highestScore()
    res.send(game)
}