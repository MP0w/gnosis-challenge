"use client";

import { useNonce } from "@/hooks/useNonce";
import { ConnectWallet } from "./components/ConnectWallet";
import { useEffect } from "react";
import { Profile } from "./components/Profile";
import { AuthProvider } from "./contexts/AuthContext";

export default function Home() {
  const { nonce, getNonce } = useNonce();

  useEffect(() => {
    getNonce();
  }, [getNonce]);

  if (!nonce) {
    return <>Loading...</>;
  }

  return (
    <AuthProvider>
      <div className="m-8 flex flex-col items-center justify-center space-y-8">
        <h1 className="text-3xl font-bold">_gnosis_challenge_</h1>
        <ConnectWallet nonce={nonce} />
        <Profile />
      </div>
    </AuthProvider>
  );
}
