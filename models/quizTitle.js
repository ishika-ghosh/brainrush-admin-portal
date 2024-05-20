import { Schema, model, models } from "mongoose";

const quizTitleSchema = new Schema(
  {
    title: {
      type: String,
      unique: [true, "Quiz Name already exists"],
      required: [true, "Quiz Name is required"],
    },
  },
  { timestamps: true }
);

const QuizTitle =
  (models && models.QuizTitle) || model("QuizTitle", quizTitleSchema);
export default QuizTitle;
