import { Rubik } from "next/font/google";
import "../globals.css";
import ReactQueryProvider from "@/lib/react-query-provider";

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
});

export const metadata = {
  title: "Tech Gear | Admin",
  description: "Admin Dashboard for Tech Gear",
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${rubik.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full font-rubik bg-[#000918] text-white">
        <ReactQueryProvider>
          {children}
        </ReactQueryProvider>
      </body>
    </html>
  );
}
