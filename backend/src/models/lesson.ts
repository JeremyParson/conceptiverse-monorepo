import mongoose, { Schema } from "mongoose";

const LessonSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    rating: Number,
    comments: [{ message: String, user_id: String, date: Date }],
    languages: [{ type: String, required: true }],
    creator: { type: Schema.Types.ObjectId, required: true },
  },
  {
    methods: {
      async deleteChapters() {
        await mongoose.model("chapter").deleteMany({ lesson_id: this._id });
      },
    },
  }
);

export default LessonSchema;
