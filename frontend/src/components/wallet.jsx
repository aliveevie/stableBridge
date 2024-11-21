"use client";

import { useState, useEffect, useContext } from 'react';
import { Button } from './ui/button';
import { AppConfig, UserSession, showConnect } from "@stacks/connect";
import { UserContext } from '@/components/userContext';

export const WalletConnectButton = () => {
  const { userData, setUserData, tokens, setTokens } = useContext(UserContext);
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
  }, [setUserData]);

  
  return (
    <Button className="inline-flex"
      onClick={userData ? disconnectWallet : connectWallet}
    >
      {label}
    </Button>
  );
};
