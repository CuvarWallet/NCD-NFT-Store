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

near call $CONTRACT createsNFT '{"name":"Azuki", "description": "Azuki starts with a collection of 10,000 avatars that give you membership access to The Garden: a corner of the internet where artists, builders, and web3 enthusiasts meet to create a decentralized future.", "totalSupply": 5, "mintPrice": 1, "profilePic": "https://lh3.googleusercontent.com/H8jOCJuQokNqGBpkBN5wk1oZwO7LM8bNnrHCaekV2nKjnCqw6UB5oaH8XyNeBDj6bA_n1mjejzhFQUP3O1NfjFLHr3FOaeHcTOOT=s130", "banner": "https://lh3.googleusercontent.com/O0XkiR_Z2--OPa_RA6FhXrR16yBOgIJqSLdHTGA0-LAhyzjSYcb3WEPaCYZHeh19JIUEAUazofVKXcY2qOylWCdoeBN6IfGZLJ3I4A" }' --accountId $CONTRACT

near call $CONTRACT createsNFT '{"name":"CryptoPunks", "description": "CryptoPunks launched as a fixed set of 10,000 items in mid-2017 and became one of the inspirations for the ERC-721 standard. They have been featured in places like The New York Times, Christie’s of London, Art|Basel Miami, and The PBS NewsHour.", "totalSupply": 7, "mintPrice": 1, "profilePic": "https://lh3.googleusercontent.com/BdxvLseXcfl57BiuQcQYdJ64v-aI8din7WPk0Pgo3qQFhAUH-B6i-dCqqc_mCkRIzULmwzwecnohLhrcH8A9mpWIZqA7ygc52Sr81hE=s130", "banner": "https://lh3.googleusercontent.com/48oVuDyfe_xhs24BC2TTVcaYCX7rrU5mpuQLyTgRDbKHj2PtzKZsQ5qC3xTH4ar34wwAXxEKH8uUDPAGffbg7boeGYqX6op5vBDcbA" }' --accountId $CONTRACT

near call $CONTRACT createsNFT '{"name":"Ruggies", "description": "Ruggies is a Community that was built as a place where you can share and check in with what you are going through. With the Ruggies community we want to create with good vibes and a friendly atmosphere where people feel comfortable talking about what is on their mind.", "totalSupply": 5, "mintPrice": 1, "profilePic": "https://lh3.googleusercontent.com/bkKaof42Om6tsa0d1cUqZLZ9hmjP09nWkWMWuoeecidkwEgXd5uNdiKSFpYKwenbOmz2i0IXoz7LZnHs_TznUujPQgUt4eHnFdZX2g=s130", "banner": "https://lh3.googleusercontent.com/d_Yoz54-R7KmJc8dvLK1p59xkNFZrSowGtUbhLYZV0BXvv6qt_34dtjDFnNS1Q6la4UKNN8H_Z3J3lMAv27kAwTebQsns4MqqODERA" }' --accountId $CONTRACT

near call $CONTRACT createsNFT '{"name":"Cozy Bears", "description": "444 wild genesis Cozy Bears woke up from hibernation. Our goal is to involve the community in every step of the roadmap while also funding and supporting members own ideas and projects.", "totalSupply": 5, "mintPrice": 1, "profilePic": "https://lh3.googleusercontent.com/Mat6pAVXEE0HI1X5PC9L9kabqC6xJzosI7gkT368reqGF7clACwMOMxnllY4IlKK039QFddHQmlCtmH_ffLlwvdFg3-ziFmUd1-bsA=s130", "banner": "https://lh3.googleusercontent.com/q5KsGE2QVLeiD51Iay9h7EQg5EGQP95yu9-EgzKfrkMBM3BdiALekmcrCMu4zJM-AwIhR0VY-iF2KlT1pzYArL-0iLan4dz2D3OZAA" }' --accountId $CONTRACT

near call $CONTRACT createsNFT '{"name":"Hape Prime", "description": "8K NEXT-GENERATION, HIGH FASHION HAPES Unique, fully 3D and built to unite the ape multiverse. Designed and styled by Digimental.", "totalSupply": 5, "mintPrice": 1, "profilePic": "https://lh3.googleusercontent.com/5VAunHscTO5Nt8WgCezb0i2oVskplFVhVgwmvISfiWQlrBulCxUL7zCYUkRfVF04_47QmNlpWqqdfVraThlhLBEZjuWzajmYDYc9vOc=s130", "banner": "https://lh3.googleusercontent.com/xryD6BiWXv4tieZ6i7YOqrHMkupKILo9Y0yrz3JX-V17dcmwk3ic9kRFsYIF8YBZNVhq0k7uuEV5PokfRT8UJG8AM3I3o4LxwgqOyFo" }' --accountId $CONTRACT

near call $CONTRACT createsNFT '{"name":"BAYC", "description": "The Bored Ape Yacht Club is a collection of 10,000 unique Bored Ape NFTs— unique digital collectibles living on the Ethereum blockchain.", "totalSupply": 5, "mintPrice": 1, "profilePic": "https://lh3.googleusercontent.com/Ju9CkWtV-1Okvf45wo8UctR-M9He2PjILP0oOvxE89AyiPPGtrR3gysu1Zgy0hjd2xKIgjJJtWIc0ybj4Vd7wv8t3pxDGHoJBzDB=s130", "banner": "https://lh3.googleusercontent.com/i5dYZRkVCUK97bfprQ3WXyrT9BnLSZtVKGJlKQ919uaUB0sxbngVCioaiyu9r6snqfi2aaTyIvv6DHm4m2R3y7hMajbsv14pSZK8mhs" }' --accountId $CONTRACT

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
echo ---------------------------------------------------------
echo "Add Forth NFT to Collection"
echo ---------------------------------------------------------
near call $CONTRACT add '{"id": 2368191543, "nftId": 4, "metadata": "https://ikzttp.mypinata.cloud/ipfs/QmQFkLSQysj94s5GvTHPyzTxrawwtjgiiYS2TBLgrvw8CW/3"}' --accountId $CONTRACT
echo ---------------------------------------------------------
echo "Add Fifth NFT to Collection"
echo ---------------------------------------------------------
near call $CONTRACT add '{"id": 2368191543, "nftId": 5, "metadata": "https://ikzttp.mypinata.cloud/ipfs/QmQFkLSQysj94s5GvTHPyzTxrawwtjgiiYS2TBLgrvw8CW/4"}' --accountId $CONTRACT


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

echo
echo
echo ---------------------------------------------------------
echo "Step 6: Owner lists NFT"
echo ---------------------------------------------------------
echo

near call $CONTRACT listNFT '{"id":2368191543, "nftId": 1, "price": 1 }' --accountId $CONTRACT

echo
echo
echo ---------------------------------------------------------
echo "Step 7: Someone buys it"
echo ---------------------------------------------------------
echo

near call $CONTRACT buyNFT '{"id":2368191543, "nftId": 1 }' --accountId $CONTRACT --amount 1

echo
echo
echo ---------------------------------------------------------
echo "Step 8: Check NFT Data and confirm owner again"
echo ---------------------------------------------------------
echo

near view $CONTRACT getNFTData '{"id":2368191543 , "nftId": 1}' --account_id giftie.testnet


exit 0