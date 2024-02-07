"use-client";
import "./globals.css";

export const metadata = {
  title: "SmartDisperse",
  description:
    "All Chains, One Solution Cross-Disperse Your Crypto Transactions!",
};

// RootLayout component
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="body">{children}</body>
    </html>
  );
}
