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

    const wordPreview = () => {
        const regex = new RegExp(/[a-z']/g)
        const prev = game.word.word.replaceAll(regex, '_ ')
        return prev
    }
    let canvasRef = useRef<CanvasDraw>(null)
    const [gameOver, setGameOver] = useState(0)
    const [guess, setGuess] = useState('')
    const [hint, setHint] = useState(wordPreview)

    const wordGuessed = async () => {
        if (guess === game.word.word) {
            setGameOver(1)
            setHint(guess)
            const myScore = game.scores.find(score => score.player._id === game.me?._id)
            await axios.patch<IScore>(`${REACT_APP_SERVER_URL}/score/update`, {
                id: myScore?._id,
                score: (myScore?.value || 0) + game.word.value
            })
            let nextPlayer = game.scores.findIndex(score => score.player._id === game.currentPlayer?._id) + 1
            if (nextPlayer === game.scores.length || nextPlayer === -1) {
                nextPlayer = 0
            }
            let gameStage = game.gameStage
            //game.rounds === game.scores.length * 3
            if (game.rounds === 4) {
                gameStage = GameStage.OVER
            }
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
                rounds: game.rounds + 1
            })
            if (game.gameStage === GameStage.OVER) {
                setTimeout(() => {
                    canvasRef.current?.clear()
                    setPage(4)
                }, 2000);
                return
            }
            setTimeout(() => {
                canvasRef.current?.clear()
                setPage(2)
            }, 2000);
            return
        }
        setGameOver(-1)

    }

    const getNewData = async () => {
        const res = await axios.get<IGame>(`${REACT_APP_SERVER_URL}/game/${game._id}`);
        if (game.currentPlayer?._id !== game.me?._id) {
            game.setBoard(res.data.board)
            return
        }
        if (res.data.word.word === '') {
            
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
            setGameOver(1)
            if (game.gameStage === GameStage.OVER) {
                setTimeout(() => {
                    canvasRef.current?.clear()
                    setPage(4)
                }, 2000);
                return
            }
            setTimeout(() => {
                canvasRef.current?.clear()
                setPage(2)
            }, 2000);
            return
        }
    };

    useEffect(() => {
        const timer = setInterval(getNewData, 300);
        return () => clearInterval(timer);
    });

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
