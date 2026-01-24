import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { cookies } from "next/headers";
import { DebugProvider } from "@/components/debug/debug-context";
import { DebugPanel } from "@/components/debug/debug-panel";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


// const JetBrainsMo

export const metadata: Metadata = {
  title: "Nextjs Appwrite starter",
  description: "appwrite next js starte with functional auth",
  authors: [{
    name: "Alaric senpai",
    url: "https://devcharles.me"
  }],
  keywords: ['nextjs-starter', 'appwrite-starter', 'auth', 'Oauth', 'dashboard', 'starter'],
  creator: "Alaric-senpai",
  robots: {
    index: true,
    follow: true
  }

};

import { Toaster } from "@/components/ui/sonner";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased w-screen min-h-screen`}
      >

          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <AuthProvider>
              <DebugProvider>
                {children}
                <Toaster position="top-right" richColors />
                <DebugPanel cookies={allCookies} />
              </DebugProvider>
            </AuthProvider>
          </ThemeProvider>

      </body>
    </html>
  );
}
