import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

const inter = { className: "font-sans" };

export const metadata: Metadata = {
  title: "Vibe Coach — AI Interview & Pitch Coach",
  description:
    "Level up your interview game and portfolio pitch with AI-powered coaching. Practice questions and get instant feedback.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link href="/" className="font-bold text-indigo-600 text-lg">
              🎯 Vibe Coach
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/app"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Start Session
              </Link>
              <Link
                href="/app/sessions"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                My Sessions
              </Link>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
