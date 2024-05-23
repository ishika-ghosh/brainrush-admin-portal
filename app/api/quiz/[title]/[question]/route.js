import Admin from "@models/admin";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@utils/db";
import QuizTitle from "@models/quizTitle";
import Question from "@models/question";
import { getToken } from "next-auth/jwt";

export async function GET(request, { params }) {
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
    const { title: id, question: qid } = params;

    const quiz = await QuizTitle.findById(id);
    if (!quiz) {
      res.status(404).json({ error: "Quiz not found" });
      return;
    }
    const question = await Question.findById(qid);
    if (!question) {
      res.status(404).json({ error: "Question not found" });
      return;
    }
    return NextResponse.json({
      status: 200,
      message: quiz.title + "'s question loaded",
      question,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error",
    });
  }
}
export async function PUT(request, { params }) {
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
    const { title: id, question: qid } = params;

    const quiz = await QuizTitle.findById(id);
    if (!quiz) {
      res.status(404).json({ error: "Quiz not found" });
      return;
    }
    const question = await Question.findById(qid);
    if (!question) {
      res.status(404).json({ error: "Question not found" });
      return;
    }

    const reqBody = await request.json();
    console.log(reqBody);
    Object.assign(question, reqBody);

    await question.save();

    return NextResponse.json({
      status: 200,
      message: "Question updated",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error",
    });
  }
}
export async function DELETE(request, { params }) {
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

    const { title: id, question: qid } = params;

    const quiz = await QuizTitle.findById(id);
    if (!quiz) {
      res.status(404).json({ error: "Quiz not found" });
      return;
    }
    const question = await Question.findById(qid);
    if (!question) {
      res.status(404).json({ error: "Question not found" });
      return;
    }

    await question.deleteOne();

    return NextResponse.json({
      status: 200,
      message: question.q_type + " deleted",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error",
    });
  }
}
