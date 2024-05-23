import EventTimings from "@models/eventTimings";
import Team from "@models/team";
import User from "@models/user";
import Admin from "@models/admin";
import Payment from "@models/payment";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@utils/db";
import EventDay from "@models/eventDay";

export async function GET() {
  try {
    await connectToDatabase();
    const eventsOfAllTeams = await EventDay.find().populate({
      path: "team",
      populate: [{ path: "members" }, { path: "leader" }],
    });
    return NextResponse.json({ teams: eventsOfAllTeams });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
