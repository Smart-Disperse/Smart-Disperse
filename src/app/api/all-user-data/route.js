import mongoose from "mongoose";
import { NextResponse } from "next/server";
// import dotenv from "dotenv";
// dotenv.config();
// import { useAccount } from "wagmi";
// const { address } = useAccount();
const disperse_data = new mongoose.Schema({
  userid: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    maxlength: 10,
  },
  address: String,
});

export const smartdisperse_data =
  mongoose.models.name_userid_data ||
  mongoose.model("name_userid_data", disperse_data);

export async function GET(req) {
  let data = [];

  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address");

  try {
    await mongoose.connect(process.env.MONGODB_URL);

    data = await smartdisperse_data.find({
      userid: address,
    });
  } catch (err) {
    return new Response("Error connecting to the database", { status: 503 });
  }
  return NextResponse.json({ result: data });
}

export async function POST(request) {
  let result = null;

  try {
    await mongoose.connect(process.env.MONGODB_URL);
    const payload = await request.json();

    //check if name is already mapped to another address
    let existingName = await smartdisperse_data.findOne({
      name: payload.name,
      userid: payload.userid,
    });

    if (existingName) {
      return NextResponse.json({
        error: "Name is already alloted to other recipient address",
      });
    }

    let existingAddress = await smartdisperse_data.findOne({
      address: payload.address,
      userid: payload.userid,
    });

    // Check if the address already exists in the database
    let existingData = await smartdisperse_data.findOne({
      address: payload.address,
      userid: payload.userid,
    });
    if (existingAddress) {
      if (existingAddress.name !== payload.name) {
        existingAddress.name = payload.name;
        result = await existingAddress.save();
      } else {
        return new Response("Address already exists", { status: 400 });
      }
    } else {
      let newData = new smartdisperse_data(payload);
      result = await newData.save();
    }
  } catch (err) {
    console.log(err);
    return new Response("Error connecting to the database", { status: 503 });
  }
  return new Response(JSON.stringify({ message: "Success" }), { status: 200 });
}

export async function PUT(request) {
  let result = null;

  try {
    await mongoose.connect(process.env.MONGODB_URL);

    const payload = await request.json();

    let existingData = await smartdisperse_data.findOne({
      address: payload.address,
    });

    if (existingData) {
      existingData.name = payload.name;
      result = await existingData.save();
    } else {
      return new Response("Resource not found", { status: 404 });
    }
  } catch (err) {
    return new Response("Error connecting to the database", { status: 503 });
  }
  return NextResponse.json({ result: result });
}

export async function DELETE(request) {
  try {
    await mongoose.connect(process.env.MONGODB_URL);

    const payload = await request.json();

    // Delete the document matching the address
    const deleteResult = await smartdisperse_data.deleteOne({
      address: payload.address,
    });

    if (deleteResult.deletedCount > 0) {
      return new Response("Data deleted successfully", { status: 200 });
    } else {
      // If no document was deleted, return a 404 error
      return new Response("Resource not found", { status: 404 });
    }
  } catch (err) {
    console.log(err);
    return new Response("Error connecting to the database", { status: 503 });
  }
}
