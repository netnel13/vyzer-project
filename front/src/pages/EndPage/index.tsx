import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { REACT_APP_SERVER_URL } from '../../config/config'
import { useGame } from '../../hooks/useGame'
import { IGame, IScore, Pages } from '../../types'
import { millisToMinutesAndSeconds } from '../../functions/millisToMinutesAndSeconds'

interface EndPageProps {
  setPage: React.Dispatch<React.SetStateAction<Pages>>
}

export default function EndPage({ setPage }: EndPageProps) {

  const game = useGame()
  const [time, setTime] = useState(0)
  const [scores, setScores] = useState<IScore[]>([])

  useEffect(() => {
    // get data from server
    axios.get<IGame & { createdAt: string }>(`${REACT_APP_SERVER_URL}/game/${game._id}`).then(res => {
      //find winner
      setScores(game.scores.sort((a, b) => a.value - b.value))
      // get game time to complete
      setTime(res.data.time)
    })
  }, [game._id, game.scores])

  // check if api call has finished
  if (scores.length > 0 && time > 0) {
    return (
      <div>
        <h1>The Winner is {scores[scores.length - 1].player.name} with a score of {scores[scores.length - 1].value}</h1>
        <h1>the game took {millisToMinutesAndSeconds(time)} minutes</h1>

        <button onClick={() => {
          game.clear()
          setPage(0)
        }}>return to main menu</button>
      </div>
    )
  }

  return <>Calculating the results</>

}
