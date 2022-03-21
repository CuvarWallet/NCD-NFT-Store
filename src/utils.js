import { connect, Contract, keyStores, WalletConnection, utils } from 'near-api-js'
import getConfig from './config'
import BN from "bn.js";

const nearConfig = getConfig(process.env.NODE_ENV || 'development')
const gas = new BN('70000000000000');
const ONE_NEAR = 1000000000000000000000000;

export function asNEAR(amount)
{
  return amount / ONE_NEAR
}

// Initialize contract & set global variables
export async function initContract() {
  // Initialize connection to the NEAR testnet
  const near = await connect(Object.assign({ deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() } }, nearConfig))

  // Initializing Wallet based Account. It can work with NEAR testnet wallet that
  // is hosted at https://wallet.testnet.near.org
  window.walletConnection = new WalletConnection(near)

  // Getting the Account ID. If still unauthorized, it's just empty string
  window.accountId = window.walletConnection.getAccountId()

  // Initializing our contract APIs by contract name and configuration
  window.contract = await new Contract(window.walletConnection.account(), nearConfig.contractName, {
    // View methods are read only. They don't modify the state, but usually return some value.
    viewMethods: ['getDetails', 'getNFTData', 'entries', 'getMintedWithId', 'getMinted', 'getListings', 'getOwnerNFT', 'getSingleListing'],
    // Change methods can modify the state. But you don't receive the returned value when called.
    changeMethods: ['createsNFT', 'add', 'addInBatch', 'mintNFT', 'listNFT', 'buyNFT'],
  })
}

export async function callWithAmount(method, args, price){
  let priceNumber = price.toString().match(/(\d+)/)[0] //* 1000000000000000000000000
  let response = await window.walletConnection.account().functionCall({
    contractId: nearConfig.contractName,
    methodName: method,
    args: args,
    gas,
    attachedDeposit: utils.format.parseNearAmount(priceNumber)
  })
  return response
}

export function logout() {
  window.walletConnection.signOut()
  // reload page
  window.location.replace(window.location.origin + window.location.pathname)
}

export function login() {
  // Allow the current app to make calls to the specified contract on the
  // user's behalf.
  // This works by creating a new access key for the user's account and storing
  // the private key in localStorage.
  window.walletConnection.requestSignIn(nearConfig.contractName)
}

export function truncateString(str, num)
{
  if (str.length > num)
  {
    return str.slice(0, num) + "...";
  } else
  {
    return str;
  }
}

export async function getNFTData(collectionId, nftId) {
  let result = {}
  await window.contract.getNFTData({
    id: +collectionId,
    nftId: +nftId
  }).then(async nftData =>
  {
    let res = await fetch(nftData.metadata).then(res => res.json()).then(data =>
    {
      return data;
    })
    // adding data from ipfs
    nftData.name = res.name;
    nftData.attributes = res.attributes;
    nftData.image = res.image;

    // check listings
    await window.contract.getSingleListing({
      id: nftData?.id,
      nftId: nftData?.nftId
    }).then(entries =>
    {
      nftData.price = asNEAR(entries);
    }).catch(err =>
    {
      nftData.price = 0;
    });
    result = nftData;
  })
  return result;
}