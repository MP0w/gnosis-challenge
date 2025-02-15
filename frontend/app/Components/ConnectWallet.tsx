import { useSignIn } from "@/hooks/useSignIn";
import { useWalletAuth } from "@/hooks/useWalletAuth";
import React, { useCallback, useEffect } from "react";
import { useAuthContext } from "../contexts/AuthContext";

interface ConnectWalletProps {
  nonce: string;
}

export function ConnectWallet({ nonce }: ConnectWalletProps) {
  const { user, setUser } = useAuthContext();
  const { connectedWallet, connect, disconnect } = useWalletAuth(nonce);

  const logout = useCallback(() => {
    disconnect();
    setUser(null);
  }, [disconnect, setUser]);

  const { signIn, signedInUser } = useSignIn();

  useEffect(() => {
    if (connectedWallet) {
      signIn(connectedWallet.message, connectedWallet.signature);
    }
  }, [connectedWallet, signIn]);

  useEffect(() => {
    if (!signedInUser) {
      disconnect();
    }

    setUser(signedInUser ?? null);
  }, [signedInUser, disconnect, setUser]);

  const buttonStyle = "text-white font-bold py-2 px-4 rounded";
  return (
    <div>
      {user && (
        <button
          onClick={() => logout()}
          className={`bg-red-500 hover:bg-red-700 ${buttonStyle}`}
        >
          Logout
        </button>
      )}
      {!user && (
        <button
          onClick={async () => {
            connect(window);
          }}
          className={`bg-blue-500 hover:bg-blue-700 ${buttonStyle}`}
        >
          Sign in with Ethereum
        </button>
      )}

      {connectedWallet === null && (
        <p>
          No wallet installed, please install a wallet like Rabby or Metamask.
          WalletConnect is not supported yet.
        </p>
      )}
    </div>
  );
}
