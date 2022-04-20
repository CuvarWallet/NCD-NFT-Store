import { connect, Contract, keyStores, WalletConnection, utils } from 'near-api-js'
import getConfig from './config'
import BN from "bn.js";
import * as nearApi from "near-api-js";

const nearConfig = getConfig(process.env.NODE_ENV || 'development')
const gas = new BN('70000000000000');
const ONE_NEAR = 1000000000000000000000000;

export function asNEAR(amount)
{
  return amount / ONE_NEAR
}

// Initialize contract & set global variables
export async function initContract()
{

}

export async function callWithAmount(method, args, price)
{
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

export function logout()
{
  window.walletConnection.signOut()
  // reload page
  window.location.replace(window.location.origin + window.location.pathname)
}

export async function login()
{
  // Allow the current app to make calls to the specified contract on the
  // user's behalf.
  // This works by creating a new access key for the user's account and storing
  // the private key in localStorage.
  //window.walletConnection.requestSignIn(nearConfig.contractName)

  // adding cuvar wallet integration

  let res = await window.cuvar().requestSignIn({
    contractId: nearConfig.contractName,
    methods: [],
    allowance: "100000000000000000000000000",
  })

  const accountId = await window.cuvar().getAccountId();
  const keyStore = new nearApi.keyStores.InMemoryKeyStore();
  const keyPair = nearApi.KeyPair.fromString(res.keys.secretKey);
  await keyStore.setKey("testnet", accountId, keyPair);
  const near = await nearApi.connect(
    Object.assign({ deps: { keyStore } }, nearConfig)
  );
  const account = await near.account(accountId);
  window.accountId = accountId;
  window.contract = new Contract(account, nearConfig.contractName, {
    // View methods are read only. They don't modify the state, but usually return some value.
    viewMethods: ['getDetails', 'getNFTData', 'entries', 'getMintedWithId', 'getMinted', 'getListings', 'getOwnerNFT', 'getSingleListing', 'getLastAdded'],
    // Change methods can modify the state. But you don't receive the returned value when called.
    changeMethods: ['createsNFT', 'add', 'addInBatch', 'mintNFT', 'listNFT', 'buyNFT'],
  })

  // save to local storage
  localStorage.setItem('cuvar', JSON.stringify(res))
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

export async function checkTxFromURL()
{
  // check if its a redirect from previous tx
  const search = window.location.search;
  const params = new URLSearchParams(search);
  const foo = params.get('transactionHashes');
  let result = '';

  if (foo)
  {
    await fetch(nearConfig.nodeUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "jsonrpc": "2.0",
        "id": "dontcare",
        "method": "tx",
        "params": [foo, window.accountId]
      })
    }).then(res => res.json()).then(data =>
    {
      if (data['result']['status']['SuccessValue'])
      {
        result = 'success';
      } else
      {
        result = 'failed';
      };
    });
  }
  return result;
}

export async function getNFTData(collectionId, nftId)
{
  let result = {}
  await window.contract.getNFTData({
    id: +collectionId,
    nftId: +nftId
  }).then(async nftData =>
  {
    let res = await fetch(nftData.metadata)
      .then(response =>
      {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1)
        {
          return response.json().then(data =>
          {
            return data;
          });
        } else
        {
          return response.text().then(text =>
          {
            return JSON.parse(text);
          });
        }
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

export function ipfsImageSupport(url)
{
  if (!url) return;
  if (url?.includes('ipfs://'))
  {
    return 'https://gateway.ipfs.io/ipfs/' + url?.split('ipfs://')[1]
  }
  return url;
}