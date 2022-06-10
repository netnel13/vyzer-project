import express from "express";

import playerRoutes from './Routes/player-routes'
import scoreRouter from './Routes/score-routes'
import gameRouter from './Routes/game-routes'

const router = express.Router()

router.get('/health', (req, res) => {
    const data = {
        uptime: process.uptime(),
        message: 'Ok',
        date: new Date()
    }

    res.send(data);
});
router.use('/player', playerRoutes)
router.use('/score', scoreRouter)
router.use('/game', gameRouter)

export default router