"use client";

import { useNonce } from "@/hooks/useNonce";
import { ConnectWallet } from "./Login/ConnectWallet";
import { useEffect } from "react";

export default function Home() {
  const { nonce, getNonce } = useNonce();

  useEffect(() => {
    getNonce();
  }, [getNonce]);

  if (!nonce) {
    return <>Not logged in</>;
  }

  return <ConnectWallet nonce={nonce} />;
}
