import mongoose, { Types } from "mongoose";

export interface IPlayer {
    _id: Types.ObjectId;
    name: string
}

export const PlayerSchema = new mongoose.Schema<IPlayer>({
    name: {
        type: String,
        required: true
    }
})