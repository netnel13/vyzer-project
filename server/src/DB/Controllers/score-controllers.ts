import { ObjectId } from "mongoose"
import { ScoreModel } from "../Models"
import { IPlayer } from "../Models/player"

export const getScoreById = async (id: ObjectId | string) => {
    const score = await ScoreModel.findById(id)
    return score
}

export const createScore = async (player: IPlayer) => {
    const score = new ScoreModel({
        player
    })
    return await score.save()
}

export const updateScore = async (id: ObjectId | string, score: number) => {
    return await ScoreModel.findByIdAndUpdate(id, {value: score}, {new: true})
}