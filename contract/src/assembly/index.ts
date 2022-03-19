import { context, MapEntry } from "near-sdk-as";
import { CreateNFT, NFT } from "./model";

interface Batch {
  id: u32, nftId: u16, metadata: string
}

export function createsNFT(name: string, description: string, totalSupply: u16, mintPrice: u16): CreateNFT {
  return CreateNFT.setupNFT(name, description, totalSupply, mintPrice);
}

// add NFT to the list
export function add(id: u32, nftId: u16, metadata: string): string {
  return NFT.addNFT(id, nftId, metadata, "");
}

export function addInBatch( nftDatas: Array<Batch> ): string {
  let result: NFT[] = [];
  assert(nftDatas.length > 0, "NFT data is empty");
  nftDatas.forEach(nftData => {
    result.push(new NFT(nftData.id as u32, nftData.nftId, nftData.metadata, context.sender, false, ""))
  });
  return NFT.addBatchNFT(result);
}

export function getDetails(id: u32): CreateNFT {
  return CreateNFT.get(id);
}

export function getNFTData(id: u32, nftId: u16): NFT {
  return NFT.get(id, nftId);
}

export function mintNFT(id: u32): string {
  return NFT.mint(id);
}

export function entries(): MapEntry<u32, CreateNFT>[] {
  return CreateNFT.entries();
}