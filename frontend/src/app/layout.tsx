import "./globals.css";
import Header from "@/src/layout/Header";
import Footer from "@/src/layout/Footer";
import React from "react";
import { Providers } from "@/src/providers";

export const metadata = {
  title: "Tilim.uz",
  description: "",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />
          <div className="main__wrapper">{children}</div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
