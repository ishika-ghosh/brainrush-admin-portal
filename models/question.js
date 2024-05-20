import { Schema, model, models } from "mongoose";

const questionSchema = new Schema(
  {
    title: {
      type: Schema.Types.ObjectId,
      ref: "QuizTitle",
    },
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
    explanation: String,
  },
  { timestamps: true }
);

const Question =
  (models && models.Question) || model("Question", questionSchema);
export default Question;
