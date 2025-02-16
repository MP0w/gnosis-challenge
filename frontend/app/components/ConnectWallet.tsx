import { useSignIn } from "@/hooks/useSignIn";
import { useWalletAuth } from "@/hooks/useWalletAuth";
import React, { useCallback, useEffect } from "react";
import { useAuthContext } from "../contexts/AuthContext";
import { useNonce } from "@/hooks/useNonce";

export function ConnectWallet() {
  const { user, setUser } = useAuthContext();
  const { execute: getNonce } = useNonce();
  const { connectedWallet, connect, disconnect } = useWalletAuth(getNonce);

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
    <div className="flex flex-col gap-4 items-center">
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
