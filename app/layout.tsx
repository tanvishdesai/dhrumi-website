import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RVFET.COM - Rafet Abbasli | Security Researcher & Software Engineer",
  description:
    "Personal website of Rafet Abbasli - Offensive Security Researcher and Senior Software Engineer from Baku, Azerbaijan. Specializing in vulnerability research, secure software development, and offensive tooling.",
  keywords: [
    "security researcher",
    "software engineer",
    "vulnerability research",
    "offensive security",
    "penetration testing",
    "web security",
    "cybersecurity",
  ],
  authors: [{ name: "Rafet Abbasli", url: "https://rvfet.com" }],
  creator: "Rafet Abbasli",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://rvfet.com",
    siteName: "RVFET.COM",
    title: "RVFET.COM - Rafet Abbasli",
    description:
      "Offensive Security Researcher and Senior Software Engineer from Baku, Azerbaijan.",
  },
  twitter: {
    card: "summary_large_image",
    title: "RVFET.COM - Rafet Abbasli",
    description:
      "Offensive Security Researcher and Senior Software Engineer from Baku, Azerbaijan.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
