import express  from "express";
import { createScoreHandler, findScoreHandler, updateScoreHandler } from "../Handlers/score-handlers";
const router = express.Router()

router.get('/:id', findScoreHandler)
router.post('/create', createScoreHandler)
router.patch('/update', updateScoreHandler)

export default router