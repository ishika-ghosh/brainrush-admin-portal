import Team from "@models/team";
import User from "@models/user";
import Admin from "@models/admin";
import Payment from "@models/payment";
import { connectToDatabase } from "@utils/db";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import EventDay from "@models/eventDay";

export async function PUT(req) {
  try {
    await connectToDatabase();
    const { teamId, lunchStatus } = await req.json();
    const token = await getToken({ req });
    const admin = await Admin.findOne({ username: token?.username });
    if (!admin) {
      return NextResponse.json({ error: "Not valid user", success: false });
    }
    const updatedData = await EventDay.updateOne(
      { team: teamId },
      {
        lunch: lunchStatus,
      }
    );
    console.log("updatedData: " + updatedData);
    return NextResponse.json({
      success: true,
      updatedData,
    });
  } catch (error) {
    console.error("Error updating payment details:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
export async function POST(req) {
  try {
    await connectToDatabase();
    const { teamId, entryStatus } = await req.json();
    const token = await getToken({ req });
    const admin = await Admin.findOne({ username: token?.username });
    if (!admin) {
      return NextResponse.json({ error: "Not valid user", success: false });
    }
    const team = await Team.findOne({ team: teamId });
    if (team?.payment) {
      const eventStarted = await EventDay.create({
        team: teamId,
        attendance: entryStatus,
      });
      console.log("Start: " + eventStarted);
      return NextResponse.json({
        success: true,
        eventStarted,
      });
    }
    return NextResponse.json(
      { message: "Team's Payment is due!" },
      { status: 500 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
