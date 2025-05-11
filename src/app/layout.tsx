import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from '@/components/ClientLayout'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Swag AI - Your AI Personal Stylist",
  description: "Get AI-powered outfit suggestions and style recommendations",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
