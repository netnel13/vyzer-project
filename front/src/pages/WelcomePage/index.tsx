import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { REACT_APP_SERVER_URL } from '../../config/config'
import { useGame } from '../../hooks/useGame';
import { IGame, Pages } from '../../types';
import { millisToMinutesAndSeconds } from '../../functions/millisToMinutesAndSeconds';

interface WelcomePageProps {
    setPage: React.Dispatch<React.SetStateAction<Pages>>
}

export default function WelcomePage({ setPage }: WelcomePageProps) {

    const setAll = useGame(state => state.setAll)

    const [name, setName] = useState('')
    const [gameId, setGameId] = useState('')
    const [bestGame, setBestGame] = useState<IGame & { combinedScores: number } | null>()

    // starts a game, send a request to server to create a game
    const startGame = async () => {
        if (name.length > 0) {
            const game = await axios.post<IGame>(`${REACT_APP_SERVER_URL}/game/create`, {
                name
            })
            // set local state for game object
            setAll({
                _id: game.data._id,
                currentPlayer: game.data.currentPlayer,
                board: game.data.board,
                gameStage: game.data.gameStage,
                rounds: game.data.rounds,
                scores: game.data.scores,
                time: game.data.time,
                word: game.data.word,
                me: game.data.currentPlayer
            })
            // switch to lobby
            setPage(1)
            return
        }
        alert('name needs to be at least 1 character')
    }

    const joinGame = async () => {
        if (name.length > 0) {
            // make a request to join a game, can only join games that are in a lobby stage
            try {
                const game = await axios.patch<IGame>(`${REACT_APP_SERVER_URL}/game/join`, {
                    id: gameId,
                    name
                })
                // set local state
                setAll({
                    _id: game.data._id,
                    currentPlayer: game.data.currentPlayer,
                    board: game.data.board,
                    gameStage: game.data.gameStage,
                    rounds: game.data.rounds,
                    scores: game.data.scores,
                    time: game.data.time,
                    word: game.data.word,
                    me: game.data.scores[game.data.scores.length - 1].player
                })
                // switch to lobby page
                setPage(1)
                return
                // couldnt join game
            } catch {
                alert('game couldnt be found or game is already in progress')
                return
            }
        }
        alert('name needs to be at least 1 character')
    }

    // get the best game session
    const getBestGame = async () => {
        const data = await axios.get<IGame & { combinedScores: number }>(`${REACT_APP_SERVER_URL}/game/highestScore`)
        console.log(data);
        setBestGame({
            _id: data.data._id,
            board: data.data.board,
            currentPlayer: null,
            gameStage: data.data.gameStage,
            rounds: data.data.rounds,
            scores: data.data.scores,
            time: data.data.time,
            word: {
                word: '',
                value: 0
            },
            combinedScores: data.data.combinedScores
        })
    }

    // get best game in first render
    useEffect(() => {
        getBestGame()
    }, [])

    return (
        <div>
            <h1>Welocme to the guess game</h1>
            <div>
                <label htmlFor="name">Name </label>
                <input id='name' type="text" onChange={e => setName(e.target.value)} />
            </div>
            <div style={{ marginTop: '20px' }}>
                <label htmlFor="gameId">gameId </label>
                <input id='gameId' type="text" onChange={e => setGameId(e.target.value)} placeholder="To join an exsiting game" />
            </div>
            <div style={{ marginTop: "30px" }}>
                <button style={{ marginRight: '10px' }} onClick={startGame}>Start Game</button>
                <button onClick={joinGame}>Join Game</button>
            </div>
            {bestGame === null && <h1>best scoring game was not found</h1>}
            {bestGame?._id && 
            <h1>
                Best game was with combined score of: {bestGame.combinedScores} and finished in: {millisToMinutesAndSeconds(bestGame.time)} game code {bestGame._id}
            </h1>}
        </div>
    )
}
