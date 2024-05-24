import { Schema, model, models } from "mongoose";

const resultsSchema = new Schema({
  quiz: {
    type: Schema.Types.ObjectId,
    ref: "Quiz",
  },
  score: {
    type: Number,
  },
  time: {
    type: Number,
  },
});
const Results = (models && models.Results) || model("Results", resultsSchema);
export default Results;
