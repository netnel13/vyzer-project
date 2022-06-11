import { ObjectId, UpdateQuery } from "mongoose";
import { GameModel } from "../Models";
import { GameStage, IGame } from "../Models/game";

export const getGameById = async (id: ObjectId | string) => {
    return await GameModel.findById(id).populate([{ path: 'scores', populate: 'player' }, 'currentPlayer'])
}

export const createGame = async (score: any) => {
    const game = new GameModel({
        scores: [score],
        currentPlayer: score.player,
    })
    return await game.save()
}

export const updateGame = async (id: ObjectId | string, update: UpdateQuery<IGame>) => {
    const game = await GameModel.findByIdAndUpdate(id, { ...update }, { new: true })
        .populate([{ path: 'scores', populate: 'player' }, 'currentPlayer'])
    return game
}

export const highestScore = async () => {
    return await GameModel.findOne({ gameStage: GameStage.OVER }).sort({ time: 1, combinedScores: 1, })
        .populate([{ path: 'scores', populate: 'player' }, 'currentPlayer'])
}