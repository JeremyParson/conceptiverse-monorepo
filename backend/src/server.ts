require('dotenv').config()
import express, {Request, Response} from "express"
import cors from "cors"
import {User} from "./models"
import mongoose from "mongoose"

const app: express.Application = express()

// server middleware
app.use(
    express.urlencoded({
    extended: true,
  })
);

app.use(cors())

// middleware
import defineCurrentUser from "./middleware/defineCurrentUser"
app.use(defineCurrentUser)

//routes
import UserRouter from "./routers/user"
app.use('/user', UserRouter)

import AuthenticationRouter from "./routers/authentication"
app.use('/auth', AuthenticationRouter)

app.get('/', async (req: Request, res: Response) => {
  res.json({"message": "conceptiverse api"}).status(200)
})

// start
app.listen(process.env.PORT, () => [
    console.log(`Server listening on port ${process.env.PORT}.`)
])