import mongoose, { Types } from "mongoose";
import { Word, WordSchema } from "./word";

// type GameStage = 'lobby' | 'play' | 'over'

export enum GameStage {
    LOBBY = 'LOBBY',
    PLAY = 'PLAY',
    OVER = 'OVER'
}

export interface IGame {
    _id: Types.ObjectId;
    scores: Types.ObjectId[];
    rounds: number;
    word: Word;
    board: string | null;
    currentPlayer: Types.ObjectId | null;
    gameStage: GameStage,
    time: number
}

export const GameSchema = new mongoose.Schema<IGame>({
    scores: {
        type:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Score' }],
        required: true
    },
    rounds: {
        type: Number,
        default: 0,
    },
    word: {
        type: WordSchema,
        default: {
            word: '',
            value: 1
        }
    },
    board: {
        type: String,
        default: null
    },
    currentPlayer: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Player',
        default: null
    },
    gameStage: {
        type: String,
        enum: GameStage,
        default: GameStage.LOBBY
    },
    time: {
        type: Number,
        default: 0
    }
}, {timestamps: true})