import type { Metadata } from "next";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LiveChat from "../components/LiveChat";
import { ProductProvider } from "../context/ProductContext";

export const metadata: Metadata = {
  title: "magicprintsandballoons — Custom Prints & Premium Balloons",
  description: "Custom photo boards, cutouts, backdrops, floor wraps, SemperTex & TufTex balloons, DIY garland kits. Pickup in Arlington, local delivery, nationwide shipping.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Dancing+Script:wght@700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
      </head>
      <body className="antialiased min-h-screen flex flex-col font-sans bg-white text-slate-900">
        <ProductProvider>
          <Navbar />
          <main className="flex-grow pt-[104px] md:pt-[120px]">
            {children}
          </main>
          <Footer />
          <LiveChat />
        </ProductProvider>
      </body>
    </html>
  );
}
