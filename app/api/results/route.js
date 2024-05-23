import Admin from "@models/admin";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@utils/db";
import { getToken } from "next-auth/jwt";
import QuizTitle from "@models/quizTitle";
import Question from "@models/question";
import Results from "@models/results";
import Quiz from "@models/quiz";
import Team from "@models/team";
import User from "@models/user";

export async function GET(request) {
  try {
    await connectToDatabase();
    const token = await getToken({ req: request });
    const admin = await Admin.findOne({ username: token?.username });
    if (!admin) {
      return NextResponse.json({
        status: 400,
        message: "Not valid user",
      });
    }
    const adminId = admin?.id;
    const adminDetails = await Admin.findById(adminId);
    // if not a super admin then can not allow then to change the details
    if (!adminDetails.isSuperAdmin) {
      return NextResponse.json({
        status: 400,
        message: "Only super admin can change this details",
      });
    }
    const results = await Results.find({}).populate({
      path: "quiz",
      populate: {
        path: "team",
        populate: {
          path: "leader",
        },
      },
    });

    const extractedResults = results.map((result) => {
      return {
        teamName: result.quiz.team.teamName,
        teamLeader: result.quiz.team.leader.name,
        score: result.score,
        time: result.time,
      };
    });

    const sortedResults = extractedResults.sort((a, b) => {
      if (b.score === a.score) {
        return a.time - b.time;
      }
      return b.score - a.score;
    });

    return NextResponse.json({
      status: 200,
      message: "Results Fetched Successfully",
      sortedResults,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error",
    });
  }
}
export async function POST(request) {
  try {
    await connectToDatabase();
    const token = await getToken({ req: request });
    const admin = await Admin.findOne({ username: token?.username });
    if (!admin) {
      return NextResponse.json({
        status: 400,
        message: "Not valid user",
      });
    }
    const adminId = admin?.id;
    const adminDetails = await Admin.findById(adminId);
    //if not a super admin then can not allow then to change the details
    if (!adminDetails.isSuperAdmin) {
      return NextResponse.json({
        status: 400,
        message: "Only super admin can change this details",
      });
    }

    const quizzes = await Quiz.find({ quizEnded: true }).populate(
      "responses.question"
    );

    const results = [];

    for (const quiz of quizzes) {
      let score = 0;
      const endTime = new Date(quiz.quizEndTime);
      const startTime = new Date(quiz.createdAt);
      const duration = Math.floor(Number((endTime - startTime) / 1000));
      console.log(endTime + " " + startTime + " " + duration);
      for (let response of quiz.responses) {
        const question = await Question.findById(response.question._id);
        for (let options of question.options) {
          if (options.isCorrect === true && options.text === response.answer) {
            score++;
          }
        }
      }

      const result = new Results({
        quiz: quiz._id,
        score: score,
        time: Math.min(duration, 1800),
      });

      await result.save();
      results.push(result);
    }

    return NextResponse.json({
      status: 201,
      message: "Resulted Calculated Successfully",
      results,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error",
    });
  }
}
