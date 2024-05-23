import { NextResponse } from "next/server";
import { connectToDatabase } from "@utils/db";
import User from "@models/user";
import Admin from "@models/admin";
import { getToken } from "next-auth/jwt";

export async function GET(request) {
  await connectToDatabase();
  const token = await getToken({ req: request });
  // console.log(token.username);
  const admin = await Admin.findOne({ username: token?.username });
  if (!admin) {
    return NextResponse.json({ error: "Not valid user", success: false });
  }
  if (!admin.isSuperAdmin) {
    return NextResponse.json(
      { message: "Only super admins are allowed" },
      { status: 400 }
    );
  }
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "";
  const page = searchParams.get("page") || 1;
  const queries = search
    ? {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      }
    : {};
  const limit = 10;
  const skip = (page - 1) * limit;
  // console.log({ queries });
  // console.log({ sort });
  try {
    const count = await User.find(queries).count();
    const users = await User.find(queries).sort(sort).skip(skip).limit(limit);
    return NextResponse.json({
      success: true,
      message: "All registered teams",
      count: Number(count),
      limit: Number(limit),
      data: users,
    });
  } catch (error) {
    console.error("Error fetching team names:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
