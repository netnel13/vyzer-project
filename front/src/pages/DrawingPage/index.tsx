import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import CanvasDraw from "react-canvas-draw";
import './style.css'
import { REACT_APP_SERVER_URL } from '../../config/config'
import { useGame } from '../../hooks/useGame'
import { GameStage, IGame, IScore, Pages } from '../../types'

interface DrawingPageProps {
    setPage: React.Dispatch<React.SetStateAction<Pages>>
}

const DrawingPage = ({ setPage }: DrawingPageProps) => {
    const game = useGame()

    // create a 'hint' for guessing players
    const wordPreview = () => {
        const regex = new RegExp(/[a-z']/g)
        const preview = game.word.word.replaceAll(regex, '_ ')
        return preview
    }

    const canvasRef = useRef<CanvasDraw>(null)
    const [gameOver, setGameOver] = useState(0)
    const [guess, setGuess] = useState('')
    const [hint, setHint] = useState(wordPreview)

    // check guess
    const wordGuessed = async () => {
        if (guess === game.word.word) {
            // set correct guess
            setGameOver(1)
            setHint(guess)
            
            // update my score
            const myScore = game.scores.find(score => score.player._id === game.me?._id)
            await axios.patch<IScore>(`${REACT_APP_SERVER_URL}/score/update`, {
                id: myScore?._id,
                score: (myScore?.value || 0) + game.word.value,
                gameId: game._id
            })

            // get next player
            let nextPlayer = game.scores.findIndex(score => score.player._id === game.currentPlayer?._id) + 1
            if (nextPlayer === game.scores.length || nextPlayer === -1) {
                nextPlayer = 0
            }

            // get new game Stage
            let gameStage = game.gameStage
            //game.rounds === game.scores.length * 3
            if (game.rounds === 2) {
                gameStage = GameStage.OVER
            }

            // get updated game data and updae local state
            const data = await axios.patch<IGame>(`${REACT_APP_SERVER_URL}/game/update`, {
                id: game._id,
                word: {
                    word: '',
                    value: 0
                },
                currentPlayer: game.scores[nextPlayer].player._id,
                rounds: game.rounds + 1,
                gameStage
            })
            game.setAll({
                word: {
                    word: '',
                    value: 0
                },
                scores: data.data.scores,
                currentPlayer: data.data.currentPlayer,
                rounds: game.rounds + 1,
                gameStage: data.data.gameStage
            })

            // check if game over else cont
            if (game.gameStage === GameStage.OVER) {
                setTimeout(() => {
                    canvasRef.current?.clear()
                    canvasRef.current?.forceUpdate()
                    setPage(4)
                }, 2000);
            } else {
                setTimeout(() => {
                    canvasRef.current?.clear()
                    canvasRef.current?.forceUpdate()
                    setPage(2)
                }, 2000);
            }
        }else {
            setGameOver(-1)
        }

    }

    // get data from server after polling
    const getNewData = async () => {
        const res = await axios.get<IGame>(`${REACT_APP_SERVER_URL}/game/${game._id}`);
        // update local state board for guessing players
        if (game.currentPlayer?._id !== game.me?._id) {
            game.setBoard(res.data.board)
            return
        }
        // check if correct guess
        if (res.data.word.word === '') {
            // set correct guess
            setGameOver(1)

            // update local data
            game.setAll({
                word: {
                    word: '',
                    value: 0
                },
                scores: res.data.scores,
                currentPlayer: res.data.currentPlayer,
                rounds: res.data.rounds,
                gameStage: res.data.gameStage
            })

            //check if game is over else cont
            if (game.gameStage === GameStage.OVER) {
                setTimeout(() => {
                    canvasRef.current?.clear()
                    canvasRef.current?.forceUpdate()
                    setPage(4)
                }, 2000);
            } else {
                setTimeout(() => {
                    canvasRef.current?.clear()
                    canvasRef.current?.forceUpdate()
                    setPage(2)
                }, 2000);
            }
        }
    };

    // poll data from server every 300 mill
    useEffect(() => {
        const timer = setInterval(getNewData, 300);
        return () => clearInterval(timer);
    });

    // update board for guessing players
    useEffect(() => {
        if (canvasRef.current) {
            if (game.me?._id !== game.currentPlayer?._id && game.board) {
                const board = game.board
                canvasRef.current.loadSaveData(board, true)
                canvasRef.current.forceUpdate()
            }
        }
    }, [game])

    return (
        <div>
            <div>
                <h1>Round: {game.rounds}</h1>
                {game.scores.map((score) => (
                    <h3 key={score._id}>{score.player.name} : {score.value}</h3>
                ))}
            </div>
            {gameOver === 1 && <h1>Game Over</h1>}
            {gameOver === -1 && <h1>Try Again</h1>}
            <div>
                {game.me?._id === game.currentPlayer?._id && <h1>{game.word.word}</h1>}
                {game.me?._id !== game.currentPlayer?._id &&
                    <>
                        <h1>{hint}</h1>
                        <div>
                            <label htmlFor="guess">guess </label>
                            <input disabled={gameOver === 1} id='guess' type="text" onChange={(e) => setGuess(e.target.value)} />
                            <button onClick={wordGuessed}>
                                guess
                            </button>
                        </div>
                    </>
                }
            </div>
            <CanvasDraw
                ref={canvasRef}
                canvasHeight={800}
                canvasWidth={800}
                disabled={game.me?._id !== game.currentPlayer?._id || gameOver === 1}
            />
            {game.me?._id === game.currentPlayer?._id &&
                <div>
                    <button onClick={() => {
                        axios.patch(`${REACT_APP_SERVER_URL}/game/update`, {
                            id: game._id,
                            board: canvasRef.current?.getSaveData()
                        })
                    }}>
                        done
                    </button>
                    <button onClick={() => {
                        canvasRef.current?.clear()
                        canvasRef.current?.forceUpdate()
                        axios.patch(`${REACT_APP_SERVER_URL}/game/update`, {
                            id: game._id,
                            board: canvasRef.current?.getSaveData()
                        })
                    }}>
                        Clear Canvas
                    </button>
                </div>
            }
        </div>
    )
}

export default DrawingPage
