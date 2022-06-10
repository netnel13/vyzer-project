import { RequestHandler } from "express";
import { createPlayer, findPlayerById } from "../../DB/Controllers/player-controller";

export const findPlayerHandler: RequestHandler = async (req, res, next) => {
    const {id} = req.params
    const player = await findPlayerById(id)
    res.send(player)
}

export const createPlayerHandler: RequestHandler = async (req, res, next) => {
    const player = await createPlayer(req.body.name)
    res.send(player)
} 