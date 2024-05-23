import { NextResponse } from "next/server";
import { connectToDatabase } from "@utils/db";
import Admin from "@models/admin";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
// import { signJWT } from "@utils/jwt";
// import { cookies } from "next/headers";

export async function POST(request) {
  try {
    // const cookiesList = cookies();
    await connectToDatabase();
    const { username, password } = await request.json();

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return NextResponse.json({ message: "Username not found", status: 404 });
    }
    const validPassword = await bcryptjs.compare(password, admin.password);
    if (!validPassword) {
      return NextResponse.json(
        {
          message: "incorrect password",
        },
        { status: 400 }
      );
    }
    // const tokenData = {
    //   id: admin._id,
    //   name: admin.username,
    // };
    // const token = jwt.sign(tokenData, process.env.MONGO_SECRET, {
    //   expiresIn: "1d",
    // });
    const response = NextResponse.json({
      message: "login success",
      success: true,
      user: {
        username: admin.username,
        isSuperUser: admin.isSuperAdmin,
      },
    });
    // localStorage.setItem("token", token);
    // response.cookies.set("token", token);

    return response;
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
