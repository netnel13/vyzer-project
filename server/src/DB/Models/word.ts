import mongoose, { Types } from "mongoose";

export interface Word {
    word: string;
    value: number
}

export const WordSchema = new mongoose.Schema<Word>({
    word: {
        type: String,
        default: ''
    },
    value: {
        type: Number,
        default: 1
    }
})

