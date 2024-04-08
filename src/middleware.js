import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { ethers } from "ethers";
import { jwtVerify } from "jose";

export async function middleware(request) {
  // Extract the JWT token from the cookie
  const token = request.cookies.get("jwt_token")?.value;
  const JWT_SECRET = new TextEncoder().encode("This is the msg for Jwt Token");

  if (!token) {
    return new NextResponse(
      JSON.stringify({
        errorMessage: "Bearer token not defined",
      })
    );
  }

  try {
    // Decode the JWT token to get the signature
    console.log(token);

    const decoded = await jwtVerify(token, JWT_SECRET);
    console.log(decoded);

    console.log("decoded", decoded);

    if (!decoded) {
      return new NextResponse(
        JSON.stringify({
          errorMessage: "Invalid Bearer Token",
        })
      );
    }

    // Extract the signature from the decoded JWT token
    const signature = decoded["payload"]["signature"];
    console.log(signature);
    const message = decoded["payload"]["message"];

    const signerAddress = ethers.utils.verifyMessage(message, signature);
    // Extract the 'address' parameter from the URL
    // const address = "0xe57f4c84539a6414C4Cf48f135210e01c477EFE0";
    const { searchParams } = new URL(request.url);
    const address = searchParams.get("address");
    console.log("address", address);
    console.log("Signeraddress", signerAddress);

    // Compare the extracted signer's address with the address parameter
    if (signerAddress.toLowerCase() !== address.toLowerCase()) {
      console.log("hereeeee")
      // If addresses don't match, return unauthorized response or handle accordingly
      return new NextResponse(
        JSON.stringify({
          errorMessage: "You are not Authorized to see others Labels",
        })
      );
    }

    // Continue with the request
    return NextResponse.next();
  } catch (error) {
    // If there's an error decoding or verifying the JWT token, handle it accordingly
    return new NextResponse(
      JSON.stringify({
        errorMessage: "Issue in middleware",
        error: error,
      })
    );
  }
}

export const config = {
  matcher: ["/api/all-user-data"],
};
