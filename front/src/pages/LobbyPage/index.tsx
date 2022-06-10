import axios from 'axios'
import React, { useEffect } from 'react'
import { REACT_APP_SERVER_URL } from '../../config/config'
import { useGame } from '../../hooks/useGame'
import { GameStage, IGame, Pages } from '../../types'

interface LobbyPageProps {
    setPage: React.Dispatch<React.SetStateAction<Pages>>
}

export default function LobbyPage({ setPage }: LobbyPageProps) {

    const game = useGame()

    const startGame = async () => {
        await axios.patch<IGame>(`${REACT_APP_SERVER_URL}/game/update`, {
            id: game._id,
            gameStage: GameStage.PLAY
        })
        game.setGameStage(GameStage.PLAY)
        setPage(2)
    }

    const getNewData = async () => {
        const res = await axios.get<IGame>(`${REACT_APP_SERVER_URL}/game/${game._id}`);
        game.setAll({
            scores: res.data.scores,
            gameStage: res.data.gameStage
        })
        if(game.gameStage !== GameStage.LOBBY){
            setPage(2)
        }
    };

    useEffect(() => {
        const timer = setInterval(getNewData, 300);
        return () => clearInterval(timer);
    });

    return (
        <div>
            <div>
                Players:
                {game.scores.map(score => (
                    <h3 key={score._id}>
                        {score.player.name}
                        {score.player._id === game.currentPlayer?._id && <span>(Admin)</span>}
                        {score.player._id === game.me?._id && <span>(Me)</span>}
                    </h3>
                ))}
            </div>
            <h1>Game Code: {game._id}</h1>
            <div>
                <h1>Only the admin can start the game</h1>
                {game.me?._id === game.currentPlayer?._id && (
                    <button onClick={startGame}>startGame</button>
                )}
            </div>
        </div>
    )
}