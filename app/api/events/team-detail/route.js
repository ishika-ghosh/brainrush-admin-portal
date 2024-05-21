import EventTimings from "@models/eventTimings";
import Team from "@models/team";
import User from "@models/user";
import Admin from "@models/admin";
import Payment from "@models/payment";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@utils/db";
import EventDay from "@models/eventDay";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const teamId = searchParams.get("teamid");
  console.log(teamId);
  try {
    await connectToDatabase();
    let events = await EventDay.findOne({
      team: teamId,
    }).populate({ path: "team", populate: ["leader", "members"] });
    return NextResponse.json(events);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
export async function POST(req) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const event = new EventDay(body);
    const newEvent = await event.save();
    return NextResponse.json(newEvent);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
