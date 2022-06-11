import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import { CORS_ALLOWED_ORIGIN, MONGO_URI, PORT } from './config'
import router from './Router/router'

const main = async () => {

    await mongoose.connect(MONGO_URI).then(res => console.log('connected to db'))

    const app = express()
    app.use(express.json())

    app.use(cors({
        origin: [...CORS_ALLOWED_ORIGIN]
    }))

    app.use((req,res, next) => {
        console.log(req.url, req.method);
        next()
    })
    app.use(router)
    app.get('*', function(req, res){
        console.log('404')
      });

    app.listen(PORT, () => {
        console.log(`server is running at http://localhost:${PORT}`);
    })
}

main()