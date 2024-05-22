import { NextResponse } from "next/server";
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

    const decoded = await jwtVerify(token, JWT_SECRET);

    if (!decoded) {
      return new NextResponse(
        JSON.stringify({
          errorMessage: "Invalid Bearer Token",
        })
      );
    }

    // Extract the signature from the decoded JWT token
    const signature = decoded["payload"]["signature"];

    const message = decoded["payload"]["message"];

    const signerAddress = ethers.utils.verifyMessage(message, signature);

    const { searchParams } = new URL(request.url);
    const address = searchParams.get("address");

    // Compare the extracted signer's address with the address parameter
    if (signerAddress.toLowerCase() !== address.toLowerCase()) {
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
