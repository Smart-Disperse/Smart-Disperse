import mongoose from "mongoose";
import { NextResponse } from "next/server";

const disperse_data = new mongoose.Schema({
  userid: String,
  chain: String,
});

export const smartdisperse_data =
  mongoose.models.datas || mongoose.model("datas", disperse_data);

mongoose.connect("mongodb+srv://princi:abcdefghijk@dispersesmart.4duwewu.mongodb.net/Smartdisperse")
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1); // Exit the process if MongoDB connection fails
  });

export async function GET() {
  console.log("GET request received");
  try {
    const data = await smartdisperse_data.find();
    console.log("smart disperse data:", data);
    return NextResponse.json({ result: data });
  } catch (err) {
    console.error("Error fetching data:", err);
    return new Response("Error fetching data", { status: 500 });
  }
}

export async function POST(request) {
  console.log("POST request received");
  try {
    const payload = await request.json();
    console.log("payload:", payload);

    // Check if userid is provided in the payload
    if (!payload.userid) {
      throw new Error("Userid is required");
    }

    // Check if there is already an entry with the same userid
    const existingData = await smartdisperse_data.findOne({ userid: payload.userid });

    if (existingData) {
      // Update the chain if an entry already exists
      existingData.chain = payload.chain;
      const updatedData = await existingData.save();
      console.log("Data updated successfully:", updatedData);
      return NextResponse.json({ result: updatedData });
    } else {
      // Create a new entry if no existing entry is found
      const newData = new smartdisperse_data({
        userid: payload.userid,
        chain: payload.chain,
      });
      
      const result = await newData.save();
      console.log("New data created successfully:", result);
      return NextResponse.json({ result });
    }
  } catch (err) {
    console.error("Error creating/updating data:", err);
    return new Response("Error creating/updating data", { status: 500 });
  }
}

