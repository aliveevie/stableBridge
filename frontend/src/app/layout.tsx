
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import Footer from "@/components/footer";
import { UserProvider } from "@/components/userContext";
import { WalletConnectProvider } from "@/contexts/WalletConnectContext";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "StableBridge - Cross-Chain Asset Transfers",
  description: "Seamless cross-chain asset transfers on Stacks blockchain",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletConnectProvider>
          <UserProvider>
            <Header />
            {children}
            <Toaster />
            <Footer />
          </UserProvider>
        </WalletConnectProvider>
      </body>
    </html>
  );
}
