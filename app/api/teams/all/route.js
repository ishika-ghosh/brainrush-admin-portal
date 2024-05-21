import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@utils/db";
import { getDetails } from "@utils/getDetails";
import Team from "@models/team";

export async function GET(request) {
  await connectToDatabase();
  try {
    const admin = getDetails(request);
    if (!admin) {
      return NextResponse.json({ error: "Not valid user", success: false });
    }
    const teams = await Team.find({}).populate("leader").populate("members");
    return NextResponse.json({
      success: true,
      teams: teams,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
