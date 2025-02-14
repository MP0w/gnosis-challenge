import { Eip1193Provider } from "ethers";
import { BrowserProvider } from "ethers";
import { useState, useCallback } from "react";
import { SiweMessage } from "siwe";

interface Signer {
  address: string;
  signMessage: (message: string) => Promise<void>;
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
      await signer.signMessage(message);
    },
  } as Signer;
}

function createSiweMessage(window: Window, address: string, statement: string) {
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
  });
  return message.prepareMessage();
}

export function useWalletAuth() {
  const [address, setAddress] = useState<string | undefined | null>(undefined);
  const signIn = useCallback(
    async ({ signer, message }: { signer: Signer; message: string }) => {
      await signer.signMessage(message);

      setAddress(signer.address);
    },
    []
  );

  const connect = useCallback(
    async (
      window: Window,
      messageSigner?: Signer,
      createMessage?: () => string
    ) => {
      const signer = messageSigner ?? (await getBrowserSigner(window));
      if (!signer) {
        setAddress(null);
        return;
      }

      const message =
        createMessage?.() ??
        createSiweMessage(window, signer.address, "Sign in");

      signIn({
        signer,
        message,
      }).catch(() => {
        console.info("user rejected");
        setAddress(undefined);
      });
    },
    [signIn]
  );

  const disconnect = useCallback(async () => {
    setAddress(undefined);
  }, []);

  return {
    address,
    connect,
    disconnect,
  };
}
