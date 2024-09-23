"use client";

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { AppConfig, UserSession, showConnect } from "@stacks/connect";

export const WalletConnectButton = () => {
  const [userData, setUserData] = useState(undefined);
  const [label, setLabel] = useState("Connect");

  const appConfig = new AppConfig(["store_write"]);
  const userSession = new UserSession({ appConfig });

  const appDetails = {
    name: "StableBridge",
    icon: "https://freesvg.org/img/1541103084.png", // Replace with your icon URL
  };

  const connectWallet = () => {
    showConnect({
      appDetails,
      onFinish: () => {
        const data = userSession.loadUserData();
        setUserData(data);
        setLabel("Disconnect");
      },
      userSession,
    });
  };

  const disconnectWallet = () => {
    userSession.signUserOut();
    setUserData(undefined);
    setLabel("Connect");
  };

  useEffect(() => {
    if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then((data) => {
        setUserData(data);
        if (data) {
          setLabel("Disconnect");
        }
      });
    } else if (userSession.isUserSignedIn()) {
      setUserData(userSession.loadUserData());
      setLabel("Disconnect");
    }
  }, []);

  return (
    <Button className="hidden md:inline-flex"
      onClick={userData ? disconnectWallet : connectWallet}
    >
      {label}
    </Button>
  );
};
