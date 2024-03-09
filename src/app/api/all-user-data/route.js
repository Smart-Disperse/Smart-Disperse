import mongoose from "mongoose";
import { NextResponse } from "next/server";
// const { default: mongoose } = require("mongoose");
const disperse_data = new mongoose.Schema({
  userid: {
    type: String,
    required: true,
  },
  name: String,
  address: String,
});

export const smartdisperse_data =
  mongoose.models.tnx || mongoose.model("tnx", disperse_data);

export async function GET() {
  let data = [];
  console.log("Connecting to MongoDB...");
  try {
    await mongoose.connect(
      "mongodb+srv://princi:abcdefghijk@dispersesmart.4duwewu.mongodb.net/Smartdisperse?retryWrites=true&w=majority"
    );
    console.log("Connected to MongoDB!!");
    data = await smartdisperse_data.find();
    console.log("smart disperse data:", data);
  } catch (err) {
    return new Response("Error connecting to the database", { status: 503 });
  }
  return NextResponse.json({ result: data });
}

export async function POST(request) {
  console.log("entered into post function");
  let result = null;
  console.log("Connecting to MongoDB...");
  try {
    await mongoose.connect(
      "mongodb+srv://princi:abcdefghijk@dispersesmart.4duwewu.mongodb.net/Smartdisperse?retryWrites=true&w=majority"
    );
    console.log("Connected to MongoDB!!");
    const payload = await request.json();
    console.log("payload:", payload);

    // Check if the address already exists in the database
    let existingData = await smartdisperse_data.findOne({
      address: payload.address,
    });

    if (existingData) {
      // If address exists, update the name field
      existingData.name = payload.name;
      result = await existingData.save();
      console.log("Data updated successfully");
    } else {
      // If address doesn't exist, create a new entry
      let newData = new smartdisperse_data(payload);
      result = await newData.save();
      console.log("New data created successfully");
    }
  } catch (err) {
    console.log(err);
    return new Response("Error connecting to the database", { status: 503 });
  }
  return NextResponse.json({ result: result });
}
