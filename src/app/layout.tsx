import type { Metadata } from "next";
import "./globals.css";



export const metadata: Metadata = {
  title: "Sudoku Heatmap Generator",
  description: "Checks the difficulty of a Sudoku on a per-cell basis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      >
        {children}
      </body>
    </html>
  );
}
