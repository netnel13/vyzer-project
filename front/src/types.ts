export interface IPlayer {
    _id: string;
    name: string
}

export interface IScore {
    _id: string;
    player: IPlayer;
    value: number
}

export enum GameStage {
    LOBBY = 'LOBBY',
    PLAY = 'PLAY',
    OVER = 'OVER'
}

export type WordValue = 0 | 1 | 3 | 5

export type Difficulty = 'easy' | 'medium' | 'hard'

export interface Word {
    word: string;
    value: WordValue
}

export interface IGame {
    _id: string;
    scores: IScore[];
    rounds: number;
    word: Word;
    board: string | null;
    currentPlayer: IPlayer | null;
    gameStage: GameStage,
    time: number
}

export type Pages = 0 | 1 | 2 | 3 | 4

