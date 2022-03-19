import { math, MapEntry, context, PersistentUnorderedMap, u128, PersistentVector } from "near-sdk-as";
import { toYocto } from "../utils";
import { hash } from "./utils";

type AccountId = string;

export const nftData = new PersistentUnorderedMap<string, NFT>("nftData");
export const createNFT = new PersistentUnorderedMap<u32, CreateNFT>("createNFT");
export const nftOwner = new PersistentUnorderedMap<AccountId, u32[]>("nftOwner");
export const minted = new PersistentUnorderedMap<u32, u128>("minted");

@nearBindgen
export class CreateNFT {
  id: u32;

  constructor(
    public name: string, 
    public description: string,
    public totalSupply: u16,
    public maker: string,
    public mintPrice: u16,
  ) {
    this.id = hash(name);
    this.maker = maker;
    this.mintPrice = mintPrice;
  }

  static setupNFT(name: string, description: string, totalSupply: u16, mintPrice: u16): CreateNFT {
    assert(createNFT.get(hash(name)) == null, "NFT already exists");

    const setupNFT = new CreateNFT(name, description, totalSupply, context.sender, mintPrice);
    // creating a new NFT
    createNFT.set(setupNFT.id, setupNFT);
    // adding owner of the NFT
    let ownerNFT = nftOwner.get(context.sender);

    // check if owner already has NFT
    if (ownerNFT == null) {
      ownerNFT = [];
    }

    // add NFT to the list
    ownerNFT.push(setupNFT.id);
    nftOwner.set(context.sender, ownerNFT);

    // add minted amount
    minted.set(setupNFT.id, u128.from(0));

    return setupNFT;
  }

  static entries(): MapEntry<u32, CreateNFT>[] {
    const entries = createNFT.entries();
    return entries;
  }

  static get(id: u32): CreateNFT {
    const getNFT = createNFT.get(id)!;
    return getNFT;
  }

  static getOwnerNFT(): u32[] {
    const getNFTOwner = nftOwner.get(context.sender)!;
    return getNFTOwner;
  }
}


@nearBindgen
export class NFT {
  constructor(
    public id: u32,
    public nftId: u16, 
    public metadata: string, 
    public maker: string,
    public minted: bool = false, 
    public owner: string = ""
  ) {
    this.id = id;
    this.nftId = nftId;
    this.metadata = metadata;
    this.minted = minted;
    this.owner = owner;
    this.maker = maker;
  }

  // add single NFT
  static addNFT(id: u32, nftId: u16, metadata: string, owner: string): string {
    assert(createNFT.get(id) != null, "NFT does not exist");
    assert(createNFT.get(id)!.maker == context.sender, "Only the owner can add NFT");
    assert(nftData.get(`${id}_${nftId}`) == null, "NFT already exists");

     // get total supply
    const totalSupply = createNFT.get(id)!.totalSupply;

    assert(totalSupply >= nftId, "NFT id is greater than total supply");

    const nft = new NFT(id, nftId, metadata, context.sender, false, owner);
    
    nftData.set(`${id}_${nftId}`, nft);
    return `✅ NFT ${nftId} added successfully`;
  }

  // add NFT data as batch
  static addBatchNFT( nftDatas: Array<NFT> ): string {
    for(let i = 0; i < nftDatas.length; i++) {
      assert(createNFT.get(nftDatas[i].id) != null, "NFT does not exist");
      assert(createNFT.get(nftDatas[i].id)!.maker == context.sender, "Only the owner can add NFT");
      assert(nftData.get(`${nftDatas[i].id}_${nftDatas[i].nftId}`) == null, "NFT already exists");

      // get total supply
      const totalSupply = createNFT.get(nftDatas[i].id)!.totalSupply;

      assert(totalSupply >= nftDatas[i].nftId, "NFT id is greater than total supply");

      const nft = new NFT(nftDatas[i].id, nftDatas[i].nftId, nftDatas[i].metadata, context.sender, false, nftDatas[i].owner);

      nftData.set(`${nftDatas[i].id}_${nftDatas[i].nftId}`, nft);
    }
    return `✅ All ${nftDatas.length} NFTs added successfully`;
  }

  static get(id: u32, nftId: u16): NFT {
    const getNFT = nftData.get(`${id}_${nftId}`)!;
    return getNFT;
  }

  static mint(id: u32) : string {
    // attach deposit for mint
    const deposit = context.attachedDeposit;
    const getNFTData = createNFT.get(id)!;

    assert(deposit > u128.Zero, "Deposit must be greater than 0");
    assert(deposit == toYocto(getNFTData.mintPrice), `❌ Cannot mint, deposit must be ${getNFTData.mintPrice} NEAR`);

    const currentId = u128.add(minted.get(id)!, u128.from(1));

    // check if mint completed
    assert(minted.get(id)! <= u128.from(getNFTData.totalSupply), "Mint has ended");
    assert(nftData.get(`${id}_${currentId}`) !== null, "NFT does not exists");

    // update minted to true
    const nft = nftData.get(`${id}_${currentId}`)!;
    nft.minted = true;
    nft.owner = context.sender;
    nftData.set(`${id}_${currentId}`, nft);
    
    minted.set(id, currentId);
    return `✅ Minted No:${currentId} successfully with ${getNFTData.mintPrice} NEAR`;
  }
}

@nearBindgen
export class NFTSales {
  buy(id: u32, nftId: u16): string {
      //  ContractPromiseBatch.create(target_account_id).transfer(u128.sub(context.attachedDeposit, message_fee));
      return "";
  }
}