import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppHeader from "./_components/app-header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wook Board · Refined Community Space",
  description:
    "Apple Store 감성의 섬세한 Wook 커뮤니티. 공지, 자유, Q&A, 정보 게시판을 정제된 인터페이스에서 경험하세요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased`}>
        <div className="mx-auto flex min-h-screen w-full max-w-[1180px] flex-col px-5 pb-20 pt-10 sm:px-8 lg:px-14 fade-in">
          <AppHeader />
          <main className="grow pt-8 fade-up fade-delay-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
