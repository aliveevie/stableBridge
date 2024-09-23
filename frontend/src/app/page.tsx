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
  disconnect
} from "@stacks/connect";
import { useEffect, useState } from "react";

import * as MicroStacks from '@micro-stacks/react';
import { AppProps } from "next/app";
import { ClientProvider } from "@micro-stacks/react";
import Head from "next/head";



export default function Home() {

  const appConfig = new AppConfig(["store_write"]);
  const userSession = new UserSession({ appConfig });

  const [userData, setUserData] = useState<any>([]);

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
   // console.log("You are clicking!")
  };



  useEffect(() => {
    if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then((userData: any) => {
        setUserData(userData);
      });
    } else if (userSession.isUserSignedIn()) {
      setUserData(userSession.loadUserData());
    }
  }, []);
  
  console.log(userData);

  return (
    <>
    
      <Header />
      <Hero1 />
      <Hero2 />
      <Hero3 />
    </>
  );
}
