import { useSignIn } from "@/hooks/useSignIn";
import { useWalletAuth } from "@/hooks/useWalletAuth";
import React, { useCallback, useEffect } from "react";
import { useAuthContext } from "../contexts/AuthContext";
import { useNonce } from "@/hooks/useNonce";
import { Button } from "./Button";

export function ConnectWallet() {
  const { user, setUser } = useAuthContext();
  const { execute: getNonce } = useNonce();
  const { connectedWallet, connect } = useWalletAuth(getNonce);

  const logout = useCallback(() => {
    setUser(null);
  }, [setUser]);

  const { signIn } = useSignIn();

  useEffect(() => {
    if (connectedWallet) {
      signIn(connectedWallet.message, connectedWallet.signature)
        .then((user) => {
          setUser(user);
        })
        .catch(() => {
          logout();
        });
    }
  }, [connectedWallet, signIn, setUser, logout]);

  return (
    <div className="flex flex-col gap-4 items-center">
      {user && (
        <Button variant="danger" onClick={() => logout()}>
          Logout
        </Button>
      )}
      {!user && (
        <Button
          onClick={async () => {
            connect(window);
          }}
        >
          Sign in with Ethereum
        </Button>
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
