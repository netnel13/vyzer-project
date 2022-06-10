import { ObjectId } from "mongoose"
import { PlayerModel } from "../Models"

export const createPlayer = async (name: string) => {
    const player = new PlayerModel({
        name
    })
    return await player.save()
}

export const findPlayerById = async (id: ObjectId | string) => {
    return await PlayerModel.findById(id)
}