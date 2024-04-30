import Team from "@models/team";
import User from "@models/user";
import Admin from "@models/admin";
import Payment from "@models/payment";
import { connectToDatabase } from "@utils/db";
import { NextResponse } from "next/server";
import { getDetails } from "@utils/getDetails";
import EventDay from "@models/eventDay";
export async function GET(req) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const teamId = searchParams.get("teamid");
    console.log(teamId);
    let team = await Team.findOne({
      _id: searchParams.get("teamid"),
    }).populate(["leader", "teamMember"]);
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
    const admin = getDetails(req);
    if (!admin) {
      return NextResponse.json({ error: "Not valid user", success: false });
    }
    const teamData = await Team.findById(teamId);
    if (teamData.teamMemberConfirmation && !teamData.payment) {
      const updatedData = await Team.updateOne(
        { team: teamId },
        {
          payment: paymentStatus,
        }
      );
      console.log(updatedData);
      if (!updatedData) {
        return NextResponse.json(
          { message: "Internal Server Error" },
          { status: 500 }
        );
      }
      console.log(updatedData);
      const addInPayment = await Payment.create({
        team: teamId,
        admin: admin?.id,
      });
      console.log("updatedData: " + updatedData);
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
