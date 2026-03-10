import type { Metadata } from "next";
import { Sarabun } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { V3Provider } from "@/components/V3Provider";

const sarabun = Sarabun({
  variable: "--font-sarabun",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "ลุยดิวะ | CrossFit Open Thailand 2026",
  description: "วิเคราะห์ผลการแข่งขัน CrossFit Open Thailand 2026 แบบลึกๆ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className={`${sarabun.variable} font-sans antialiased min-h-screen`}>
        <V3Provider>
          <Navbar />
          {children}
        </V3Provider>
      </body>
    </html>
  );
}
