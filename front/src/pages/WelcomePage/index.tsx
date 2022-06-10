import React, { useState } from 'react'
import axios from 'axios';

import { REACT_APP_SERVER_URL } from '../../config/config'
import { useGame } from '../../hooks/useGame';
import { IGame, Pages } from '../../types';

interface WelcomePageProps {
    setPage: React.Dispatch<React.SetStateAction<Pages>>
}

export default function WelcomePage({ setPage }: WelcomePageProps) {

    const setAll = useGame(state => state.setAll)

    const [name, setName] = useState('')
    const [gameId, setGameId] = useState('')

    const startGame = async () => {
        if (name.length > 0) {
            const game = await axios.post<IGame>(`${REACT_APP_SERVER_URL}/game/create`, {
                name
            })
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
            setPage(1)
            return
        }
        alert('name needs to be at least 1 character')
    }

    const joinGame = async () => {
        if (name.length > 0) {
            try {
                const game = await axios.patch<IGame>(`${REACT_APP_SERVER_URL}/game/join`, {
                    id: gameId,
                    name
                })
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
                setPage(1)
                return
            } catch {
                alert('something went wrong')
                return
            }
        }
        alert('name needs to be at least 1 character')
    }

    return (
        <div>
            <h1>Welocme to the guess game</h1>
            <div>
                <label htmlFor="name">Name </label>
                <input id='name' type="text" onChange={e => setName(e.target.value)} />
            </div>
            <div>
                <button onClick={startGame}>Start Game</button>
            </div>
            <div style={{ marginTop: '20px' }}>
                <label htmlFor="gameId">gameId </label>
                <input id='gameId' type="text" onChange={e => setGameId(e.target.value)} />
                <div>
                    <button onClick={joinGame}>Join Game</button>
                </div>
            </div>

        </div>
    )
}
