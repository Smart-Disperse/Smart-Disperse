import { Providers } from "@/Providers";
import "./globals.css";
import { Roboto } from "next/font/google";
import { ThemeProvider } from "@/Components/Themeprovider";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
});

export const metadata = {
  title: "SmartDisperse",
  description:
    "All Chains, One Solution Cross-Disperse Your Crypto Transactions!",
};

// RootLayout component
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
