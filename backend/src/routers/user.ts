import {Router, Request, Response} from "express"
import { User } from "../models"
import { Error } from "mongoose"
import * as bcrypt from "bcrypt"

const router = Router()

router.get('/', async (req: Request, res: Response) => {
    try {
        if (!req.currentUser || req.currentUser.role !== "admin") {
            return res.status(404).json({"message": "Only admins can access this route."})
        }
        
        const users = await User.find()
        res.json(users).status(200)
    } catch (err) {
        if (err instanceof Error.ValidationError) {
            res.json({"message": "validation failed"}).status(400)
        }
        res.status(400)
    }
})

router.post('/', async (req: Request, res: Response) => {
    try {
        const passwordDigest = bcrypt.hashSync(req.body.password, 10)
        const user = new User({
            ...req.body,
            passwordDigest,
            "role": "user"
        })
        user.save()
        res.json(user).status(200)
    } catch (err) {
        if (err instanceof Error.ValidationError) {
            res.json({"message": "validation failed"}).status(400)
        }
        res.status(400)
    }
})

export default router;