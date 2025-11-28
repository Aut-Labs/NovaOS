import { NetworkConfig } from "./ProviderFactory/network.config";

export const getNetworkConfigs = (networkEnv: string): NetworkConfig[] => {
  if (networkEnv === "mainnet") {
    return [PolygonMainnetConfig];
  }
  return [AmoyTestnetConfig];
};

const AmoyTestnetConfig: NetworkConfig = {
  name: "Amoy (Polygon)",
  chainId: 80002,
  network: "Amoy",
  disabled: false,
  rpcUrls: ["https://polygon-amoy.g.alchemy.com/v2/Skyi471bo5qu1UFfGLHf-DDo0kgKHeXW"],
  explorerUrls: ["https://www.oklink.com/amoy"],
  contracts: {
    autIDAddress: "0x19d4F2cC1D360425ddB912098Fea7d30C4478903",
    hubRegistryAddress: "0x3a992CDDa745d75A6A4E48f1DB648F259e6c16b4",
    taskRegistryAddress: "0x2EE333430233ED6ffc1bd9352B75d1EF1334f7B4",
    hubDomainsRegistryAddress: "0x66086AaCaaFA3ac6B407313aA3Fc8cB22ac59A1d",
    interactionFactoryAddress: "0xcdda7a4B03cC68EF8718529E2dE22d9F0e25852D",
    trustedForwarderAddress: "0x4CAB865F2f032E088062f4243A7C76729BB8A358",
    globalParametersAddress: "0xd1432B5A114d23beC6944B8D209FB90d93a8C838"
  },
  nativeCurrency: {
    name: "MATIC",
    symbol: "MATIC",
    decimals: 18
  }
};

const PolygonMainnetConfig: NetworkConfig = {
  name: "Polygon",
  chainId: 137,
  network: "Polygon",
  disabled: true,
  rpcUrls: ["https://polygon-mainnet.g.alchemy.com/v2/Skyi471bo5qu1UFfGLHf-DDo0kgKHeXW"],
  explorerUrls: ["https://polygonscan.com"],
  contracts: {
    autIDAddress: "",
    hubRegistryAddress: "",
    taskRegistryAddress: "",
    hubDomainsRegistryAddress: "",
    interactionFactoryAddress: "",
    trustedForwarderAddress: "",
    globalParametersAddress: ""
  },
  nativeCurrency: {
    name: "MATIC",
    symbol: "MATIC",
    decimals: 18
  }
};

