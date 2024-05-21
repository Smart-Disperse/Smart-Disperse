"use client";
import { Providers } from "@/Providers";
import "./globals.css";
import { Poppins } from "next/font/google";
import { ThemeProvider } from "@/Components/Themeprovider";
import Navbar from "@/Components/Navbar/Navbar";
import React from "react";
import { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

const Poppin = Poppins({
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
        ></link>
      </head>
      <body className={Poppin.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <Toaster position="top-right" />
            {children}
          </Providers>
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
