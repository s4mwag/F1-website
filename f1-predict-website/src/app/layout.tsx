import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "SweF1",
  description: "Sveriges Största F1 Casino",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
