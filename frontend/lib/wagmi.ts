import { http, createConfig } from "wagmi";
import { arbitrumSepolia } from "wagmi/chains";
import { injected } from "wagmi/connectors";

// Production configuration for Arbitrum Sepolia
export const config = createConfig({
  chains: [arbitrumSepolia],
  connectors: [
    injected(), // MetaMask, Coinbase Wallet, etc.
  ],
  transports: {
    // Use Arbitrum Sepolia with optimized settings for production
    [arbitrumSepolia.id]: http(
      process.env.NEXT_PUBLIC_RPC_URL || "https://sepolia-rollup.arbitrum.io/rpc",
      {
        timeout: 60_000, // 60 second timeout to prevent abort errors
        retryCount: 3, // Retry failed requests
        retryDelay: 1000, // Wait 1s between retries
      }
    ),
  },
  ssr: true, // Enable server-side rendering support for Vercel
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
