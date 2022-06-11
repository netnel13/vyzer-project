import React, { useEffect } from 'react'
import axios from 'axios'
import { REACT_APP_SERVER_URL } from '../../config/config'
import { useGame } from '../../hooks/useGame'
import { GameStage, IGame, Pages } from '../../types'

interface LobbyPageProps {
    setPage: React.Dispatch<React.SetStateAction<Pages>>
}

export default function LobbyPage({ setPage }: LobbyPageProps) {

    const game = useGame()

    // start the game, after the Admin clicked the button
    const startGame = async () => {
        await axios.patch<IGame>(`${REACT_APP_SERVER_URL}/game/update`, {
            id: game._id,
            gameStage: GameStage.PLAY
        })
        game.setGameStage(GameStage.PLAY)
        setPage(2)
    }

    // poll data from server
    const getNewData = async () => {
        // console.log('polling');
        const res = await axios.get<IGame>(`${REACT_APP_SERVER_URL}/game/${game._id}`);
        // check if game has started
        game.setAll({
            scores: res.data.scores,
            gameStage: res.data.gameStage
        })
        if(game.gameStage !== GameStage.LOBBY){
            setPage(2)
        }
    };

    // poll data from db every 300 seconds
    useEffect(() => {
        // console.log('polling');
        const timer = setInterval(getNewData, 1000);
        return () => clearInterval(timer);
    });

    return (
        <div>
            <div>
                <h2>Players:</h2>
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