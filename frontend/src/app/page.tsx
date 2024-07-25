"use client";
import { Header } from "@/components/header";
import { Hero1 } from "@/components/hero1";
import { Hero2 } from "@/components/hero2";
import { Hero3 } from "@/components/hero3";
import {
  AppConfig,
  UserSession,
 // AuthDetails,
  showConnect,
} from "@stacks/connect";

export default function Home() {

  const appConfig = new AppConfig(["store_write"]);
  const userSession = new UserSession({ appConfig });

  const appDetails = {
    name: "StableBridge",
    icon: "https://i.postimg.cc/1tHS3xK0/Screenshot-from-2024-07-25-11-47-57.png",
  };

  const connectWallet = () => {
    showConnect({
      appDetails,
      onFinish: () => window.location.reload(),
      userSession,
    });
    console.log("You are clicking!")
  };

  return (
    <>
      <Header connectWallet={connectWallet} />
      <Hero1 />
      <Hero2 />
      <Hero3 />
    </>
  );
}
