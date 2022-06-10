import mongoose from "mongoose";
import { GameSchema, IGame } from "./game";
import { IPlayer, PlayerSchema } from "./player";
import { IScore, ScoreSchema } from "./score";

export const PlayerModel = mongoose.model<IPlayer>('Player',PlayerSchema )
export const ScoreModel = mongoose.model<IScore>('Score', ScoreSchema)
export const GameModel = mongoose.model<IGame>('Game', GameSchema)