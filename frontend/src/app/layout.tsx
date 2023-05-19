import "./globals.css";
import Header from "@/src/layout/Header";
import Footer from "@/src/layout/Footer";
import { Providers } from "@/src/providers";
import { Help } from "../components/Help";

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
          <div>{children}</div>
          <Help />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
