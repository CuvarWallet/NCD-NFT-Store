#!/usr/bin/env bash

# exit on first error after this point to avoid redeploying with successful build
set -e

echo
echo ---------------------------------------------------------
echo "Step 0: Check for environment variable with contract name"
echo ---------------------------------------------------------
echo

[ -z "$CONTRACT" ] && echo "Missing \$CONTRACT environment variable" && exit 1
[ -z "$CONTRACT" ] || echo "Found it! \$CONTRACT is set to [ $CONTRACT ]"

echo
echo
echo ---------------------------------------------------------
echo "Step 1: Add a contract"
echo
echo "(run this script again to see changes made by this file)"
echo ---------------------------------------------------------
echo

near call $CONTRACT createsNFT '{"name":"Azuki", "description": "Azuki starts with a collection of 10,000 avatars that give you membership access to The Garden: a corner of the internet where artists, builders, and web3 enthusiasts meet to create a decentralized future.", "totalSupply": 5, "mintPrice": 1}' --accountId $CONTRACT

echo
echo
echo
echo ---------------------------------------------------------
echo "View all NFTs"
echo ---------------------------------------------------------
echo
echo

near view $CONTRACT entries

echo
echo
echo ---------------------------------------------------------
echo "View one NFT Data"
echo ---------------------------------------------------------
echo

near view $CONTRACT getDetails '{"id":2368191543}' --accountId $CONTRACT

echo
echo
echo ---------------------------------------------------------
echo "Step 2: Add NFT to Contract"
echo ---------------------------------------------------------
echo

echo ---------------------------------------------------------
echo "Adding First NFT to Collection"
echo ---------------------------------------------------------
near call $CONTRACT add '{"id": 2368191543, "nftId": 1, "metadata": "https://ikzttp.mypinata.cloud/ipfs/QmQFkLSQysj94s5GvTHPyzTxrawwtjgiiYS2TBLgrvw8CW/0"}' --accountId $CONTRACT
echo ---------------------------------------------------------
echo "Add Second NFT to Collection"
echo ---------------------------------------------------------
near call $CONTRACT add '{"id": 2368191543, "nftId": 2, "metadata": "https://ikzttp.mypinata.cloud/ipfs/QmQFkLSQysj94s5GvTHPyzTxrawwtjgiiYS2TBLgrvw8CW/1"}' --accountId $CONTRACT
echo ---------------------------------------------------------
echo "Add Third NFT to Collection"
echo ---------------------------------------------------------
near call $CONTRACT add '{"id": 2368191543, "nftId": 3, "metadata": "https://ikzttp.mypinata.cloud/ipfs/QmQFkLSQysj94s5GvTHPyzTxrawwtjgiiYS2TBLgrvw8CW/2"}' --accountId $CONTRACT

echo
echo
echo ---------------------------------------------------------
echo "Step 3: Adding 2 More NFT to Collection in batch"
echo ---------------------------------------------------------
echo

near call $CONTRACT addInBatch '[{"id": 2368191543, "nftId": 3, "metadata": "https://ikzttp.mypinata.cloud/ipfs/QmQFkLSQysj94s5GvTHPyzTxrawwtjgiiYS2TBLgrvw8CW/3"}, {"id": 2368191543, "nftId": 3, "metadata": "https://ikzttp.mypinata.cloud/ipfs/QmQFkLSQysj94s5GvTHPyzTxrawwtjgiiYS2TBLgrvw8CW/4"}]' --accountId $CONTRACT

echo
echo
echo ---------------------------------------------------------
echo "Step 4: Minting an NFT Collection"
echo ---------------------------------------------------------
echo

near call $CONTRACT mintNFT '{"id":2368191543}' --accountId $CONTRACT --amount 1
echo ---------------------------------------------------------
echo "Minting Second NFT"
echo ---------------------------------------------------------
near call $CONTRACT mintNFT '{"id":2368191543}' --accountId $CONTRACT --amount 1
echo ---------------------------------------------------------
echo "Minting Third NFT"
echo ---------------------------------------------------------
near call $CONTRACT mintNFT '{"id":2368191543}' --accountId $CONTRACT --amount 1
echo ---------------------------------------------------------
echo "Minting Fourth NFT"
echo ---------------------------------------------------------
near call $CONTRACT mintNFT '{"id":2368191543}' --accountId $CONTRACT --amount 1
echo ---------------------------------------------------------
echo "Minting Fifth NFT"
echo ---------------------------------------------------------
near call $CONTRACT mintNFT '{"id":2368191543}' --accountId $CONTRACT --amount 1

echo
echo
echo ---------------------------------------------------------
echo "Step 5: Check NFT Data and confirm owner"
echo ---------------------------------------------------------
echo

near view $CONTRACT getNFTData '{"id":2368191543 , "nftId": 1}' --accountId $CONTRACT

exit 0