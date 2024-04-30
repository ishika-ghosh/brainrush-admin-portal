import Admin from "@models/admin";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@utils/db";
import { getDetails } from "@utils/getDetails";
import Quiz from "@models/quiz";

export async function GET(request) {
  try {
    await connectToDatabase();
    const admin = getDetails(request);
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
    const quizzes = await Quiz.find({});
    return NextResponse.json({
      status: 200,
      message: "All Quizzes",
      quizzes,
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
    const admin = getDetails(request);
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

    const reqBody = await request.json();
    const { title, questions } = reqBody;

    const quiz = new Quiz({ title, questions });
    await quiz.save();
    return NextResponse.json({
      status: 201,
      message: "Quiz Created",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error",
    });
  }
}
