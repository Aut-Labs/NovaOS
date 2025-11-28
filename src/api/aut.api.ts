import { NetworkConfig } from "./ProviderFactory/network.config";
import { getNetworkConfigs } from "./network-configs";
import { environment } from "./environment";
import { AuthSig } from "@aut-labs/connector/lib/esm/aut-sig";

export const getAppConfig = (): Promise<NetworkConfig[]> => {
  return Promise.resolve(getNetworkConfigs(environment.networkEnv));
};

interface EncryptRequest {
  autSig: AuthSig;
  message: string;
  hubAddress: string;
}

export const encryptMessage = (body: EncryptRequest): Promise<string> => {
  return axios
    .post(`${environment.apiUrl}/task/encrypt`, body)
    .then((r) => r.data);
};
