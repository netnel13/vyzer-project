import mongoose, { Types } from "mongoose";

export interface IScore {
    _id: Types.ObjectId;
    player: Types.ObjectId;
    value: number
}

export const ScoreSchema = new mongoose.Schema<IScore>({
    player: {
        type:  mongoose.Schema.Types.ObjectId, 
        ref: 'Player',
        required: true
    },
    value: {
        type: Number,
        default: 0
    }
})