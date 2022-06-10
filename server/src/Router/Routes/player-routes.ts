import express  from "express";
import { createPlayerHandler, findPlayerHandler } from "../Handlers/player-handlers";
const router = express.Router()

router.get('/:id', findPlayerHandler)
router.post('/create', createPlayerHandler)

export default router