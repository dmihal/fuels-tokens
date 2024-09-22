import { Provider } from "fuels";

function query<T = any>(query: string, chainId: number): Promise<T> {
  return fetch("https://cryptostats.squids.live/token-indexer/v/v1/graphql", {
    headers: {
      "content-type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ query }),
  }).then((res) => res.json()).then((res: any) => res.data);
}

export async function getAssetDetails(assetId: string, provider: Provider): Promise<{ contractId: string, subId: string } | null> {
  const result = await query(`query MyQuery {
    assetById(id: "${assetId}") {
      subId
      contractId
    }
  }`, provider.getChainId());

  return result.assetById ? result.assetById : null;
}

export async function getAllAssets(contractId: string, provider: Provider): Promise<{ id: string, subId: string }[]> {
  const result = await query(`query MyQuery {
    assetsByContractId(contractId: "${contractId}") {
      id
      subId
    }
  }`, provider.getChainId());

  return result.assetsByContractId;
}
