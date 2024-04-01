"use client";
import { Providers } from "@/Providers";
import "./globals.css";
import { Roboto } from "next/font/google";
import { ThemeProvider } from "@/Components/Themeprovider";
import Navbar from "@/Components/Navbar/Navbar";
import React from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
});

// RootLayout component
export default function RootLayout({ children }) {
  const router = useRouter();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-TCL85RRP');
            `,
          }}
        />
      </head>
      <body className={roboto.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>{children}</Providers>
        </ThemeProvider>
        <noscript
          dangerouslySetInnerHTML={{
            __html: `
           <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TCL85RRP"
            height="0" width="0" style="display:none;visibility:hidden"></iframe>
            `,
          }}
        />
      </body>
    </html>
  );
}
