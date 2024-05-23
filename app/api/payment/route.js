import Team from "@models/team";
import User from "@models/user";
import Admin from "@models/admin";
import Payment from "@models/payment";
import { connectToDatabase } from "@utils/db";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import EventDay from "@models/eventDay";
export async function GET(req) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const teamId = searchParams.get("teamid");

    let team = await Team.findOne({
      _id: searchParams.get("teamid"),
    }).populate(["leader", "members"]);
    return NextResponse.json({
      success: true,
      message: `${team.teamName} Details`,
      team,
    });
  } catch (error) {
    console.error("Error fetching team names:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
export async function PUT(req) {
  try {
    await connectToDatabase();
    const { teamId, paymentStatus } = await req.json();
    const token = await getToken({ req });
    const admin = await Admin.findOne({ username: token?.username });
    if (!admin) {
      return NextResponse.json({ error: "Not valid user", success: false });
    }
    const teamData = await Team.findById(teamId);
    if (teamData.members.length === 2 && !teamData.payment) {
      const updatedData = await Team.findByIdAndUpdate(
        teamId,
        {
          payment: paymentStatus,
        },
        { new: true }
      )
        .populate("leader")
        .populate("members");

      if (!updatedData) {
        return NextResponse.json(
          { message: "Internal Server Error" },
          { status: 500 }
        );
      }

      const addInPayment = await Payment.create({
        team: teamId,
        admin: admin?.id,
      });

      return NextResponse.json({
        success: true,
        updatedData,
        transactionData: addInPayment,
        teamData: updatedData,
      });
    } else {
      return NextResponse.json({ success: false, message: "Team not full" });
    }
    return NextResponse.json({ message: "Team not full!" }, { status: 500 });
  } catch (error) {
    console.error("Error updating payment details:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
