"use client";

import { useWalletAuth } from "../hooks/useWalletAuth";

export default function Home() {
  const { address, connect, disconnect } = useWalletAuth();

  const buttonStyle = "text-white font-bold py-2 px-4 rounded";

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-8">_gnosis_challenge_</h1>
      {address === null && (
        <p>
          No wallet installed, please install a wallet like Rabby or Metamask.
          WalletConnect is not supported yet.
        </p>
      )}
      {address && <p className="mb-4">Signed in as {address}</p>}
      {!address && (
        <button
          onClick={async () => {
            connect(window);
          }}
          className={`bg-blue-500 hover:bg-blue-700 ${buttonStyle}`}
        >
          Sign in with Ethereum
        </button>
      )}
      {address && (
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
