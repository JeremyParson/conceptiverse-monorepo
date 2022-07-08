require('dotenv').config();
import mongoose from "mongoose";
import UserSchema from "./user";
import LessonSchema from "./lesson";
import ChapterSchema from "./chapter";

// connect to mongo database using MONGO URI
console.log(process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI);

let db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Create model instances
const User = mongoose.model('user', UserSchema);
const Lesson = mongoose.model('lesson', LessonSchema);
const Chapter = mongoose.model('chapter', ChapterSchema);

export {db, User, Lesson, Chapter};
