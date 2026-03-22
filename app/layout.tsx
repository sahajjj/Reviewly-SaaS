import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Reviewly - AI Code Review",
  description: "Get instant, structured AI-powered feedback on your code.",
};

import Providers from "@/components/Providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-slate-950 text-slate-50 antialiased`}>
        <Providers>
          {children}
          <Toaster position="bottom-right" reverseOrder={false} />
        </Providers>
      </body>
    </html>
  );
}
