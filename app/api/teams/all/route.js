import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@utils/db";
import { getToken } from "next-auth/jwt";
import Team from "@models/team";
import Admin from "@models/admin";

export async function GET(request) {
  await connectToDatabase();
  try {
    const token = await getToken({ req: request });
    const admin = await Admin.findOne({ username: token?.username });
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
