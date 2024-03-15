import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "VidVerse",
  description: "Video player app, with playlist and video playing controls.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`bg-gradient-to-tr from-navy to-semigrey ${inter.className}`}>{children}</body>
    </html>
  );
}
