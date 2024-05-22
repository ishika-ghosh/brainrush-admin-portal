import Payment from "@models/payment";
import Admin from "@models/admin";
import { connectToDatabase } from "@utils/db";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import mongoose from "mongoose";
import Team from "@models/team";

export const dynamic = "force-dynamic";

export async function DELETE(req, { params }) {
  try {
    await connectToDatabase();
    const token = await getToken({ req });
    const admin = await Admin.findOne({ username: token?.username });
    if (!admin) {
      return NextResponse.json(
        { message: "Not a valid user" },
        { status: 403 }
      );
    }
    if (!admin.isSuperAdmin) {
      return NextResponse.json(
        { message: "Only super admin can delete" },
        { status: 403 }
      );
    }
    const { id } = params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(null);
    }
    const transaction = await Payment.findById(id).populate("team");
    const team = await Team.findByIdAndUpdate(
      transaction.team._id,
      {
        payment: false,
      },
      { new: true }
    );

    await Payment.deleteOne({ _id: id });
    return NextResponse.json(
      {
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching Transactions:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
