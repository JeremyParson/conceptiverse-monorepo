import { Schema } from "mongoose";

const ChapterSchema = new Schema({
  name: String,
  index: {type: Number, required: true },
  content: { type: String, required: true },
  lesson_id: {type: String, required: true},
  test_script: [Schema.Types.ObjectId],
  creator: {type: Schema.Types.ObjectId, required: true}
});

export default ChapterSchema;
