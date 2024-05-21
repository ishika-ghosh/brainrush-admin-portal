import { Schema, model, models } from "mongoose";

const teamSchema = new Schema(
  {
    teamName: {
      //case insensitive
      type: String,
      required: [true, "Team name is required"],
      unique: [true, "Team name already exists"],
    },
    leader: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Leader is a must"],
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    memberEmails: [
      {
        email: {
          type: String,
          unique: true,
        },
        confirmation: { type: Boolean, default: false },
      },
    ],
    payment: {
      type: Boolean,
      default: false,
    },
    quizTopics: [
      {
        type: Schema.Types.ObjectId,
        ref: "QuizTitle",
      },
    ],
  },
  { timestamps: true }
);

const Team = (models && models.Team) || model("Team", teamSchema);
export default Team;
