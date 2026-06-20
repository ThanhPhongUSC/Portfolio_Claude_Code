import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Phong Trinh — Full-Stack Software Engineer",
  description:
    "Full-stack software engineer specializing in secure, scalable SaaS and authentication systems. Chemistry PhD turned engineer building reliable production software with React, TypeScript & Node.js.",
  keywords: [
    "Phong Trinh",
    "Software Engineer",
    "Full-Stack",
    "React",
    "TypeScript",
    "Node.js",
    "Authentication",
    "Denver",
  ],
  authors: [{ name: "Phong Trinh" }],
  openGraph: {
    title: "Phong Trinh — Full-Stack Software Engineer",
    description:
      "Chemistry PhD turned full-stack engineer. Building secure, scalable SaaS and authentication systems.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${jetBrainsMono.variable} font-sans antialiased noise`}
      >
        {children}
      </body>
    </html>
  );
}
