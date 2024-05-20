import { getDetails } from "@utils/getDetails";
import { connectToDatabase } from "@utils/db";
import { NextResponse } from "next/server";
import Admin from "@models/admin";
import QuizTitle from "@models/quizTitle";
import Question from "@models/question";

export async function GET(request, { params }) {
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

    const { title: id } = params;

    const quiz = await QuizTitle.findById(id);
    if (!quiz) {
      res.status(404).json({ error: "Quiz not found" });
      return;
    }
    const questions = await Question.find({ title: quiz._id });
    return NextResponse.json({
      status: 200,
      message: quiz.title + " loaded",
      questions,
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

    const { id } = params;

    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return NextResponse.json({
        status: 404,
        message: "Quiz not found",
      });
    }

    await quiz.deleteOne();

    return NextResponse.json({
      status: 200,
      message: quiz.title + " deleted",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error",
    });
  }
}
// export async function PUT(request, { params }) {
//   try {
//     await connectToDatabase();
//     const admin = getDetails(request);
//     if (!admin) {
//       return NextResponse.json({
//         status: 400,
//         message: "Not valid user",
//       });
//     }
//     const adminId = admin?.id;
//     const adminDetails = await Admin.findById(adminId);
//     //if not a super admin then can not allow then to change the details
//     if (!adminDetails.isSuperAdmin) {
//       return NextResponse.json({
//         status: 400,
//         message: "Only super admin can change this details",
//       });
//     }

//     const { id } = params;

//     const reqBody = await request.json();
//     const { title, questions } = reqBody;
//     const quiz = await Quiz.findById(id);

//     if (!quiz) {
//       return NextResponse.json({
//         status: 404,
//         message: "Quiz not found",
//       });
//     }

//     quiz.title = title;
//     quiz.questions = questions;

//     await quiz.save();

//     return NextResponse.json({
//       status: 200,
//       message: "Quiz updated successfully",
//     });
//   } catch (error) {
//     console.log(error);
//     return NextResponse.json({
//       status: 500,
//       message: "Internal Server Error",
//     });
//   }
// }

export async function POST(request, { params }) {
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

    const { title: id } = params;

    const quiz = await QuizTitle.findById(id);
    if (!quiz) {
      res.status(404).json({ error: "Quiz not found" });
      return;
    }

    const reqBody = await request.json();

    const question = new Question({ title: id, ...reqBody });
    await question.save();

    return NextResponse.json({
      status: 201,
      message: "Question Added",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error",
    });
  }
}
