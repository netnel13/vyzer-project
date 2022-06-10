import React, { useEffect, useState } from 'react'
import axios from 'axios'
import randomWords from 'random-words'
import { REACT_APP_SERVER_URL } from '../../config/config'
import { useGame } from '../../hooks/useGame'
import { Difficulty, IGame, Pages, Word, WordValue } from '../../types'

interface GamePropsProps {
    setPage: React.Dispatch<React.SetStateAction<Pages>>
}

export default function GamePage({ setPage }: GamePropsProps) {

    const game = useGame()
    const [words, setWords] = useState<Word[]>([])

    useEffect(() => {
        const easy = randomWords({ exactly: 1, maxLength: 3, wordsPerString: 1 })[0]
        const medium = randomWords({ exactly: 1, maxLength: 5, wordsPerString: 1 })[0]
        const hard = randomWords({ exactly: 1, maxLength: 7, wordsPerString: 2 })[0]
        setWords([
            {
                word: easy,
                value: 1
            },
            {
                word: medium,
                value: 3
            },
            {
                word: hard,
                value: 5
            }
        ])
    }, [])

    const getNewData = async () => {
        const res = await axios.get<IGame>(`${REACT_APP_SERVER_URL}/game/${game._id}`);
        if (game.word !== res.data.word) {
            game.setWord(res.data.word)
            setPage(3)
        }
    };

    useEffect(() => {
        if (game.currentPlayer?._id !== game.me?._id) {
            const timer = setInterval(getNewData, 300);
            return () => clearInterval(timer);
        }
    });

    const getDifficulty = (value: WordValue) : Difficulty => {
        switch (value) {
            case 1:
                return 'easy'
            case 3:
                return 'medium'
            case 5:
                return 'hard'
            default:
                return 'easy'
        }
    }

    if (words.length > 0) {
        return (
            <>
                <div>
                    <h1>Round: {game.rounds}</h1>
                    {game.scores.map((score) => (
                        <h3 key={score._id}>
                            {score.player.name}
                            {score.player._id === game.me?._id && <span>(Me)</span>}
                            {score.player._id === game.currentPlayer?._id && <span>(Choosing)</span>} :
                            {score.value}
                        </h3>
                    ))}
                </div>
                {game.currentPlayer?._id === game.me?._id &&
                    <div>
                        <h1>choose word</h1>
                        <div>
                            {words.map(word => (
                                <button key={`${word.word}-${word.value}`} onClick={() => {
                                    axios.patch(`${REACT_APP_SERVER_URL}/game/update`, {
                                        id: game._id,
                                        word
                                    })
                                    game.setWord(word)
                                    setPage(3)
                                }}>
                                    {word.word}
                                    {getDifficulty(word.value)}
                                </button>
                            ))}
                        </div>
                    </div>
                }
                {game.currentPlayer?._id !== game.me?._id && (
                    <div>waiting for other player to choose a word</div>
                )}
            </>
        )
    }

    return <>loading...</>
}
