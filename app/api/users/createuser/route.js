import { NextResponse } from "next/server";
import { connectToDatabase } from "@utils/db";
import Admin from "@models/admin";
import bcryptjs from "bcryptjs";
import { getToken } from "next-auth/jwt";

//create a new admin
export async function POST(req) {
  try {
    await connectToDatabase();

    const reqBody = await req.json();
    const { username, password, isSuperAdmin } = reqBody;
    console.log(isSuperAdmin);
    console.log(reqBody);

    const token = await getToken({ req });
    const admin = await Admin.findOne({ username: token?.username });
    if (!decoded) {
      return NextResponse.json({ error: "Not valid user", success: false });
    }
    const admin = await Admin.findById(decoded?.id);
    if (!admin.isSuperAdmin) {
      return NextResponse.json(
        {
          error: "Non super admin can not create a user",
        },
        { status: 400 }
      );
    }
    console.log(reqBody);
    const existingUser = await Admin.findOne({ username });
    if (existingUser) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 400 }
      );
    }
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    const newAdmin = new Admin({
      username,
      password: hashedPassword,
      isSuperAdmin,
    });
    const savedAdmin = await newAdmin.save();
    return NextResponse.json({ status: 200, savedAdmin });
  } catch (error) {
    console.log(error);
    // return NextResponse.json(
    //   { message: "Internal Server Error" },
    //   { status: 500 }
    // );
  }
}
