import { u128, VMContext, context } from "near-sdk-as";
import { createsNFT, add, getNFTData, mintNFT, addInBatch } from "../index";
import { createNFT, CreateNFT, NFT } from "../model";
import { toYocto } from "../utils";

let create: CreateNFT;
let nftOne: string, nftTwo: string, nftThree: string, nftFourFive: string;

beforeEach(() => {
  // creates an NFT collection
  create = createsNFT(
      "Azuki", 
      "Azuki starts with a collection of 10,000 avatars that give you membership access to The Garden: a corner of the internet where artists, builders, and web3 enthusiasts meet to create a decentralized future.",
      5,
      1
  );

  // add NFT to the list
  nftOne = add(
    create.id as u32,
    1,
    "ipfs://QmPv7wqpgpNrqU1L4sK6BJ4qszknFHuw9tX7ausREYiBYY",
  );
  nftTwo = add(
    create.id as u32,
    2,
    "ipfs://QmPv7wqpgpNrqU1L4sK6BJ4qszknFHuw9tX7ausREYiBYY",
  );
  nftThree = add(
    create.id as u32,
    3,
    "ipfs://QmPv7wqpgpNrqU1L4sK6BJ4qszknFHuw9tX7ausREYiBYY",
  );

  nftFourFive = addInBatch([
    new NFT( 
      create.id as u32, 
      4,
      "ipfs://QmPv7wqpgpNrqU1L4sK6BJ4qszknFHuw9tX7ausREYiBYY", 
      context.sender,
      false,
      ""
    ),
    new NFT( 
      create.id as u32, 
      5,
      "ipfs://QmPv7wqpgpNrqU1L4sK6BJ4qszknFHuw9tX7ausREYiBYY", 
      context.sender,
      false,
      ""
    ),
  ])
})

describe("NFT Creations", () => {
  it("Creates an NFT collection", () => {
      expect(createNFT.get(create.id)).toStrictEqual(create);
  });
});

describe("NFT Addition", () => {
  // add NFT to the collection
  it("Adds First NFT was added to collection", () => {
    expect(nftOne).toStrictEqual('✅ NFT 1 added successfully');
  });

  it("Second NFT was added to collection", () => {
    expect(nftTwo).toStrictEqual('✅ NFT 2 added successfully');
  });

  it("Third NFT was added to collection", () => {
    expect(nftThree).toStrictEqual('✅ NFT 3 added successfully');
  });

  it("Fourth NFT was added from batch to collection", () => {
    expect(nftFourFive).toStrictEqual('✅ All 2 NFTs added successfully');
  });

  it("Fifth NFT was added from batch to collection", () => {
    expect(nftFourFive).toStrictEqual('✅ All 2 NFTs added successfully');
  });
});

describe("Can't add already existing NFT", () => {
  it("Throw Error On adding NFT 1", () => {
    expect(() => {
      add(
        create.id as u32,
        1,
        "ipfs://QmPv7wqpgpNrqU1L4sK6BJ4qszknFHuw9tX7ausREYiBYY",
      );
    }).toThrow('NFT already exists');
  });
});

describe("Only the owner can add NFT", () => {
  it("Not Owner Error", () => {
    VMContext.setSigner_account_id("notOwner");
    expect(() => {
      add(
        create.id as u32,
        1,
        "ipfs://QmPv7wqpgpNrqU1L4sK6BJ4qszknFHuw9tX7ausREYiBYY",
      );
    }).toThrow('Only the owner can add NFT');
  });
});

describe("Shouldn't add past total supply", () => {
  it("Throw Error On Sixth NFT to collection", () => {
    expect(() => {
      add(
        create.id as u32,
        6,
        "ipfs://QmPv7wqpgpNrqU1L4sK6BJ4qszknFHuw9tX7ausREYiBYY",
      );
    }).toThrow('NFT id is greater than total supply');
  });
});

describe('Mint NFT', () => { 
  it('Mint Should fail, No deposit', () => {
    expect(() => {
      mintNFT(
        create.id as u32,
      );
    }).toThrow(`❌ Cannot mint, deposit must be ${create.mintPrice} NEAR`);
  });

  it(`Mint Should pass and owned by minter`, () => {
    // add deposits
    for(let i = 1; u128.from(i) <= u128.from(create.totalSupply); i++) {
      VMContext.setAttached_deposit(toYocto(create.mintPrice));
      // mint NFT
      const mint = mintNFT(
        create.id as u32,
      );
      log(`Minted NFT ${i}`);
      expect(mint).toStrictEqual(`✅ Minted No:${i} successfully with ${create.mintPrice} NEAR`);
    }

    // the last mint should fail
    VMContext.setAttached_deposit(toYocto(create.mintPrice));
    // mint NFT
    expect(() => {
      mintNFT(
        create.id as u32,
      )
    }).toThrow(`Mint has ended`);

    // NFT Owned by minter
    const nft = getNFTData(create.id as u32, 1);
    expect(nft.owner).toStrictEqual(context.sender);
  });
})