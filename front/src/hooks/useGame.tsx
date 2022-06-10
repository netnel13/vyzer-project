import create from 'zustand'
import { GameStage, IGame, IPlayer, IScore, Word } from '../types'

interface GameProps extends IGame {
  me: IPlayer | null,
  setAll: (game: Partial<GameProps>) => void;
  setBoard: (board: string | null) => void
  setCurrentPlayer: (currentPlayer: IPlayer) => void
  setGameStage: (gameStage: GameStage) => void
  setScores: (score: IScore) => void
  setWord: (word: Word) => void
  setRounds: (rounds: number) => void
  setMe: (me: IPlayer) => void
}

export const useGame = create<GameProps>(set => ({
  _id: '',
  board: null,
  currentPlayer: null,
  gameStage: GameStage.LOBBY,
  rounds: 0,
  scores: [],
  time: 0,
  word: {
    value: 1,
    word: ''
  },
  me: null,
  setAll: (game) => set(state => ({...game})),
  setBoard: (board) => set(state => ({board})),
  setCurrentPlayer: (currentPlayer) => set(state => ({currentPlayer})),
  setGameStage: (gameStage) => set(state => ({gameStage})),
  setScores: (score) => set(state => ({scores: [...state.scores, score]})),
  setWord: (word) => set(state => ({word})),
  setRounds: (rounds) => set(state => ({rounds})),
  setMe: (me) => set(state => ({me}))
}))