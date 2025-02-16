"use client";

import { ConnectWallet } from "./components/ConnectWallet";
import { Profile } from "./components/Profile";
import { AuthProvider } from "./contexts/AuthContext";

export default function Home() {
  return (
    <AuthProvider>
      <div className="m-8 flex flex-col items-center justify-center space-y-8">
        <h1 className="text-3xl font-bold">_gnosis_challenge_</h1>
        <ConnectWallet />
        <Profile />
      </div>
    </AuthProvider>
  );
}
