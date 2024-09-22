import { Contract, Provider } from "fuels";
import { getAssetDetails } from "./indexer";
import src20Abi from "./abis/src20-abi.json";

export async function getSRC20Metadata(assetId: string, provider: Provider): Promise<{ name: string | null, symbol: string | null, decimals: number | null }> {
  const details = await getAssetDetails(assetId, provider);
  if (!details) {
    throw new Error(`Asset with id ${assetId} not found`);
  }

  const contract = new Contract(details.contractId, src20Abi, provider);

  const assetIdStruct = { bits: assetId };

  const result = await contract.multiCall([
    contract.functions.name(assetIdStruct),
    contract.functions.symbol(assetIdStruct),
    contract.functions.decimals(assetIdStruct),
  ]).get();

  return {
    name: result.value[0],
    symbol: result.value[1],
    decimals: result.value[2],
  };
}
