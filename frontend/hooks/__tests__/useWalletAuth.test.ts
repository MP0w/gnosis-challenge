import { renderHook } from "@testing-library/react";
import { useWalletAuth } from "../useWalletAuth";
import { act } from "react";

describe("useWalletAuth", () => {
  const getNonce = () => Promise.resolve({ nonce: "nonce" });
  const mockWindow = {
    location: {
      protocol: "https:",
      host: "localhost:3000",
      origin: "https://localhost:3000",
    },
  } as unknown as Window;

  const mockSigner = {
    address: "0x452aA85C3aaDC7c0A7E6bda88e08374C0c56CE8f",
    signMessage: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize with undefined address", () => {
    const { result } = renderHook(() => useWalletAuth(getNonce));
    expect(result.current.connectedWallet).toBeUndefined();
  });

  it("should set address to null if ethereum provider is not available", async () => {
    const { result } = renderHook(() => useWalletAuth(getNonce));

    await act(async () => {
      await result.current.connect(mockWindow);
    });

    expect(result.current.connectedWallet).toBeNull();
  });

  it("should handle rejection during connection", async () => {
    const { result } = renderHook(() => useWalletAuth(getNonce));

    mockSigner.signMessage = jest
      .fn()
      .mockRejectedValueOnce(new Error("User rejected"));

    await act(async () => {
      await result.current.connect(mockWindow, mockSigner, () => "message");
    });

    expect(result.current.connectedWallet).toBeUndefined();
  });

  it("should connect and sign in successfully", async () => {
    const { result } = renderHook(() => useWalletAuth(getNonce));

    mockSigner.signMessage = jest.fn().mockResolvedValue("yup");

    await act(async () => {
      await result.current.connect(mockWindow, mockSigner, () => "message");
    });

    expect(result.current.connectedWallet?.address).toBe(mockSigner.address);
    expect(result.current.connectedWallet?.message).toBe("message");
    expect(result.current.connectedWallet?.signature).toBe("yup");
  });

  it("should disconnect successfully", async () => {
    const { result } = renderHook(() => useWalletAuth(getNonce));

    mockSigner.signMessage = jest.fn().mockResolvedValue("yup");

    await act(async () => {
      await result.current.connect(mockWindow, mockSigner, () => "message");
    });
    expect(result.current.connectedWallet).not.toBeUndefined();

    // Then disconnect
    await act(async () => {
      await result.current.disconnect();
    });
    expect(result.current.connectedWallet).toBeUndefined();
  });
});
