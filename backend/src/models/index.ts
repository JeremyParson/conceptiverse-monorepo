require('dotenv').config()
import mongoose from "mongoose"
import UserSchema from "./user"

console.log(process.env.MONGO_URI)
mongoose.connect(process.env.MONGO_URI).catch((error) => {
    console.log("Connection Failed")
})

let db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'))

const User = mongoose.model('user', UserSchema)

export {db, User};