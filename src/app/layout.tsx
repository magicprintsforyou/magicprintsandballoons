import type { Metadata } from "next";
import "./globals.css";
import Navbar from "../components/Navbar";
import AIAssistant from "../components/AIAssistant";
import Footer from "../components/Footer";
import LiveChat from "../components/LiveChat";
import { ProductProvider } from "../context/ProductContext";

export const metadata: Metadata = {
  title: "Magic Prints For You - Express Event Catalog",
  description: "Transform your events with our custom large-format prints and express delivery.",
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
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Dancing+Script:wght@700&family=Cinzel+Decorative:wght@700;900&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
      </head>
      <body className="antialiased min-h-screen flex flex-col font-sans">
        <ProductProvider>
          <Navbar />
          <AIAssistant />

          <main className="flex-grow relative pt-8">
            {/* Subtle background glow effect like the V2 site */}
            <div className="absolute top-0 left-0 w-full h-[800px] overflow-hidden -z-10 pointer-events-none">
              <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#ff2a70]/20 blur-[120px]"></div>
              <div className="absolute top-[10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#00f2fe]/10 blur-[120px]"></div>
            </div>
            {children}
          </main>
          <Footer />
          <LiveChat />
        </ProductProvider>
      </body>
    </html>
  );
}
