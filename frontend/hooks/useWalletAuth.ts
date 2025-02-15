import { Eip1193Provider } from "ethers";
import { BrowserProvider } from "ethers";
import { useState, useCallback } from "react";
import { SiweMessage } from "siwe";

interface Signer {
  address: string;
  signMessage: (message: string) => Promise<string>;
}

async function getBrowserSigner(window: Window) {
  const win = window as unknown as Window & {
    ethereum: Eip1193Provider | null;
  };

  if (!win.ethereum) {
    return null;
  }

  const provider = new BrowserProvider(win.ethereum);
  const signer = await provider.getSigner();

  return {
    address: signer.address,
    signMessage: async (message: string) => {
      return await signer.signMessage(message);
    },
  } as Signer;
}

function createSiweMessage(
  window: Window,
  address: string,
  statement: string,
  nonce: string
) {
  const scheme = window.location.protocol.slice(0, -1);
  const domain = window.location.host;
  const origin = window.location.origin;

  const message = new SiweMessage({
    scheme,
    domain,
    address,
    statement,
    uri: origin,
    version: "1",
    chainId: 1,
    nonce,
  });
  return message.prepareMessage();
}

type ConnectedWaller = {
  address: string;
  message: string;
  signature: string;
};

export function useWalletAuth(nonce: string) {
  const [connectedWallet, setConnectedWallet] = useState<
    ConnectedWaller | undefined | null
  >(undefined);
  const signIn = useCallback(
    async ({ signer, message }: { signer: Signer; message: string }) => {
      const signature = await signer.signMessage(message);

      setConnectedWallet({
        address: signer.address,
        message,
        signature,
      });
    },
    []
  );

  const connect = useCallback(
    async (
      window: Window,
      messageSigner?: Signer,
      createMessage?: (nonce: string) => string
    ) => {
      try {
        const signer = messageSigner ?? (await getBrowserSigner(window));
        if (!signer) {
          setConnectedWallet(null);
          return;
        }

        const message =
          createMessage?.(nonce) ??
          createSiweMessage(window, signer.address, "Sign in", nonce);

        signIn({
          signer,
          message,
        });
      } catch (err) {
        console.info("user rejected", err);
        setConnectedWallet(undefined);
      }
    },
    [signIn, nonce]
  );

  const disconnect = useCallback(async () => {
    setConnectedWallet(undefined);
  }, []);

  return {
    connectedWallet,
    connect,
    disconnect,
  };
}
