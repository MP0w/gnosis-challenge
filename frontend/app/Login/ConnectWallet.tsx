import { useSignIn } from "@/hooks/useSignIn";
import { useWalletAuth } from "@/hooks/useWalletAuth";
import React, { useEffect } from "react";

interface ConnectWalletProps {
  nonce: string;
}

export function ConnectWallet({ nonce }: ConnectWalletProps) {
  const { connectedWallet, connect, disconnect } = useWalletAuth(nonce);

  const { signIn, isSignedIn } = useSignIn();

  useEffect(() => {
    if (connectedWallet) {
      signIn(connectedWallet.message, connectedWallet.signature);
    }
  }, [connectedWallet, signIn]);

  useEffect(() => {
    if (!isSignedIn) {
      disconnect();
    }
  }, [isSignedIn, disconnect]);

  const buttonStyle = "text-white font-bold py-2 px-4 rounded";
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-8">_gnosis_challenge_</h1>
      {connectedWallet === null && (
        <p>
          No wallet installed, please install a wallet like Rabby or Metamask.
          WalletConnect is not supported yet.
        </p>
      )}
      {connectedWallet && (
        <p className="mb-4">Signed in as {connectedWallet.address}</p>
      )}
      {!connectedWallet && (
        <button
          onClick={async () => {
            connect(window);
          }}
          className={`bg-blue-500 hover:bg-blue-700 ${buttonStyle}`}
        >
          Sign in with Ethereum
        </button>
      )}
      {connectedWallet && (
        <button
          onClick={() => disconnect()}
          className={`bg-red-500 hover:bg-red-700 ${buttonStyle}`}
        >
          Logout
        </button>
      )}
    </div>
  );
}
