import { Schema, model, models } from "mongoose";

const quizSchema = new Schema(
  {
    title: {
      type: String,
      unique: [true, "Quiz Name already exists"],
      required: [true, "Quiz Name is required"],
    },
    questions: [
      {
        q_type: String, // MCQ, MSQ, NAT
        // format: String, // Image, Text
        content: String,
        // assets: String, // any image
        options: [
          {
            text: String,
            isCorrect: Boolean,
          },
        ], 
      },
    ],
  },
  { timestamps: true }
);

const Quiz = (models && models.Quiz) || model("Quiz", quizSchema);
export default Quiz;
