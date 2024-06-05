import { connectToDatabase } from "@utils/db";
import { NextResponse } from "next/server";
import Team from "@models/team";
import User from "@models/user";
import Payment from "@models/payment";
import EventDay from "@models/eventDay";
import Admin from "@models/admin";
import Quiz from "@models/quiz";
import { getToken } from "next-auth/jwt";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    await connectToDatabase();
    const token = await getToken({ req });
    // console.log(token.username);
    const admin = await Admin.findOne({ username: token?.username }).select(
      "-password"
    );
    if (!admin) {
      return NextResponse.json({ error: "Not valid user", success: false });
    }
    const today = new Date().toDateString();
    const tomorrow = new Date().setDate(new Date().getDate() + 1);
    const teams = await Team.count({});
    const teamsWithPayment = await Team.count({ payment: true });
    const users = await User.count({});
    const transactions = await Payment.count({});
    const todaysTransactions = await Payment.count({
      createdAt: {
        $gte: new Date(today),
        $lte: new Date(tomorrow),
      },
    });
    const teamsAttended = await EventDay.count({});

    return NextResponse.json({
      teams: teams,
      users: users,
      transactions: transactions,
      todaysTransactions: todaysTransactions,
      teamsAttended: teamsAttended,
      teamsWithPayment: teamsWithPayment,
      user: admin,
    });
  } catch (error) {
    console.error("Error ", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
export async function POST(req) {
  try {
    await connectToDatabase();
    const token = await getToken({ req });
    const admin = await Admin.findOne({ username: token?.username }).select(
      "-password"
    );
    if (!admin) {
      return NextResponse.json({ error: "Not valid user", success: false });
    }
    const { all } = await req.json();
    var dataSummary = [];
    if (all) {
      const teams = await Team.find({ payment: true })
        .populate("leader")
        .populate("members");
      teams.forEach((team) => {
        var teamDetails = {
          teamId: team._id,
          teamName: team.teamName,
          leaderName: team.leader.name,
          leaderEmail: team.leader.email,
          member1Name: team.members[0].name,
          member1Email: team.members[0].email,
          member2Name: team.members[1].name,
          member2Email: team.members[1].email,
        };
        dataSummary.push(teamDetails);
      });
    } else {
      const quizDetails = await Quiz.find({
        quizEnded: true,
      })
        .populate({
          path: "team",
          populate: ["leader", "members"],
        })
        .select(["team"]);

      quizDetails.forEach((quiz) => {
        var team = {
          teamId: quiz.team._id,
          teamName: quiz.team.teamName,
          leaderName: quiz.team.leader.name,
          leaderEmail: quiz.team.leader.email,
          member1Name: quiz.team.members[0].name,
          member1Email: quiz.team.members[0].email,
          member2Name: quiz.team.members[1].name,
          member2Email: quiz.team.members[1].email,
        };
        dataSummary.push(team);
      });
    }
    return NextResponse.json({
      success: true,
      message: "data fetched successfully",
      results: dataSummary,
    });
  } catch (error) {
    console.log(error);
  }
}
